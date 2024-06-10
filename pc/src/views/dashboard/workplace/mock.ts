import { SessionItemProps } from './components/session-item.vue';

// 海报的回复
export const PosterRobotReply: Array<Partial<SessionItemProps>> = [
  {
    data: {
      title:
        '请您简要描述您想要设计的海报的想法，例如：“帮我生成一张端午节的宣传问候营销图',
      content: '请在下方输入框内进行描述并发送给我',
      enableInput: true,
    },
  },
  {
    data: {
      content: '请选择一个适合您需求的图片比例',
    },
    slotName: 'sizeChoose',
  },
  {
    data: {
      content: '下面可以开始选择一种您喜欢的风格啦，也可选择默认',
      styles: ['默认', '手绘', '极简', '线性', '复古', '几何'],
      activeStyles: [],
    },
    slotName: 'styleChoose',
  },
  {
    data: {
      title: '请输入一个图片的主标题',
    },
    content: '请在下方输入框内输入并发送给我',
  },
  {
    data: {
      title: '请输入一个图片的副标题',
    },
    content: '请在下方输入框内输入并发送给我',
  },
  {
    data: {
      title:
        '请您输入关于图片想要描述的内容，如果您想输入的内容有很多段，不要着急，当您输入完成第一段后，我会提示您继续进行输入',
      content: '请在下方输入框内输入并发送给我',
      btns: ['没有'],
    },
  },
  {
    data: {
      title:
        '请您输入关于图片想要描述的内容，如果您想输入的内容有很多段，不要着急，当您输入完成第一段后，我会提示您继续进行输入',
      content: '请在下方输入框内输入并发送给我',
      btns: ['不需要'],
    },
  },
  {
    data: {
      title: '最后一步啦，请选择一个您喜欢的模版，我们马上为您生成最终的效果图',
      titleStyle: {
        color: '#256AF7',
      },
      imagesOptions: [
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
      ],
      activeImages: [],
    },
  },
  {
    data: {
      title: '生成中.....',
      content: '辛苦您了，您可以开始休息了，接下来交给我帮您设计',
      titleStyle: {
        color: '#256AF7',
      },
      imagesOptions: [{ url: '', status: 'queue_remaining', precent: 0 }],
      activeImages: [],
    },
  },
];

export const LogoRobotReply: Array<Partial<SessionItemProps>> = [
  // {
  //   data: {
  //     content: '您是否有参考图给我参考呢？',
  //     btns: ['没有参考图', '上传参考图'],
  //     activeBtns: [],
  //   },
  //   slotName: 'refrenceImage',
  // },
  {
    data: {
      title: '请您简要描述您想要设计的logo的想法，例如：“一间开在海边的咖啡厅”',
      content: '请在下方输入框内进行描述并发送给我',
      enableInput: true,
    },
  },
  {
    data: {
      content:
        '下面可以开始选择一种您喜欢的风格啦，也可选择默认，完成后会马上为您开始设计',
      styles: ['默认', '手绘', '极简', '线性', '复古', '几何'],
      activeStyles: [],
    },
    slotName: 'styleChoose',
  },
  {
    data: {
      title:
        '为了达到更好的效果，请把你的品牌名称告诉我如果选择没有，可能会导致最终的logo没有品牌名称，请谨慎选择没有哦',
      content: '请直接在下方输入或选择暂时还没有',
    },
  },
  // {
  //   data: {
  //     title: 'Hi~ 正在为您生成创意想法...',
  //     titleStyle: {
  //       color: '#256AF7',
  //     },
  //     content:4444444
  //       '根据您提供的信息，以下是我针对图片的设计；点击图片可查看大图点击下方选择框选定图形，进入最终效果图生成。',
  //     imagesOptions: [
  //       // queue_remaining-任务排队中 loading - 生成中
  //       { url: '', status: 'queue_remaining', precent: 0 },
  //       { url: '', status: 'queue_remaining', precent: 0 },
  //       { url: '', status: 'queue_remaining', precent: 0 },
  //       { url: '', status: 'queue_remaining', precent: 0 },
  //     ],
  //     activeImages: [],
  //     compute: true, // 用于最后计算是不是保存的字段
  //     couldReload: true,
  //   },
  //   slotName: 'logoSelect',
  // },
  // {
  //   data: {
  //     content: '请输入品牌名称',
  //     btns: ['没有'],
  //     activeBtns: [],
  //   },
  //   slotName: 'supplyText',
  // },
  // {
  //   data: {
  //     content: '请选择一款您喜欢的模版开始生成效果图',
  //     imagesOptions: [
  //       {
  //         url: '/static/png/mock1.png',
  //         status: 'done',
  //         precent: 100,
  //       },
  //       {
  //         url: '/static/png/mock2.png',
  //         status: 'done',
  //         precent: 100,
  //       },
  //     ],
  //     activeImages: [],
  //     compute: true, // 用于最后计算是不是保存的字段
  //   },
  //   slotName: 'templateImg',
  // },
  {
    data: {
      title: '生成中',
      titleStyle: {
        color: '#256AF7',
      },
      content:
        '根据您提供的信息，以下是我针对图片的设计，点击图片可查看大图，点击下方选择框选定图形，进入最终效果图生成',
      imagesOptions: [
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
      ],
      activeImages: [],
      couldReload: true,
    },
    slotName: 'lastStep',
  },
];

export const firstRobotReply: Partial<SessionItemProps> = {
  data: {
    title: 'Hi，我是你的AI设计师素素～',
    content: '在开始之前，需要你先回答我几个问题；\n需要我帮你设计什么？',
    btns: ['AI logo', 'AI 海报'],
    activeBtns: [],
  },
  slotName: 'sessionStart',
};

export default {};
