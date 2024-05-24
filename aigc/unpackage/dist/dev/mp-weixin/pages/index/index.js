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
      "padding-top": "110rpx"
    });
    common_vendor.ref();
    common_vendor.ref({
      mobile: "",
      code: ""
    });
    common_vendor.ref(0);
    const isRead = common_vendor.ref(false);
    common_vendor.onReady(() => {
    });
    const switchIsRead = () => {
      isRead.value = !isRead.value;
    };
    const handleClick = () => {
      if (!isRead.value) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请先勾选已阅读用户协议"
        });
      }
    };
    const handleSwitchRead = () => {
      isRead.value = !isRead.value;
    };
    console.log(res);
    const goUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userAgreement/userAgreement"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(handleClick),
        c: isRead.value,
        d: common_vendor.p({
          type: "checkbox-filled",
          color: "#256AF7",
          size: 18
        }),
        e: common_vendor.o(handleSwitchRead),
        f: isRead.value ? "none" : "solid 1px $border-gray-color",
        g: common_vendor.o(goUserAgreement),
        h: common_vendor.o(switchIsRead),
        i: common_vendor.s(innerContentStyle.value),
        j: common_assets._imports_1
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
