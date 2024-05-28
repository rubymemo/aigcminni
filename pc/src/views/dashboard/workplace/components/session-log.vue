<template>
  <div v-if="props.logs.length" class="box">
    <div v-for="item in props.logs" :key="item.time">
      <div class="time-tag">
        {{ item.time }}
      </div>
      <div
        v-for="(detailItem, index) in item.list"
        :key="index"
        class="log-detail-item"
        @click="handleClick(detailItem)"
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
  <div v-else class="box">
    <div class="empty-box"> 暂无对话记录 </div>
  </div>
</template>

<script setup lang="ts">
import { getSessionCommit } from '@/api/dashboard';
import logItemTag from '@/assets/images/log-item-tag.png';
import { useRouter } from 'vue-router';

interface Props {
  logs: {
    time: string;
    list: {
      title: string;
    }[];
  }[];
}

const props = defineProps<Props>();

const router = useRouter();

const handleClick = async (detailItem: any) => {
  router.replace({
    query: {
      sessionId: detailItem.id,
    },
  });
  // const res = getSessionCommit(detailItem.id);
  // if (res) {
  //   const dataListTemp = res.items.map((item) => {
  //     return JSON.parse(item.whoSay);
  //   });
  //   // dataList.value = dataListTemp;
  //   // 根据数据做一些初始工作,先写死，后面再改
  //   const lastMsg = dataListTemp[dataListTemp.length - 1];
  //   console.log(lastMsg);
  //   if (lastMsg.type === 'right' && dataListTemp.length === 6) {
  //     // 人说的，且是第一条
  //     addMockRobotReply(3);
  //     getPaintingTask();
  //   }
  //   if (lastMsg.type === 'left' && dataListTemp.length === 9) {
  //     // 机器人说的，且接下来让人说
  //     lastRobotMsg.value = true;
  //     canSend.value = true;
  //   }
  // }
};
</script>

<style scoped lang="less">
.box {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: rgba(236, 243, 253, 0.7);

  .empty-box {
    width: 100%;
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(163, 180, 204);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
  }

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
