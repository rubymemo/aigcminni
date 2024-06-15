<template>
  <a-radio-group
    v-if="imagesType === 'radio'"
    v-model="chosenTemplateItem"
    class="template-commit-action"
    :disabled="disabled"
    @change="handleChoseTemplateImg(data, $event)"
  >
    <ImgList :data="data" :images-type="imagesType" :disabled="disabled" />
  </a-radio-group>
  <div v-else class="template-commit-action">
    <ImgList :data="data" :images-type="imagesType" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import { ImgOption, RobotMessage } from '@/interface';
import { toRefs } from 'vue';
import ImgList from './img-list.vue';

interface Props {
  data: {
    imagesOptions: Array<ImgOption>;
    progress: number;
  };
  disabled?: boolean;
  imagesType: RobotMessage['imagesType'];
}

const props = defineProps<Props>();

const { data, disabled, imagesType } = toRefs(props);

const handleChoseTemplateImg = (data: any, code: any) => {
  // console.log(data, code);
  // chosenTemplateItem.value = code;
  // const { url } = data.imagesOptions.find((item: any) => item.code === code);
  // data.activeImages = [url];
  // addCommit({
  //   author: 'user',
  //   data: {
  //     images: [url],
  //     content: '我已经选定了',
  //   },
  // });
  // emit('lastStep', code);
  // lastStep.value = true;
};
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
</style>
