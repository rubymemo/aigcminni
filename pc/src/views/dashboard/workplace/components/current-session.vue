<template>
  <div class="current-session-box">
    <SessionItem
      v-for="(item, index) in commitList"
      v-bind="item"
      :key="item.id"
      :disabled="actionDisabled(index)"
      @choose-img="handleChooseTemplate"
    >
      <template #sessionStart>
        <a-button
          :disabled="actionDisabled(index)"
          class="action-button"
          @click="handleCreateLogo('logo')"
          >logo</a-button
        >
        <a-button
          class="action-button"
          :disabled="actionDisabled(index)"
          @click="handleCreateLogo('创意营销大图')"
          >创意营销大图</a-button
        >
      </template>
      <template #refrenceImage>
        <a-button
          class="action-button"
          :disabled="actionDisabled(index)"
          @click="noImageUpload"
          >没有参考图</a-button
        >
        <a-upload
          accept="image/png, image/jpeg"
          :custom-request="customUpload"
          :disabled="actionDisabled(index)"
          class="upload-com"
        >
          <template #upload-button>
            <a-button :disabled="disabledUpload" class="action-button"
              >上传参考图</a-button
            >
          </template>
        </a-upload>
      </template>
      <template #supplyText>
        <a-button
          class="action-button"
          :disabled="actionDisabled(index)"
          @click="noTextSupply"
          >没有</a-button
        >
      </template>
    </SessionItem>
  </div>
</template>

<script lang="ts">
import { uploadImage } from '@/api/dashboard';
import SessionItem, { SessionItemProps } from './session-item.vue';
import { ref } from 'vue';
import { v4 } from 'uuid';
import { getImagePath } from '../util';

interface CommitItem extends SessionItemProps {
  id: string;
}
</script>

<script setup lang="ts">
const emit = defineEmits([
  'imageUploadSuccess',
  'waitInput',
  'textComplete',
  'noText',
  'chooseStyle'
]);

const disabledUpload = ref(false);

const commitList = ref<CommitItem[]>([]);

const addCommit = (params: Partial<SessionItemProps>) => {
  const author = params.author || 'robot';
  commitList.value.push({
    ...params,
    author,
    id: v4(),
  });
};

addCommit({
  author: 'robot',
  title: 'Hi，我是你的AI设计师素素～',
  content:
    '在开始之前，需要你先回答我几个问题，现在开始吧！需要我帮你设计什么？',
  slotName: 'sessionStart',
});

const actionDisabled = (index: number) => {
  return index < commitList.value.length - 1;
};

const handleCreateLogo = (type: string) => {
  addCommit({
    author: 'user',
    content: `帮我设计一个${type}`,
  });
  addCommit({
    content: '您是否有参考图给我参考呢？',
    slotName: 'refrenceImage',
  });
};

const noImageUpload = () => {
  addCommit({
    author: 'user',
    content: `没有参考图`,
  });
  addCommit({
    content: '您现在可以输入内容了',
  });
  emit('waitInput');
  disabledUpload.value = true;
};

const customUpload = (option: any): any => {
  const { fileItem } = option;

  const formData = new FormData();
  formData.append('image', fileItem.file);

  return uploadImage(formData).then((res: any) => {
    disabledUpload.value = true;
    addCommit({
      author: 'user',
      // image: `http://101.126.93.249/api/hh/comfyui_api/view?type=${res.data.type}&filename=${res.data.filename}`,
      image: getImagePath(res.data.filename, res.data.type),
    });
    emit('imageUploadSuccess', res.data.filename);
  });
};

const handleChooseTemplate = (imgUrl: string) => {
  addCommit({
    author: 'user',
    image: imgUrl,
    content: '我已经选定了',
  });
  addCommit({
    content:
      '针对文字部分，您是否还有其它补充，如果没有直接点击没有跳过即可，如果有请在下方输入',
    slotName: 'supplyText',
  });
  emit('chooseStyle', imgUrl)
};

const noTextSupply = () => {
  addCommit({
    author: 'user',
    content: '没有',
  });
  emit('noText');
};
defineExpose({
  addCommit,
});
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
