"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  _easycom_uni_datetime_picker2();
}
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  _easycom_uni_datetime_picker();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "editUserInfo",
  setup(__props) {
    const userInfo = common_vendor.ref({
      id: "",
      avatar: "",
      nickname: "",
      birth: "",
      gender: "",
      mobile: ""
    });
    const getUserInfo = async (id) => {
      const res = await common_utils.httpsRequest(`/cx/member/findById/${id}`, userInfo.value, "GET");
      userInfo.value = {
        id,
        ...res
      };
    };
    const putUserInfo = async () => {
      await common_utils.httpsRequest("/cx/member/editById", userInfo.value, "PUT");
    };
    const choseGener = (gender) => {
      userInfo.value.gender = gender;
    };
    common_vendor.onLoad(() => {
      const res = JSON.parse(common_vendor.index.getStorageSync("userInfo"));
      getUserInfo(res.userId);
    });
    const handleChooseImg = () => {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        camera: "back",
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFiles;
          common_vendor.index.uploadFile({
            url: `${common_utils.host}/hh/comfyui_api_v2/uploadImage`,
            //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0].tempFilePath,
            name: "image",
            success: (uploadFileRes) => {
              const uploadData = JSON.parse(uploadFileRes.data);
              if (Number(uploadData.code) === 2e3) {
                const url = uploadData.data;
                userInfo.value.avatar = url;
              } else {
                common_vendor.index.showToast({
                  icon: "none",
                  title: "上传失败，请联系客服或稍后重试"
                });
              }
            },
            fail: () => {
              common_vendor.index.showToast({
                icon: "none",
                title: "上传失败，请联系客服或稍后重试"
              });
            }
          });
        }
      });
    };
    common_vendor.onUnload(() => {
      putUserInfo();
    });
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar,
        b: common_vendor.o(handleChooseImg),
        c: common_vendor.o(putUserInfo),
        d: userInfo.value.nickname,
        e: common_vendor.o(common_vendor.m(($event) => userInfo.value.nickname = $event.detail.value, {
          trim: true
        })),
        f: common_vendor.n(`gender-btn ${userInfo.value.gender === "M" ? "active" : ""}`),
        g: common_vendor.o(($event) => choseGener("M")),
        h: common_vendor.n(`gender-btn ${userInfo.value.gender === "F" ? "active" : ""}`),
        i: common_vendor.o(($event) => choseGener("F")),
        j: common_vendor.o(($event) => userInfo.value.birth = $event),
        k: common_vendor.p({
          type: "date",
          ["clear-icon"]: false,
          modelValue: userInfo.value.birth
        }),
        l: userInfo.value.mobile,
        m: common_vendor.o(common_vendor.m(($event) => userInfo.value.mobile = $event.detail.value, {
          trim: true
        }))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9a54821f"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/editUserInfo/editUserInfo.vue"]]);
wx.createPage(MiniProgramPage);
