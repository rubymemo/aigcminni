"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    height: null,
    width: null,
    active: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return {
        a: props.height - 4 + "rpx",
        b: props.height - 4 + "rpx",
        c: props.width ? props.width + "rpx" : "auto",
        d: common_vendor.n(`g-color-btn-box ${__props.active ? "active" : ""}`),
        e: props.height + "rpx"
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-87cda5e5"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-color-btn/index.vue"]]);
wx.createComponent(Component);
