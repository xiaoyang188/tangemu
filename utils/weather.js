const WEATHER_CACHE_KEY = "tanmu_weather_cache_v1";
const CACHE_TTL_MS = 30 * 60 * 1000;

const WMO_LABELS = {
  0: "晴",
  1: "晴",
  2: "多云",
  3: "阴",
  45: "雾",
  48: "雾",
  51: "小雨",
  53: "小雨",
  55: "中雨",
  56: "冻雨",
  57: "冻雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "冻雨",
  67: "冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "雪",
  80: "阵雨",
  81: "阵雨",
  82: "暴雨",
  85: "阵雪",
  86: "阵雪",
  95: "雷雨",
  96: "雷雨",
  99: "雷雨"
};

function readCache() {
  try {
    const raw = wx.getStorageSync(WEATHER_CACHE_KEY);
    if (!raw || typeof raw !== "object") return null;
    if (!raw.expiresAt || Date.now() > raw.expiresAt) return null;
    return raw;
  } catch (error) {
    return null;
  }
}

function writeCache(payload) {
  try {
    wx.setStorageSync(WEATHER_CACHE_KEY, {
      ...payload,
      expiresAt: Date.now() + CACHE_TTL_MS
    });
  } catch (error) {
    // ignore cache write failures
  }
}

function mapWeatherCode(code) {
  return WMO_LABELS[Number(code)] || "天气";
}

function formatCityName(data) {
  if (!data || typeof data !== "object") return "当前位置";

  const city = data.city || data.locality || data.principalSubdivision;
  if (!city) return "当前位置";

  return String(city).replace(/市$/u, "") || "当前位置";
}

function getCoords() {
  return new Promise((resolve, reject) => {
    const onSuccess = (res) => resolve({ latitude: res.latitude, longitude: res.longitude });
    const onFail = (error) => reject(error || new Error("location_failed"));

    if (typeof wx.getFuzzyLocation === "function") {
      wx.getFuzzyLocation({
        type: "wgs84",
        success: onSuccess,
        fail: () => {
          if (typeof wx.getLocation === "function") {
            wx.getLocation({ type: "wgs84", success: onSuccess, fail: onFail });
            return;
          }
          onFail();
        }
      });
      return;
    }

    if (typeof wx.getLocation === "function") {
      wx.getLocation({ type: "wgs84", success: onSuccess, fail: onFail });
      return;
    }

    onFail(new Error("location_unsupported"));
  });
}

function fetchCityName(latitude, longitude) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://api.bigdatacloud.net/data/reverse-geocode-client",
      data: {
        latitude,
        longitude,
        localityLanguage: "zh"
      },
      success: (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error("geocode_failed"));
          return;
        }
        resolve(formatCityName(res.data));
      },
      fail: () => reject(new Error("geocode_failed"))
    });
  });
}

function fetchWeather(latitude, longitude) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://api.open-meteo.com/v1/forecast",
      data: {
        latitude,
        longitude,
        current: "temperature_2m,weather_code",
        timezone: "auto"
      },
      success: (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error("weather_failed"));
          return;
        }

        const current = res.data && res.data.current;
        if (!current) {
          reject(new Error("weather_empty"));
          return;
        }

        resolve({
          temp: Math.round(Number(current.temperature_2m)),
          desc: mapWeatherCode(current.weather_code)
        });
      },
      fail: () => reject(new Error("weather_failed"))
    });
  });
}

function buildWeatherView(city, weather) {
  const tempText = Number.isFinite(weather.temp) ? `${weather.temp}°C` : "";
  const summary = [weather.desc, tempText].filter(Boolean).join(" ");
  const line = [city, summary].filter(Boolean).join(" · ");

  return {
    weatherCity: city,
    weatherDesc: weather.desc,
    weatherTemp: Number.isFinite(weather.temp) ? weather.temp : "",
    weatherSummary: summary,
    weatherLine: line
  };
}

function loadWeatherInfo(options = {}) {
  const force = Boolean(options.force);
  const cached = !force ? readCache() : null;

  if (cached) {
    return Promise.resolve({
      status: "ready",
      ...buildWeatherView(cached.city, cached)
    });
  }

  return getCoords()
    .then(({ latitude, longitude }) => {
      return Promise.all([
        fetchCityName(latitude, longitude),
        fetchWeather(latitude, longitude)
      ]).then(([city, weather]) => {
        writeCache({ city, ...weather });
        return {
          status: "ready",
          ...buildWeatherView(city, weather)
        };
      });
    })
    .catch((error) => {
      const message = String((error && error.errMsg) || error || "");
      if (message.includes("auth deny") || message.includes("authorize")) {
        return {
          status: "denied",
          weatherLine: "未授权定位",
          weatherHint: "点击授权定位"
        };
      }

      return {
        status: "error",
        weatherLine: "天气获取失败",
        weatherHint: "点击重试"
      };
    });
}

module.exports = {
  loadWeatherInfo
};
