<template>
  <div
    v-for="(imgItem, index) in data.imagesOptions"
    :key="index"
    class="template-image-item"
  >
    <div class="img-area">
      <div v-if="data.loading" class="img-loading">
        <p>图片加载中{{ data.progress }}%</p>
        <GProgress :progress="data.progress" />
      </div>
      <div v-else-if="imgItem.url" class="img-box">
        <a-image
          class="img-item"
          :preview="disabled && imagesType !== 'result'"
          :width="200"
          :height="150"
          fit="scale-down"
          :src="imgItem.url"
          @click="clickImg(imgItem, index)"
        />
      </div>
    </div>
    <a-radio
      v-if="imagesType === 'radio'"
      :disabled="disabled"
      :value="imgItem.url"
    >
      <template #radio="{ checked }">
        <span v-if="checked" class="iconfont icon-success checked-icon" />
        <span v-else class="radio-no-checked" />
      </template>
    </a-radio>
  </div>
  <ImgDownload
    v-model:visible="modalState.downloadModalVisible"
    :url="modalState.url"
  />
  <CommonModal
    v-model:visible="modalState.visible"
    title="作品选择"
    ok-btn-text="选择该图"
    :width="626"
    @ok="handleChoseTemplateImg"
  >
    <div class="container">
      <p
        >如果该图片是您喜欢的风格，请点击选择该图；您可以通过左右滑动进行查看，如果该组中没有您想要的图片，请点击取消后在主页选择重新生成</p
      >

      <div class="img-banner">
        <div @click.stop="changeIndex($event)">
          <span class="iconfont icon-a-zuhe7974 left-btn" />
        </div>
        <a-carousel
          v-model:current="modalState.index"
          class="img-play"
          :style="{ width: '426px', height: '258px' }"
        >
          <a-carousel-item
            v-for="(item, index) in data.imagesOptions"
            :key="index"
          >
            <a-image
              width="426"
              height="258"
              :src="item.url"
              fit="scale-down"
              :preview="false"
            />
          </a-carousel-item>
        </a-carousel>
        <div @click.stop="changeIndex($event, false)">
          <span class="iconfont icon-a-zuhe7960 right-btn" />
        </div>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import { ImgOption, RobotMessage } from '@/interface';
import { reactive, toRefs } from 'vue';
import GProgress from '@/views/dashboard/workplace/components/g-progress.vue';
import ImgDownload from './img-download.vue';

interface Props {
  data: {
    imagesOptions: Array<ImgOption>;
    progress: number;
    [prop: string]: any;
  };
  disabled?: boolean;
  imagesType: RobotMessage['imagesType'];
}

const props = defineProps<Props>();
const emits = defineEmits(['choose']);

const { data, disabled } = toRefs(props);

const modalState = reactive({
  index: 0,
  visible: false,
  url: '',
  downloadModalVisible: false,
});

const clickImg = (option: ImgOption, index: number) => {
  if (props.disabled) {
    return;
  }
  if (props.imagesType === 'result') {
    modalState.url = option.url;
    modalState.downloadModalVisible = true;

    return;
  }
  modalState.index = index + 1;
  modalState.visible = true;
};

const changeIndex = (e: any, left = true) => {
  e.preventDefault();
  if (left) {
    if (modalState.index === 1) {
      modalState.index = 4;
      return;
    }
    modalState.index -= 1;
  } else {
    if (modalState.index === 4) {
      modalState.index = 1;
      return;
    }
    modalState.index += 1;
  }
};

const handleChoseTemplateImg = () => {
  const imgBtn = data.value.imagesOptions[modalState.index - 1];
  emits('choose', imgBtn);
  modalState.visible = false;
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
    color: rgb(107, 116, 143);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
  }

  .img-banner {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 26px;

    .left-btn,
    .right-btn {
      font-size: 24px;
      cursor: pointer;
    }
  }
}

.template-commit-action {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  :deep(.arco-radio) {
    margin-right: 0;
  }
}

.template-image-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  margin: 0 24px 16px 0;

  &:last-child {
    margin-right: 0;
  }

  .radio-no-checked {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 1px solid rgb(163, 180, 204);
    background: rgb(255, 255, 255);
    border-radius: 50%;
  }
  .checked-icon {
    color: rgb(37, 106, 247);
    height: 16px;
  }

  :deep(.arco-radio) {
    justify-content: center;
  }
  .img-area {
    height: 150px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;
    // margin-bottom: 16px;

    .img-box {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .img-item {
        cursor: pointer;
      }
    }

    .img-loading {
      padding: 24px;
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

      p {
        margin: 0;
        margin-bottom: 8px;
      }
    }
  }
}

.img-play {
  :deep {
    .arco-carousel-indicator-wrapper,
    .arco-carousel-arrow {
      display: none;
    }
  }
}
</style>
