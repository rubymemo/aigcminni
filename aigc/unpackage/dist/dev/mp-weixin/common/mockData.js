"use strict";
const robotReply = {
  0: {
    data: {
      title: "Hi，我是你的AI设计师素素～",
      content: "在开始之前，需要你先回答我几个问题；\n需要我帮你设计什么？",
      btns: ["logo", "创意营销大图"]
    }
  },
  1: {
    data: {
      content: "您是否有参考图给我参考呢？",
      btns: ["没有参考图", "上传参考图"]
    }
  },
  2: {
    data: {
      content: "现在可以开始用文字描述您想要的图片了\n通过下方输入框进行描述"
    },
    startCreate: true
  },
  3: {
    data: {
      title: "Hi~ 正在为您生成创意想法...",
      titleStyle: {
        color: "#256AF7"
      },
      content: "根据您提供的信息，以下是我针对图片的设计；点击图片可查看大图点击下方选择框选定图形，进入最终效果图生成。"
    }
  }
};
const manualReply = {
  "logo": {
    content: "帮我设计一个logo",
    nextRobotId: 1
  },
  "创意营销大图": {
    content: "帮我设计一个创意营销大图",
    nextRobotId: 1
  },
  "没有参考图": {
    content: "没有参考图",
    nextRobotId: 2
  },
  "上传参考图": {
    content: "上传参考图",
    nextRobotId: 2,
    opertionType: "chooseMedia"
    // 上传图片
  }
};
exports.manualReply = manualReply;
exports.robotReply = robotReply;