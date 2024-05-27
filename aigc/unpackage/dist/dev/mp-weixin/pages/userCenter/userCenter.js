"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
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
    const waitTodo = () => {
      common_vendor.index.showToast({
        icon: "none",
        title: "功能开发中...请耐心等待"
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
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        f: common_vendor.o(($event) => goPage("/pages/editUserInfo/editUserInfo")),
        g: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        h: common_vendor.o(($event) => goPage("/pages/historyDesign/historyDesign")),
        i: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        j: common_vendor.o(waitTodo),
        k: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        l: common_vendor.o(waitTodo),
        m: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        n: common_vendor.o(($event) => goPage("/pages/userAgreement/userAgreement")),
        o: common_vendor.p({
          type: "right",
          size: "14",
          color: "#6b748fab"
        }),
        p: common_vendor.o(($event) => goPage("/pages/userAgreement/userAgreement")),
        q: common_vendor.o(logout),
        r: common_vendor.s(innerContentStyle.value),
        s: common_assets._imports_0$2
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5963578a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/userCenter/userCenter.vue"]]);
wx.createPage(MiniProgramPage);
