"use strict";
const common_vendor = require("./vendor.js");
const host = "https://huatu.solart.pro/api";
const httpsRequestResult = (httpRes, noshowerr) => {
  if (httpRes.statusCode === 200) {
    const data = httpRes.data;
    if (Number(data.code) !== 2e3) {
      if (!noshowerr) {
        common_vendor.index.showToast({
          icon: "none",
          title: data.msg
        });
      }
      return null;
    } else {
      return data.data || {};
    }
  } else {
    common_vendor.index.showToast({
      icon: "none",
      title: "系统错误，请联系管理员"
    });
  }
  return null;
};
const httpsRequest = async (url, params, method, noheader, noshowerr) => {
  const token = common_vendor.index.getStorageSync("token");
  const header = noheader ? void 0 : {
    Authorization: token
  };
  const res = await common_vendor.index.request({
    url: host + url,
    method: method || "POST",
    data: params,
    header
  });
  const data = httpsRequestResult(res, noshowerr);
  return data;
};
function getDay(day) {
  const days = /* @__PURE__ */ new Date();
  const gettimes = days.getTime() + 1e3 * 60 * 60 * 24 * day;
  days.setTime(gettimes);
  const year = days.getFullYear();
  let month = days.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let today = days.getDate();
  if (today < 10) {
    today = "0" + today;
  }
  return year + "-" + month + "-" + today;
}
exports.getDay = getDay;
exports.host = host;
exports.httpsRequest = httpsRequest;
