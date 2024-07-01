<template>
  <div class="info-container">
    <Title v-if="props.title" :text="props.title" />
    <div class="info-content-container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Title from './title.vue';

interface Props {
  title?: string;
}

const props = defineProps<Props>();
</script>

<style scoped lang="less">
.info-container {
  background: #fff;
  width: 1200px;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  .info-content-container {
    flex: 1;
  }
}
</style>
