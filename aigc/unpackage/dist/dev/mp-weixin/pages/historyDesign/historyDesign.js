"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_g_color_btn2 = common_vendor.resolveComponent("g-color-btn");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_g_color_btn2 + _easycom_z_paging2)();
}
const _easycom_g_color_btn = () => "../../components/g-color-btn/index.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_g_color_btn + _easycom_z_paging)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "historyDesign",
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const paging = common_vendor.ref();
    const queryList = async (pageNo, pageSize) => {
      console.log(pageNo, pageSize);
      if (pageNo === 1) {
        paging.value.complete([1, 2, 3, 4, 5]);
      } else {
        paging.value.complete([]);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          height: 66,
          width: 180
        }),
        b: common_vendor.p({
          height: 66,
          width: 180
        }),
        c: common_vendor.p({
          height: 66,
          width: 180
        }),
        d: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return {
            a: i0,
            b: s0
          };
        }, {
          name: "cell",
          path: "d",
          vueId: "999f11f3-0"
        }),
        e: common_vendor.sr(paging, "999f11f3-0", {
          "k": "paging"
        }),
        f: common_vendor.o(queryList),
        g: common_vendor.o(($event) => dataList.value = $event),
        h: common_vendor.p({
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
