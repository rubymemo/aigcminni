"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
const common_constants = require("../../common/constants.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_g_member_tag2 = common_vendor.resolveComponent("g-member-tag");
  (_easycom_uni_icons2 + _easycom_g_member_tag2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_g_member_tag = () => "../../components/g-member-tag/index.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_g_member_tag + memberCardVue)();
}
const memberCardVue = () => "./memberCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "memberCenter",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const navStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + "px"
    });
    const userInfo = common_vendor.ref({
      avatar: "",
      nickname: ""
    });
    const membershipType = common_vendor.ref(1);
    const getUserInfo = async (id) => {
      const res2 = await common_utils.httpsRequest(`/cx/member/findById/${id}`, userInfo.value, "GET");
      userInfo.value = {
        id,
        ...res2
      };
    };
    common_vendor.onShow(() => {
      const local = JSON.parse(common_vendor.index.getStorageSync("userInfo"));
      getUserInfo(local.userId);
    });
    return (_ctx, _cache) => {
      return {
        a: `
			${membershipType.value === common_vendor.unref(common_constants.membershipTypeMap).personal.value ? "../../static/png/member-bg-2.png" : "../../static/png/member-bg-1.png"}`,
        b: common_vendor.o(_ctx.goDesignCenter),
        c: common_vendor.p({
          type: "left",
          size: "20",
          color: "#2A2A2A"
        }),
        d: common_vendor.s(navStyle.value),
        e: userInfo.value.avatar,
        f: common_vendor.t(userInfo.value.nickname || userInfo.value.username || "暂无昵称"),
        g: common_vendor.t(membershipType.value === common_vendor.unref(common_constants.membershipTypeMap).personal.value ? "首次注册用户可免费设计3次" : "会员有效期至2021-03-16"),
        h: common_vendor.p({
          type: membershipType.value
        }),
        i: common_vendor.p({
          type: 1
        }),
        j: common_vendor.p({
          type: 2
        }),
        k: common_vendor.n(`member-center ${membershipType.value !== common_vendor.unref(common_constants.membershipTypeMap).personal.value ? "vip" : ""}`)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-151a8dd6"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/memberCenter/memberCenter.vue"]]);
wx.createPage(MiniProgramPage);
