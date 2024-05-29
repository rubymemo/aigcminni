<template>
  <div v-if="props.logs.length" class="box">
    <div v-for="item in props.logs" :key="item.time">
      <div class="time-tag">
        {{ item.time }}
      </div>
      <div
        v-for="(detailItem, index) in item.list"
        :key="index"
        class="log-detail-item-box"
        @click="handleClick(detailItem)"
      >
        <div class="log-detail-item">
          <img :src="logItemTag" alt="" srcset="" />
          <div class="text-container">{{ detailItem.title }}</div>
          <div class="log-actions">
            <div class="action-item" @click.stop="editItem(detailItem)">
              <span class="iconfont icon-write1"></span>
              <!-- <svg class="icon icon-write1" aria-hidden="true">
                <use xlink:href="#icon-write1"></use>
              </svg> -->
            </div>
            <div class="action-item" @click.stop="deleteItem(detailItem)">
              <span class="iconfont icon-a-delete"></span>
              <!-- <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-delete"></use>
              </svg> -->
            </div>
          </div>
        </div>
        <div class="bg"></div>
      </div>
    </div>
  </div>
  <div v-else class="box">
    <div class="empty-box"> 暂无对话记录 </div>
  </div>
</template>

<script setup lang="ts">
import { deleteSessionItem, getSessionCommit } from '@/api/dashboard';
import logItemTag from '@/assets/images/log-item-tag.png';
import Delete from '@/assets/images/delete.png';
import Edit from '@/assets/images/edit.png';
import { Message } from '@arco-design/web-vue';
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

const emit = defineEmits(['refresh', 'chosenSession']);

const editItem = (detailItem: any) => {
  console.log(detailItem)
}

const deleteItem = async (detailItem: any) => {
  const res = await deleteSessionItem(detailItem.id);
  if (res.code === '2000') {
    Message.success('删除成功');
    emit('refresh');
  }
};

const handleClick = async (detailItem: any) => {
  emit('chosenSession', detailItem.id);
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
  .log-detail-item-box {
    margin-bottom: 16px;
    padding: 1px;
    border-radius: 12px;
    background: rgb(255, 255, 255);
    &:hover {
      background: linear-gradient(135.00deg, rgb(23, 242, 95),rgb(37, 106, 247) 100%);
    }
  }
  .log-detail-item {
    width: 100%;
    border-radius: 12px;
    background: rgb(255, 255, 255);
    padding: 16px;
    // margin-bottom: 16px;
    display: flex;
    border: 1px solid transparent;
    cursor: pointer;

    &:hover {
      border-color: linear-gradient(
        180deg,
        rgb(99, 214, 101),
        rgb(37, 106, 247) 100%
      );
    }

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

      width: 200px;
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
        margin-right: 6px;
        padding: 0 4px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        img {
          width: 14px;
          height: 14px;
        }
        .iconfont.icon-write1,  .iconfont.icon-a-delete {
          color: #A3B4CC;
          font-size: 14px;
        }
        &:hover {
          .icon-write1,.icon-a-delete {
            background: linear-gradient(135.00deg, rgb(23, 242, 95) 0%,rgb(37, 106, 247) 100%); 
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
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
