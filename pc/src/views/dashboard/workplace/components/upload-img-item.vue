<template>
  <div class="upload-img-item-container">
    <a-upload
      v-if="!valueRef"
      accept="image/png, image/jpeg"
      :custom-request="customUpload"
      :disabled="props.disabled"
      class="upload-com"
    >
      <template #upload-button>
        <div class="no-img-upload-btn" :class="disabled && 'hover-disabled'">
          <span class="iconfont icon-a-zuhe7903 icon-add" />
        </div>
      </template>
    </a-upload>
    <div v-else class="reupload-btn">
      <a-image
        width="120"
        height="120"
        :preview="false"
        :src="valueRef"
        fit="scale-down"
      />
     
      <div v-if="!props.disabled" class="hover-area">
        <a-upload
          accept="image/png, image/jpeg"
          :custom-request="customUpload"
          class="upload-com"
        >
          <template #upload-button>
            <a-button>重新上传</a-button>
          </template>
        </a-upload>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { uploadImageV2 } from '@/api/dashboard';
import { computed, ref } from 'vue';

interface Props {
  modelValue: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:modelValue']);

const valueRef = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
});

const disabled = ref(false);

const customUpload = (option: any): any => {
  // data.activeBtns = [data.btns[1]];
  const { fileItem } = option;

  const formData = new FormData();
  formData.append('image', fileItem.file);

  // robotCommitStep.value = 3;
  return uploadImageV2(formData).then((res: any) => {
    valueRef.value = res.data;
    disabled.value = true;
  });
};
</script>

<style scoped lang="less">
.upload-img-item-container {
  width: auto;
  box-sizing: border-box;
  border: 1px solid rgb(232, 233, 235);
  border-radius: 12px;
  max-width: 121px;
  overflow: hidden;

  background: rgb(255, 255, 255);

  position: relative;
  .no-img-upload-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
  }

  .hover-disabled {
    cursor: not-allowed;
  }

  .reupload-btn {
    width: 120px;
    height: 120px;
    position: relative;

    .hover-area {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;

      background: rgba(4, 8, 13, 0.5);

      align-items: center;
      justify-content: center;
      display: none;
      :deep {
        .arco-upload-wrapper {
          width: auto;
        }

        .arco-btn {
          box-sizing: border-box;
          border: 1px solid rgb(232, 233, 235);
          border-radius: 4px;

          background: rgb(255, 255, 255);

          color: rgb(52, 65, 86);
          font-family: FZLanTingHeiS-R-GB;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0px;
          text-align: left;

          padding: 5px 16px;
        }
      }
    }

    &:hover {
      .hover-area {
        display: flex;
      }
    }
  }

  .icon-add {
    font-size: 20px;
    color: rgba(44, 44, 44, 0.2);
  }
}

.upload-com {
  :deep(.arco-upload-list) {
    display: none;
  }
}
</style>
