"use strict";
const robotReply_1 = {
  1: {
    data: {
      content: "请您简要描述您想要设计的logo的想法，\n例如：“一间开在海边的咖啡厅”\n请在下方输入框内进行描述并发送给我",
      canUserSend: true,
      afterUserSendNextRobotId: 2,
      // 等用户回复完，再下一次机器人
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          promptWords: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit"]
      }
    }
  },
  2: {
    data: {
      content: "下面可以开始选择一种您喜欢的风格啦\n也可选择默认，完成后马上为您开始设计",
      btns: [
        { label: "默认", value: "", nextUserId: 2 },
        { label: "立体", value: "3D", nextUserId: 2 },
        { label: "简洁", value: "simple", nextUserId: 2 },
        { label: "卡通", value: "cartoon", nextUserId: 2 },
        { label: "水彩", value: "watercolor", nextUserId: 2 },
        { label: "油画", value: "oil on canvas", nextUserId: 2 },
        { label: "剪影", value: "Silhouette", nextUserId: 2 },
        { label: "复古", value: "vintage style ", nextUserId: 2 },
        { label: "单色", value: "monochrome", nextUserId: 2 }
      ],
      activeBtns: []
    }
  },
  3: {
    data: {
      content: "为了达到更好的效果，请把你的品牌名称告诉我；如果选择没有，可能会导致最终的logo没有品牌名称，请谨慎选择没有哦\n请直接在下方输入，或选择暂时还没有",
      btns: [
        { label: "没有", value: 0, nextUserId: 3 }
      ],
      activeBtns: [],
      canUserSend: true,
      afterUserSendNextRobotId: 4,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        type: "right",
        content: "",
        interfaceParams: {
          brandName: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit", "family"]
      }
    }
  },
  4: {
    data: {
      title: "Hi~ 正在为您生成创意想法...",
      titleStyle: {
        color: "#256AF7"
      },
      content: "根据您提供的信息，以下是我针对图片的设计；点击图片可查看大图，点击下方选择框选定图形，进入最终效果图生成。",
      imagesType: "result",
      //
      imagesOptions: [
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 }
      ],
      reload: true,
      fetch: {
        // 接口对接
        type: "doPrompt",
        params: {
          tplCode: "logo_a4"
        }
      }
    }
  }
};
const robotReply_2 = {
  201: {
    data: {
      content: "请您简要描述您想要设计的海报的想法，例如：“帮我生成一张端午节的宣传问候营销图“\n请在下方输入框内进行描述并发送给我",
      canUserSend: true,
      afterUserSendNextRobotId: 202,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          promptWords: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit"]
      }
    }
  },
  202: {
    data: {
      content: "请选择一个适合您需求的图片比例",
      imgRatioOptions: [
        { label: "3:4", value: "3:4", nextUserId: 202 },
        { label: "4:3", value: "4:3", nextUserId: 202 }
      ],
      activeBtns: []
    }
  },
  203: {
    data: {
      content: "下面可以开始选择一种您喜欢的风格啦\n也可选择默认，完成后马上为您开始设计",
      btns: [
        { label: "佳节倍思亲", value: "1003", nextUserId: 203 },
        { label: "嫦娥奔月", value: "1004", nextUserId: 203 },
        { label: "龙舟竞渡", value: "1005", nextUserId: 203 },
        { label: "粽子与传统文化", value: "1006", nextUserId: 203 }
      ],
      activeBtns: []
    }
  },
  204: {
    data: {
      title: "Hi~ 背景效果图已完成",
      titleStyle: {
        color: "#256AF7"
      },
      content: "根据您提供的信息我们先帮您生成一张符合您要求的背景图，如果您对生成的背景图不满意，您可以选择重新生成直到您满意后选择理想背景图，我们再为您完成接下来的设计任务",
      imagesType: "radio",
      imagesOptions: [
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 }
        // { url: 'https://profile-avatar.csdnimg.cn/default.jpg!1', status: 'done', precent: 100 },
        // { url: 'https://profile-avatar.csdnimg.cn/default.jpg!1', status: 'done', precent: 100 },
        // { url: 'https://profile-avatar.csdnimg.cn/default.jpg!1', status: 'done', precent: 100 },
        // { url: 'https://profile-avatar.csdnimg.cn/default.jpg!1', status: 'done', precent: 100 }
      ],
      nextUserId: 204,
      activeImages: [],
      reload: true,
      fetch: {
        // 接口对接
        type: "doPrompt"
      }
    }
  },
  205: {
    data: {
      content: "请输入一个图片的主标题\n请在下方输入框内输入并发送给我",
      btns: [
        { label: "没有", value: 0, nextUserId: 205 }
      ],
      activeBtns: [],
      canUserSend: true,
      afterUserSendNextRobotId: 206,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          title: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit", "family"]
      }
    }
  },
  206: {
    data: {
      content: "请输入一个图片的副标题\n请在下方输入框内输入并发送给我",
      btns: [
        { label: "没有", value: 0, nextUserId: 206 }
      ],
      activeBtns: [],
      canUserSend: true,
      afterUserSendNextRobotId: 207,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          title: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit", "family"]
      }
    }
  },
  207: {
    data: {
      content: "请您输入关于图片想要描述的内容，如果您想输入的内容有很多段，不要着急\n当您输入完成第一段后，我会提示您继续进行输入\n请在下方输入框内输入并发送给我",
      btns: [
        { label: "没有", value: 0, nextUserId: 207 }
      ],
      activeBtns: [],
      canUserSend: true,
      afterUserSendNextRobotId: 208,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          content: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit", "family"]
      }
    }
  },
  208: {
    data: {
      content: "请您输入关于图片想要描述的内容，如果您想输入的内容有很多段，不要着急\n当您输入完成第一段后，我会提示您继续进行输入\n请在下方输入框内输入并发送给我",
      btns: [
        { label: "没有", value: 0, nextUserId: 207 }
      ],
      activeBtns: [],
      canUserSend: true,
      afterUserSendNextRobotId: 209,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          content: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit", "family"]
      }
    }
  },
  209: {
    data: {
      content: "请您输入关于图片想要描述的内容，如果您想输入的内容有很多段，不要着急\n当您输入完成第一段后，我会提示您继续进行输入\n请在下方输入框内输入并发送给我",
      btns: [
        { label: "没有", value: 0, nextUserId: 207 }
      ],
      activeBtns: [],
      canUserSend: true,
      afterUserSendNextRobotId: 210,
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        interfaceParams: {
          content: { text: "", fontfamily: "" }
        },
        tooltipsBtns: ["copy", "edit", "family"]
      }
    }
  },
  210: {
    data: {
      content: "您是否需要上传一些图形让我添加在最终的海报中，如果不需要请点不需要，\n如果需要请点击对应的上传按钮进行上传并在上传后点击完成",
      btns: [
        { label: "不需要", value: 0, nextUserId: 208 },
        { label: "上传内容", value: "1", nextUserId: 208, opertionType: "chooseMedia" }
      ],
      activeBtns: [],
      nextUserReply: {
        // 下次用户回复时，会参考哪些参数
        images: [],
        interfaceParams: {
          additionalReferImgs: { logo: "", QRCode: "", topicMap: "" }
        }
      },
      afterUserSendNextRobotId: 211
    }
  },
  211: {
    data: {
      title: "Hi~ 您的创意意想法模板已生成",
      titleStyle: {
        color: "#256AF7"
      },
      content: "最后一步啦，请选择一个您喜欢的模版\n我们马上为您生成最终的效果图",
      imagesType: "radio",
      imagesOptions: [
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 },
        { url: "", status: "queue_remaining", precent: 0 }
      ],
      nextUserId: 209,
      activeImages: [],
      fetch: {
        // 接口对接
        type: "workflow",
        params: {
          grp: "poster_compose"
        }
      }
    }
  },
  212: {
    data: {
      title: "Hi~ 最终效果图已完成",
      titleStyle: {
        color: "#256AF7"
      },
      content: "辛苦您了，您可以开始休息了，接下来交给我帮您设计",
      imagesType: "result",
      imagesOptions: [
        { url: "https://cdn.wwads.cn/creatives/YI1kTCUXJYqB9fIaOHz5qNw9pO5Fsgtq1PivY0Ea.jpg", status: "done", precent: 100 }
      ],
      nextUserId: 209,
      activeImages: [],
      reload: true,
      fetch: {
        // 接口对接
        type: "doPrompt"
      }
    }
  }
};
const robotReply = {
  0: {
    data: {
      title: "Hi，我是你的AI设计师素素～",
      content: "在开始之前，需要你先回答我几个问题；\n需要我帮你设计什么？",
      btns: [
        { label: "AI Logo", value: "logo_draw", nextUserId: 1 },
        { label: "AI 海报", value: "poster_draw", nextUserId: 201 }
      ],
      activeBtns: []
    }
  },
  ...robotReply_1,
  ...robotReply_2
};
const manualReply = {
  1: {
    content: "AI Logo生成",
    nextRobotId: 1,
    interfaceParams: {
      tplCode: ""
    }
  },
  2: {
    content: "{replace}",
    // {replace} 表示替换文案
    nextRobotId: 3,
    interfaceParams: {
      styleTag: ""
    }
  },
  3: {
    content: "{replace}",
    // {replace} 表示替换文案
    nextRobotId: 4,
    interfaceParams: {
      brandName: { text: "", fontfamily: "" }
    }
  },
  201: {
    content: "AI 海报",
    nextRobotId: 201,
    interfaceParams: {
      tplCode: ""
    }
  },
  202: {
    content: "{replace}",
    nextRobotId: 203,
    interfaceParams: {
      imgRatio: ""
    }
  },
  203: {
    content: "{replace}",
    nextRobotId: 204,
    interfaceParams: {
      styleTag: ""
    }
  },
  204: {
    content: "已选择完毕",
    nextRobotId: 205,
    interfaceParams: {
      bgImgUrl: ""
      // 选择的背景图
    }
  },
  205: {
    content: "{replace}",
    nextRobotId: 206,
    interfaceParams: {
      title: { text: "", fontfamily: "" }
    }
  },
  206: {
    content: "{replace}",
    nextRobotId: 207,
    interfaceParams: {
      title: { text: "", fontfamily: "" }
    }
  },
  207: {
    content: "没有啦～",
    nextRobotId: 210,
    interfaceParams: {
      content: null
      // 在请求接口的时候，如果是null则不会参与计算
    }
  },
  208: {
    content: "{replace}",
    nextRobotId: 211,
    interfaceParams: {
      additionalReferImgs: { logo: "", QRCode: "", topicMap: "" }
    }
  },
  209: {
    content: "已选择完毕",
    nextRobotId: 212,
    interfaceParams: {
      templateId: ""
    }
  }
};
exports.manualReply = manualReply;
exports.robotReply = robotReply;
