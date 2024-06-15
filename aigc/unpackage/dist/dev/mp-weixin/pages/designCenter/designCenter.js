"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_mockData = require("../../common/mockData.js");
const common_utils = require("../../common/utils.js");
if (!Math) {
  (robotMessageVue + userMessageVue)();
}
const userMessageVue = () => "./components/userMessage.js";
const robotMessageVue = () => "./components/robotMessage.js";
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
    const lastRobotMsg = common_vendor.ref(false);
    const isGenLoading = common_vendor.ref(false);
    const RobotReply = common_vendor.reactive({ ...common_mockData.robotReply });
    const userInfo = common_vendor.ref({
      avatar: "",
      nickname: "",
      username: "",
      userId: ""
    });
    const workId = common_vendor.ref(void 0);
    const dataList = common_vendor.ref([
      {
        type: "left",
        ...RobotReply[0].data
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
          dataList.value.filter((item, index) => item.type === "right" && item.userInputSend === true);
        }
        if (lastMsg.type === "left" && dataListTemp.length >= 9) {
          lastRobotMsg.value = true;
          if (dataListTemp.length === 9) {
            canSend.value = true;
          }
        }
      }
    };
    common_vendor.onLoad(async (params) => {
      console.log("onLoad： 获取用户信息");
      const localUserInfo = await getUserInfo();
      if (localUserInfo) {
        userInfo.value = localUserInfo;
      }
      if (params.id) {
        workId.value = params.id;
        getWorkDataById(params.id);
      }
    });
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
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/userCenter"
      });
    };
    const addMockRobotReply = (robotId) => {
      const robotReplyData = RobotReply[robotId].data;
      dataList.value.push({
        ...robotReplyData,
        type: "left"
      });
      if (robotReplyData.canUserSend) {
        canSend.value = true;
      }
      scrollToBottom();
      console.log(dataList.value);
    };
    const addUserReply = (data) => {
      dataList.value.push(data);
      if (data.nextRobotId) {
        addMockRobotReply(data.nextRobotId);
      }
    };
    const onRobotBtnClick = (btnItem, messageIndex) => {
      if (messageIndex < dataList.value.length - 1) {
        return;
      }
      dataList.value[messageIndex].activeBtns = [btnItem.value];
      const manualData = common_mockData.manualReply[btnItem.nextUserId];
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
        const userRelyStr = manualData.content.replaceAll("{replace}", btnItem.label);
        const interfaceParams = { ...manualData.interfaceParams };
        if (btnItem.value !== 0) {
          interfaceParams[Object.keys(interfaceParams)[0]] = btnItem.value;
        }
        dataList.value.push({
          type: "right",
          content: userRelyStr,
          interfaceParams
        });
        canSend.value = false;
        inputValue.value = "";
        addMockRobotReply(manualData.nextRobotId);
      }
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
      const prevRobotMsg = dataList.value[dataList.value.length - 1];
      const nextUserRely = prevRobotMsg.nextUserReply || {};
      const interfaceParams = { ...nextUserRely.interfaceParams };
      interfaceParams[Object.keys(interfaceParams)[0]] = { text: inputValue.value, fontfamily: "" };
      dataList.value.push({
        type: "right",
        content: inputValue.value,
        interfaceParams,
        tooltipsBtns: prevRobotMsg.nextUserReply.tooltipsBtns || void 0
      });
      canSend.value = false;
      inputValue.value = "";
      console.log(prevRobotMsg);
      if (prevRobotMsg.afterUserSendNextRobotId) {
        addMockRobotReply(prevRobotMsg.afterUserSendNextRobotId);
      }
    };
    const onUserSelectImg = async (imgValue, messageIndex) => {
      if (imgValue.status !== "done") {
        return;
      }
      const imgUrl = imgValue.url;
      if (!imgUrl) {
        return;
      }
      if (messageIndex !== dataList.value.length - 1) {
        return;
      }
      dataList.value[messageIndex].activeImages = [imgUrl];
      const manualData = common_mockData.manualReply[dataList.value[messageIndex].nextUserId];
      const interfaceParams = manualData.interfaceParams;
      interfaceParams[Object.keys(interfaceParams)[0]] = imgUrl;
      dataList.value.push({
        type: "right",
        content: manualData.content,
        interfaceParams
      });
      addMockRobotReply(manualData.nextRobotId);
    };
    common_vendor.onBeforeUnmount(() => {
      try {
        common_vendor.index.closeSocket();
        clearTimeout(timer.value);
      } catch (e) {
      }
    });
    const goHistoryPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/historyDesign/historyDesign"
      });
    };
    const addNewWork = async () => {
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
    const onDataChange = (newData, index) => {
      dataList.value[index] = newData;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goUserCenter),
        b: common_vendor.s(innerContentStyle.value),
        c: common_vendor.o(addNewWork),
        d: common_vendor.f(dataList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "left"
          }, item.type === "left" ? {
            b: common_vendor.o(({
              btnItem
            }) => onRobotBtnClick(btnItem, index), index),
            c: common_vendor.o(({
              imgValue
            }) => onUserSelectImg(imgValue, index), index),
            d: common_vendor.o((newData) => onDataChange(newData, index), index),
            e: common_vendor.o(addUserReply, index),
            f: "492712a1-0-" + i0,
            g: common_vendor.p({
              msgInfo: item,
              msgIndex: index,
              msgList: dataList.value,
              userInfo: userInfo.value
            })
          } : {}, {
            h: item.type === "right"
          }, item.type === "right" ? {
            i: common_vendor.o((newData) => onDataChange(newData, index), index),
            j: "492712a1-1-" + i0,
            k: common_vendor.p({
              msgInfo: item,
              userInfo: userInfo.value
            })
          } : {}, {
            l: index
          });
        }),
        e: scrollTop.value,
        f: common_vendor.o(goHistoryPage),
        g: !canSend.value,
        h: common_vendor.o(($event) => onSendMessage(canSend.value && inputValue.value)),
        i: canSend.value ? "输入对话后，可通过回车键发送指令" : "请先选择机器人提供的选项",
        j: inputValue.value,
        k: common_vendor.o(common_vendor.m(($event) => inputValue.value = $event.detail.value, {
          trim: true
        })),
        l: common_assets._imports_0$2,
        m: common_vendor.n(`send-btn ${canSend.value && inputValue.value ? "" : "disabled"} `),
        n: common_vendor.o(($event) => onSendMessage(canSend.value && inputValue.value))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-492712a1"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/designCenter.vue"]]);
wx.createPage(MiniProgramPage);
