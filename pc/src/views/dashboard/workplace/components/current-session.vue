<template>
  <div class="current-session-box">
    <div v-for="(item, index) in commitList" :key="index">
      <div
        :class="[
          'commit-item',
          item.author === 'robot' ? 'robot-commit' : 'user-commit',
        ]"
      >
        <a-avatar :image-url="item.author === 'robot' ? '' : avatar" />
        <div class="commit-content">
          <h5 v-if="item.title" class="commit-title">{{ item.title }}</h5>
          <div v-if="item.content" class="commit-content-text">
            {{ item.content }}
          </div>
          <div class="commit-action" v-if="item.action?.length">
            <div v-for="button in item.action" :key="button">
              <a-button
                v-if="button === 'logo'"
                class="logo-button action-button"
                >{{ button }}</a-button
              >
              <a-button
                v-if="button === '创意营销大图'"
                class="creative-button action-button"
              >
                <span>{{ button }}</span></a-button
              >

              <a-button
                v-if="button === '没有参考图'"
                class="logo-button action-button"
                >{{ button }}</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatar from '@/assets/images/avatar.png';

const commitList = [
  {
    author: 'robot',
    title: 'Hi，我是你的AI设计师素素～',
    content:
      '在开始之前，需要你先回答我几个问题，现在开始吧！需要我帮你设计什么？',
    action: ['logo', '创意营销大图'],
  },
  {
    author: 'user',
    content: '帮我设计一个宠物店的logo',
  },

  {
    author: 'robot',
    content: '您是否有参考图给我参考呢？',
    action: ['没有参考图', '上传参考图'],
  },
  {
    author: 'user',
    content: '没有参考图',
  },

  {
    author: 'robot',
    content: '现在可以开始用文字描述您想要的图片了，通过下方输入框进行描述',
  },
];
</script>

<style scoped lang="less">
.current-session-box {
  width: 100%;

  .commit-item {
    display: flex;
    width: 100%;
    margin-bottom: 32px;

    .commit-content {
      flex: 1;
      margin-left: 16px;
    }
  }
  .robot-commit {
    .commit-content {
      padding: 24px;

      margin-left: 16px;
      border-radius: 12px;
      background: rgb(255, 255, 255);
      padding: 24px;

      .commit-title {
        color: rgb(52, 65, 86);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: left;
        margin: 0;
        margin-bottom: 8px;
      }

      .commit-content-text {
        color: rgb(52, 65, 86);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: left;
      }
    }
  }

  .user-commit {
    .commit-content {
      padding-top: 9px;
      color: rgb(52, 65, 86);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
    }
  }

  .commit-action {
    margin-top: 16px;
    display: flex;

    .action-button {
      margin-right: 16px;
      border: none;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
      padding: 3px 16px;
    }

    .logo-button {
      border-radius: 100px;
      color: rgb(255, 255, 255);
      background: linear-gradient(
        135deg,
        rgb(23, 242, 95) 0%,
        rgb(37, 106, 247) 100%
      );
    }

    .creative-button {
      border-radius: 100px;
      color: rgb(52, 65, 86);
      background: linear-gradient(
        135deg,
        rgb(23, 242, 95) 0%,
        rgb(37, 106, 247) 100%
      );
      span {
        opacity: 1;
        color: rgb(52, 65, 86);
      }
    }
  }
}
</style>
