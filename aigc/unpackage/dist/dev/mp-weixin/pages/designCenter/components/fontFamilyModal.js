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
  __name: "fontFamilyModal",
  emits: ["ok"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const popup = common_vendor.ref(false);
    const emits = __emit;
    const familyList = [
      { label: "阿里巴巴普惠体", value: "Alibaba-PuHuiTi-Heavy.ttf", src: "../../../static/png/font-family1.png" },
      { label: "优设标题黑", value: "YouSheBiaoTiHei.ttf", src: "../../../static/png/font-family2.png" }
    ];
    const activeFamily = common_vendor.ref(null);
    const closeModal = () => {
      popup.value.close();
    };
    const openModal = (data) => {
      activeFamily.value = data.defaultFamily || null;
      popup.value.open();
    };
    const selectFamily = (item) => {
      activeFamily.value = item.value;
    };
    const clickOk = () => {
      emits("ok", activeFamily.value);
      closeModal();
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeModal),
        b: common_vendor.f(familyList, (item, index, i0) => {
          return {
            a: item.src,
            b: common_vendor.n(`cube-box ${activeFamily.value === item.value ? "active" : ""}`),
            c: common_vendor.t(item.label),
            d: index,
            e: common_vendor.o(($event) => selectFamily(item), index)
          };
        }),
        c: common_vendor.o(clickOk),
        d: common_vendor.sr(popup, "d932d5fe-0", {
          "k": "popup"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d932d5fe"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/fontFamilyModal.vue"]]);
wx.createComponent(Component);
