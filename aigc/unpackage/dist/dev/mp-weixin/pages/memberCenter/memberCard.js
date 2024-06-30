"use strict";
const common_vendor = require("../../common/vendor.js");
const common_constants = require("../../common/constants.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "memberCard",
  props: {
    type: {}
  },
  setup(__props) {
    const props = __props;
    const type = common_vendor.computed(() => props.type);
    const list = common_vendor.ref([
      { label: "连续包月", price: "19.00", linePrice: "39.00" },
      { label: "连续包月", price: "19.00", linePrice: "39.00" },
      { label: "连续包月", price: "19.00", linePrice: "" },
      { label: "连续包月", price: "19.00", linePrice: "39.00" },
      { label: "连续包月", price: "19.00", linePrice: "39.00" },
      { label: "连续包月", price: "19.00", linePrice: "" }
    ]);
    const activeMember = common_vendor.ref(null);
    const onClickMember = (activeMemberTemp) => {
      activeMember.value = activeMember.value !== activeMemberTemp ? activeMemberTemp : null;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(type.value === common_vendor.unref(common_constants.membershipTypeMap).personalpro.value ? "个人版PRO" : "团队版"),
        b: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.linePrice),
            d: item.linePrice,
            e: index,
            f: common_vendor.n(`price-item ${activeMember.value === index ? "active" : ""}`),
            g: common_vendor.o(() => onClickMember(index), index)
          };
        }),
        c: common_vendor.t(type.value === common_vendor.unref(common_constants.membershipTypeMap).personalpro.value ? "个人版会员期内，可享受无限制设计与下载" : "享有个人版PRO全部功能；同时可添加5个子账号子账号同时享有个人版PRO的全部权益")
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fd02fa05"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/memberCenter/memberCard.vue"]]);
wx.createComponent(Component);
