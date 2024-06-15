"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "editContentModal",
  emits: ["ok", "cancel"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const popup = common_vendor.ref(false);
    const textValue = common_vendor.ref("");
    const closeModal = () => {
      emits("cancel");
      popup.value.close();
    };
    const openModal = (text) => {
      console.log(text);
      textValue.value = text;
      popup.value.open();
    };
    const clickOk = () => {
      emits("ok", textValue.value);
      closeModal();
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeModal),
        b: textValue.value,
        c: common_vendor.o(($event) => textValue.value = $event.detail.value),
        d: common_vendor.o(closeModal),
        e: common_vendor.o(clickOk),
        f: common_vendor.sr(popup, "bfcc78ca-0", {
          "k": "popup"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bfcc78ca"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/editContentModal.vue"]]);
wx.createComponent(Component);
