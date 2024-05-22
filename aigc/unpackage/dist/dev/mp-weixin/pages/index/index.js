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
  __name: "index",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + 44 + "px"
    });
    const isRead = common_vendor.ref(false);
    const handleClick = () => {
    };
    const handleSwitchRead = () => {
      isRead.value = !isRead.value;
    };
    console.log(res);
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: common_vendor.o(handleClick),
        d: common_vendor.p({
          type: "checkbox-filled",
          color: "#256AF7",
          size: 18
        }),
        e: common_vendor.o(handleSwitchRead),
        f: isRead.value ? "none" : "solid 1px $border-gray-color",
        g: common_assets._imports_2,
        h: common_assets._imports_3,
        i: common_vendor.s(innerContentStyle.value),
        j: common_assets._imports_4
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
