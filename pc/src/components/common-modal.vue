<template>
  <a-modal
    class="common-modal"
    :class="modalClass"
    :title-align="'start'"
    @cancel="handleCancel"
  >
    <template #title> {{ $attrs.title }} </template>
    <slot />
    <div class="common-modal-footer">
      <a-button class="cancel-btn" @click="handleCancel">{{
        props.cancelBtnText
      }}</a-button>
      <a-button class="ok-btn" @click="handleConfirm">{{
        props.okBtnText
      }}</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ModalConfig } from '@arco-design/web-vue';
import { computed } from 'vue';

interface Props extends /* @vue-ignore */ Omit<ModalConfig, 'content'> {
  hiddenHeader?: boolean;
  hiddenFooter?: boolean;
  okBtnText?: string;
  cancelBtnText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hiddenFooter: true,
  okBtnText: '确认',
  cancelBtnText: '取消',
});

const emit = defineEmits(['ok', 'cancel', 'update:visible']);

const handleConfirm = () => {
  emit('ok');
};

const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};

const modalClass = computed(() => ({
  'common-modal-hidden-title': props.hiddenHeader,
  'common-modal-hidden-footer': props.hiddenFooter,
}));
</script>

<style lang="less">
.common-modal {
  .arco-modal-header {
    height: 52px;
    padding: 0 24px;

    .arco-modal-title {
      color: rgb(25, 29, 50);
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: left;
    }
  }

  .arco-modal-body {
    padding: 24px;
  }
  .arco-modal {
    border-radius: 8px;
  }
}

.common-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  margin-top: 8px;
}

.common-modal-hidden-title {
  .arco-modal-header {
    display: none;
  }
}

.common-modal-hidden-footer {
  .arco-modal-footer {
    display: none;
  }

  .cancel-btn,
  .ok-btn {
    border-radius: 100px;
    height: 40px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: center;
    padding: 0 24px;
  }

  .cancel-btn {
    margin-right: 16px;
    border: 1px solid rgb(207, 218, 235) !important;
    background: rgb(255, 255, 255) !important;
  }

  .ok-btn {
    border: none !important;
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    );
    color: rgb(255, 255, 255) !important;
  }
}
</style>
