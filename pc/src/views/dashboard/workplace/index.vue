<template>
  <div class="layout">
    <div class="left-bar">
      <div class="logo-area">
        <img :src="Logo" alt="huatu" />
      </div>
      <div class="button-area">
        <a-button class="create-session-button" @click="addSession">
          <icon-plus class="add-color" />
          新建会话
        </a-button>
      </div>
      <div class="session-log-container">
        <div class="log-header">会话记录</div>
        <div class="session-log-el">
          <SessionLog :logs="logs" />
        </div>
      </div>
    </div>
    <div class="right-container">
      <div class="top-bar">
        <div></div>
        <div class="user-info">
          <a-avatar :image-url="avatar" :size="42" />
          <a-dropdown>
            <div class="user-name"
              >诗人王维
              <icon-caret-down />
            </div>
            <template #content>
              <a-doption>Option 1</a-doption>
              <a-doption disabled>Option 2</a-doption>
              <a-doption>Option 3</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="detail-container">
        <div class="session-container">
          <div class="session-inner-container">
            <CurrentSession
              ref="sessionListRef"
              @image-upload-success="handleImageUploaded"
              @choose-style="handleChooseStyle"
              @no-text="handleNoText"
            />
          </div>
        </div>
        <div class="bottom-bar">
          <div class="input-container">
            <textarea
              v-model="inputText"
              placeholder="输入对话后，可通过回车键发送指令"
              @keydown="enterSend"
            />
            <a-button
              v-show="inputText"
              class="send-button-active"
              @click="handleSendButtonClick"
            >
              <span class="button-text">发送创意</span>
              <!-- <SendSvg /> -->
              <img :src="SendIcon" />
            </a-button>
            <div v-show="!inputText" class="send-button-disabled">
              <SendSvg />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import Logo from '@/assets/images/logo.png';
import avatar from '@/assets/images/avatar.png';
import SendSvg from '@/assets/svg/send.svg';
import SendIcon from '@/assets/images/send-icon.png';
import SessionLog from './components/session-log.vue';
import CurrentSession from './components/current-session.vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import {
  createSession,
  getSessionHistory,
  getSessionList,
  sendMessage,
} from '@/api/dashboard';
import { v4 } from 'uuid';
import { getImagePath } from './util';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';

const logs = ref<any[]>([]);

const inputText = ref('');
const sessionListRef = ref();

const wsInstance = ref<WebSocket>();

const userInfo = useUserStore();
const router = useRouter();

const addSession = async () => {
  const res = await createSession({
    works: {
      authorId: userInfo.userId,
      type: 1,
      title: '新键会话',
    },
    dialogs: [],
  });
  console.log(res);
  router.replace({
    query: {
      promptId: res.data,
    },
  });
};

const initWs = (
  imageName = '',
  words = '',
  type: 'template' | 'style' = 'template',
) => {
  const uuid = v4();

  let promptId = '';

  let dataRef;

  wsInstance.value = new WebSocket(
    `wss://huatu.solart.pro/ws/?clientId=${uuid}`,
  );
  wsInstance.value.onopen = () => {
    console.log('链接成功');
    sendMessage({
      clientId: uuid,
      promptImage: imageName,
      promptWords: words,
    }).then((res) => {
      console.log('promptPost', res);
      promptId = res.data.promptId;
      dataRef = ref({
        loading: true,
        progress: 0,
      });
      sessionListRef.value.addCommit({
        preset: type,
        data: dataRef,
      });
    });
  };
  wsInstance.value.onmessage = (message: any) => {
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
    if (messageInfo.type === 'executing' && messageInfo.data.node) {
      console.log('正在执行');
    }
    if (messageInfo.type === 'progress') {
      const step = Number((95 / messageInfo.data.max).toFixed(2));
      dataRef.value.progress = messageInfo.data.value * step;
      console.log('正在生成图片');
    }
    if (messageInfo.type === 'executing' && !messageInfo.data.node) {
      dataRef.value.progress = 100;
      dataRef.value.loading = false;
      console.log('生成完成', messageInfo);
      if (!promptId) {
        return;
      }
      getSessionHistory(promptId).then((res) => {
        console.log('promptHistory', res);
        dataRef.value.imgUrls = res.data[promptId].outputs[100].images.map(
          (item) => getImagePath(item.filename, item.type),
        );
      });
      wsInstance.value?.close();
      wsInstance.value = undefined;
    }
  };
  wsInstance.value.onclose = () => {
    console.log('关闭链接');
  };
};

onBeforeMount(() => {
  if (!wsInstance.value) {
    return;
  }
  wsInstance.value.close();
  wsInstance.value = undefined;
});

// const sendMessageAction = (imgName = '', words = '') => {
//   return sendMessage({
//     promptImage: imgName,
//     promptWords: words,
//   });
// };

const styleImgUrl = ref('');
let imgUploaded = false;

const handleSendButtonClick = () => {
  initWs(
    styleImgUrl.value,
    inputText.value,
    imgUploaded ? 'style' : 'template',
  );
  // sendMessageAction('', inputText.value);
};

const enterSend = (event: any) => {
  if (event.keyCode === 13 && inputText.value) {
    console.log(event);
    initWs(styleImgUrl.value, inputText.value, 'style');
    // 判断按下的是否是回车键的keyCode
    event.preventDefault();
  }
};

// 图片上传成功
const handleImageUploaded = (imageUrl: string) => {
  imgUploaded = true;
  initWs(imageUrl, '');
  // sendMessage({
  //   promptImage: imageUrl,
  //   promptWords: '大一点',
  //   clientId: uuid,
  // }).then((res: any) => {
  //   const { number, promptId } = res.data;
  //   console.log('number, promptI', number, promptId);
  //   getSessionHistory(promptId).then((history) => {
  //     console.log('history', history);
  //   });
  // });
};

const handleChooseStyle = (imgUrl: string) => {
  styleImgUrl.value = imgUrl;
};

const handleNoText = () => {
  initWs(styleImgUrl.value, '', 'style');
};

onMounted(() => {
  getSessionList(1, 10)
    .then((res: any) => {
      if (res.code !== '2000') {
        return;
      }
      console.log('res.data', res.data);
      const dataAlias = res.data.data as any[];
      const timeDataMap = dataAlias.reduce<Record<string, any>>(
        (result, cur) => {
          const time = cur.createTime.split(' ')[0];
          // 根据时间分组
          if (!result[time]) {
            result[time] = { time, list: [] };
          }
          result[time].list.push(cur);
          return result;
        },
        {},
      );

      logs.value = Object.values(timeDataMap);
    })
    .catch((error) => {
      console.log('error', error);
    });

  // createSession({});
});
</script>

<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 24px;
  box-sizing: border-box;
  background: rgb(242, 244, 247);
  background-image: url(@/assets/images/background.png);

  .left-bar {
    width: 370px;
    height: 100%;
    border-radius: 12px;
    box-sizing: border-box;
    border-radius: 12px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0) 100%
    );
    overflow: hidden;
    .logo-area {
      height: 70px;
      border: 2px solid #fff;
      border-radius: 12px 12px 0 0;
      display: flex;
      align-items: center;
      padding-left: 24px;

      img {
        width: 104px;
        height: 30px;
      }
    }

    .button-area {
      height: 88px;
      border: 2px solid #fff;
      border-top: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .create-session-button {
        width: 168px;
        height: 40px;
        border-radius: 24px;
        box-shadow: inset 0px 4px 4px 0px rgba(230, 228, 228, 0.12);
        background: linear-gradient(
          135deg,
          rgb(23, 242, 95) 0%,
          rgb(37, 106, 247) 100%
        );
        border: none;
        color: rgb(255, 255, 255);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: left;

        .add-color {
          margin-right: 4px;
        }
      }
    }

    .log-header {
      color: rgb(25, 29, 50);
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: left;
    }

    .session-log-container {
      border: 2px solid #fff;
      border-top: 0;
      border-bottom: 0;
      padding: 16px 14px;

      .session-log-el {
        margin-top: 16px;
      }
    }
  }

  .right-container {
    flex: 1;
    margin-left: 24px;
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;

    .top-bar {
      height: 64px;
      width: 100%;
      border-radius: 12px;
      background: rgb(255, 255, 255);
      opacity: 0.7;

      display: flex;
      align-items: center;
      justify-content: end;
      padding-right: 24px;

      .user-info {
        display: flex;
        align-items: center;
        .user-name {
          margin-left: 8px;
          color: rgb(52, 65, 86);
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0px;
          text-align: left;
        }
      }
    }

    .detail-container {
      flex: 1;
      // max-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .session-container {
        flex: 1;
        overflow-y: auto;
        padding-top: 32px;

        .session-inner-container {
          width: 980px;
          margin: auto;
        }
      }

      .bottom-bar {
        height: 120px;
        .input-container {
          height: 100%;
          margin: auto;
          border-radius: 8px;
          background: rgb(255, 255, 255);
          width: 980px;

          display: flex;
          align-items: center;
          padding: 24px;

          textarea {
            height: 100%;
            flex: 1;
            margin-right: 8px;
            border: none;
            outline: none;
            resize: none;

            &::placeholder {
              color: rgb(163, 180, 204);
              font-family: 思源黑体 CN;
              font-size: 14px;
              font-weight: 400;
              line-height: 22px;
              letter-spacing: 0px;
              text-align: left;
            }
          }

          .send-button-active {
            border: none;
            height: 40px;
            border-radius: 100px;
            background: linear-gradient(
              135deg,
              rgb(23, 242, 95) 0%,
              rgb(37, 106, 247) 100%
            );
            color: rgb(255, 255, 255);
            font-family: PingFang SC;
            font-size: 16px;
            font-weight: 400;

            .button-text {
              margin-right: 12px;
            }

            img {
              width: 28px;
              height: 28px;
            }
          }

          .send-button-disabled {
            width: 60px;
            height: 40px;
            border-radius: 100px;
            background: linear-gradient(
              135deg,
              rgb(23, 242, 95) 0%,
              rgb(37, 106, 247) 100%
            );
            opacity: 0.5;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
