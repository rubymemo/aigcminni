<template>
  <a-list class="list" @reach-bottom="handleReachBottom">
    <div class="box">
    <div v-for="(detailItem, index) in props.logs" :key="detailItem.createTime">
      <div class="time-tag">
        {{ detailItem.createTime }}
      </div>
      <div
        class="log-detail-item-box"
        :class="detailItem.__editting ? 'log-detail-item-editting' : 'log-detail-item-normal'"
        @click="handleClick(detailItem)"
      >
        <div v-if="detailItem.__editting" class="log-editting-item">
          <img :src="logItemTag" alt="" srcset="" />
          <div class="edit-area">
            <textarea v-model="detailItem.__title" />
            <div class="edit-handle-area">
              <span
                class="iconfont icon-check"
                :class="!detailItem.__title && 'disabled-icon-click'"
                @click.stop="saveTitle(detailItem)"
              ></span>
              <span
                class="iconfont icon-close"
                @click.stop="dropEdit(detailItem)"
              ></span>
            </div>
          </div>
        </div>
        <div v-else class="log-detail-item" @click="handleClick(detailItem)">
          <img :src="logItemTag" alt="" srcset="" />
          <div class="text-container">{{ detailItem.title }}</div>
          <div class="log-actions">
            <div class="action-item" @click.stop="editItem(detailItem)">
              <!-- <icon-edit :size="16" /> -->
              <span class="iconfont icon-write1"></span>
            </div>
            <div class="action-item" @click.stop="deleteItem(detailItem, index)">
              <span class="iconfont icon-a-delete"></span>
            </div>
          </div>
        </div>
        <div class="bg"></div>
      </div>
    </div>
    <div class="extra-info">
      <a-spin v-if="props.loading" />
      <div v-else-if="props.finished">
        <div v-if="!props.logs.length" class="empty-box">暂无对话记录</div>
        <template v-else>已经是全部历史记录了</template>
      </div>
    </div>
  </div>
  </a-list>

</template>

<script setup lang="ts">
import {
  deleteSessionItem,
  editSessionTitle,
  getSessionCommit,
} from '@/api/dashboard';
import logItemTag from '@/assets/images/log-item-tag.png';
import Delete from '@/assets/images/delete.png';
import Edit from '@/assets/images/edit.png';
import { Message } from '@arco-design/web-vue';

interface Props {
  logs: {
    createTime: string;
    title: string;
    [props: string]: any;
  }[];
  loading: boolean;
  finished: boolean;
  firstLoadComplete: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(['refresh', 'chosenSession', 'loadMore', 'deleteItem']);

const handleReachBottom = () => {
  if (props.loading || props.finished || !props.firstLoadComplete) {
    return;
  }
  emit('loadMore');
}

const editItem = (detailItem: any) => {
  // eslint-disable-next-line no-underscore-dangle
  detailItem.__editting = true;
  // eslint-disable-next-line no-underscore-dangle
  detailItem.__title = detailItem.title;
};

const saveTitle = async (detailItem: any) => {
  // eslint-disable-next-line no-underscore-dangle
  if (!detailItem.__title) {
    return;
  }
  const res = await editSessionTitle({
    id: detailItem.id,
    // eslint-disable-next-line no-underscore-dangle
    title: detailItem.__title,
  });
  if (res.code === '2000') {
    // eslint-disable-next-line no-underscore-dangle
    detailItem.title = detailItem.__title;
    Reflect.deleteProperty(detailItem, '__editting');
  }
};

const dropEdit = (detailItem: any) => {
  Reflect.deleteProperty(detailItem, '__title');
  Reflect.deleteProperty(detailItem, '__editting');
};

const deleteItem = async (detailItem: any, deleteIndex: number) => {
  const res = await deleteSessionItem(detailItem.id);
  if (res.code === '2000') {
    Message.success('删除成功');
    emit('deleteItem', deleteIndex)
  }
};

const handleClick = async (detailItem: any) => {
  // eslint-disable-next-line no-underscore-dangle
  if (detailItem.__editting) {
    return;
  }
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
.list {
  height: 100%;


  :deep {
    .arco-scrollbar {
      height: 100%;

      .arco-list {
        height: 100%;
        overflow-y: scroll;
      }
    }

    .arco-list-bordered {
      border: none;
    }
  }
}

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
  }

  .log-detail-item-normal {
    &:hover,&.active {
      background: linear-gradient(
        135deg,
        rgb(23, 242, 95),
        rgb(37, 106, 247) 100%
      );
    }
     
  }

  .log-detail-item-editting {
    background: linear-gradient(
        135deg,
        rgb(23, 242, 95),
        rgb(37, 106, 247) 100%
      );
  }

  .log-editting-item {
    width: 100%;
    height: 107px;
    border-radius: 12px;
    background: rgb(255, 255, 255);
    padding: 12px 16px;
    box-sizing: border-box;
    display: flex;

    .edit-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 8px;

      textarea {
        height: 56px;
        width: 100%;
        line-height: 24px;
        border: none;
        outline: none;
        resize: none;
        display: block;
        background-color: #fff;
        margin-bottom: 6px;
      }
    }

    .edit-handle-area {
      display: flex;
      justify-content: flex-end;
      font-size: 16px;

      .icon-check, .icon-close {
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(163, 180, 204);
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 15px;
        border-radius: 4px;

        &:hover {
          background-color: rgba(163, 180, 204, 0.2);
        }
      }

      .disabled-icon-click {
        cursor: not-allowed;
      }

      span {
        cursor: pointer;
        margin-right: 15px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    img {
      margin: 4px;
      height: 24px;
      width: 24px;
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
        .iconfont.icon-write1,
        .iconfont.icon-a-delete {
          color: #a3b4cc;
          font-size: 14px;
        }
        &:hover {
          .icon-write1,
          .icon-a-delete {
            background: linear-gradient(
              135deg,
              rgb(23, 242, 95) 0%,
              rgb(37, 106, 247) 100%
            );
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

.extra-info {
  min-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
