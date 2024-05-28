"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    progress: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return {
        a: props.progress + "%"
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-48afdb1b"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-progress/index.vue"]]);
wx.createComponent(Component);
