"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_g_upload2 = common_vendor.resolveComponent("g-upload");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_g_upload2 + _easycom_uni_popup2)();
}
const _easycom_g_upload = () => "../../../components/g-upload/index.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_g_upload + _easycom_uni_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "uploadImgModal",
  emits: ["ok"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const popup = common_vendor.ref(false);
    const emits = __emit;
    const imgData = common_vendor.reactive({
      logo: "",
      QRCode: "",
      topicMap: ""
    });
    const closeModal = () => {
      popup.value.close();
    };
    const openModal = () => {
      popup.value.open();
    };
    const clickOk = () => {
      closeModal();
      emits("ok", imgData);
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeModal),
        b: common_vendor.o(($event) => imgData.logo = $event),
        c: common_vendor.p({
          modelValue: imgData.logo
        }),
        d: common_vendor.o(($event) => imgData.QRCode = $event),
        e: common_vendor.p({
          modelValue: imgData.QRCode
        }),
        f: common_vendor.o(($event) => imgData.topicMap = $event),
        g: common_vendor.p({
          modelValue: imgData.topicMap
        }),
        h: common_vendor.o(clickOk),
        i: common_vendor.sr(popup, "e05a29bd-0", {
          "k": "popup"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e05a29bd"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/uploadImgModal.vue"]]);
wx.createComponent(Component);
