"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Math) {
  (FontFamilyModal + EditContentModal)();
}
const FontFamilyModal = () => "./fontFamilyModal.js";
const EditContentModal = () => "./editContentModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userMessage",
  props: {
    msgInfo: {},
    userInfo: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const FontFamilyModalRef = common_vendor.ref();
    const EditContentModalRef = common_vendor.ref();
    const showTooltips = common_vendor.ref(false);
    const hasTooltips = common_vendor.computed(() => {
      if (props.msgInfo.tooltipsBtns && props.msgInfo.tooltipsBtns.length > 0) {
        return true;
      }
      return false;
    });
    const handleCopy = () => {
      common_vendor.index.setClipboardData({
        data: props.msgInfo.content,
        //要被复制的内容
        success: () => {
          toggleShowTooltips();
          common_vendor.index.showToast({
            //提示
            icon: "none",
            title: "复制成功"
          });
        }
      });
    };
    const handleEdit = () => {
      toggleShowTooltips();
      EditContentModalRef.value && EditContentModalRef.value.openModal(props.msgInfo.content);
    };
    const openFamilyModal = () => {
      toggleShowTooltips();
      const defaultFamily = props.msgInfo.interfaceParams[Object.keys(props.msgInfo.interfaceParams)[0]].fontfamily || "";
      FontFamilyModalRef.value && FontFamilyModalRef.value.openModal({
        defaultFamily
      });
    };
    const toolsMap = {
      "copy": {
        text: "复制全文",
        click: handleCopy,
        icon: "icon-copy"
      },
      "edit": {
        text: "修改全文",
        click: handleEdit,
        icon: "icon-edit"
      },
      "family": {
        text: "字体选择",
        click: openFamilyModal,
        icon: "icon-font-family"
      }
    };
    const toolList = common_vendor.computed(() => {
      return props.msgInfo.tooltipsBtns.map((key) => toolsMap[key]);
    });
    const toggleShowTooltips = () => {
      if (hasTooltips.value) {
        showTooltips.value = !showTooltips.value;
      }
    };
    const previewImg = (url) => {
      console.log(url);
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    const onTooltipsBgTouchstart = () => {
      toggleShowTooltips();
    };
    const editContentModalOk = (newContent) => {
      const data = { ...props.msgInfo };
      data.content = newContent;
      data.interfaceParams[Object.keys(data.interfaceParams)[0]] = {
        ...data.interfaceParams[Object.keys(data.interfaceParams)[0]],
        text: newContent
      };
      emits("change", data);
    };
    const onSelectFontFamilyOk = (newFamily) => {
      const data = { ...props.msgInfo };
      data.interfaceParams[Object.keys(data.interfaceParams)[0]] = {
        ...data.interfaceParams[Object.keys(data.interfaceParams)[0]],
        fontfamily: newFamily
      };
      emits("change", data);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showTooltips.value
      }, showTooltips.value ? {
        b: common_vendor.f(toolList.value, (item, index, i0) => {
          return {
            a: common_vendor.n(`iconfont ${item.icon}`),
            b: common_vendor.t(item.text),
            c: item.index,
            d: common_vendor.o(item.click, item.index)
          };
        })
      } : {}, {
        c: showTooltips.value
      }, showTooltips.value ? {
        d: common_vendor.o(onTooltipsBgTouchstart)
      } : {}, {
        e: _ctx.msgInfo.content
      }, _ctx.msgInfo.content ? {
        f: common_vendor.t(_ctx.msgInfo.content),
        g: common_vendor.n(showTooltips.value ? "user-select" : ""),
        h: common_vendor.o(toggleShowTooltips)
      } : {}, {
        i: _ctx.msgInfo.images
      }, _ctx.msgInfo.images ? {
        j: common_vendor.f(_ctx.msgInfo.images, (imageItemSrc, imgIndex, i0) => {
          return {
            a: imageItemSrc,
            b: common_vendor.o(($event) => previewImg(imageItemSrc), imgIndex),
            c: imgIndex
          };
        })
      } : {}, {
        k: _ctx.userInfo.avatar,
        l: common_vendor.sr(FontFamilyModalRef, "bc432972-0", {
          "k": "FontFamilyModalRef"
        }),
        m: common_vendor.o(onSelectFontFamilyOk),
        n: common_vendor.sr(EditContentModalRef, "bc432972-1", {
          "k": "EditContentModalRef"
        }),
        o: common_vendor.o(editContentModalOk)
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bc432972"], ["__file", "/Users/huyi/Desktop/own-project/aigc/aigcminni/aigc/pages/designCenter/components/userMessage.vue"]]);
wx.createComponent(Component);
