<template>
  <div class="top-bar">
    <a-dropdown :popup-max-height="false">
      <div class="wechat-tag">微信小程序</div>
      <template #content>
        <div class="qrcode-info">
          <div class="qrcode-container"> 二维码占位 </div>
          用微信二维码体验移动版
        </div>
      </template>
    </a-dropdown>
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
</template>

<script setup lang="ts">
import { logout } from '@/api/user';
import CommonAvatar from '@/components/common-avatar.vue';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';

const router = useRouter();

const userInfo = useUserStore();

const logoutAction = () => {
  logout();
  localStorage.setItem('token', '');
  router.replace('/login');
};
</script>

<style scoped lang="less">
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

  .wechat-tag {
    margin-right: 32px;
    color: rgb(52, 65, 86);
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
    cursor: pointer;
    color: #256af7;
  }

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

.qrcode-info {
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  .qrcode-container {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
