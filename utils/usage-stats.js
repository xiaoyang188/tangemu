const { CLOUD_ENV, USAGE_COUNTER_FN } = require("../config/cloud");

const STORAGE_KEY = "tanmu_usage_count_v2";
const MAX_RETRY = 3;
const RETRY_DELAY_MS = 800;

let usageWatcher = null;

function formatUsageCount(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "";
  return String(Math.floor(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function readCachedCount() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    const num = Number(raw);
    if (!Number.isFinite(num) || num <= 0) return null;
    return Math.floor(num);
  } catch (error) {
    return null;
  }
}

function writeCachedCount(count) {
  const safeCount = Math.floor(Number(count));
  if (!Number.isFinite(safeCount) || safeCount <= 0) return;

  try {
    wx.setStorageSync(STORAGE_KEY, safeCount);
  } catch (error) {
    // 忽略缓存失败
  }
}

function waitCloudReady() {
  const app = getApp();

  if (app && app.cloudReadyPromise) {
    return app.cloudReadyPromise;
  }

  if (!wx.cloud) {
    return Promise.resolve(false);
  }

  try {
    wx.cloud.init({ env: CLOUD_ENV, traceUser: true });
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
}

function getDatabase() {
  if (!wx.cloud || !wx.cloud.database) return null;
  return wx.cloud.database({ env: CLOUD_ENV });
}

function extractCountFromSnapshot(snapshot) {
  const docs = (snapshot && snapshot.docs) || [];
  if (!docs.length) return null;

  const count = docs[0] && docs[0].count;
  if (typeof count !== "number" || count <= 0) return null;
  return Math.floor(count);
}

function callUsageCounter(action) {
  return waitCloudReady().then((ready) => {
    if (!ready) {
      return Promise.reject(new Error("CLOUD_UNAVAILABLE"));
    }

    return wx.cloud.callFunction({
      name: USAGE_COUNTER_FN,
      data: { action }
    });
  });
}

function parseHitResponse(res) {
  const result = (res && res.result) || {};

  if (typeof result === "string") {
    throw new Error(result);
  }

  if (result.success === false) {
    throw new Error(result.message || "云函数返回失败");
  }

  const count = Number(result.count);
  if (!Number.isFinite(count) || count <= 0) {
    throw new Error(`usageCounter 返回异常: ${JSON.stringify(result)}`);
  }

  return Math.floor(count);
}

function requestHitWithRetry(retryLeft) {
  const retries = typeof retryLeft === "number" ? retryLeft : MAX_RETRY;

  return callUsageCounter("hit")
    .then(parseHitResponse)
    .catch((error) => {
      if (retries <= 0) {
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          requestHitWithRetry(retries - 1).then(resolve).catch(reject);
        }, RETRY_DELAY_MS);
      });
    });
}

function hitUsage() {
  return requestHitWithRetry().then((count) => {
    writeCachedCount(count);
    return count;
  });
}

function stopUsageWatch() {
  if (usageWatcher && typeof usageWatcher.close === "function") {
    usageWatcher.close();
  }

  usageWatcher = null;
}

function startUsageWatch(onChange) {
  if (typeof onChange !== "function") {
    return Promise.resolve(null);
  }

  stopUsageWatch();

  return waitCloudReady().then((ready) => {
    if (!ready) return null;

    const database = getDatabase();
    if (!database) return null;

    usageWatcher = database
      .collection("stats")
      .where({ _id: "usage" })
      .watch({
        onChange(snapshot) {
          const count = extractCountFromSnapshot(snapshot);
          if (count === null) return;

          writeCachedCount(count);
          onChange(count, formatUsageCount(count));
        },
        onError(error) {
          console.error("[usageWatch] 实时监听失败", error);
        }
      });

    return usageWatcher;
  });
}

module.exports = {
  formatUsageCount,
  readCachedCount,
  hitUsage,
  startUsageWatch,
  stopUsageWatch
};
