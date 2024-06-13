<template>
  <div class="commit-item">
    <div class="avatar-area">
      <CommonAvatar :role="props.author" />
    </div>
    <div v-if="props.author === 'robot'" class="robot-commit">
      <div class="commit-content">
        <h5 v-if="data.title" :style="data.titleStyle" class="commit-title">{{
          data.title
        }}</h5>
        <div v-if="data.content" class="commit-content-text">
          {{ data.content }}
        </div>
        <div v-if="data.images && data.images.length" class="image-box">
          <!-- <img :src="data.image" alt="" /> -->
          <a-image
            :width="200"
            :height="200"
            fit="scale-down"
            :src="data.images[0]"
          />
        </div>
        <div v-if="props.slotName" class="custom-slot-box">
          <slot
            :name="props.slotName"
            :data="props.data"
            :disabled="props.disabled"
          />
        </div>
      </div>
      <div
        v-if="data.couldReload && !props.disabled"
        class="reload-button"
        @click="handleReload"
      >
        <img :src="Reload" alt="" />
        重新生成
      </div>
    </div>
    <div v-if="props.author === 'user'" class="user-commit">
      <div class="commit-content">
        <h5 v-if="data.title" :style="data.titleStyle" class="commit-title">{{
          data.title
        }}</h5>
        <div v-if="data.content" class="commit-content-text">
          {{ data.content }}
        </div>
        <div v-if="data.images && data.images.length" class="image-box">
          <!-- <img :src="data.image" alt="" /> -->
          <a-image
            :width="200"
            :height="200"
            fit="scale-down"
            :src="data.images[0]"
          />
        </div>
        <div v-if="props.slotName" class="custom-slot-box">
          <slot
            :name="props.slotName"
            :data="props.data"
            :disabled="props.disabled"
          />
        </div>
      </div>
      <div class="user-action">
        <a-tooltip
          v-for="(item, index) in userActionList"
          :key="index"
          :content="item.tooltip"
        >
          <div class="user-action-icon-item" @click.stop="item.action">
            <component :is="item.icon" />
          </div>
        </a-tooltip>
      </div>
      <ChooseFontModal
        v-model:visible="userMessageState.chooseFontModalVisible"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CommonAvatar from '@/components/common-avatar.vue';
import { reactive, ref, toRefs } from 'vue';
import Reload from '@/assets/images/reload.png';
import { IconCopy } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import ChooseFontModal from './choose-font-modal.vue';

interface DataItem {
  title?: string;
  content?: string;
  image?: string;
  [prop: string]: any;
}

export interface SessionItemProps {
  title?: string;
  content?: string;
  image?: string;
  data: DataItem;
  author: 'user' | 'robot';
  slotName?: string;
  preset?: 'template' | 'result' | 'style';
  disabled?: boolean;
  isLastStep?: boolean;
}
</script>

<script setup lang="ts">
const props = defineProps<SessionItemProps>();

const { data } = toRefs(props);

const emit = defineEmits(['reload']);

const userMessageState = reactive({
  chooseFontModalVisible: false,
  editContentModalVisible: false,
});

const copyText = () => {
  navigator.clipboard.writeText(props.data.content || '').then(() => {
    Message.success('复制成功');
  });
};

const userActionList = [
  {
    tooltip: '复制全文',
    icon: IconCopy,
    action: copyText,
  },
  {
    tooltip: '编辑文字',
    icon: IconCopy,
    action: () => {
      userMessageState.editContentModalVisible = true;
    },
  },
  {
    tooltip: '字体选择',
    icon: IconCopy,
    action: () => {
      userMessageState.chooseFontModalVisible = true;
    },
  },
];

const handleReload = () => {
  if (data.value.loading) {
    return;
  }
  emit('reload');
};
</script>

<style scoped lang="less">
.current-session-box {
  width: 100%;

  .commit-item {
    .avatar-area {
      min-width: 40px;
    }
    display: flex;
    width: 100%;
    margin-bottom: 32px;

    .commit-content {
      flex: 1;

      .image-box {
        width: 200px;
        height: 200px;
        overflow: hidden;
        box-sizing: border-box;
        // border: 1px solid rgb(232, 233, 235);
        border-radius: 12px;
        background-color: #fff;
        margin-top: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .robot-commit {
    flex: 1;
    margin-left: 16px;
    .commit-content {
      padding: 24px;

      border-radius: 12px;
      background: rgb(255, 255, 255);
      padding: 24px;

      .commit-title {
        color: rgb(52, 65, 86);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: left;
        margin: 0;
        margin-bottom: 8px;
      }

      .commit-content-text {
        color: rgb(52, 65, 86);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: left;
      }
    }
  }

  .user-commit {
    flex: 1;
    margin-left: 16px;
    display: flex;
    padding-top: 9px;

    .commit-content {
      color: rgb(52, 65, 86);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;

      flex: 1;
    }

    .user-action {
      height: 22px;
      display: flex;
      align-items: center;

      .user-action-icon-item {
        padding: 3px;
        font-size: 16.5px;
        cursor: pointer;
        margin-right: 11px;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
          background: rgba(163, 180, 204, 0.2);
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .commit-action {
    margin-top: 16px;
    display: flex;

    .action-button {
      margin-right: 16px;
      border: none;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
      padding: 3px 16px;
    }

    .logo-button {
      border-radius: 100px;
      color: rgb(255, 255, 255);
      background: linear-gradient(
        135deg,
        rgb(23, 242, 95) 0%,
        rgb(37, 106, 247) 100%
      );
    }

    .creative-button {
      border-radius: 100px;
      color: rgb(52, 65, 86);
      background: linear-gradient(
        135deg,
        rgb(23, 242, 95) 0%,
        rgb(37, 106, 247) 100%
      );
      span {
        opacity: 1;
        color: rgb(52, 65, 86);
      }
    }
  }

  .custom-slot-box {
    margin-top: 16px;
    display: flex;
    width: 100%;
  }

  .preset-template-commit-content {
    .commit-content {
      .template-title {
        color: rgb(37, 106, 247);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
      }

      .commit-action {
        .template-commit-action {
          width: 100%;
          display: flex;
          justify-content: space-around;
        }

        .template-image-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 24.5%;
          width: 200px;

          :deep(.arco-radio) {
            justify-content: center;
          }
          .img-area {
            height: 200px;
            border-radius: 12px;
            overflow: hidden;
            // margin-bottom: 16px;
            margin-bottom: 8px;
            .img-box {
              width: 100%;
              height: 100%;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .img-loading {
              color: rgb(107, 116, 143);
              font-family: PingFang SC;
              font-size: 14px;
              font-weight: 400;
              line-height: 22px;
              letter-spacing: 0px;
              text-align: left;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 12px;
              background: linear-gradient(
                135deg,
                rgba(23, 242, 95, 0.1) 0%,
                rgba(37, 106, 247, 0.1) 100%
              );
            }
          }
        }
      }
    }
  }

  .reload-button {
    margin-top: 8px;

    color: rgb(37, 106, 247);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    height: 22px;

    display: flex;
    align-items: center;

    cursor: pointer;

    img {
      width: 14px;
      height: 12px;
      margin-right: 3px;
    }
  }
}
</style>
