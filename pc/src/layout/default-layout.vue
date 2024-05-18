<template>
  <div class="layout">
    <div class="left-bar"></div>
    <div class="right-container">
      <div class="top-bar"></div>
      <div class="detail-container"></div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
  .layout {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 24px;
    box-sizing: border-box;
    background: rgb(242, 244, 247);
    background-image: url(@/assets/images/background.png);

    .left-bar {
      width: 370px;
      height: 100%;
      border-radius: 12px;
      box-sizing: border-box;
      border-radius: 12px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0) 100%
      );
    }

    .right-container {
      flex: 1;
      margin-left: 24px;
      display: flex;
      flex-direction: column;

      .top-bar {
        height: 64px;
        width: 100%;
        border-radius: 12px;
        background: rgb(255, 255, 255);
        opacity: 0.7;
      }

      .detail-container {
        flex: 1;
      }
    }
  }
</style>
