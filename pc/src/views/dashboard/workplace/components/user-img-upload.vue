<template>
  <div class="user-img-upload-container">
    {{ data.interfaceParams }}
    <UploadImgItem
      v-model="data.interfaceParams.additionalReferImgs.logo"
      class="user-upload-item"
      :disabled="props.disabled"
    />
    <UploadImgItem
      v-model="data.interfaceParams.additionalReferImgs.QRCode"
      class="user-upload-item"
      :disabled="props.disabled"
    />
    <UploadImgItem
      v-model="data.interfaceParams.additionalReferImgs.topicMap"
      class="user-upload-item"
      :disabled="props.disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import UploadImgItem from './upload-img-item.vue';

interface Props {
  data: any;
  disabled?: boolean;
}

const props = defineProps<Props>();

const { data } = toRefs(props);
</script>

<style scoped lang="less">
.user-img-upload-container {
  display: flex;

  .user-upload-item {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
