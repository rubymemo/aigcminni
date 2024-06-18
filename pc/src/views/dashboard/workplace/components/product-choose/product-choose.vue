<template>
  <a-radio-group
    v-if="imagesType === 'radio'"
    class="template-commit-action"
    :disabled="disabled"
    @change="chooseImg"
  >
    <ImgList
      :data="data"
      :images-type="imagesType"
      :disabled="disabled"
      @choose="handleChoseTemplateImg"
    />
  </a-radio-group>
  <div v-else class="template-commit-action">
    <ImgList
      :data="data"
      :images-type="imagesType"
      :disabled="disabled"
      @choose="handleChoseTemplateImg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import ImgList from './img-list.vue';
import { ImgOption } from '@/interface';

interface Props {
  data: any;
  disabled?: boolean;
  // imagesType: RobotMessage['imagesType'];
}

const props = defineProps<Props>();
const emits = defineEmits(['chooseImg']);

const { data, disabled } = toRefs(props);

const { imagesType } = data.value;

const chosenImg = ref('');

const chooseImg = (url: any) => {
  data.value.activeImages = [url];
  emits('chooseImg', url);
};

const handleChoseTemplateImg = (img: ImgOption) => {
  console.log('img', img);
  chooseImg(img.url);
};

watch(
  () => data.value.activeImages,
  (arr) => {
    if (arr.length) {
      [chosenImg.value] = arr;
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<style scoped lang="less">
.template-commit-action {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  :deep(.arco-radio) {
    margin-right: 0;
  }
}

.template-image-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  margin: 0 24px 16px 0;

  &:last-child {
    margin-right: 0;
  }

  .radio-no-checked {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 1px solid rgb(163, 180, 204);
    background: rgb(255, 255, 255);
    border-radius: 50%;
  }
  .checked-icon {
    color: rgb(37, 106, 247);
    height: 16px;
  }

  :deep(.arco-radio) {
    justify-content: center;
  }
  .img-area {
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;
    // margin-bottom: 16px;

    .img-box {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .img-loading {
      padding: 24px;
      color: rgb(107, 116, 143);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        rgba(23, 242, 95, 0.1) 0%,
        rgba(37, 106, 247, 0.1) 100%
      );

      p {
        margin: 0;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
