"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_mockData = require("../../common/mockData.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "designCenter",
  setup(__props) {
    const res = common_vendor.index.getSystemInfoSync();
    const innerContentStyle = common_vendor.ref({
      "padding-top": res.statusBarHeight + "px"
    });
    const canSend = common_vendor.ref(false);
    const selectTags = common_vendor.ref([]);
    const inputValue = common_vendor.ref("");
    const dataList = common_vendor.ref([
      {
        ...common_mockData.robotReply[0].data,
        type: "left"
      }
    ]);
    const timer = common_vendor.ref();
    const goUserCenter = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/userCenter"
      });
    };
    const onRobotBtnClick = (btnStr) => {
      selectTags.value.push(btnStr);
      const manualData = common_mockData.manualReply[btnStr];
      dataList.value.push({
        content: manualData.content,
        type: "right"
      });
      timer.value = setTimeout(() => {
        const robotReplyData = common_mockData.robotReply[manualData.nextRobotId];
        dataList.value.push({
          ...robotReplyData.data,
          startCreate: robotReplyData.startCreate,
          type: "left"
        });
        if (robotReplyData.startCreate) {
          canSend.value = true;
        }
      }, 500);
    };
    const onSendMessage = (canClick) => {
      if (!canClick) {
        return;
      }
      dataList.value.push({
        content: inputValue.value,
        type: "right"
      });
      canSend.value = false;
    };
    common_vendor.onBeforeUnmount(() => {
      clearTimeout(timer.value);
    });
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
            d: common_vendor.t(item.title)
          } : {}, {
            e: item.content
          }, item.content ? {
            f: common_vendor.t(item.content)
          } : {}, {
            g: item.btns
          }, item.btns ? {
            h: common_vendor.f(item.btns, (btnItem, btnIndex, i1) => {
              return {
                a: common_vendor.t(btnItem),
                b: btnIndex,
                c: common_vendor.n(`robot-btn ${selectTags.value.includes(btnItem) ? "active" : ""}`),
                d: common_vendor.o(($event) => onRobotBtnClick(btnItem), btnIndex)
              };
            })
          } : {}) : {}, {
            i: item.type === "right"
          }, item.type === "right" ? {
            j: common_vendor.t(item.content),
            k: common_assets._imports_0
          } : {}, {
            l: index
          });
        }),
        d: !canSend.value,
        e: canSend.value ? "输入对话后，可通过回车键发送指令" : "请先选择机器人提供的选项",
        f: inputValue.value,
        g: common_vendor.o(common_vendor.m(($event) => inputValue.value = $event.detail.value, {
          trim: true
        })),
        h: common_assets._imports_1,
        i: common_vendor.n(`send-btn ${canSend.value && inputValue.value ? "" : "disabled"} `),
        j: common_vendor.o(($event) => onSendMessage(canSend.value && inputValue.value))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-492712a1"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/designCenter.vue"]]);
wx.createPage(MiniProgramPage);
