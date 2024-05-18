<template>
  <div class="box">
    <div v-for="item in props.logs" :key="item.time">
      <div class="time-tag">
        {{ item.time }}
      </div>
      <div
        v-for="(detailItem, index) in item.detailList"
        :key="index"
        class="log-detail-item"
      >
        <img :src="logItemTag" alt="" srcset="" />
        <div class="text-container">{{ detailItem.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logItemTag from '@/assets/images/log-item-tag.png';

interface Props {
  logs: {
    time: string;
    detailList: {
      text: string;
    }[];
  }[];
}

const props = defineProps<Props>();
</script>

<style scoped lang="less">
.box {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: rgba(236, 243, 253, 0.7);

  .time-tag {
    color: rgb(107, 116, 143);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    margin-bottom: 8px;
  }

  .log-detail-item {
    width: 100%;
    border-radius: 12px;
    background: rgb(255, 255, 255);
    padding: 16px;
    margin-bottom: 16px;
    display: flex;

    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .text-container {
      color: rgb(52, 65, 86);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
    }
  }
}
</style>
