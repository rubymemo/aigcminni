"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    height: null,
    width: null,
    active: { type: Boolean }
  },
  emits: ["click"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const onClick = () => {
      emits("click");
    };
    return (_ctx, _cache) => {
      return {
        a: props.height - 4 + "rpx",
        b: props.height - 4 + "rpx",
        c: props.width ? props.width + "rpx" : "auto",
        d: common_vendor.n(`g-color-btn-box ${props.active ? "active" : ""}`),
        e: props.height + "rpx",
        f: props.active ? "linear-gradient(135.00deg, rgb(23, 242, 95),rgb(37, 106, 247) 100%)" : "#CFDAEB",
        g: common_vendor.o(onClick)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-87cda5e5"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-color-btn/index.vue"]]);
wx.createComponent(Component);
