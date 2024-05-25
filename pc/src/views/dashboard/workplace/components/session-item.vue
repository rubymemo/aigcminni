<template>
  <div
    :class="[
      'commit-item',
      author === 'robot' ? 'robot-commit' : 'user-commit',
    ]"
  >
    <a-avatar :image-url="author === 'robot' ? '' : avatar" />
    <div class="commit-content">
      <h5 v-if="title" class="commit-title">{{ title }}</h5>
      <div v-if="content" class="commit-content-text">
        {{ content }}
      </div>
      <div v-if="props.image" class="image-box">
        <img :src="props.image" alt="" />
      </div>
      <div class="commit-action">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatar from '@/assets/images/avatar.png';

interface Props {
  title?: string;
  content?: string;
  author: 'user' | 'robot';
  image?: string;
}

const props = defineProps<Props>();
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

      .image-box {
        width: 120px;
        height: 120px;
        overflow: hidden;
        border-radius: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }
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
