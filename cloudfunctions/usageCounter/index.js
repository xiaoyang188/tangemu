const cloud = require("wx-server-sdk");

cloud.init({
  env: "cloud1-d9g3efctacd99bc45"
});

const db = cloud.database();
const COLLECTION = "stats";
const DOC_ID = "usage";

function isMissingDoc(error) {
  const msg = String((error && error.message) || "");
  const code = error && (error.errCode || error.code);
  return code === -1 || msg.indexOf("does not exist") !== -1 || msg.indexOf("not exist") !== -1;
}

async function ensureCollection() {
  try {
    await db.createCollection(COLLECTION);
  } catch (error) {
    // 已存在时忽略
  }
}

async function readCount() {
  try {
    const res = await db.collection(COLLECTION).doc(DOC_ID).get();
    const count = res && res.data && res.data.count;
    return typeof count === "number" && count > 0 ? Math.floor(count) : 0;
  } catch (error) {
    return 0;
  }
}

async function writeCount(count) {
  const docRef = db.collection(COLLECTION).doc(DOC_ID);
  const payload = {
    count: Math.max(1, Math.floor(count)),
    updatedAt: db.serverDate()
  };

  try {
    await docRef.update({ data: payload });
  } catch (error) {
    if (!isMissingDoc(error)) {
      throw error;
    }

    await docRef.set({ data: payload });
  }

  return payload.count;
}

async function hitCount() {
  await ensureCollection();

  const current = await readCount();
  const nextCount = current + 1;
  return writeCount(nextCount);
}

exports.main = async (event) => {
  const action = (event && event.action) || "hit";

  try {
    await ensureCollection();

    if (action === "get") {
      const count = await readCount();
      return { success: true, count };
    }

    const count = await hitCount();
    return { success: true, count };
  } catch (error) {
    console.error("[usageCounter] failed", error);
    return {
      success: false,
      message: (error && error.message) || "usageCounter failed",
      errCode: (error && (error.errCode || error.code)) || -1
    };
  }
};
