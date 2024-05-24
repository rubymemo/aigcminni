"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_g_color_btn2 = common_vendor.resolveComponent("g-color-btn");
  const _easycom_g_select2 = common_vendor.resolveComponent("g-select");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_g_color_btn2 + _easycom_g_select2 + _easycom_z_paging2)();
}
const _easycom_g_color_btn = () => "../../components/g-color-btn/index.js";
const _easycom_g_select = () => "../../components/g-select/index.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_g_color_btn + _easycom_g_select + _easycom_z_paging)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "historyDesign",
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const paging = common_vendor.ref();
    const searchValues = common_vendor.reactive({
      type: null,
      time: null
    });
    const isAll = common_vendor.ref(true);
    const selectOptions = (value) => {
      isAll.value = false;
    };
    const queryList = async (pageNo, pageSize) => {
      console.log(pageNo, pageSize);
      const res = await common_utils.httpsRequest(`/works/pageBy/${pageSize}/${pageNo}`, {}, "GET");
      paging.value.complete(res.data || []);
    };
    const clickAll = () => {
      isAll.value = true;
      searchValues.time = null;
      searchValues.type = null;
      console.log("clickAll");
      console.log(searchValues);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(clickAll),
        b: common_vendor.p({
          height: 66,
          width: 180,
          active: isAll.value
        }),
        c: common_vendor.o(selectOptions),
        d: common_vendor.o(($event) => searchValues.type = $event),
        e: common_vendor.p({
          height: 66,
          width: 212,
          options: [{
            label: "logo生成",
            value: "0"
          }, {
            label: "创意营销大图",
            value: "1"
          }],
          placeholder: "类型",
          modelValue: searchValues.type
        }),
        f: common_vendor.o(selectOptions),
        g: common_vendor.o(($event) => searchValues.time = $event),
        h: common_vendor.p({
          height: 66,
          width: 212,
          options: [{
            label: "近一个月",
            value: "0"
          }, {
            label: "近7天",
            value: "1"
          }],
          placeholder: "时间",
          modelValue: searchValues.time
        }),
        i: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return {
            a: i0,
            b: s0
          };
        }, {
          name: "cell",
          path: "i",
          vueId: "999f11f3-0"
        }),
        j: common_vendor.sr(paging, "999f11f3-0", {
          "k": "paging"
        }),
        k: common_vendor.o(queryList),
        l: common_vendor.o(($event) => dataList.value = $event),
        m: common_vendor.p({
          ["use-virtual-list"]: true,
          ["auto-show-back-to-top"]: true,
          ["refresher-enabled"]: true,
          modelValue: dataList.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-999f11f3"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/historyDesign/historyDesign.vue"]]);
wx.createPage(MiniProgramPage);
