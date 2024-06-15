"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup + downloadImgResultModal)();
}
const downloadImgResultModal = () => "./downloadImgResultModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "downloadImgModal",
  setup(__props, { expose: __expose }) {
    const popup = common_vendor.ref(false);
    const DownloadImgResultModalRef = common_vendor.ref();
    const list = [
      { label: "JPEG", desc: "体积较小的图片，不支持透明背景", value: "jpeg" },
      { label: "PNG", desc: "无损图片画质更优，体积较大，支持透明背景", value: "png" },
      { label: "SVG", desc: "普遍应用标准图片，体积较小，易于修改和编辑", value: "svg" }
    ];
    const radioValue = common_vendor.ref("");
    const imageUrl = common_vendor.ref("");
    const sysInfo = common_vendor.index.getSystemInfoSync();
    const screenHeight = sysInfo.screenHeight;
    const closeModal = () => {
      popup.value.close();
    };
    const openModal = (data) => {
      imageUrl.value = data.imageOptions[data.imgIndex].url;
      popup.value.open();
    };
    const handleSelectRadio = (value) => {
      radioValue.value = value;
    };
    const onRadioSelect = (evt) => {
      radioValue.value = evt.detail.value;
    };
    const clickDownLoad = () => {
      console.log("下载");
      DownloadImgResultModalRef.value && DownloadImgResultModalRef.value.openModal({ type: "png" });
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeModal),
        b: imageUrl.value,
        c: common_vendor.f(list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.n(`${item.value === radioValue.value ? "primary" : "gray-btn"} radio-item-button`),
            c: item.value,
            d: item.value === radioValue.value,
            e: common_vendor.t(item.desc),
            f: index,
            g: common_vendor.o(($event) => handleSelectRadio(item.value), index)
          };
        }),
        d: common_vendor.o(onRadioSelect),
        e: common_vendor.unref(screenHeight) < 800 ? "200rpx" : "auto",
        f: common_vendor.o(clickDownLoad),
        g: common_vendor.sr(popup, "0679aa64-0", {
          "k": "popup"
        }),
        h: common_vendor.sr(DownloadImgResultModalRef, "0679aa64-1", {
          "k": "DownloadImgResultModalRef"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0679aa64"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/downloadImgModal.vue"]]);
wx.createComponent(Component);
