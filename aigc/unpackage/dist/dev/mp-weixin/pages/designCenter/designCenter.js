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
      common_vendor.index.createSelectorQuery().in(instance).select(".contact-container").boundingClientRect((data) => {
        if (data) {
          console.log(data.height);
          scrollTop.value = data.height;
        }
      }).exec();
    };
    common_vendor.onMounted(async () => {
      initScrollHeight();
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
          if (item.interfaceParams && item.interfaceParams.promptWords && !isFindTitle) {
            isFindTitle = true;
            params.clipType = "info", params.clipContent = JSON.stringify({
              title: item.interfaceParams.promptWords.text,
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
      if (dataList.value.length > 3) {
        putWorkData();
      }
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
    };
    const initContentHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).select(".contact-container").boundingClientRect((data) => {
        if (data && data.height) {
          scrollTop.value = data.height;
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
      interfaceParams[Object.keys(interfaceParams)[0]] = imgValue.id || imgUrl;
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
    const onDataChange = (newData, index, type) => {
      dataList.value[index] = newData;
      if (type === "done") {
        putWorkData();
      }
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
            d: common_vendor.o((newData, changeType) => onDataChange(newData, index, changeType), index),
            e: common_vendor.o(addUserReply, index),
            f: "492712a1-0-" + i0,
            g: common_vendor.p({
              msgInfo: item,
              msgIndex: index,
              msgList: dataList.value,
              userInfo: userInfo.value,
              dialogId: workId.value
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
