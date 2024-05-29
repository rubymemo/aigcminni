<template>
  <div class="container">
    <header class="nav-bar">
      <span class="left-side">
        <img
          alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
        />
      </span>
      <span class="right-side">
          <a-dropdown trigger="click">
            <a-avatar
              :size="32"
              :style="{ marginRight: '8px', cursor: 'pointer', backgroundColor: isUserLogin ? '#c9cdd4' : undefined }"
            >
            <template v-if="avatar && isUserLogin">
              <img
                alt="avatar"
                :src="avatar"
              />
            </template>
            <template v-else>
              {{ isUserLogin ? name : '未登录' }}
            </template>
            </a-avatar>
            <template #content>
              <a-doption>
                <a-space @click="handleLoginLogout">
                  <icon-export />
                  <span>
                    {{ isUserLogin ? '登出' : '登录' }}
                  </span>
                </a-space>
              </a-doption>
            </template>
          </a-dropdown>
      </span>
    </header>
    <div class="content">
      <LoginBanner />
      <div class="content-inner">
        <!-- <LoginForm /> -->

        <div
          :class="`card-${item.type} card`"
          v-for="item in cardList"
          @click="handleGoContent(item)"
          :key="item.type"
        >
          <div class="card-title">{{ item.title }}</div>
          <div class="card-footer"
            >{{ item.footer }}
            <span class="card-icon-box">
              <icon-right />
            </span>
          </div>
        </div>
      </div>
    </div>
    <loginForm ref="LoginFormModalRef" @ok="onOk"/>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import { isLogin } from '@/utils/auth';
  import LoginBanner from './components/banner.vue';
  import loginForm from './components/login-form.vue';
  import { useUserStore } from '@/store';

  const LoginFormModalRef = ref();
  const isUserLogin = ref(false);
  const userStore = useUserStore();
  const router = useRouter();
  const name = computed(() => {
    return userStore.username || userStore.nickname || userStore.userId;
  })
  const avatar = computed(() => {
    return userStore.avatar;
  })

  const cardList = [
    {
      title: 'logo制作',
      footer: '智能勾勒品牌灵魂',
      type: 'logo',
    },
    {
      title: '创意营销大图',
      footer: '智能勾勒视觉语言',
      type: 'big-img',
    },
  ];

  onBeforeMount(() => {
    isUserLogin.value = isLogin();
  });

  const handleGoContent = (item: { type: string }) => {
    const isLoginTemp = isLogin();
    isUserLogin.value = isLoginTemp;
    
    if (isLoginTemp) {
      console.log('已经登录，直接进入首页')
      router.push({
        name: 'Workplace',
      });
    } else {
      LoginFormModalRef.value.switchVisible();
    }
  };
  const handleLoginLogout = () => {
    const isLoginTemp = isLogin();
    isUserLogin.value = isLoginTemp;
    if(isLoginTemp) {
      // 登出
      isUserLogin.value = false;
      userStore.logout();
    }else {
      LoginFormModalRef.value.switchVisible();
    }
  };
  const onOk = () => {
    isUserLogin.value = isLogin();
  }
</script>

<style lang="less" scoped>
  .container {
    padding: 16px 24px;
    min-height: 100vh;
    background-color: #f6f7fa;

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      border-radius: 12px;
      background-color: rgb(255, 255, 255, 0.7);
      padding: 0 24px;
      margin-bottom: 24px;
    }

    .banner {
      // width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      // position: relative;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      // flex: 1;
      // align-items: center;
      // justify-content: center;
      // padding-bottom: 40px;
      .content-inner {
        flex: 1;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding-left: 6vw;
        padding-top: 17vh;
      }
      .card {
        position: relative;
        border-radius: 12px;
        height: 200px;
        width: 30vw;
        min-width: 300px;
        max-width: 602px;
        padding: 36px 24px 36px 36px;
        cursor: pointer;
        &-title {
          color: rgb(25, 29, 50);
          font-size: 28px;
          font-weight: 500;
          line-height: 36px;
          letter-spacing: 0px;
          text-align: left;
        }
        &-footer {
          display: flex;
          align-items: center;
          position: absolute;
          bottom: 33px;
          right: 38px;
          color: rgb(25, 29, 50);
          font-size: 22px;
          font-weight: 500;
          line-height: 30px;
          letter-spacing: 0px;
        }
        &-icon-box {
          margin-left: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: #c4c4c4;
          border-radius: 4px;
          font-size: 12px;
        }
      }
      .card.card-logo {
        background: #e9ecfd;
      }
      .card.card-big-img {
        margin-top: 70px;
        background: #dfeafc;
      }
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>
