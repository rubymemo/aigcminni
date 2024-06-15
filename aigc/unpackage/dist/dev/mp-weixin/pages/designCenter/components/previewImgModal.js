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
  __name: "previewImgModal",
  emits: ["ok"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const popup = common_vendor.ref(false);
    const swiperInfo = common_vendor.ref([]);
    const current = common_vendor.ref(0);
    const closeModal = () => {
      popup.value.close();
    };
    const openModal = (data) => {
      swiperInfo.value = data.images;
      current.value = data.imgIndex;
      popup.value.open();
    };
    const changeCurrent = (type) => {
      if (type === "next") {
        current.value = current.value === swiperInfo.value.length - 1 ? 0 : current.value + 1;
      } else {
        current.value = current.value === 0 ? swiperInfo.value.length - 1 : current.value - 1;
      }
    };
    const previewImg = (index) => {
      common_vendor.index.previewImage({
        urls: swiperInfo.value.map((item) => item.url),
        current: index,
        showmenu: false
      });
    };
    const onOk = () => {
      emits("ok", {
        selectImgValue: swiperInfo.value[current.value]
      });
      closeModal();
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeModal),
        b: common_vendor.o(($event) => changeCurrent("prev")),
        c: common_vendor.f(swiperInfo.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => previewImg(index), index),
            c: index
          };
        }),
        d: current.value,
        e: common_vendor.o(($event) => changeCurrent("next")),
        f: common_vendor.o(closeModal),
        g: common_vendor.o(onOk),
        h: common_vendor.sr(popup, "1c30804b-0", {
          "k": "popup"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1c30804b"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/previewImgModal.vue"]]);
wx.createComponent(Component);
