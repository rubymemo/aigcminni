<template>
  <a-modal
    :width="448"
    :visible="modalVisible"
    :hideTitle="true"
    :footer="false"
    :modalStyle="{
      borderRadius: '12px',
    }"
  >
    <span class="close-icon" @click="switchVisible">
      <icon-close />
    </span>
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
          field="phone"
          :rules="[
            { required: true, message: '请输入手机号' },
            {
              match:
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: '手机号错误',
            },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <GInput
            v-model:model-value="userInfo.phone"
            placeholder="请输入手机号"
          >
            <template v-slot:prepend>
              <span class="prepend">
                +86
                <span class="down-icon">
                  <svg
                    width="8.000000"
                    height="5.000000"
                    viewBox="0 0 8 5"
                    fill="none"
                  >
                    <defs />
                    <path
                      id="path"
                      d="M4.7 3.66C4.69 3.68 4.67 3.69 4.66 3.7C4.65 3.71 4.64 3.72 4.63 3.74C4.62 3.75 4.61 3.76 4.59 3.77C4.58 3.78 4.57 3.79 4.55 3.8C4.54 3.81 4.53 3.82 4.51 3.83C4.5 3.84 4.49 3.85 4.47 3.86C4.46 3.87 4.44 3.88 4.43 3.89C4.41 3.89 4.4 3.9 4.38 3.91C4.37 3.92 4.35 3.92 4.34 3.93C4.32 3.93 4.31 3.94 4.29 3.95C4.28 3.95 4.26 3.96 4.24 3.96C4.23 3.97 4.21 3.97 4.2 3.97C4.18 3.98 4.16 3.98 4.15 3.98C4.13 3.99 4.11 3.99 4.1 3.99C4.08 3.99 4.06 3.99 4.04 3.99C4.03 4 4.01 4 4 4C3.98 4 3.96 4 3.94 3.99C3.93 3.99 3.91 3.99 3.89 3.99C3.88 3.99 3.86 3.99 3.84 3.98C3.83 3.98 3.81 3.98 3.79 3.97C3.78 3.97 3.76 3.97 3.75 3.96C3.73 3.96 3.71 3.95 3.7 3.95C3.68 3.94 3.67 3.93 3.65 3.93C3.64 3.92 3.62 3.92 3.61 3.91C3.59 3.9 3.58 3.89 3.56 3.89C3.55 3.88 3.53 3.87 3.52 3.86C3.5 3.85 3.49 3.84 3.48 3.83C3.46 3.82 3.45 3.81 3.44 3.8C3.42 3.79 3.41 3.78 3.4 3.77C3.38 3.76 3.37 3.75 3.36 3.74C3.35 3.72 3.34 3.71 3.33 3.7C3.32 3.69 3.3 3.68 3.29 3.66L0.09 -0.29C0.06 -0.32 0.04 -0.37 0.02 -0.42C0 -0.46 0 -0.51 0 -0.56C0 -0.81 0.2 -1 0.44 -1L7.55 -1C7.65 -1 7.75 -0.97 7.83 -0.91C7.84 -0.9 7.85 -0.89 7.86 -0.88C7.87 -0.87 7.88 -0.86 7.89 -0.85C7.9 -0.84 7.91 -0.82 7.92 -0.81C7.92 -0.8 7.93 -0.79 7.94 -0.77C7.95 -0.76 7.95 -0.75 7.96 -0.74C7.96 -0.72 7.97 -0.71 7.97 -0.7C7.98 -0.68 7.98 -0.67 7.99 -0.65C7.99 -0.64 7.99 -0.62 7.99 -0.61C7.99 -0.6 8 -0.58 8 -0.57C8 -0.55 8 -0.54 7.99 -0.52C7.99 -0.51 7.99 -0.5 7.99 -0.48C7.98 -0.47 7.98 -0.45 7.98 -0.44C7.97 -0.42 7.97 -0.41 7.96 -0.4C7.96 -0.38 7.95 -0.37 7.94 -0.36C7.94 -0.35 7.93 -0.33 7.92 -0.32C7.91 -0.31 7.91 -0.3 7.9 -0.29L4.7 3.66Z"
                      fill="#666666"
                      fill-opacity="1.000000"
                      fill-rule="nonzero"
                    />
                  </svg>
                </span>
              </span>
            </template>
          </GInput>
        </a-form-item>
        <a-form-item
          field="code"
          :rules="[{ required: true, message: '请输入验证码' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <GInput
            v-model:model-value="userInfo.code"
            placeholder="请输入验证码"
          >
            <template v-slot:append>
              <div class="append">
                <a-link
                  v-show="timer === 0"
                  @click="queryCode"
                  :hoverable="false"
                  >获取验证码</a-link
                >
                <span v-show="timer > 0" style="color: #A3B4CC">重新发送{{ timer }}s</span>
              </div>
            </template>
          </GInput>
        </a-form-item>
        <a-space :size="16" direction="vertical" style="margin-top: 22px">
          <a-button
            type="primary"
            html-type="submit"
            long
            :loading="loading"
            class="submit-button"
          >
            登录
          </a-button>
        </a-space>
      </a-form>
      <div class="read-allow" @click="handleRead">
        <span class="circle">
          <icon-check-circle-fill v-if="isRead" class="icon-fill" :size="14" />
        </span>

        已阅读并同意&nbsp;&nbsp;<span class="blue">用户协议</span>、<span
          class="blue"
          >隐私政策</span
        >&nbsp;并授权使用账号信息
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, defineExpose } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import robotImage from '@/assets/images/robot.png';
  import { isLogin } from '@/utils/auth';
  import GInput from '@/components/Input/index.vue';
  import { useIntervalFn } from '@vueuse/core';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const modalVisible = ref(false);
  const isChecked = ref(false);
  const isRead = ref(false);
  const loginForm = ref();
  const timer = ref(0); // 倒计时

  // const loginConfig = useStorage('login-config', {
  //   phone: '', // 演示默认值
  //   code: '', // demo default value
  // });
  const userInfo = reactive({
    phone: '',
    code: '',
  });

  onMounted(() => {
    if (!isLogin()) {
      console.log('未登录');
      modalVisible.value = true;
    }
  });

  const { pause, resume } = useIntervalFn(
    () => {
      if (timer.value <= 0) {
        // 停止定时任务
        pause();
      } else {
        // 单次定时任务执行的回调
        timer.value -= 1;
      }
    },
    1000,
    {
      // 默认不开启定时任务
      immediate: false,
    }
  );

  const queryCode = async () => {
    const err = await loginForm.value.validateField(['phone']);
    if (!err) {
      if (timer.value === 0) {
        timer.value = 60;
        resume();
        // 这里写向后台发送请求的代码
        // console.log('发送请求');
      }
    }
  };

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    console.log('提交');
    if (loading.value) return;
    if(!errors &&isRead.value === false) {
        Message.normal({
          content: '请选勾选下方协议',
        })
    }
    if (!errors) {
      

      setLoading(true);
      try {
        
        console.log(values);
        // await userStore.login(values as LoginData);
        // const { redirect, ...othersQuery } = router.currentRoute.value.query;
        // router.push({
        //   name: (redirect as string) || 'Workplace',
        //   query: {
        //     ...othersQuery,
        //   },
        // });
        // Message.success(t('login.form.login.success'));
        // const { phone, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        // loginConfig.value.phone = phone;
        // loginConfig.value.password = password;
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };

  // 阅读
  const handleRead = () => {
    isRead.value = !isRead.value;
  };

  const switchVisible = () => {
    modalVisible.value = !modalVisible.value;
    loginForm.value.clearValidate();
  };

  defineExpose({
    switchVisible,
  });
</script>

<style lang="less" scoped>
  .close-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    position: absolute;
    right: 23px;
    top: 23px;
    font-weight: bold;
    color: #a3b4cc;
    &:hover {
      background-color: #a3b4cc66;
    }
  }
  .robot-image-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    );
    margin-bottom: 44px;
  }
  .login-form {
    &-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 44px;
      width: 100%;
      background-color: #fff;
      border-radius: 12px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
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
          color: #256af7;
        }
      }
    }

    &::v-deep {
      .arco-form-item-message {
        position: absolute;
        top: 44px;
        color: #ff6966;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0px;
        margin-left: 16px;
      }
      .arco-form-item {
        position: relative;
        padding-bottom: 34px;
        margin-bottom: 0px;
      }
    }
  }
  .submit-button {
    font-weight: 500;
  }
  .read-allow {
    display: flex;
    align-items: center;
    cursor: pointer;

    .circle {
      position: relative;
      display: inline-block;
      border: 1px solid rgb(163, 180, 204);
      border-radius: 50%;
      width: 12px;
      height: 12px;
      margin-right: 8px;
      .icon-fill {
        position: absolute;
        top: -2px;
        left: -2px;
        color: #256af7;
      }
    }
    margin-top: 28px;
    color: #6b748f;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    .blue {
      color: #256af7;
    }
  }
</style>
