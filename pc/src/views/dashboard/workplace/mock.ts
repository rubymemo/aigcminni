import { SessionItemProps } from './components/session-item.vue';

export const robotReply: Record<number, Partial<SessionItemProps>> = {
  0: {
    data: {
      title: 'Hi，我是你的AI设计师素素～',
      content: '在开始之前，需要你先回答我几个问题；\n需要我帮你设计什么？',
      btns: ['logo', '创意营销大图'],
      activeBtns: [],
    },
    slotName: 'sessionStart',
  },
  1: {
    data: {
      content: '您是否有参考图给我参考呢？',
      btns: ['没有参考图', '上传参考图'],
      activeBtns: [],
    },
    slotName: 'refrenceImage',
  },
  2: {
    data: {
      content: '现在可以开始用文字描述您想要的图片了\n通过下方输入框进行描述',
    },
    startCreate: true,
  },
  3: {
    data: {
      title: 'Hi~ 正在为您生成创意想法...',
      titleStyle: {
        color: '#256AF7',
      },
      content:
        '根据您提供的信息，以下是我针对图片的设计；点击图片可查看大图点击下方选择框选定图形，进入最终效果图生成。',
      imagesOptions: [
        // queue_remaining-任务排队中 loading - 生成中
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
        { url: '', status: 'queue_remaining', precent: 0 },
      ],
      activeImages: [],
      compute: true, // 用于最后计算是不是保存的字段
    },
    slotName: 'logoSelect',
  },
  4: {
    data: {
      content:
        '针对文字部分，您是否还有其它补充，如果没有直接点击没有跳过即可，如果有请在下方输入',
      btns: ['没有'],
      activeBtns: [],
    },
    slotName: 'supplyText',
  },
  5: {
    data: {
      content: '请选择一款您喜欢的模版开始生成效果图',
      imagesOptions: [
        {
          url: '/static/png/mock1.png',
          status: 'done',
          precent: 100,
        },
        {
          url: '/static/png/mock2.png',
          status: 'done',
          precent: 100,
        },
      ],
      activeImages: [],
      compute: true, // 用于最后计算是不是保存的字段
    },
    slotName: 'templateImg',
  },
  6: {
    data: {
      title: 'Hi~ 最终效果图已经完成',
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
    slotName: 'lastStep'
  },
};

export const manualReply = {
  logo: {
    content: '帮我设计一个logo',
    nextRobotId: 1,
  },
  创意营销大图: {
    content: '帮我设计一个创意营销大图',
    nextRobotId: 1,
  },
  没有参考图: {
    content: '没有参考图',
    nextRobotId: 2,
  },
  上传参考图: {
    content: '上传参考图',
    nextRobotId: 2,
    opertionType: 'chooseMedia', // 上传图片
  },
  没有: {
    content: '没有补充',
    nextRobotId: 5,
  },
};
