<template>
  <InfoContainer title="账户设置">
    <div class="user-setting-container">
      <div class="form-container">
        <a-form
          :model="userInfo"
          :label-col-props="{ span: 2 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="8">
            <a-col :span="12">
              <a-form-item label="头像">
                <a-input />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :span="12">
              <a-form-item label="昵称">
                <a-input />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="性别">
                <a-input />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col :span="12">
              <a-form-item label="昵称">
                <a-input />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="性别">
                <a-input />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <a-divider />
        <Title text="关联账号" />
      </div>

      <div class="handler-bar">
        <a-button>取消</a-button>
        <a-button>保存</a-button>
      </div>
    </div>
  </InfoContainer>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import InfoContainer from '../components/info-container.vue';
import Title from '../components/title.vue';

const userInfo = useUserStore();
</script>

<style scoped lang="less">
.user-setting-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.form-container {
  flex: 1;
  margin-top: 24px;
}

.handler-bar {
  display: flex;
  justify-content: center;
}
</style>
