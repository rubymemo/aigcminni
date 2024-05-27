<template>
  <div class="box">
    <div v-for="item in props.logs" :key="item.time">
      <div class="time-tag">
        {{ item.time }}
      </div>
      <div
        v-for="(detailItem, index) in item.list"
        :key="index"
        class="log-detail-item"
      >
        <img :src="logItemTag" alt="" srcset="" />
        <div class="text-container">{{ detailItem.title }}</div>
        <div class="log-actions">
          <div class="action-item">
            <icon-edit :size="16" />
          </div>
          <div class="action-item">
            <icon-delete :size="16" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logItemTag from '@/assets/images/log-item-tag.png';

interface Props {
  logs: {
    time: string;
    list: {
      title: string;
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
    border: 1px solid transparent;
    cursor: pointer;

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

      width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .log-actions {
      display: none;

      .action-item {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 8px;
        padding: 0 4px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &:hover {
      .log-actions {
        display: flex;
      }
    }
  }
}
</style>
