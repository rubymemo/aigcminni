<template>
  <a-modal class="common-modal" :class="modalClass" :title-align="'start'">
    <template #title> {{ $attrs.title }} </template>
    <slot />
    <div class="common-modal-footer"> </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ModalConfig } from '@arco-design/web-vue';
import { computed } from 'vue';

interface Props extends /* @vue-ignore */ Omit<ModalConfig, 'content'> {
  hiddenHeader?: boolean;
  hiddenFooter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hiddenFooter: true,
});

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
  .arco-modal {
    border-radius: 8px;
  }
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
}
</style>
