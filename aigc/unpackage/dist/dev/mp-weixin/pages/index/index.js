"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_g_input2 = common_vendor.resolveComponent("g-input");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_g_input2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_icons2)();
}
const _easycom_g_input = () => "../../components/g-input/index.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_g_input + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_icons)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + 44 + "px"
    });
    const mobileCodeFormRef = common_vendor.ref();
    const formData = common_vendor.ref({
      mobile: "",
      code: ""
    });
    const timer = common_vendor.ref(0);
    const isRead = common_vendor.ref(false);
    common_vendor.onReady(() => {
    });
    const validateMobile = () => {
      if (!formData.value.mobile) {
        return "请先输入手机号";
      }
      if (formData.value.mobile) {
        if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(formData.value.mobile)) {
          return false;
        } else {
          return "请填写正确的手机号";
        }
      } else {
        return false;
      }
    };
    const validateCode = () => {
      if (!formData.value.code) {
        return "请先输入验证码";
      } else {
        return false;
      }
    };
    const handleClick = () => {
      const err12 = validateMobile();
      const err2 = validateCode();
      if (err12 || err2) {
        common_vendor.index.showToast({
          icon: "none",
          title: err12 || err2
        });
      }
    };
    const handleSwitchRead = () => {
      isRead.value = !isRead.value;
    };
    console.log(res);
    const queryCode = async () => {
      const err = validateMobile();
      if (err) {
        common_vendor.index.showToast({
          icon: "none",
          title: err1
        });
      }
      if (!err) {
        if (timer.value === 0) {
          timer.value = 60;
        }
      }
    };
    const goUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userAgreement/userAgreement"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: common_vendor.o(common_vendor.m(($event) => formData.value.mobile = $event, {
          trim: true
        }, true)),
        d: common_vendor.p({
          placeholder: "请输入手机号",
          modelValue: formData.value.mobile
        }),
        e: timer.value === 0,
        f: common_vendor.o(queryCode),
        g: common_vendor.t(timer.value),
        h: timer.value > 0,
        i: common_vendor.o(common_vendor.m(($event) => formData.value.code = $event, {
          trim: true
        }, true)),
        j: common_vendor.p({
          placeholder: "请输入验证码",
          modelValue: formData.value.code
        }),
        k: common_vendor.sr(mobileCodeFormRef, "1cf27b2a-0", {
          "k": "mobileCodeFormRef"
        }),
        l: common_vendor.p({
          modelValue: formData.value
        }),
        m: common_vendor.o(handleClick),
        n: common_vendor.p({
          type: "checkbox-filled",
          color: "#256AF7",
          size: 18
        }),
        o: common_vendor.o(handleSwitchRead),
        p: isRead.value ? "none" : "solid 1px $border-gray-color",
        q: common_vendor.o(goUserAgreement),
        r: common_assets._imports_2,
        s: common_assets._imports_3,
        t: common_vendor.s(innerContentStyle.value),
        v: common_assets._imports_4
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
