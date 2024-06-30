"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
if (!Array) {
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  _easycom_z_paging2();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  _easycom_z_paging();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userNotifications",
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const paging = common_vendor.ref();
    const queryList = async (pageNo, pageSize) => {
      console.log(pageNo, pageSize);
      const userInfo = JSON.parse(common_vendor.index.getStorageSync("userInfo"));
      let query = {
        ownerId: userInfo.userId
      };
      const res = await common_utils.httpsRequest(`/hh/dialog/pageMeBy/${pageSize}/${pageNo}`, query, "GET");
      paging.value.complete(res.data || []);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.w(({
          item,
          index
        }, s0, i0) => {
          return {
            a: item.imgUrl,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.createTime),
            d: common_vendor.t(item.createTime),
            e: common_vendor.o(($event) => _ctx.clickItem(item)),
            f: i0,
            g: s0
          };
        }, {
          name: "cell",
          path: "a",
          vueId: "9b4068d4-0"
        }),
        b: common_vendor.sr(paging, "9b4068d4-0", {
          "k": "paging"
        }),
        c: common_vendor.o(queryList),
        d: common_vendor.o(($event) => dataList.value = $event),
        e: common_vendor.p({
          ["use-virtual-list"]: true,
          ["auto-show-back-to-top"]: true,
          ["refresher-enabled"]: true,
          modelValue: dataList.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9b4068d4"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/userNotifications/userNotifications.vue"]]);
wx.createPage(MiniProgramPage);
