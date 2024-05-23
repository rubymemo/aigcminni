"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    placeholder: null
  },
  emits: ["update:modelValue", "blur"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const inputvalue = common_vendor.ref("");
    const inputClass = common_vendor.ref("");
    common_vendor.watch(() => inputvalue.value, (newValue) => {
      emits("update:modelValue", newValue);
    });
    const onInputFocus = () => {
      inputClass.value = "input-focus";
    };
    const onInputBlur = () => {
      inputClass.value = "";
      emits("blur");
    };
    return (_ctx, _cache) => {
      return {
        a: props.placeholder,
        b: common_vendor.o(onInputFocus),
        c: common_vendor.o(onInputBlur),
        d: inputvalue.value,
        e: common_vendor.o(($event) => inputvalue.value = $event.detail.value),
        f: common_vendor.n(`input-box ${inputClass.value}`)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2eefdd40"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-input/index.vue"]]);
wx.createComponent(Component);
