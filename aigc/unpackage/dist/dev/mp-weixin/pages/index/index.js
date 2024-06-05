"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_g_loading2 = common_vendor.resolveComponent("g-loading");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_g_loading2 + _easycom_uni_icons2)();
}
const _easycom_g_loading = () => "../../components/g-loading/index.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_g_loading + _easycom_uni_icons)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": "110rpx"
    });
    common_vendor.ref();
    common_vendor.ref({
      mobile: "",
      code: ""
    });
    common_vendor.ref(0);
    const isRead = common_vendor.ref(false);
    common_vendor.ref("");
    const phoneNumber = common_vendor.ref("");
    const hasUser = common_vendor.ref(false);
    const firstLoading = common_vendor.ref(true);
    const getUserInfo = async () => {
      const res2 = await common_utils.httpsRequest("/cx/meByMobile", {}, "GET");
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(res2));
      return res2;
    };
    const judgeHasCurUser = async (phone) => {
      const loginRes = await common_vendor.index.login({});
      const code = loginRes.code;
      console.log(code);
      const data = await common_utils.httpsRequest("/cx/doLoginByWx", {
        wxCode: code,
        phone
      }, "POST", true, true);
      if (data) {
        hasUser.value = true;
        common_vendor.index.setStorageSync("token", data);
        await getUserInfo();
        common_vendor.index.redirectTo({
          url: "/pages/designCenter/designCenter"
        });
      } else {
        console.log("用户不存在");
        hasUser.value = false;
        firstLoading.value = false;
      }
    };
    common_vendor.onReady(async () => {
      judgeHasCurUser();
    });
    const decryptPhoneNumber = async (e) => {
      const code = e.detail.code;
      const data = await common_utils.httpsRequest(`/wx/userPhone/${code}`, {}, "GET", true);
      if (data) {
        phoneNumber.value = data.phoneNumber;
        judgeHasCurUser(data.phoneNumber);
      }
    };
    const handleClick = () => {
      if (!isRead.value) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请先勾选已阅读用户协议"
        });
      }
    };
    const handleSwitchRead = () => {
      isRead.value = !isRead.value;
    };
    console.log(res);
    const goUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userAgreement/userAgreement"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: firstLoading.value
      }, firstLoading.value ? {} : !firstLoading.value && !hasUser.value ? common_vendor.e({
        c: common_assets._imports_0,
        d: !isRead.value
      }, !isRead.value ? {
        e: common_vendor.o(handleClick)
      } : {
        f: common_vendor.o(decryptPhoneNumber)
      }, {
        g: isRead.value,
        h: common_vendor.p({
          type: "checkbox-filled",
          color: "#256AF7",
          size: 18
        }),
        i: common_vendor.o(handleSwitchRead),
        j: isRead.value ? "none" : "solid 1px $border-gray-color",
        k: common_vendor.o(handleSwitchRead),
        l: common_vendor.o(goUserAgreement),
        m: common_vendor.o(handleSwitchRead),
        n: common_vendor.s(innerContentStyle.value)
      }) : {}, {
        b: !firstLoading.value && !hasUser.value,
        o: common_assets._imports_1
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
