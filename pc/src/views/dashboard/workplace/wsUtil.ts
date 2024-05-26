import { getSessionHistory, sendMessage } from '@/api/dashboard';
import { v4 } from 'uuid';

const HandleSendMessage = (imageName = '', words = '') => {
  const uuid = v4();

  let promptId = '';

  const wsInstance = new WebSocket(
    `wss://huatu.solart.pro/ws/?clientId=${uuid}`,
  );
  wsInstance.onopen = () => {
    console.log('链接成功');
    sendMessage({
      clientId: uuid,
      promptImage: imageName,
      promptWords: words,
    }).then((res) => {
      console.log('promptPost', res);
      promptId = res.data.promptId;
    });
  };
  wsInstance.onmessage = (message: any) => {
    const messageInfo = JSON.parse(message.data);
    const { data } = messageInfo || {};
    console.log('收到消息', data, messageInfo.type);

    if (messageInfo.type === 'status') {
      console.log('sid', data.sid);
      console.log('任务变更', messageInfo, data);
    }
    if (messageInfo.type === 'execution_start') {
      console.log('开始生成');
    }
    if (messageInfo.type === 'executing') {
      console.log('正在执行');
    }
    if (messageInfo.type === 'progress') {
      console.log('正在生成图片');
    }
    if (messageInfo.type === 'executing' && !messageInfo.data.node) {
      console.log('生成完成', messageInfo);
      if (!promptId) {
        return;
      }
      getSessionHistory(promptId).then((res) => {
        console.log('promptHistory', res);
      });
      wsInstance?.close();
    }
  };
  wsInstance.onclose = () => {
    console.log('关闭链接');
  };
};

export default HandleSendMessage;
