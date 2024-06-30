"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const common_utils = require("../../../common/utils.js");
if (!Array) {
  const _easycom_g_progress2 = common_vendor.resolveComponent("g-progress");
  _easycom_g_progress2();
}
const _easycom_g_progress = () => "../../../components/g-progress/index.js";
if (!Math) {
  (_easycom_g_progress + DownloadImgModal + UploadImgModal + PreviewImgModal)();
}
const DownloadImgModal = () => "./downloadImgModal.js";
const UploadImgModal = () => "./uploadImgModal.js";
const PreviewImgModal = () => "./previewImgModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "robotMessage",
  props: {
    msgInfo: {},
    msgIndex: {},
    msgList: {},
    userInfo: {},
    dialogId: {}
  },
  emits: ["btnClick", "imgSelect", "change", "addUserMsg"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const msgInfo = common_vendor.computed(() => props.msgInfo);
    const emits = __emit;
    const isGenLoading = common_vendor.ref(false);
    const DownloadImgModalRef = common_vendor.ref();
    const UploadImgModalRef = common_vendor.ref();
    const PreviewImgModalRef = common_vendor.ref();
    const precentState = common_vendor.reactive({
      // 用户计算百分比
      nodeCount: 22,
      // 生成时总共有几个节点,
      numerator: 0
      // 分子
    });
    const imgSelectDisabled = common_vendor.computed(() => {
      const status = props.msgInfo.imagesOptions[0].status;
      return props.msgIndex < props.msgList.length - 1 || status !== "done";
    });
    const previewImg = (data) => {
      console.log(imgSelectDisabled.value);
      if (imgSelectDisabled.value) {
        common_vendor.index.previewImage({
          urls: props.msgInfo.imagesOptions.map((item) => item.url),
          current: data.imgIndex,
          showmenu: false
        });
      } else {
        PreviewImgModalRef.value && PreviewImgModalRef.value.openModal({
          images: props.msgInfo.imagesOptions,
          imgIndex: data.imgIndex
        });
      }
    };
    const onRobotBtnClick = (btnItem) => {
      if (btnItem.opertionType === "chooseMedia") {
        UploadImgModalRef.value && UploadImgModalRef.value.openModal();
      } else {
        emits("btnClick", {
          btnItem
        });
      }
    };
    const onImgSelect = (evt) => {
      const imgValue = JSON.parse(evt.detail.value);
      emits("imgSelect", {
        imgValue
      });
    };
    const uploadImgModalOk = (data) => {
      const images = [];
      for (let key in data) {
        if (data[key]) {
          images.push(data[key]);
        }
      }
      const interfaceParamsKey = Object.keys(props.msgInfo.nextUserReply.interfaceParams)[0];
      const nextUserMsg = {
        type: "right",
        images,
        interfaceParams: {
          [interfaceParamsKey]: data
        },
        nextRobotId: props.msgInfo.afterUserSendNextRobotId
      };
      emits("addUserReply", nextUserMsg);
    };
    const previewImgModalOnOk = ({ selectImgValue }) => {
      emits("imgSelect", {
        imgValue: selectImgValue
      });
    };
    const clickDownLoadImg = (imgIndex) => {
      DownloadImgModalRef.value && DownloadImgModalRef.value.openModal({
        imageOptions: props.msgInfo.imagesOptions,
        imgIndex
      });
    };
    const computeCube = (ratioStr) => {
      const wRatio = Number(ratioStr.split(":")[0]);
      const hRatio = Number(ratioStr.split(":")[1]);
      const maxLen = 28;
      if (wRatio > hRatio) {
        return {
          width: `${maxLen}rpx`,
          height: `${hRatio / wRatio * 28}rpx`
        };
      } else {
        return {
          width: `${wRatio / hRatio * 28}rpx`,
          height: `${maxLen}rpx`
        };
      }
    };
    const fetchWebSocket = (promptData) => {
      common_vendor.index.onSocketOpen(async function(res) {
        console.log("WebSocket连接已打开！");
      });
      common_vendor.index.onSocketMessage(async function(res) {
        console.log("收到服务器内容：");
        const msgData = JSON.parse(res.data);
        console.log(msgData);
        if (msgData.type === "executing" && msgData.data.node === null) {
          console.log("最终结果");
          common_vendor.index.closeSocket();
          const imagesRes = await common_utils.httpsRequest(`/hh/comfyui_api_v2/historyByPromptId/${promptData.prompt_id}`, {}, "GET");
          if (!imagesRes)
            return;
          const msgInfoTemp = props.msgInfo;
          msgInfoTemp.imagesOptions = imagesRes.map((imgItemSrc) => {
            return {
              url: imgItemSrc,
              status: "done",
              precent: 100
            };
          });
          emits("change", msgInfoTemp, "done");
          common_vendor.nextTick$1(() => {
            isGenLoading.value = false;
          });
        } else if (msgData.type === "progress" || msgData.type === "executing" && msgData.data.node !== null) {
          let precent = 0;
          precentState.numerator = precentState.numerator + 1;
          if (precentState.numerator === precentState.nodeCount) {
            precent = 95;
          } else {
            precent = ((precentState.numerator / precentState.nodeCount).toFixed(2) * 100).toFixed(0);
          }
          const msgInfoTemp = props.msgInfo;
          if (msgInfoTemp.imagesOptions) {
            msgInfoTemp.imagesOptions = msgInfoTemp.imagesOptions.map((imgItem) => {
              return {
                url: "",
                status: "loading",
                precent
              };
            });
          }
          emits("change", msgInfoTemp, "loading");
        } else if (msgData.type === "execution_cached") {
          precentState.nodeCount = precentState.nodeCount - (msgData.data.nodes || []).length;
        }
      });
      common_vendor.index.onSocketClose(function(res) {
        console.log("WebSocket 已关闭！");
      });
    };
    const createParams = () => {
      let params = {
        clientId: props.userInfo.userId
      };
      props.msgList.forEach((msgItem) => {
        if (!msgItem.interfaceParams) {
          return;
        }
        const interfaceParamsKey = Object.keys(msgItem.interfaceParams)[0];
        const paramsValue = msgItem.interfaceParams[interfaceParamsKey];
        if (typeof paramsValue === "string") {
          params[interfaceParamsKey] = paramsValue;
        }
        if (Object.prototype.toString.call(paramsValue) === "[object Object]" && paramsValue.hasOwnProperty("text") && paramsValue.hasOwnProperty("fontfamily")) {
          const newValue = (params[interfaceParamsKey] ? params[interfaceParamsKey] : []).concat([paramsValue]);
          params[interfaceParamsKey] = newValue;
        }
        if (Object.prototype.toString.call(paramsValue) === "[object Object]" && paramsValue.hasOwnProperty("QRCode") && paramsValue.hasOwnProperty("logo") && paramsValue.hasOwnProperty("topicMap")) {
          params[interfaceParamsKey] = paramsValue;
        }
      });
      params = {
        ...params,
        ...props.msgInfo.fetch.params || {}
      };
      return params;
    };
    const fetchPaintingTask = async () => {
      const queryData = createParams();
      isGenLoading.value = true;
      common_vendor.index.connectSocket({
        url: `wss://huatu.solart.pro/ws?clientId=${props.userInfo.userId}`
      });
      const promptRes = await common_utils.httpsRequest("/hh/comfyui_api_v2/doPrompt", queryData);
      if (promptRes) {
        precentState.numerator = 0;
        precentState.nodeCount = promptRes.node_count;
        fetchWebSocket(promptRes);
      } else {
        isGenLoading.value = false;
      }
    };
    const fetchWorkflowTemplateList = async () => {
      let queryData = createParams();
      console.log(queryData);
      const workflowListTemp = await common_utils.httpsRequest(`/hh/wf/listStyleBy`, queryData, "POST");
      const msgInfoTemp = props.msgInfo;
      msgInfoTemp.imagesOptions = workflowListTemp.map((imgItem) => {
        return {
          id: imgItem.id,
          url: imgItem.imgUrl,
          status: "done",
          precent: 100
        };
      });
      emits("change", msgInfoTemp);
    };
    common_vendor.onMounted(() => {
      if (props.msgInfo.fetch && props.msgInfo.fetch.type === "doPrompt" && props.msgInfo.imagesOptions[0].status !== "done") {
        fetchPaintingTask();
      } else if (props.msgInfo.fetch && props.msgInfo.fetch.type === "workflow") {
        fetchWorkflowTemplateList();
      }
    });
    const reloadGen = () => {
      const msgInfoTemp = props.msgInfo;
      if (msgInfoTemp.imagesOptions) {
        msgInfoTemp.imagesOptions = msgInfoTemp.imagesOptions.map((imgItem) => {
          return {
            url: "",
            status: "queue_remaining",
            precent: 0
          };
        });
      }
      emits("change", msgInfoTemp);
      fetchPaintingTask();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$3,
        b: msgInfo.value.title
      }, msgInfo.value.title ? {
        c: common_vendor.t(msgInfo.value.title),
        d: common_vendor.s(msgInfo.value.titleStyle || void 0)
      } : {}, {
        e: msgInfo.value.content
      }, msgInfo.value.content ? {
        f: common_vendor.t(msgInfo.value.content)
      } : {}, {
        g: msgInfo.value.btns
      }, msgInfo.value.btns ? {
        h: common_vendor.f(msgInfo.value.btns, (btnItem, btnIndex, i0) => {
          return {
            a: common_vendor.t(btnItem.label),
            b: common_vendor.n(`robot-btn ${msgInfo.value.activeBtns.includes(btnItem.value) ? "active" : ""}`),
            c: common_vendor.o(($event) => onRobotBtnClick(btnItem), btnIndex),
            d: btnIndex
          };
        })
      } : {}, {
        i: msgInfo.value.imgRatioOptions
      }, msgInfo.value.imgRatioOptions ? {
        j: common_vendor.f(msgInfo.value.imgRatioOptions, (ratioItem, ratioIndex, i0) => {
          return {
            a: common_vendor.s(computeCube(ratioItem.value)),
            b: common_vendor.t(ratioItem.label),
            c: common_vendor.n(`robot-ratio-btn ${msgInfo.value.activeBtns.includes(ratioItem.value) ? "active" : ""}`),
            d: common_vendor.o(($event) => onRobotBtnClick(ratioItem), ratioIndex),
            e: ratioIndex
          };
        })
      } : {}, {
        k: msgInfo.value.imagesOptions
      }, msgInfo.value.imagesOptions ? common_vendor.e({
        l: msgInfo.value.imagesType === "radio"
      }, msgInfo.value.imagesType === "radio" ? {
        m: common_vendor.f(msgInfo.value.imagesOptions, (imageItem, imgIndex, i0) => {
          return common_vendor.e({
            a: imageItem.status === "loading" || imageItem.status === "queue_remaining"
          }, imageItem.status === "loading" || imageItem.status === "queue_remaining" ? {
            b: common_vendor.t(imageItem.status === "queue_remaining" ? "任务排队中，请稍等" : ""),
            c: common_vendor.t(imageItem.status === "loading" ? `图片加载中${imageItem.precent}%` : ""),
            d: "a106ba0d-0-" + i0,
            e: common_vendor.p({
              progress: imageItem.precent
            }),
            f: imageItem.status === "loading"
          } : {}, {
            g: common_vendor.n(imageItem.status),
            h: imageItem.status === "done" ? imageItem.url : "",
            i: common_vendor.o(($event) => previewImg({
              ...imageItem,
              imgIndex
            }), imgIndex),
            j: JSON.stringify(imageItem),
            k: msgInfo.value.activeImages.includes(imageItem.url),
            l: imgIndex
          });
        }),
        n: imgSelectDisabled.value,
        o: common_vendor.o(onImgSelect)
      } : {
        p: common_vendor.f(msgInfo.value.imagesOptions, (imageItem, imgIndex, i0) => {
          return common_vendor.e({
            a: imageItem.status === "loading" || imageItem.status === "queue_remaining"
          }, imageItem.status === "loading" || imageItem.status === "queue_remaining" ? {
            b: common_vendor.t(imageItem.status === "queue_remaining" ? "任务排队中，请稍等" : ""),
            c: common_vendor.t(imageItem.status === "loading" ? `图片加载中${imageItem.precent}%` : ""),
            d: "a106ba0d-1-" + i0,
            e: common_vendor.p({
              progress: imageItem.precent
            }),
            f: imageItem.status === "loading"
          } : {}, {
            g: common_vendor.n(imageItem.status),
            h: imageItem.status === "done" ? imageItem.url : "",
            i: common_vendor.o(($event) => clickDownLoadImg(imgIndex), imgIndex),
            j: imgIndex,
            k: msgInfo.value.imagesOptions.length % 2 === 1 && imgIndex === msgInfo.value.imagesOptions.length - 1 || msgInfo.value.imagesOptions.length % 2 === 0 && (imgIndex === msgInfo.value.imagesOptions.length - 1 || imgIndex === msgInfo.value.imagesOptions.length - 2) ? 0 : "18rpx"
          });
        })
      }) : {}, {
        q: msgInfo.value.reload && !isGenLoading.value && props.msgIndex === props.msgList.length - 1
      }, msgInfo.value.reload && !isGenLoading.value && props.msgIndex === props.msgList.length - 1 ? {
        r: common_vendor.n(`reload ${isGenLoading.value ? "loading" : ""}`),
        s: common_vendor.o(reloadGen)
      } : {}, {
        t: common_vendor.sr(DownloadImgModalRef, "a106ba0d-2", {
          "k": "DownloadImgModalRef"
        }),
        v: common_vendor.p({
          dialogId: props.dialogId,
          userId: props.userInfo.userId
        }),
        w: common_vendor.sr(UploadImgModalRef, "a106ba0d-3", {
          "k": "UploadImgModalRef"
        }),
        x: common_vendor.o(uploadImgModalOk),
        y: common_vendor.sr(PreviewImgModalRef, "a106ba0d-4", {
          "k": "PreviewImgModalRef"
        }),
        z: common_vendor.o(previewImgModalOnOk)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a106ba0d"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/robotMessage.vue"]]);
wx.createComponent(Component);
