<template>
  <div class="layout">
    <div class="left-bar">
      <div class="left-bar-content">
        <div class="logo-area">
          <img class="logo-img" :src="Logo" alt="huatu" @click="goHome" />
        </div>
        <div class="button-area">
          <a-button class="create-session-button" @click="changeSession('')">
            <span class="iconfont icon-plus add-new-icon"></span>
            新建会话
          </a-button>
        </div>
        <div class="session-log-container">
          <div class="log-header">对话记录</div>
          <div class="session-log-el">
            <SessionLog
              :logs="logsState.logs"
              :loading="logsState.loading"
              :finished="logsState.finished"
              :first-load-complete="logsState.firstLoadComplete"
              @load-more="loadLogs"
              @refresh="refreshLogs"
              @chosen-session="changeSession"
              @delete-item="deleteItem"
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
          <CommonAvatar role="user" :size="36" />
          <a-dropdown trigger="hover">
            <div class="user-name"
              >{{ userInfo.nickname }}
              <!-- <icon-caret-down /> -->
              <span class="iconfont icon-down"></span>
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
              @no-imge-upload="handleImageUploaded"
              @regenerate-logo="handleRegenerateLogo"
              @before-last-step="handleBeforeLastStep"
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
import Logo from '@/assets/images/logo.png';
import SendSvg from '@/assets/svg/send.svg';
import SendIcon from '@/assets/images/send-icon.png';
import SessionLog from './components/session-log.vue';
import CurrentSession from './components/current-session.vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import {
  getHistoryByPromptId,
  getSessionList,
  getWorkFlow,
  sendMessageV2,
} from '@/api/dashboard';
import { v4 } from 'uuid';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import { nextTick } from 'vue';
import CommonAvatar from '@/components/common-avatar.vue';
import { getUserInfo, logout } from '@/api/user';
import { reactive } from 'vue';

const inputText = ref('');
const inputDisabled = ref(true);
const sessionListRef = ref();

const wsInstance = ref<WebSocket>();

const userInfo = useUserStore();
const router = useRouter();

const sessionBox = ref();

const userInfoRef = ref();

const logsState = reactive<{
  logs: any[];
  loading: boolean;
  finished: boolean;
  pageIndex: 1;
  pageSize: 10;
  firstLoadComplete: boolean;
}>({
  logs: [],
  loading: false,
  finished: false,
  pageIndex: 1,
  pageSize: 10,
  firstLoadComplete: false,
});

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
  nextTick(() => {
    sessionBox.value.scrollTo(0, sessionBox.value.scrollHeight);
  });
};

const currentSessionId = ref('');

const changeSession = (id: any) => {
  if (!id || id !== currentSessionId.value) {
    currentSessionId.value = id;
    wsInstance.value?.close();
    inputDisabled.value = true;
    sessionListRef.value.refreshSession(id);
  }
};

const handleEnableInput = () => {
  inputDisabled.value = false;
};
let imgUpName = '';
// 此次生成图片的工作流
let workCode = '';
const initWs = (imageName = imgUpName, words = '', code = workCode) => {
  let promptId = '';

  let dataRef;

  const uid = userInfo.userId;

  wsInstance.value = new WebSocket(
    `wss://u262838-87ee-75614327.westx.seetacloud.com:8443/ws?clientId=${uid}`,
  );
  wsInstance.value.onopen = () => {
    console.log('链接成功');
    sendMessageV2({
      clientId: uid,
      fileUrl: imageName,
      promptWords: `${words} `,
      code,
    }).then((res) => {
      console.log('promptPost', res);
      promptId = res.data.prompt_id;
      const currentCommit = sessionListRef.value.getRobotCommit();
      console.log('currentCommit', currentCommit);

      dataRef = ref(currentCommit.data);
      dataRef.value.loading = true;
      dataRef.value.progress = 0;
      sessionListRef.value.addCommit({
        ...currentCommit,
        data: dataRef,
      });
    });
  };
  wsInstance.value.onmessage = (message: any) => {
    const messageInfo = JSON.parse(message.data);
    const { data } = messageInfo || {};
    console.log('收到消息', data, messageInfo.type);

    if (messageInfo.type === 'status') {
      console.log('任务变更', messageInfo, data);
    }
    if (messageInfo.type === 'execution_start') {
      console.log('开始生成');
    }

    if (!promptId || !data.prompt_id || promptId !== data.prompt_id) {
      return;
    }

    if (messageInfo.type === 'executing' && messageInfo.data.node) {
      // console.log('正在执行');
    }
    if (messageInfo.type === 'progress') {
      const step = Number((95 / messageInfo.data.max).toFixed(2));

      dataRef.value.progress = Number(
        (messageInfo.data.value * step).toFixed(0),
      );
      console.log('正在生成图片', 'step', step);
    }
    if (messageInfo.type === 'executing' && !messageInfo.data.node) {
      dataRef.value.progress = 100;
      dataRef.value.loading = false;
      console.log('生成完成', messageInfo);
      if (!promptId) {
        return;
      }
      getHistoryByPromptId(promptId).then((res) => {
        console.log('promptHistory', res);
        // dataRef.value.imagesOptions = res.data.map((item) => item.fileUrl);
        dataRef.value.imagesOptions = res.data.map((item) => ({
          url: item,
          status: 'done',
          precent: 100,
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
  if (!localStorage.getItem('token')) {
    router.replace('/login');
    return;
  }
  if (!wsInstance.value) {
    return;
  }
  wsInstance.value.close();
  wsInstance.value = undefined;
});

const userWords = ref('');

const handleGetWorkFlow = () => {
  const robotApply = sessionListRef.value.getRobotCommit();
  getWorkFlow('logo_compose').then((res) => {
    console.log(res, robotApply);
    robotApply.data.imagesOptions = res.data.map((item: any) => ({
      url: item.imgUrl,
      status: 'done',
      precent: 100,
      code: item.code,
    }));
    sessionListRef.value.addCommit(robotApply);
  });
};

const handleRegenerateLogo = (imgUrl: string, words: string) => {
  workCode = 'logo_draw';
  imgUpName = imgUrl;
  userWords.value = words;
  initWs(imgUrl, words);
};

const handleBeforeLastStep = (img: string, words: string) => {
  imgUpName = img;
  userWords.value = words;
}

const handleSendButtonClick = () => {
  sessionListRef.value.addCommit({
    author: 'user',
    data: {
      content: inputText.value,
    },
    compute: true,
    disabledSubmit: true,
  });
  if (workCode === 'logo_draw') {
    initWs(imgUpName, inputText.value, workCode);
  }
  if (workCode === 'workFlow') {
    handleGetWorkFlow();
  }
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
    if (workCode === 'logo_draw') {
      initWs(imgUpName, inputText.value, workCode);
    }
    console.log('workFlow', workCode);

    if (workCode === 'workFlow') {
      handleGetWorkFlow();
    }
    inputDisabled.value = true;
    userWords.value = inputText.value;
    inputText.value = '';
    // 判断按下的是否是回车键的keyCode
    event.preventDefault();
  }
};

// 图片上传成功
const handleImageUploaded = (imageName = '') => {
  imgUpName = imageName;
  // 这里上传成功是为了生成logo，将工作流置为
  workCode = 'logo_draw';
  // initWs(imageName, '');
};

const handleChooseStyle = (imgUrl: string) => {
  workCode = 'workFlow';
  imgUpName = imgUrl;
};

const handleNoText = () => {
  inputDisabled.value = true;
  userWords.value = '';
  handleGetWorkFlow();
};

const lastStep = (workFlowCode: string) => {
  workCode = workFlowCode;
  initWs(imgUpName, userWords.value);
};

// 本期没有重载
const reload = (img: string) => {
  // initWs(img, userWords.value);
};

const loadLogs = () => {
  logsState.loading = true;
  getSessionList(
    logsState.pageIndex,
    logsState.pageSize,
    userInfoRef.value.userId!,
  )
    .then((res: any) => {
      if (res.code !== '2000') {
        return;
      }
      const dataAlias = res.data.data as any[];

      logsState.logs = logsState.logs.concat(dataAlias);
      logsState.pageIndex += 1;
      logsState.finished = logsState.logs.length >= res.data.total;
    })
    .catch((error) => {
      console.log('error', error);
    })
    .finally(() => {
      logsState.loading = false;
      logsState.firstLoadComplete = true;
    });
};

const refreshLogs = () => {
  logsState.pageIndex = 1;
  logsState.logs = [];
  loadLogs();
};

const goHome = () => {
  router.push('/login');
};

const deleteItem = (index: number) => {
  logsState.logs.splice(index, 1);
};

onMounted(async () => {
  const userData = await getUserInfo();
  userInfoRef.value = userData.data;
  refreshLogs();
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
  background-size: 100% 100%;
  .left-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .left-bar-content {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
      width: 366px;
      height: 100%;
      border-radius: 12px;
      background-image: linear-gradient(
        180deg,
        #f2f7fe,
        rgba(255, 255, 255, 0) 100%
      );
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
      );
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
      img.logo-img {
        width: 104px;
        height: 30px;
        cursor: pointer;
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

        .add-new-icon {
          color: white;
          font-size: 12px;
          margin-right: 6px;
        }

        &:hover {
          opacity: 0.8;
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
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .session-log-el {
        flex: 1;
        // overflow-y: scroll;
        overflow: hidden;
        margin-top: 16px;
        scrollbar-width: none;
        -ms-overflow-style: none;

        .scroll-list {
          height: 100%;

          :deep {
            .arco-scrollbar {
              height: 100%;

              .arco-list {
                height: 100%;
                overflow-y: scroll;
              }
            }
          }
        }

        .box {
          height: 100%;
        }
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
        cursor: pointer;
        .user-name {
          margin-left: 8px;
          color: rgb(52, 65, 86);
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0px;
          text-align: left;
          display: flex;
          align-items: center;
          .iconfont.icon-down {
            font-size: 5px;
            color: #666666;
            margin-left: 8px;
          }
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
          // width: 75%;
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
