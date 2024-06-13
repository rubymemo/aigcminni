<template>
  <div class="top-bar">
    <div class="top-bar-content">
      <a-dropdown :popup-max-height="false" class="qrcode-dropdown">
        <div class="wechat-tag">微信小程序</div>
        <template #content>
          <div class="qrcode-info">
            <div class="qrcode-container"> 二维码占位 </div>
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

<style lang="less">
.qrcode-dropdown {
  margin-top: 24px;
  border-radius: 12px;
  /* 外阴影-中高 */
  box-shadow: 0px 8px 16px 0px rgba(2, 32, 77, 0.12);
  overflow: hidden;

  .arco-dropdown {
    box-shadow: unset;
  }
}
</style> 

<style scoped lang="less">
.top-bar {
  position: relative;

  height: 64px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  // background: rgb(255, 255, 255);
  // opacity: 0.7;

  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgb(255, 255, 255);
    opacity: 0.7;
  }

  .top-bar-content {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100;
    display: flex;
    align-items: center;
    justify-content: end;
    padding-right: 24px;
  }

  .wechat-tag {
    margin-right: 20px;
    color: rgb(37, 106, 247);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    cursor: pointer;
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
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  .qrcode-container {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
