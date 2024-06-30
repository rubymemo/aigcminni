"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants = require("../../common/constants.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    type: {}
  },
  setup(__props) {
    const props = __props;
    const type = common_vendor.computed(() => props.type);
    return (_ctx, _cache) => {
      return {
        a: type.value !== common_vendor.unref(common_constants.membershipTypeMap).personal.value,
        b: common_vendor.t(common_vendor.unref(common_constants.membershipValueMap)[type.value].label),
        c: common_vendor.n(`membership-tag ${type.value !== common_vendor.unref(common_constants.membershipTypeMap).personal.value ? "yellow" : ""}`)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2593754d"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/components/g-member-tag/index.vue"]]);
wx.createComponent(Component);
