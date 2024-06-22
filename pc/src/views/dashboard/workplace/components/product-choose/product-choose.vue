<template>
  <a-radio-group
    v-if="imagesType === 'radio'"
    v-model="chosenImg"
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

const chooseImg = (index: any) => {
  data.value.activeImages = [data.value.imagesOptions[index].url];
  emits('chooseImg', data.value.imagesOptions[index]);
};

const handleChoseTemplateImg = (img: ImgOption) => {
  data.value.activeImages = [img.url];
  emits('chooseImg', img);
};

watch(
  [() => data.value.activeImages, () => data.value.imagesOptions],
  ([arr, imagesOptions]) => {
    if (arr?.length) {
      chosenImg.value = imagesOptions.findIndex(
        (item: any) => item.url === arr[0],
      );
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
  }
}
</style>
