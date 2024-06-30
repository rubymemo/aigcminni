<template>
  <div class="info-layout">
    <TopBar />
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from '@/components/top-bar.vue';
</script>

<style scoped lang="less">
.info-layout {
  display: flex;
  flex-direction: column;
  padding: 25px;
  background-image: url(@/assets/images/background.png);
  width: 100%;
  height: 100%;

  .content-container {
    flex: 1;
    margin-top: 24px;
    overflow: hidden;

    display: flex;
    justify-content: center;
  }
}
</style>
