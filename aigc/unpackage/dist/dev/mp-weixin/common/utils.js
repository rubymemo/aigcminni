"use strict";
const common_vendor = require("./vendor.js");
const host = "http://101.126.93.249/api/hh";
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
exports.httpsRequest = httpsRequest;
