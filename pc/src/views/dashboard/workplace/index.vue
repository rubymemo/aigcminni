<template>
  <div class="layout">
    <div class="left-bar">
      <div class="left-bar-content">
      <div class="logo-area">
        <img :src="Logo" alt="huatu" />
      </div>
      <div class="button-area">
        <a-button class="create-session-button" @click="changeSession('')">
          <icon-plus class="add-color" />
          新建会话
        </a-button>
      </div>
      <div class="session-log-container">
        <div class="log-header">对话记录</div>
        <div class="session-log-el">
          <SessionLog
            :logs="logs"
            @refresh="refreshLogs"
            @chosen-session="changeSession"
          />
        </div>
      </div>
      </div>
      <div class="left-bar-bg"></div>
    </div>
    <div class="right-container">
      <div class="top-bar">
        <div></div>
        <div class="user-info">
          <CommonAvatar role="user" :size="42" />
          <a-dropdown>
            <div class="user-name"
              >{{ userInfo.nickname }}
              <icon-caret-down />
            </div>
            <template #content>
              <a-doption @click="logoutAction">退出登录</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="detail-container">
        <div ref="sessionBox" class="session-container">
          <div class="session-inner-container">
            <CurrentSession
              ref="sessionListRef"
              @image-upload-success="handleImageUploaded"
              @enabled-input="handleEnableInput"
              @choose-style="handleChooseStyle"
              @no-text="handleNoText"
              @commit-length-change="handleScrollBottom"
              @last-step="lastStep"
              @reload="reload"
              @refresh-session-history="refreshLogs"
            />
          </div>
        </div>
        <div class="bottom-bar">
          <div class="input-container">
            <textarea
              v-model="inputText"
              :disabled="inputDisabled"
              placeholder="输入对话后，可通过回车键发送指令"
              @keydown="enterSend"
              @input="handleInput"
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
  getSessionHistory,
  getSessionList,
  sendMessage,
} from '@/api/dashboard';
import { v4 } from 'uuid';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import { nextTick } from 'vue';
import CommonAvatar from '@/components/common-avatar.vue';
import { logout } from '@/api/user';

const logs = ref<any[]>([]);

const inputText = ref('');
const inputDisabled = ref(true);
const sessionListRef = ref();

const wsInstance = ref<WebSocket>();

const userInfo = useUserStore();
const router = useRouter();

const sessionBox = ref();

const handleInput = () => {
  if (inputDisabled.value) {
    inputText.value = '';
  }
};

const logoutAction = () => {
  logout();
  localStorage.setItem('token', '');
  router.replace('/login');
};

const handleScrollBottom = () => {
  if (!sessionBox.value) {
    return;
  }
  console.log('sessionBox.value.scrollHeight', sessionBox.value.scrollHeight);

  nextTick(() => {
    sessionBox.value.scrollTo(0, sessionBox.value.scrollHeight);
  });
};

const currentSessionId = ref('');

const changeSession = (id: any) => {
  if (id && id !== currentSessionId.value) {
    currentSessionId.value = id;
    sessionListRef.value.refreshSession(id);
  }
};

const handleEnableInput = () => {
  inputDisabled.value = false;
};
let imgUpName = '';

const initWs = (imageName = imgUpName, words = '', reload = false) => {
  let promptId = '';

  let dataRef;

  const uid = userInfo.userId;

  wsInstance.value = new WebSocket(
    `wss://u262838-87ee-75614327.westx.seetacloud.com:8443/ws?clientId=${uid}`,
  );
  wsInstance.value.onopen = () => {
    console.log('链接成功');
    sendMessage({
      clientId: uid,
      promptImage: imageName,
      promptWords: words,
    }).then((res) => {
      console.log('promptPost', res);
      promptId = res.data.prompt_id;
      const currentCommit = sessionListRef.value.getRobotCommit();
      console.log('currentCommit', currentCommit);

      if (!reload) {
        dataRef = ref(currentCommit.data);
        dataRef.value.loading = true;
        dataRef.value.progress = 0;
        sessionListRef.value.addCommit({
          ...currentCommit,
          data: dataRef,
        });
      } else {
        dataRef = ref(sessionListRef.value.getLastOneStep().data);
        dataRef.value.loading = true;
        dataRef.value.progress = 0;
        dataRef.value.imagesOptions = [{}, {}, {}, {}];
      }
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
      // console.log('正在执行');
    }
    if (messageInfo.type === 'progress') {
      const step = Number((95 / messageInfo.data.max).toFixed(2));

      dataRef.value.progress = (messageInfo.data.value * step).toFixed(0);
      console.log('正在生成图片', 'step', step);
    }
    if (
      messageInfo.type === 'executed' &&
      Number(messageInfo.data.node) === 100
    ) {
      dataRef.value.progress = 100;
      dataRef.value.loading = false;
      console.log('生成完成', messageInfo);
      if (!promptId) {
        return;
      }
      getSessionHistory(promptId).then((res) => {
        console.log('promptHistory', res);
        // dataRef.value.imagesOptions = res.data.map((item) => item.fileUrl);
        dataRef.value.imagesOptions = res.data.map((item) => ({
          url: item.fileUrl,
          status: 'done',
          precent: '100',
        }));
        sessionListRef.value.saveSession();
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

const styleImgUrl = ref('');
const userWords = ref('');

const handleSendButtonClick = () => {
  sessionListRef.value.addCommit({
    author: 'user',
    data: {
      content: inputText.value,
    },
    compute: true,
    disabledSubmit: true,
  });
  initWs(undefined, inputText.value);
  inputDisabled.value = true;
  userWords.value = inputText.value;
  inputText.value = '';
  // sendMessageAction('', inputText.value);
};

const enterSend = (event: any) => {
  if (event.keyCode === 13 && inputText.value) {
    console.log(event);
    sessionListRef.value.addCommit({
      author: 'user',
      data: {
        content: inputText.value,
      },
      compute: true,
      disabledSubmit: true,
    });
    initWs(undefined, inputText.value);
    inputDisabled.value = true;
    userWords.value = inputText.value;
    inputText.value = '';
    // 判断按下的是否是回车键的keyCode
    event.preventDefault();
  }
};

// 图片上传成功
const handleImageUploaded = (imageName: string) => {
  imgUpName = imageName;
  // initWs(imageName, '');
};

const handleChooseStyle = (imgUrl: string) => {
  styleImgUrl.value = imgUrl;
};

const handleNoText = () => {
  inputDisabled.value = true;
  initWs(undefined, '');
};

const lastStep = (img: string) => {
  initWs(img, userWords.value);
};

const reload = (img: string) => {
  initWs(img, userWords.value, true);
};

const refreshLogs = () => {
  getSessionList(1, 10, userInfo.userId!)
    .then((res: any) => {
      if (res.code !== '2000') {
        return;
      }
      console.log('res.data', res.data);
      const dataAlias = res.data.data as any[];
      const timeDataMap = dataAlias.reduce<Record<string, any>>(
        (result, cur) => {
          const time = cur.createTime;
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
};

onMounted(() => {
  refreshLogs();
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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .left-bar-content {
      position: relative;
      z-index: 1;
      width: 366px;
      height: 100%;
      border-radius: 12px;
      background-image: linear-gradient(180deg, #f2f7fe, rgba(255, 255, 255, 0) 100%);
    }
    .left-bar-bg {
      position: absolute;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255),
        rgba(255, 255, 255, 0) 100%
      )
    }
  }
  .left-bar {
    padding: 2px;
    width: 370px;
    height: 100%;
    border-radius: 12px;
    box-sizing: border-box;
    border-radius: 12px;
    // background: linear-gradient(
    //   180deg,
    //   rgba(255, 255, 255, 0.8),
    //   rgba(255, 255, 255, 0) 100%
    // );
    // border: 2px solid
    //   linear-gradient(180deg, rgb(255, 255, 255), rgba(255, 255, 255, 0) 100%);
    overflow: hidden;
    .logo-area {
      height: 70px;
      border-radius: 12px 12px 0 0;
      display: flex;
      align-items: center;
      padding-left: 24px;
      border-bottom: solid 2px rgba(255, 255, 255, 0.7);
      img {
        width: 104px;
        height: 30px;
      }
    }

    .button-area {
      height: 88px;
      // border: 2px solid #fff;
      border-bottom: solid 2px rgba(255, 255, 255, 0.7);

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
      // border: 2px solid #fff;
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
        padding-bottom: 20px;

        .session-inner-container {
          width: 75%;
          max-width: 980px;
          min-width: 480px;
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
          width: 75%;
          max-width: 980px;
          min-width: 480px;

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

            &:disabled {
              background: transparent;
              cursor: not-allowed;
            }
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
