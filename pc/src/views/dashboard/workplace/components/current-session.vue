<template>
  <div class="current-session-box">
    <Session-item
      author="robot"
      title="Hi，我是你的AI设计师素素～"
      :content="'在开始之前，需要你先回答我几个问题，现在开始吧！需要我帮你设计什么？'"
    >
      <template #action>
        <a-button class="action-button">logo</a-button>
        <a-button class="action-button">创意营销大图</a-button>
      </template>
    </Session-item>
    <Session-item author="user" :content="'帮我设计一个宠物店的logo'">
    </Session-item>

    <Session-item author="robot" :content="'您是否有参考图给我参考呢？'">
      <template #action>
        <a-button class="action-button">没有参考图</a-button>
        <a-upload
          accept="image/png, image/jpeg"
          :custom-request="customUpload"
          :disabled="disabledUpload"
          class="upload-com"
        >
          <template #upload-button>
            <a-button :disabled="disabledUpload" class="action-button"
              >上传参考图</a-button
            >
          </template>
        </a-upload>
      </template>
    </Session-item>
    <SessionItem v-for="item in commitList" v-bind="item" :key="item.id" />
  </div>
</template>

<script setup lang="ts">
import { uploadImage } from '@/api/dashboard';
import SessionItem from './session-item.vue';
import { ref } from 'vue';

const disabledUpload = ref(false);

const commitList = ref<any[]>([]);

const addCommit = (params: any) => {
  commitList.value.push({
    ...params,
    id: Date.now(),
  });
};

const customUpload = (option: any) => {
  const { fileItem } = option;

  const formData = new FormData();
  formData.append('image', fileItem.file);

  return uploadImage(formData).then((res: any) => {
    disabledUpload.value = true;
    addCommit({
      author: 'user',
      image: `http://101.126.93.249/api/hh/comfyui_api/view?type=${res.data.type}&filename=${res.data.filename}`,
    });
  });
};
</script>

<style scoped lang="less">
.current-session-box {
  width: 100%;

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
    border-radius: 100px;
    color: rgb(255, 255, 255);
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    );
  }

  .upload-com {
    :deep(.arco-upload-list) {
      display: none;
    }
  }
}
</style>
