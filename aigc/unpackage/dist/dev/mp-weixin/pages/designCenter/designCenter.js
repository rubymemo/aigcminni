"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_mockData = require("../../common/mockData.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_g_progress2 = common_vendor.resolveComponent("g-progress");
  const _easycom_g_color_btn2 = common_vendor.resolveComponent("g-color-btn");
  (_easycom_g_progress2 + _easycom_g_color_btn2)();
}
const _easycom_g_progress = () => "../../components/g-progress/index.js";
const _easycom_g_color_btn = () => "../../components/g-color-btn/index.js";
if (!Math) {
  (_easycom_g_progress + _easycom_g_color_btn)();
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
    const workflowList = common_vendor.ref([]);
    const RobotReply = common_vendor.reactive({ ...common_mockData.robotReply });
    const userInfo = common_vendor.ref({
      avatar: "",
      nickname: "",
      username: ""
    });
    const workId = common_vendor.ref(void 0);
    const dataList = common_vendor.ref([
      {
        ...RobotReply[0].data,
        type: "left"
        // imagesOptions: [{
        // 	url: '/static/png/mock1.png',
        // 	status: 'loading',
        // 	precent: 80
        // },{
        // 	url: '/static/png/mock2.png',
        // 	status: 'queue_remaining',
        // 	precent: 80
        // }],
        // activeImages: [],
      }
    ]);
    const timer = common_vendor.ref();
    const instance = common_vendor.getCurrentInstance();
    const getUserInfo = async () => {
      const res2 = await common_utils.httpsRequest("/cx/meByMobile", {}, "GET");
      common_vendor.index.setStorageSync("userInfo", JSON.stringify(res2));
      return res2;
    };
    const getWorkDataById = async (id) => {
      const res2 = await common_utils.httpsRequest(`/hh/dialog/findItemHistory/${id}`, {}, "GET");
      if (res2) {
        const dataListTemp = res2.items.map((item) => {
          return JSON.parse(item.whoSay);
        });
        dataList.value = dataListTemp;
        const lastMsg = dataListTemp[dataListTemp.length - 1];
        console.log(lastMsg);
        if (lastMsg.type === "right" && dataListTemp.length === 6) {
          addMockRobotReply(3);
          const UserMessages = dataList.value.filter((item, index) => item.type === "right" && item.compute === true);
          getPaintingTask("logo_draw", UserMessages[0].content);
        }
        if (lastMsg.type === "left" && dataListTemp.length >= 9) {
          lastRobotMsg.value = true;
          if (dataListTemp.length === 9) {
            canSend.value = true;
          }
        }
      }
    };
    const fetchWorkFlowList = async (type) => {
      const workflowListTemp = await common_utils.httpsRequest(`/hh/prompt_workflow/listByType/${type}`, {}, "GET");
      workflowList.value = workflowListTemp;
      RobotReply[5].data.imagesOptions = workflowListTemp.map((item) => ({
        url: item.imgUrl,
        status: "done",
        precent: 100
      }));
    };
    common_vendor.onLoad(async (params) => {
      console.log("onLoad");
      const localUserInfo = await getUserInfo();
      if (localUserInfo) {
        userInfo.value = localUserInfo;
        clientUNIId.value = localUserInfo.userId;
      }
      fetchWorkFlowList("logo_compose");
      if (params.id) {
        workId.value = params.id;
        getWorkDataById(params.id);
      }
    });
    const putWorkData = async () => {
      let isFindTitle = false;
      const result = dataList.value.map((item, index) => {
        if (item.type === "left") {
          const params = {
            whoId: 0,
            whoName: "robot",
            whoSay: JSON.stringify(item),
            clipType: "",
            clipContent: ""
          };
          if (item.imagesOptions) {
            params.clipType = "info";
            params.clipContent = JSON.stringify({
              imgUrl: item.imagesOptions[0].url
            });
          }
          if (index === 0) {
            params.clipType = "info";
            params.clipContent = JSON.stringify({
              type: item.activeBtns.includes("logo") ? 1 : 2
            });
          }
          return params;
        } else {
          const params = {
            whoId: userInfo.value.userId,
            whoName: userInfo.value.nickname || userInfo.value.username,
            whoSay: JSON.stringify(item),
            clipType: "",
            clipContent: ""
          };
          if (item.compute && !isFindTitle) {
            isFindTitle = true;
            params.clipType = "info", params.clipContent = JSON.stringify({
              title: item.content,
              ownerId: userInfo.value.userId
            });
          }
          return params;
        }
      });
      const data = workId.value ? await common_utils.httpsRequest(`/hh/dialog/replaceAllItemBy/${workId.value}`, result, "POST") : await common_utils.httpsRequest("/hh/dialog/addItemBy", result);
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
    common_vendor.onMounted(async () => {
      initScrollHeight();
    });
    const goUserCenter = () => {
      common_vendor.index.redirectTo({
        url: "/pages/userCenter/userCenter"
      });
    };
    const addMockRobotReply = (robotId) => {
      clearTimeout(timer.value);
      timer.value = setTimeout(() => {
        const robotReplyData = RobotReply[robotId];
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
        if (workId.value && [4, 5].includes(robotId)) {
          putWorkData();
        }
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
              url: `${common_utils.host}/hh/comfyui_api_v2/uploadImage`,
              filePath: tempFilePaths[0].tempFilePath,
              name: "image",
              success: (uploadFileRes) => {
                const uploadData = JSON.parse(uploadFileRes.data);
                if (Number(uploadData.code) === 2e3) {
                  dataList.value.push({
                    type: "right",
                    content: "",
                    images: [uploadData.data],
                    refer: true
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
        url: `wss://u262838-87ee-75614327.westx.seetacloud.com:8443/ws?clientId=${clientUNIId.value}`
        // url: 'wss://101.126.93.249/ws/?clientId=' + clientUNIId.value
      });
      common_vendor.index.onSocketOpen(function(res2) {
        console.log("WebSocket连接已打开！");
      });
      common_vendor.index.onSocketMessage(async function(res2) {
        console.log("收到服务器内容：");
        const msgData = JSON.parse(res2.data);
        console.log(msgData);
        if (msgData.type === "executed" && Number(msgData.data.node) == 100) {
          console.log("最终结果");
          common_vendor.index.closeSocket();
          const imagesRes = await common_utils.httpsRequest(`/hh/comfyui_api_v2/historyByPromptId/${promptData.prompt_id}`, {}, "GET");
          if (!imagesRes)
            return;
          const dataListTemp = JSON.parse(JSON.stringify(dataList.value));
          dataListTemp[dataListTemp.length - 1].imagesOptions = imagesRes.map((imgItemSrc) => {
            return {
              url: imgItemSrc,
              status: "done",
              precent: 100
            };
          });
          dataList.value = dataListTemp;
          common_vendor.nextTick$1(() => {
            isGenLoading.value = false;
            putWorkData();
          });
        } else if (msgData.type === "progress") {
          dataList.value[dataList.value.length - 1].imagesOptions = dataList.value[dataList.value.length - 1].imagesOptions.map((imgItem) => {
            return {
              url: "",
              status: "loading",
              precent: Number(msgData.data.value) / Number(msgData.data.max) === 1 ? 95 : (Number(msgData.data.value) / Number(msgData.data.max)).toFixed(2) * 100
            };
          });
        }
      });
      common_vendor.index.onSocketClose(function(res2) {
        console.log("WebSocket 已关闭！");
      });
    };
    const getPaintingTask = async (code, promptWords) => {
      const UserImagesMessages = dataList.value.filter((item, index) => item.type === "right" && item.refer === true);
      const params = {
        code,
        promptWords: promptWords || " ",
        fileUrl: void 0,
        clientId: clientUNIId.value
      };
      if (UserImagesMessages.length) {
        const promptImageUrl = UserImagesMessages[UserImagesMessages.length - 1].images[0];
        params.fileUrl = promptImageUrl;
      }
      console.log("promt传的参数");
      console.log(params);
      const promptRes = await common_utils.httpsRequest("/hh/comfyui_api_v2/doPrompt", params);
      fetchWebSocket(promptRes);
    };
    const initContentHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).select(".contact-container").boundingClientRect((data) => {
        console.log(data);
        if (data) {
          let top = data.height - scrollTop.value;
          if (top > 0) {
            scrollTop.value = top + 900;
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
      putWorkData();
      canSend.value = false;
      inputValue.value = "";
      if (lastRobotMsg.value) {
        addMockRobotReply(5);
      } else {
        addMockRobotReply(3);
        const UserMessages = dataList.value.filter((item, index) => item.type === "right" && item.compute === true);
        await getPaintingTask("logo_draw", UserMessages[0].content);
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
          images: [imgUrl]
          // compute: true // 用于标识加入计算
        });
        addMockRobotReply(6);
        const findWorkFlow = workflowList.value.find((workflow) => workflow.imgUrl === imgUrl);
        const UserMessages = dataList.value.filter((item, index) => item.type === "right" && item.compute === true);
        const promptText = UserMessages.length === 2 ? UserMessages[1].content : "";
        getPaintingTask(findWorkFlow.code, promptText);
      } else {
        dataList.value.push({
          type: "right",
          content: "我已经选定了",
          images: [imgUrl],
          refer: true
          // 用于标识下发任务时的图片
        });
        addMockRobotReply(4);
        lastRobotMsg.value = true;
        canSend.value = true;
      }
    };
    const previewImg = (url) => {
      console.log(url);
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    common_vendor.onBeforeUnmount(() => {
      try {
        common_vendor.index.closeSocket();
        clearTimeout(timer.value);
      } catch (e) {
      }
    });
    const goHistoryPage = () => {
      common_vendor.index.redirectTo({
        url: "/pages/historyDesign/historyDesign"
      });
    };
    const addNewWork = async () => {
      await putWorkData();
      try {
        common_vendor.index.closeSocket();
        clearTimeout(timer.value);
      } catch (e) {
      }
      common_vendor.nextTick$1(() => {
        dataList.value = [
          {
            ...RobotReply[0].data,
            type: "left"
          }
        ];
        workId.value = void 0;
        canSend.value = false;
        inputValue.value = "";
        lastRobotMsg.value = false;
        isGenLoading.value = false;
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
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
                a: imageItem.status === "loading" || imageItem.status === "queue_remaining"
              }, imageItem.status === "loading" || imageItem.status === "queue_remaining" ? {
                b: common_vendor.t(imageItem.status === "queue_remaining" ? "任务排队中，请稍等" : ""),
                c: common_vendor.t(imageItem.status === "loading" ? `图片加载中${imageItem.precent}%` : ""),
                d: "492712a1-0-" + i0 + "-" + i1,
                e: common_vendor.p({
                  progress: imageItem.precent
                }),
                f: imageItem.status === "loading"
              } : {}, {
                g: imageItem.status === "done" ? imageItem.url : "",
                h: common_vendor.o(($event) => previewImg(imageItem.url), imgIndex)
              }, !item.reload ? {
                i: imageItem.url,
                j: index < dataList.value.length - 1,
                k: item.activeImages.includes(imageItem.url)
              } : {}, {
                l: imgIndex
              });
            }),
            l: !item.reload,
            m: item.reload ? "0rpx" : "28rpx",
            n: common_vendor.o((e) => onUserSelectImg(e, index), index)
          } : {}) : {}, {
            o: item.type === "right"
          }, item.type === "right" ? common_vendor.e({
            p: item.content
          }, item.content ? {
            q: common_vendor.t(item.content)
          } : {}, {
            r: item.images
          }, item.images ? {
            s: common_vendor.f(item.images, (imageItemSrc, imgIndex, i1) => {
              return {
                a: imageItemSrc,
                b: common_vendor.o(($event) => previewImg(imageItemSrc), imgIndex),
                c: imgIndex
              };
            })
          } : {}, {
            t: userInfo.value.avatar
          }) : {}, {
            v: index
          });
        }),
        d: scrollTop.value,
        e: workId.value
      }, workId.value ? {
        f: common_vendor.o(addNewWork),
        g: common_vendor.p({
          height: 56,
          width: 146,
          active: true
        }),
        h: common_vendor.o(goHistoryPage),
        i: common_vendor.p({
          height: 56,
          width: 146,
          active: true
        })
      } : {}, {
        j: !canSend.value,
        k: canSend.value ? "输入对话后，可通过回车键发送指令" : "请先选择机器人提供的选项",
        l: inputValue.value,
        m: common_vendor.o(common_vendor.m(($event) => inputValue.value = $event.detail.value, {
          trim: true
        })),
        n: common_assets._imports_1,
        o: common_vendor.n(`send-btn ${canSend.value && inputValue.value ? "" : "disabled"} `),
        p: common_vendor.o(($event) => onSendMessage(canSend.value && inputValue.value))
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-492712a1"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/designCenter.vue"]]);
wx.createPage(MiniProgramPage);
