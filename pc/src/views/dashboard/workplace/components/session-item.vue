<template>
  <div
    :class="[
      'commit-item',
      author === 'robot' ? 'robot-commit' : 'user-commit',
    ]"
  >
    <a-avatar :image-url="author === 'robot' ? '' : avatar" />
    <div v-if="props.preset" class="preset-commit-content">
      <div
        v-if="props.preset === 'template'"
        class="preset-template-commit-content"
      >
        <div class="commit-content">
          <h5 class="commit-title template-title">Hi~ 创意想法已完成</h5>
          <div class="commit-content-text">
            根据您提供的信息，以下是我针对图片的设计
            点击图片可查看大图，点击下方选择框选定图形，进入最终效果图生成。
          </div>
          <div v-if="props.data" class="commit-action">
            <a-radio-group v-model="choseItem" class="template-commit-action">
              <div v-for="item in 4" :key="item" class="template-image-item">
                <div class="img-area">
                  <div
                    v-if="props.data.imgUrls"
                    class="img-box"
                    @click="handleChoseImg(item)"
                  >
                    <img :src="props.data.imgUrls[item - 1]" alt="" />
                  </div>
                  <div v-else class="img-loading">
                    图片加载中{{ props.data.progress * 100 }}%
                  </div>
                </div>
                <a-radio
                  :disabled="props.data.loading || props.disabled"
                  :value="item"
                />
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>
      <div
        v-if="props.preset === 'style'"
        class="preset-template-commit-content"
      >
        <div class="commit-content">
          <div class="commit-content-text">
            请选择一款您喜欢的模板开始生成效果图
          </div>
          <div v-if="props.data" class="commit-action">
            <a-radio-group v-model="choseItem" class="template-commit-action">
              <div v-for="item in 4" :key="item" class="template-image-item">
                <div class="img-area">
                  <div
                    v-if="props.data.imgUrls"
                    class="img-box"
                    @click="handleChoseImg(item)"
                  >
                    <img :src="props.data.imgUrls[item - 1]" alt="" />
                  </div>
                  <div v-else class="img-loading">
                    图片加载中{{ props.data.progress * 100 }}%
                    <a-progress :percent="props.data.progress" />
                  </div>
                </div>
                <a-radio
                  :disabled="props.data.loading || props.disabled"
                  :value="item"
                />
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>
      <div
        v-if="props.preset === 'result'"
        class="preset-template-commit-content"
      >
        <div class="commit-content">
          <h5 class="commit-title template-title">Hi~ 最终效果图已完成</h5>
          <div v-if="props.data" class="commit-action">
            <a-radio-group v-model="choseItem" class="template-commit-action">
              <div v-for="item in 4" :key="item" class="template-image-item">
                <div class="img-area">
                  <div
                    v-if="props.data.imgUrls"
                    class="img-box"
                    @click="handleChoseImg(item)"
                  >
                    <img :src="props.data.imgUrls[item - 1]" alt="" />
                  </div>
                  <div v-else class="img-loading">
                    图片加载中{{ props.data.progress * 100 }}%
                  </div>
                </div>
                <a-radio
                  :disabled="props.data.loading || props.disabled"
                  :value="item"
                />
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="normal-commit-content">
      <div class="commit-content">
        <h5 v-if="props.title" class="commit-title">{{ props.title }}</h5>
        <div v-if="props.content" class="commit-content-text">
          {{ props.content }}
        </div>
        <div v-if="props.image" class="image-box">
          <img :src="props.image" alt="" />
        </div>
        <div v-if="$slots.action" class="commit-action">
          <slot name="action" />
        </div>
        <div v-if="props.slotName" class="custom-slot-box">
          <slot :name="props.slotName" :data="props" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import avatar from '@/assets/images/avatar.png';
import { ref } from 'vue';

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
  data?: DataItem;
  author: 'user' | 'robot';
  slotName?: string;
  preset?: 'template' | 'result' | 'style';
  disabled?: boolean;
}
</script>

<script setup lang="ts">
const props = defineProps<SessionItemProps>();

const emit = defineEmits(['chooseImg']);

const choseItem = ref('');

const handleChoseImg = (index: number) => {
  choseItem.value = index;
  emit('chooseImg', props.data.imgUrls[index]);
};
</script>

<style scoped lang="less">
.current-session-box {
  width: 100%;

  .commit-item {
    display: flex;
    width: 100%;
    margin-bottom: 32px;

    .commit-content {
      flex: 1;
      margin-left: 16px;

      .image-box {
        width: 120px;
        height: 120px;
        overflow: hidden;
        border-radius: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .robot-commit {
    .commit-content {
      padding: 24px;

      margin-left: 16px;
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
    .commit-content {
      padding-top: 9px;
      color: rgb(52, 65, 86);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
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

          :deep(.arco-radio) {
            justify-content: center;
          }
          .img-area {
            width: 200px;
            height: 200px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 16px;

            .img-box {
              width: 100%;
              height: 100%;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .img-loading {
              color: #fff;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 12px;
              background: linear-gradient(
                135deg,
                rgb(23, 242, 95) 0%,
                rgb(37, 106, 247) 100%
              );
            }
          }
        }
      }
    }
  }
}
</style>
