// 下面是机器人的消息相关定义
export type ImgOption = {
  url: string; // png 图片
  status: 'queue_remaining' | 'loading' | 'done';
  precent: number;
};
export type BtnItem = {
  label: string; // 展示的字符串
  value: string | number; // 值
  nextUserId: number; // 下一个用户输出的id
  opertionType?: 'chooseMedia'; // 当为chooseMedia时是上传
};

export type ImgRatioItem = {
  label: string; // 展示的字符串
  value: string | number; // 值
  nextUserId: number; // 下一个用户输出的id
};
export type RobotMessage = {
  type?: 'left';
  title?: string;
  titleStyle?: string;
  content?: string;
  btns?: Array<BtnItem>; // 有哪些按钮
  imgRatioOptions?: Array<ImgRatioItem>; // 选择生成图片比例，3:4 ｜ 4:3，这个比较特殊，单独用一个字段
  activeBtns?: string[]; // 选择了哪些按钮
  // 表示这几个图片是用来干嘛的， result - 结果。 radio - 单选
  imagesType?: 'result' | 'radio';
  imagesOptions?: Array<ImgOption>; // 生成的图片
  activeImages?: string[]; // 如果生成了图片，可以选择，选择的图片是什么

  reload?: boolean; // 是否有重新生成按钮
  canUserSend?: boolean; // 控制用户下一次是否可以输入

  nextUserId?: number; // 在选择图片后，用户下一次输出的id
  afterUserSendNextRobotId?: number; // 用户输入后，下一次机器人回应什么

  fetch?: {
    // 如果有该字段表示是生成任务
    type: 'doPrompt' | 'workflow'; // doPrompt表示生成任务 ｜ workflow 表示模版
  };
  [props: string]: any;
};
