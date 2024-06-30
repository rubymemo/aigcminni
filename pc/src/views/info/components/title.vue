<template>
  <h4 class="title-container">
    {{ props.text }}
  </h4>
</template>

<script setup lang="ts">
interface Props {
  text: string;
}

const props = defineProps<Props>();
</script>

<style scoped lang="less">
.title-container {
  margin: 0;
  height: 24px;
  display: flex;
  align-items: center;
  color: rgb(52, 65, 86);
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;

  &::before {
    content: '';
    display: block;
    border-radius: 10px;
    /* 线性渐变 */
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95),
      rgb(37, 106, 247) 100%
    );

    width: 2px;
    height: 14px;
    margin-right: 8px;
  }
}
</style>
