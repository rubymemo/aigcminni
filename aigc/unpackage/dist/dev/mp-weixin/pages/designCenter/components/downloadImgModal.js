"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_utils = require("../../../common/utils.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup + downloadImgResultModal)();
}
const downloadImgResultModal = () => "./downloadImgResultModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "downloadImgModal",
  props: {
    dialogId: {},
    userId: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const popup = common_vendor.ref(false);
    const DownloadImgResultModalRef = common_vendor.ref();
    const list = [
      { label: "JPEG", desc: "体积较小的图片，不支持透明背景", value: "jpeg" },
      { label: "PNG", desc: "无损图片画质更优，体积较大，支持透明背景", value: "png" },
      { label: "SVG", desc: "普遍应用标准图片，体积较小，易于修改和编辑", value: "svg" }
    ];
    const radioValue = common_vendor.ref("");
    const imageUrl = common_vendor.ref("");
    const imageObj = common_vendor.ref({
      jpeg: "",
      png: "",
      svg: ""
    });
    const btnLoading = common_vendor.ref(false);
    const sysInfo = common_vendor.index.getSystemInfoSync();
    const screenHeight = sysInfo.screenHeight;
    const fetchImageUrl = async (url) => {
      const res = await common_utils.httpsRequest("/hh/dialog_dl/listUrls", {
        url
      }, "GET");
      if (res) {
        imageObj.value = {
          ...imageObj.value,
          ...res
        };
      }
    };
    const closeModal = () => {
      popup.value.close();
    };
    const openModal = (data) => {
      radioValue.value = "";
      imageObj.value = {
        jpeg: "",
        png: "",
        svg: ""
      };
      const url = data.imageOptions[data.imgIndex].url;
      imageUrl.value = url;
      fetchImageUrl(url);
      popup.value.open();
    };
    const handleSelectRadio = (value) => {
      radioValue.value = value;
    };
    const onRadioSelect = (evt) => {
      radioValue.value = evt.detail.value;
    };
    const fetchAddHistory = async ({
      imgUrl,
      imgType
    }) => {
      const params = {
        dialogId: props.dialogId,
        imgUrl,
        imgType
      };
      await common_utils.httpsRequest("/hh/dialog_dl/addHistory", params);
    };
    const saveSuccess = () => {
      btnLoading.value = false;
      common_vendor.index.hideLoading();
      fetchAddHistory({
        imgType: radioValue.value,
        imgUrl: imageObj.value[radioValue.value]
      });
      closeModal();
      DownloadImgResultModalRef.value && DownloadImgResultModalRef.value.openModal({ type: radioValue.value });
    };
    const saveFail = (res) => {
      btnLoading.value = false;
      common_vendor.index.hideLoading();
      return common_vendor.index.showToast({
        icon: "error",
        title: "下载失败"
      });
    };
    const savePosterPath = (url) => {
      common_vendor.index.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            common_vendor.index.authorize({
              scope: "scope.writePhotosAlbum",
              success: () => {
                common_vendor.index.saveImageToPhotosAlbum({
                  //图片路径，不支持网络图片路径
                  filePath: url,
                  success: saveSuccess,
                  fail: saveFail
                });
              },
              //授权失败
              fail: () => {
                common_vendor.index.hideLoading();
                common_vendor.index.showModal({
                  title: "您已拒绝获取相册权限",
                  content: "是否进入权限管理，调整授权？",
                  success: (res2) => {
                    if (res2.confirm) {
                      common_vendor.index.openSetting({
                        success: (res3) => {
                          console.log(res3.authSetting);
                        }
                      });
                    } else if (res2.cancel) {
                      return common_vendor.index.showToast({
                        title: "已取消！"
                      });
                    }
                  }
                });
              }
            });
          } else {
            common_vendor.index.saveImageToPhotosAlbum({
              filePath: url,
              success: saveSuccess,
              fail: saveFail
            });
          }
        },
        fail: (res) => {
        }
      });
    };
    const fetchDownloadSvg = async () => {
      const findSvg = await common_utils.httpsRequest("/hh/comfyui_api_v2/png2svg", {
        fileUrl: imageObj.value.png,
        dialogId: props.dialogId
      }, "GET");
      if (typeof findSvg === "string") {
        imageObj.value.svg = findSvg;
        common_vendor.index.downloadFile({
          url: findSvg,
          success: (res) => {
            if (res.statusCode === 200) {
              savePosterPath(res.tempFilePath);
            }
          }
        });
        return;
      }
      common_vendor.index.connectSocket({
        url: `wss://huatu.solart.pro/ws?clientId=${props.userId}`
      });
      const promptRes = await common_utils.httpsRequest("/hh/comfyui_api_v2/doPrompt", {
        clientId: props.userId,
        image: imageObj.value.png,
        tplCode: "png2svg"
      });
      if (promptRes) {
        common_vendor.index.onSocketOpen(async function(res) {
          console.log("WebSocket连接已打开！");
        });
        common_vendor.index.onSocketMessage(async function(res) {
          const msgData = JSON.parse(res.data);
          if (msgData.type === "executing" && msgData.data.node === null) {
            common_vendor.index.closeSocket();
            const imagesSvgUrl = await common_utils.httpsRequest(`/hh/comfyui_api_v2/png2svg`, {
              fileName: promptRes.fileName,
              dialogId: props.dialogId,
              fileUrl: imageObj.value.png
            }, "GET");
            if (!imagesSvgUrl)
              return;
            imageObj.value.svg = imagesSvgUrl;
            common_vendor.index.downloadFile({
              url: imagesSvgUrl,
              success: (res2) => {
                if (res2.statusCode === 200) {
                  savePosterPath(res2.tempFilePath);
                }
              }
            });
          }
        });
        common_vendor.index.onSocketClose(function(res) {
          console.log("WebSocket 已关闭！");
        });
      }
    };
    const clickDownLoad = () => {
      if (!radioValue.value) {
        common_vendor.index.showToast({
          title: "请先选择要下载的格式",
          icon: "none"
        });
        return;
      }
      btnLoading.value = true;
      common_vendor.index.showLoading({
        title: "正在保存..."
      });
      if (radioValue.value === "svg") {
        fetchDownloadSvg();
      } else {
        common_vendor.index.downloadFile({
          url: imageObj.value[radioValue.value],
          success: (res) => {
            if (res.statusCode === 200) {
              savePosterPath(res.tempFilePath);
            }
          }
        });
      }
    };
    const previewImg = () => {
      common_vendor.index.previewImage({
        urls: [imageUrl.value],
        showmenu: false
      });
    };
    __expose({
      openModal
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeModal),
        b: imageUrl.value,
        c: common_vendor.o(previewImg),
        d: common_vendor.f(list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.n(`${item.value === radioValue.value ? "primary" : "gray-btn"} radio-item-button`),
            c: item.value,
            d: item.value === radioValue.value,
            e: common_vendor.t(item.desc),
            f: index,
            g: common_vendor.o(($event) => handleSelectRadio(item.value), index)
          };
        }),
        e: common_vendor.o(onRadioSelect),
        f: common_vendor.unref(screenHeight) < 800 ? "200rpx" : "auto",
        g: common_vendor.o(clickDownLoad),
        h: common_vendor.sr(popup, "0679aa64-0", {
          "k": "popup"
        }),
        i: common_vendor.sr(DownloadImgResultModalRef, "0679aa64-1", {
          "k": "DownloadImgResultModalRef"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0679aa64"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/downloadImgModal.vue"]]);
wx.createComponent(Component);
