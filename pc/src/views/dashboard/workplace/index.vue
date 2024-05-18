<template>
  <div class="layout">
    <div class="left-bar">
      <div class="logo-area"> logo占位 </div>
      <div class="button-area">
        <a-button class="create-session-button"> 新建会话 </a-button>
      </div>
      <div class="session-log-container">
        <div class="log-header">会话记录</div>
        <div class="session-log-el">
          <SessionLog :logs="fakeLogs" />
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
            <CurrentSession />
          </div>
        </div>
        <div class="bottom-bar">
          <div class="input-container">
            <textarea
              v-model="inputText"
              placeholder="输入对话后，可通过回车键发送指令"
            />
            <a-button v-show="inputText">发送创意</a-button>
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
import avatar from '@/assets/images/avatar.png';
import SendSvg from '@/assets/svg/send.svg';
import SessionLog from './components/session-log.vue';
import CurrentSession from './components/current-session.vue';
import { ref } from 'vue';

const fakeLogs = [
  {
    time: dayjs().format('YYYY.MM.DD HH.mm'),
    detailList: [
      {
        text: '帮我设计一个宠物店的好看...',
      },
      {
        text: '帮我设计一个打印店的logo',
      },
    ],
  },
];

const inputText = ref('');
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
