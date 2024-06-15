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
  __name: "downloadImgResultModal",
  setup(__props, { expose: __expose }) {
    const popup = common_vendor.ref(false);
    const descType = common_vendor.ref("");
    const closeModal = () => {
      popup.value.close();
    };
    const openModal = ({ type }) => {
      descType.value = type;
      popup.value.open();
    };
    const clickOk = () => {
      closeModal();
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: descType.value === "svg"
      }, descType.value === "svg" ? {} : {}, {
        b: common_vendor.o(clickOk),
        c: common_vendor.sr(popup, "883db080-0", {
          "k": "popup"
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-883db080"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/downloadImgResultModal.vue"]]);
wx.createComponent(Component);
