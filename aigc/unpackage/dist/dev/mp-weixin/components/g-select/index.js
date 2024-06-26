"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    modelValue: {},
    height: {},
    width: {},
    placeholder: {},
    options: {}
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const activeTab = common_vendor.ref(null);
    const isShowOptions = common_vendor.ref(false);
    const activeOption = common_vendor.ref(null);
    common_vendor.watch(() => props.modelValue, (newValue) => {
      if (newValue !== activeTab.value) {
        if (!newValue) {
          activeTab.value = null;
          activeOption.value = null;
        } else {
          activeTab.value = newValue;
          activeOption.value = {
            label: newValue,
            value: newValue
          };
        }
      }
    });
    const switchShowOptions = () => {
      isShowOptions.value = !isShowOptions.value;
    };
    const chooseOption = (item) => {
      activeTab.value = item.value;
      activeOption.value = item;
      switchShowOptions();
      emits("update:modelValue", item.value);
      emits("change", item.value);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(activeOption.value ? activeOption.value.label : props.placeholder || ""),
        b: props.height - 4 + "rpx",
        c: props.height - 4 + "rpx",
        d: props.width ? props.width + "rpx" : "auto",
        e: isShowOptions.value || activeTab.value !== null ? "#344156" : "#6B748F",
        f: common_vendor.o(switchShowOptions),
        g: common_vendor.f(props.options, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: common_vendor.n(`option-item ${activeTab.value === item.value ? "active" : ""}`),
            d: common_vendor.o(($event) => chooseOption(item), item.value)
          };
        }),
        h: isShowOptions.value,
        i: props.width ? props.width + "rpx" : "auto",
        j: common_vendor.n(`g-color-btn-box ${isShowOptions.value ? "active" : ""}`),
        k: props.height + "rpx",
        l: isShowOptions.value || activeTab.value !== null ? "linear-gradient(135.00deg, rgb(23, 242, 95),rgb(37, 106, 247) 100%)" : "#CFDAEB"
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d0661a0f"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-select/index.vue"]]);
wx.createComponent(Component);
