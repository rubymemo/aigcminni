<template>
  <div class="login-form-wrapper">
    <div class="robot-image-box">
      <img class="carousel-image" :src="robotImage" />
    </div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <div class="login-form-input">
          <span class="prepend">
            +86
            <span class="down-icon">
              <svg width="8.000000" height="5.000000" viewBox="0 0 8 5" fill="none">
                <defs/>
                <path id="path" d="M4.7 3.66C4.69 3.68 4.67 3.69 4.66 3.7C4.65 3.71 4.64 3.72 4.63 3.74C4.62 3.75 4.61 3.76 4.59 3.77C4.58 3.78 4.57 3.79 4.55 3.8C4.54 3.81 4.53 3.82 4.51 3.83C4.5 3.84 4.49 3.85 4.47 3.86C4.46 3.87 4.44 3.88 4.43 3.89C4.41 3.89 4.4 3.9 4.38 3.91C4.37 3.92 4.35 3.92 4.34 3.93C4.32 3.93 4.31 3.94 4.29 3.95C4.28 3.95 4.26 3.96 4.24 3.96C4.23 3.97 4.21 3.97 4.2 3.97C4.18 3.98 4.16 3.98 4.15 3.98C4.13 3.99 4.11 3.99 4.1 3.99C4.08 3.99 4.06 3.99 4.04 3.99C4.03 4 4.01 4 4 4C3.98 4 3.96 4 3.94 3.99C3.93 3.99 3.91 3.99 3.89 3.99C3.88 3.99 3.86 3.99 3.84 3.98C3.83 3.98 3.81 3.98 3.79 3.97C3.78 3.97 3.76 3.97 3.75 3.96C3.73 3.96 3.71 3.95 3.7 3.95C3.68 3.94 3.67 3.93 3.65 3.93C3.64 3.92 3.62 3.92 3.61 3.91C3.59 3.9 3.58 3.89 3.56 3.89C3.55 3.88 3.53 3.87 3.52 3.86C3.5 3.85 3.49 3.84 3.48 3.83C3.46 3.82 3.45 3.81 3.44 3.8C3.42 3.79 3.41 3.78 3.4 3.77C3.38 3.76 3.37 3.75 3.36 3.74C3.35 3.72 3.34 3.71 3.33 3.7C3.32 3.69 3.3 3.68 3.29 3.66L0.09 -0.29C0.06 -0.32 0.04 -0.37 0.02 -0.42C0 -0.46 0 -0.51 0 -0.56C0 -0.81 0.2 -1 0.44 -1L7.55 -1C7.65 -1 7.75 -0.97 7.83 -0.91C7.84 -0.9 7.85 -0.89 7.86 -0.88C7.87 -0.87 7.88 -0.86 7.89 -0.85C7.9 -0.84 7.91 -0.82 7.92 -0.81C7.92 -0.8 7.93 -0.79 7.94 -0.77C7.95 -0.76 7.95 -0.75 7.96 -0.74C7.96 -0.72 7.97 -0.71 7.97 -0.7C7.98 -0.68 7.98 -0.67 7.99 -0.65C7.99 -0.64 7.99 -0.62 7.99 -0.61C7.99 -0.6 8 -0.58 8 -0.57C8 -0.55 8 -0.54 7.99 -0.52C7.99 -0.51 7.99 -0.5 7.99 -0.48C7.98 -0.47 7.98 -0.45 7.98 -0.44C7.97 -0.42 7.97 -0.41 7.96 -0.4C7.96 -0.38 7.95 -0.37 7.94 -0.36C7.94 -0.35 7.93 -0.33 7.92 -0.32C7.91 -0.31 7.91 -0.3 7.9 -0.29L4.7 3.66Z" fill="#666666" fill-opacity="1.000000" fill-rule="nonzero"/>
              </svg>
            </span>
          </span>
          <input v-model="userInfo.username" placeholder="请输入手机号" />
        </div>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <div class="login-form-input">
          <input v-model="userInfo.username" placeholder="请输入验证码" />
          <div class="append">
            <a-link href="link" :hoverable="false">获取验证码</a-link>
          </div>
        </div>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import robotImage from '@/assets/images/robot.png';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: 'admin', // 演示默认值
    password: 'admin', // demo default value
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
  });

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
  .robot-image-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135.00deg, rgb(23, 242, 95) 0%,rgb(37, 106, 247) 100%);
      margin-bottom: 44px;
    }
  .login-form {
    &-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 44px 64px;
      width: 320px;
      background-color: #fff;
      border-radius: 12px;
      width: 448px;
      height: 454px;

    }
  
    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
    .login-form-input {
      display: flex;
      align-items: center;  
      box-sizing: border-box;
      width: 320px;
      height: 40px;
      line-height: 40px;
      border-radius: 100px;
      border: 1px solid rgb(163, 180, 204);
      background: rgb(255, 255, 255);
      overflow: hidden;
      padding: 0px 16px;
      input {
        height: 22px;
        border: none;
        flex: 1;
        &::placeholder {
          color: rgb(163, 180, 204);
        }
        &:focus-visible {
          outline: none;
        }
      }
      .prepend {
        width: 44px;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 16px;
        .down-icon {
          display: inline-flex;
          align-items: center;
        }
      }
      .append {
        &::v-deep {
          .arco-link {
            color: #256AF7;
          }
        }
      }
    }

  }
</style>
