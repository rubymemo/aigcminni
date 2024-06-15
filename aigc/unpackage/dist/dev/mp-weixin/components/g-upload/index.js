"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const url = common_vendor.computed(() => {
      return props.modelValue;
    });
    const handleUpImg = () => {
      common_utils.uploadImg({
        success: (value) => {
          emits("update:modelValue", value);
        }
      });
    };
    const onClick = () => {
      if (!url.value) {
        handleUpImg();
      }
    };
    const previewImg = () => {
      common_vendor.index.previewImage({
        urls: [url.value],
        showmenu: false
      });
    };
    const handleDelete = (e) => {
      emits("update:modelValue", "");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: url.value
      }, url.value ? {
        b: url.value,
        c: common_vendor.o(previewImg)
      } : {}, {
        d: url.value
      }, url.value ? {
        e: common_vendor.o(handleDelete),
        f: common_vendor.o(handleUpImg)
      } : {}, {
        g: common_vendor.o(onClick)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a44f6124"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-upload/index.vue"]]);
wx.createComponent(Component);
