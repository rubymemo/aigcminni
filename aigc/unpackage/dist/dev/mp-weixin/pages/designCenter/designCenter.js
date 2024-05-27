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
    const scrollTop = common_vendor.ref(0);
    const canSend = common_vendor.ref(false);
    const inputValue = common_vendor.ref("");
    const clientUNIId = common_vendor.ref("");
    const lastRobotMsg = common_vendor.ref(false);
    const isGenLoading = common_vendor.ref(false);
    const userInfo = common_vendor.ref({
      avatar: ""
    });
    const workId = common_vendor.ref(void 0);
    const dataList = common_vendor.ref([
      {
        ...common_mockData.robotReply[0].data,
        type: "left"
        // imagesOptions: [{
        // 	url: '/static/png/mock1.png',
        // 	status: 'done',
        // 	precent: 100
        // },{
        // 	url: '/static/png/mock2.png',
        // 	status: 'done',
        // 	precent: 100
        // }],
        // activeImages: [],
      }
    ]);
    const timer = common_vendor.ref();
    const instance = common_vendor.getCurrentInstance();
    const getWorkDataById = async (id) => {
      const res2 = await common_utils.httpsRequest(`/hh/works/findById/${id}`, {}, "GET");
      if (res2) {
        const dataListTemp = res2.dialogs.map((item) => {
          return JSON.parse(item.whoSay);
        });
        dataList.value = dataListTemp;
      }
    };
    common_vendor.onLoad((params) => {
      console.log("onLoad");
      if (params.id) {
        workId.value = params.id;
        getWorkDataById(params.id);
      }
    });
    const putWorkData = async () => {
      const UserMessages = dataList.value.filter((item, index) => item.type === "right" && item.compute === true);
      const lastMessage = dataList.value.find((item) => item.reload && item.type === "left");
      const lastGenImg = lastMessage ? JSON.stringify(lastMessage.imagesOptions) : void 0;
      const userInfo2 = JSON.parse(common_vendor.index.getStorageSync("userInfo"));
      const params = {
        works: {
          authorId: userInfo2.userId,
          id: workId.value || void 0,
          title: UserMessages[0].content,
          type: "1",
          imgUrl: lastGenImg
        },
        dialogs: dataList.value.map((item) => {
          if (item.type === "left") {
            return {
              whoId: 0,
              whoName: "robot",
              whoSay: JSON.stringify(item)
            };
          } else {
            return {
              whoId: userInfo2.userId,
              whoName: userInfo2.username,
              whoSay: JSON.stringify(item)
            };
          }
        })
      };
      const data = workId.value ? common_utils.httpsRequest("/hh/works/editById", params, "PUT") : common_utils.httpsRequest("/hh/works/addBy", params);
      if (data) {
        workId.value = data;
      }
    };
    const initScrollHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).select(".scroll-view-content").boundingClientRect((data) => {
        if (data) {
          scrollTop.value = data.height;
        }
      }).exec();
    };
    const getUserInfo = async () => {
      const res2 = await common_utils.httpsRequest("/cx/meByMobile", {}, "GET");
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(res2));
      return res2;
    };
    common_vendor.onMounted(async () => {
      const localUserInfo = await getUserInfo();
      if (localUserInfo) {
        userInfo.value = localUserInfo;
        clientUNIId.value = localUserInfo.userId;
      }
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
          type: "left",
          reload: robotId === 6 ? true : false
        });
        console.log(dataList.value);
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
      dataList.value[messageIndex].activeBtns = [btnStr];
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
                  const url = common_utils.genImgURl(uploadData.data.type, uploadData.data.filename);
                  console.log(url);
                  dataList.value.push({
                    type: "right",
                    content: "",
                    images: [url]
                    // compute: true
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
      isGenLoading.value = true;
      common_vendor.index.connectSocket({
        url: "wss://101.126.93.249/ws/?clientId=" + clientUNIId.value
      });
      common_vendor.index.onSocketOpen(function(res2) {
        console.log("WebSocket连接已打开！");
      });
      common_vendor.index.onSocketMessage(function(res2) {
        console.log("收到服务器内容：");
        const msgData = JSON.parse(res2.data);
        console.log(msgData);
        if (msgData.type === "executed" && Number(msgData.data.node) == 100) {
          console.log("最终结果");
          console.log(msgData.data.output);
          common_vendor.index.closeSocket();
          const dataListTemp = JSON.parse(JSON.stringify(dataList.value));
          dataListTemp[dataListTemp.length - 1].imagesOptions = msgData.data.output.images.map((imgItem) => {
            return {
              url: common_utils.genImgURl(imgItem.type, imgItem.filename),
              status: "done",
              precent: 100
            };
          });
          dataList.value = dataListTemp;
          common_vendor.nextTick$1(() => {
            isGenLoading.value = false;
          });
        } else if (msgData.type === "progress") {
          dataList.value[dataList.value.length - 1].imagesOptions = dataList.value[dataList.value.length - 1].imagesOptions.map((imgItem) => {
            return {
              url: "",
              status: "loading",
              precent: Number(msgData.data.value) / Number(msgData.data.max) === 1 ? 98 : (Number(msgData.data.value) / Number(msgData.data.max)).toFixed(2) * 100
            };
          });
        }
      });
      common_vendor.index.onSocketClose(function(res2) {
        console.log("WebSocket 已关闭！");
      });
    };
    const getPaintingTask = async () => {
      const UserMessages = dataList.value.filter((item, index) => item.type === "right" && item.compute === true);
      const lastUserMessages = UserMessages.filter((item) => item.content && !item.images).map((item) => item.content).join("");
      const UserImagesMessages = UserMessages.filter((item) => item.images && item.compute === true);
      const params = {
        promptWords: lastUserMessages + (/* @__PURE__ */ new Date()).valueOf(),
        promptImage: void 0,
        clientId: clientUNIId.value
      };
      if (UserImagesMessages.length)
        ;
      console.log("promt传的参数");
      console.log(params);
      fetchWebSocket();
      await common_utils.httpsRequest("/hh/comfyui_api/postPrompt", params);
    };
    const initContentHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).select(".contact-container").boundingClientRect((data) => {
        console.log(data);
        if (data) {
          let top = data.height - scrollTop.value;
          if (top > 0) {
            scrollTop.value = top + 500;
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
        type: "right",
        compute: true
        // 用于标识加入计算
      });
      canSend.value = false;
      inputValue.value = "";
      if (lastRobotMsg.value) {
        addMockRobotReply(5);
      } else {
        addMockRobotReply(3);
        await getPaintingTask();
      }
    };
    const onUserSelectImg = (evt, messageIndex) => {
      const imgUrl = evt.detail.value;
      if (!imgUrl) {
        return;
      }
      if (messageIndex !== dataList.value.length - 1) {
        return;
      }
      dataList.value[messageIndex].activeImages = [imgUrl];
      if (lastRobotMsg.value) {
        dataList.value.push({
          type: "right",
          content: "我已经选定了",
          images: [imgUrl],
          compute: true
          // 用于标识加入计算
        });
        addMockRobotReply(6);
        getPaintingTask();
      } else {
        dataList.value.push({
          type: "right",
          content: "我已经选定了",
          images: [imgUrl]
        });
        addMockRobotReply(4);
        lastRobotMsg.value = true;
        canSend.value = true;
      }
    };
    const previewImg = (url) => {
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    common_vendor.onBeforeUnmount(() => {
      clearTimeout(timer.value);
    });
    const goHistoryPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/historyDesign/historyDesign"
      });
    };
    const reloadGen = () => {
      if (isGenLoading.value) {
        common_vendor.index.showToast({
          icon: "none",
          title: "任务正在生成，请稍等"
        });
        return;
      }
      dataList.value[dataList.value.length - 1].imagesOptions = dataList.value[dataList.value.length - 1].imagesOptions.map((imgItem) => {
        return {
          url: "",
          status: "queue_remaining",
          precent: 0
        };
      });
      getPaintingTask();
    };
    const addNewWork = async () => {
      await putWorkData();
      common_vendor.nextTick$1(() => {
        dataList.value = [
          {
            ...common_mockData.robotReply[0].data,
            type: "left"
          }
        ];
        workId.value = void 0;
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
                c: common_vendor.n(`robot-btn ${item.activeBtns.includes(btnItem) ? "active" : ""}`),
                d: common_vendor.o(($event) => onRobotBtnClick(btnItem, index), btnIndex)
              };
            })
          } : {}, {
            j: item.imagesOptions
          }, item.imagesOptions ? {
            k: common_vendor.f(item.imagesOptions, (imageItem, imgIndex, i1) => {
              return common_vendor.e({
                a: common_vendor.t(imageItem.status === "queue_remaining" ? "任务排队中，请稍等" : ""),
                b: common_vendor.t(imageItem.status === "loading" ? `生成进度:${imageItem.precent}%` : ""),
                c: imageItem.status === "loading" || imageItem.status === "queue_remaining",
                d: imageItem.status === "done" ? imageItem.url : "",
                e: common_vendor.o(($event) => previewImg(imageItem.url), imgIndex)
              }, !item.reload ? {
                f: imageItem.url,
                g: index < dataList.value.length - 1,
                h: item.activeImages.includes(imageItem.url)
              } : {}, {
                i: imgIndex
              });
            }),
            l: !item.reload,
            m: item.reload ? "0rpx" : "28rpx",
            n: common_vendor.o((e) => onUserSelectImg(e, index), index)
          } : {}, {
            o: item.reload && !isGenLoading.value
          }, item.reload && !isGenLoading.value ? {
            p: common_vendor.n(`reload ${isGenLoading.value ? "loading" : ""}`),
            q: common_vendor.o(reloadGen, index)
          } : {}) : {}, {
            r: item.type === "right"
          }, item.type === "right" ? common_vendor.e({
            s: item.content
          }, item.content ? {
            t: common_vendor.t(item.content)
          } : {}, {
            v: item.images
          }, item.images ? {
            w: common_vendor.f(item.images, (imageItemSrc, imgIndex, i1) => {
              return {
                a: imageItemSrc,
                b: common_vendor.o(($event) => previewImg(imageItemSrc), imgIndex),
                c: imgIndex
              };
            })
          } : {}, {
            x: userInfo.value.avatar
          }) : {}, {
            y: index
          });
        }),
        d: scrollTop.value,
        e: common_vendor.o(addNewWork),
        f: common_vendor.p({
          height: 56,
          width: 146,
          active: true
        }),
        g: common_vendor.o(goHistoryPage),
        h: common_vendor.p({
          height: 56,
          width: 146,
          active: true
        }),
        i: !canSend.value,
        j: canSend.value ? "输入对话后，可通过回车键发送指令" : "请先选择机器人提供的选项",
        k: inputValue.value,
        l: common_vendor.o(common_vendor.m(($event) => inputValue.value = $event.detail.value, {
          trim: true
        })),
        m: common_assets._imports_1,
        n: common_vendor.n(`send-btn ${canSend.value && inputValue.value ? "" : "disabled"} `),
        o: common_vendor.o(($event) => onSendMessage(canSend.value && inputValue.value))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-492712a1"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/designCenter.vue"]]);
wx.createPage(MiniProgramPage);
