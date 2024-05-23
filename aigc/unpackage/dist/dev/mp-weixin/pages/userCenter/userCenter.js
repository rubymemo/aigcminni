"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userCenter",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + "px"
    });
    const goDesignCenter = () => {
      common_vendor.index.navigateTo({
        url: "/pages/designCenter/designCenter"
      });
    };
    const goPage = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goDesignCenter),
        b: common_vendor.p({
          type: "left",
          size: "20",
          color: "#2A2A2A"
        }),
        c: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        d: common_vendor.o(($event) => goPage("pages/editUserInfo/editUserInfo")),
        e: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        f: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        g: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        h: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        i: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        j: common_vendor.s(innerContentStyle.value),
        k: common_assets._imports_0$3
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5963578a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/userCenter/userCenter.vue"]]);
wx.createPage(MiniProgramPage);
