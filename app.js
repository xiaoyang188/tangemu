const { CLOUD_ENV } = require("./config/cloud");

App({
  globalData: {
    cloudEnv: CLOUD_ENV
  },

  onLaunch() {
    this.cloudReadyPromise = new Promise((resolve) => {
      if (!wx.cloud) {
        console.error("[云开发] 基础库版本过低，请将基础库升级到 2.2.3 以上");
        resolve(false);
        return;
      }

      wx.cloud.init({
        env: CLOUD_ENV,
        traceUser: true
      });

      resolve(true);
    });
  }
});
