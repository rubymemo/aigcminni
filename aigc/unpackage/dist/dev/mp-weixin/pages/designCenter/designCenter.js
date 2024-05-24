"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_mockData = require("../../common/mockData.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_g_color_btn2 = common_vendor.resolveComponent("g-color-btn");
  _easycom_g_color_btn2();
}
const _easycom_g_color_btn = () => "../../components/g-color-btn/index.js";
if (!Math) {
  _easycom_g_color_btn();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "designCenter",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + "px"
    });
    common_vendor.ref(0);
    const scrollTop = common_vendor.ref(0);
    const canSend = common_vendor.ref(false);
    const selectTags = common_vendor.ref([]);
    const inputValue = common_vendor.ref("");
    const dataList = common_vendor.ref([
      {
        ...common_mockData.robotReply[0].data,
        type: "left"
        // imagesOptions: ['http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png', 'http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png','http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png']
      }
    ]);
    const timer = common_vendor.ref();
    const instance = common_vendor.getCurrentInstance();
    const initScrollHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).select(".scroll-view-content").boundingClientRect((data) => {
        if (data) {
          scrollTop.value = data.height;
        }
      }).exec();
    };
    common_vendor.onMounted(() => {
      initScrollHeight();
    });
    const goUserCenter = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/userCenter"
      });
    };
    const addMockRobotReply = (robotId) => {
      clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        const robotReplyData = common_mockData.robotReply[robotId];
        dataList.value.push({
          ...robotReplyData.data,
          startCreate: robotReplyData.startCreate,
          type: "left"
        });
        if (robotReplyData.startCreate) {
          canSend.value = true;
        }
        scrollToBottom();
      }, 500);
    };
    const onRobotBtnClick = (btnStr, messageIndex) => {
      if (messageIndex < dataList.value.length - 1) {
        return;
      }
      selectTags.value.push(btnStr);
      const manualData = common_mockData.manualReply[btnStr];
      if (manualData.opertionType === "chooseMedia") {
        common_vendor.index.chooseMedia({
          count: 1,
          mediaType: ["image"],
          sourceType: ["album", "camera"],
          camera: "back",
          success: (chooseImageRes) => {
            const tempFilePaths = chooseImageRes.tempFiles;
            common_vendor.index.uploadFile({
              url: "http://101.126.93.249/api/hh/comfyui_api/uploadImage",
              //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0].tempFilePath,
              name: "image",
              success: (uploadFileRes) => {
                const uploadData = JSON.parse(uploadFileRes.data);
                if (Number(uploadData.code) === 2e3) {
                  const url = `http://101.126.93.249/api/hh/comfyui_api/view?type=${uploadData.data.type}&filename=${uploadData.data.filename}`;
                  console.log(url);
                  dataList.value.push({
                    type: "right",
                    content: "",
                    images: [url]
                  });
                  addMockRobotReply(manualData.nextRobotId);
                } else {
                  common_vendor.index.showToast({
                    icon: "none",
                    title: "上传失败，请联系客户或稍后重试"
                  });
                }
              },
              fail: () => {
                common_vendor.index.showToast({
                  icon: "none",
                  title: "上传失败，请联系客户或稍后重试"
                });
              }
            });
          }
        });
      } else {
        dataList.value.push({
          content: manualData.content,
          type: "right"
        });
        addMockRobotReply(manualData.nextRobotId);
      }
    };
    const fetchWebSocket = (promptData) => {
      common_vendor.index.connectSocket({
        url: "wss://region-101.seetacloud.com"
      });
      common_vendor.index.onSocketOpen(function(res2) {
        console.log("WebSocket连接已打开！");
        common_vendor.index.sendSocketMessage({
          data: promptData
        });
      });
      common_vendor.index.onSocketMessage(function(res2) {
        console.log("收到服务器内容：" + res2.data);
      });
    };
    const getPaintingTask = async () => {
      const UserMessages = dataList.value.filter((item, index) => item.type === "right");
      const lastUserMessages = UserMessages[UserMessages.length - 1];
      const UserImagesMessages = UserMessages.filter((item) => item.images);
      let params = {
        promptWords: lastUserMessages.content,
        promptImage: void 0
      };
      if (UserImagesMessages.length) {
        params.promptImage = UserImagesMessages[UserImagesMessages.length - 1].images[0];
      }
      const res2 = await common_utils.httpsRequest("/comfyui_api/postPrompt", params);
      res2.promptId;
      console.log(res2);
      fetchWebSocket(res2);
    };
    const initContentHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).select(".contact-container").boundingClientRect((data) => {
        console.log(data);
        if (data) {
          let top = data.height - scrollTop.value;
          if (top > 0) {
            scrollTop.value = top;
          }
        }
      }).exec();
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        initContentHeight();
      });
    };
    const onSendMessage = async (canClick) => {
      if (!canClick) {
        return;
      }
      dataList.value.push({
        content: inputValue.value,
        type: "right"
      });
      canSend.value = false;
      inputValue.value = "";
      addMockRobotReply(3);
      await getPaintingTask();
    };
    const previewImg = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    common_vendor.onBeforeUnmount(() => {
      clearTimeout(timer.value);
    });
    const goHistoryPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/historyDesign/historyDesign"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goUserCenter),
        b: common_vendor.s(innerContentStyle.value),
        c: common_vendor.f(dataList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "left"
          }, item.type === "left" ? common_vendor.e({
            b: common_assets._imports_0,
            c: item.title
          }, item.title ? {
            d: common_vendor.t(item.title),
            e: common_vendor.s(item.titleStyle || void 0)
          } : {}, {
            f: item.content
          }, item.content ? {
            g: common_vendor.t(item.content)
          } : {}, {
            h: item.btns
          }, item.btns ? {
            i: common_vendor.f(item.btns, (btnItem, btnIndex, i1) => {
              return {
                a: common_vendor.t(btnItem),
                b: btnIndex,
                c: common_vendor.n(`robot-btn ${selectTags.value.includes(btnItem) ? "active" : ""}`),
                d: common_vendor.o(($event) => onRobotBtnClick(btnItem, index), btnIndex)
              };
            })
          } : {}, {
            j: item.imagesOptions
          }, item.imagesOptions ? {
            k: common_vendor.f(item.imagesOptions, (imageItemSrc, imgIndex, i1) => {
              return {
                a: imageItemSrc,
                b: common_vendor.o(($event) => previewImg(imageItemSrc), imgIndex),
                c: imageItemSrc,
                d: imgIndex
              };
            })
          } : {}) : {}, {
            l: item.type === "right"
          }, item.type === "right" ? common_vendor.e({
            m: item.content
          }, item.content ? {
            n: common_vendor.t(item.content)
          } : {}, {
            o: item.images
          }, item.images ? {
            p: common_vendor.f(item.images, (imageItemSrc, imgIndex, i1) => {
              return {
                a: imageItemSrc,
                b: common_vendor.o(($event) => previewImg(imageItemSrc), imgIndex),
                c: imgIndex
              };
            })
          } : {}, {
            q: common_assets._imports_0
          }) : {}, {
            r: index
          });
        }),
        d: scrollTop.value,
        e: common_vendor.p({
          height: 56,
          width: 146,
          active: true
        }),
        f: common_vendor.o(goHistoryPage),
        g: common_vendor.p({
          height: 56,
          width: 146,
          active: true
        }),
        h: !canSend.value,
        i: canSend.value ? "输入对话后，可通过回车键发送指令" : "请先选择机器人提供的选项",
        j: inputValue.value,
        k: common_vendor.o(common_vendor.m(($event) => inputValue.value = $event.detail.value, {
          trim: true
        })),
        l: common_assets._imports_1,
        m: common_vendor.n(`send-btn ${canSend.value && inputValue.value ? "" : "disabled"} `),
        n: common_vendor.o(($event) => onSendMessage(canSend.value && inputValue.value))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-492712a1"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/designCenter.vue"]]);
wx.createPage(MiniProgramPage);
