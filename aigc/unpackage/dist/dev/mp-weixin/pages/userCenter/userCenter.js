"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
  (_easycom_uni_icons + _easycom_g_member_tag)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userCenter",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + "px"
    });
    const userInfo = common_vendor.ref({
      avatar: "",
      nickname: ""
    });
    const timer = common_vendor.ref("");
    const membershipType = common_vendor.ref(0);
    const getUserInfo = async (id) => {
      const res2 = await common_utils.httpsRequest(`/cx/member/findById/${id}`, userInfo.value, "GET");
      userInfo.value = {
        id,
        ...res2
      };
    };
    common_vendor.onShow(() => {
      timer.value = setTimeout(() => {
        const local = JSON.parse(common_vendor.index.getStorageSync("userInfo"));
        getUserInfo(local.userId);
      }, 200);
    });
    const goDesignCenter = () => {
      common_vendor.index.redirectTo({
        url: "/pages/designCenter/designCenter"
      });
    };
    const goPage = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "确定退出？",
        success: () => {
          common_vendor.index.clearStorageSync();
          common_vendor.index.redirectTo({
            url: "/pages/index/index"
          });
        }
      });
    };
    common_vendor.onHide(() => {
      clearTimeout(timer.value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goDesignCenter),
        b: common_vendor.p({
          type: "left",
          size: "20",
          color: "#2A2A2A"
        }),
        c: userInfo.value.avatar,
        d: common_vendor.t(userInfo.value.nickname || userInfo.value.username || "暂无昵称"),
        e: common_vendor.p({
          type: membershipType.value
        }),
        f: common_vendor.t(membershipType.value === common_vendor.unref(common_constants.membershipTypeMap).personal.value ? "首次注册用户可免费设计3次" : "会员有效期至2021-03-16"),
        g: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        h: common_vendor.n(`user-info ${membershipType.value !== common_vendor.unref(common_constants.membershipTypeMap).personal.value ? "vip" : ""}`),
        i: common_vendor.o(($event) => goPage("/pages/editUserInfo/editUserInfo")),
        j: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        k: common_vendor.o(($event) => goPage("/pages/historyDesign/historyDesign")),
        l: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        m: common_vendor.o(($event) => goPage("/pages/historyDownloadImg/historyDownloadImg")),
        n: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        o: common_vendor.o(($event) => goPage("/pages/userNotifications/userNotifications")),
        p: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        q: common_vendor.o(($event) => goPage("/pages/userAgreement/userAgreement")),
        r: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        s: common_vendor.o(($event) => goPage("/pages/userAgreement/userAgreement")),
        t: common_vendor.o(logout),
        v: common_vendor.s(innerContentStyle.value),
        w: common_assets._imports_0$1
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5963578a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/userCenter/userCenter.vue"]]);
wx.createPage(MiniProgramPage);
