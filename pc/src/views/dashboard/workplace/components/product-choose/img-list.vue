<template>
  <div
    v-for="imgItem in data.imagesOptions"
    :key="imgItem.code"
    class="template-image-item"
  >
    <div class="img-area">
      <div
        v-if="imgItem.url"
        class="img-box"
        @click="!disabled && handleChoseTemplateImg(data, imgItem.code)"
      >
        <a-image
          :preview="imagesType === 'result'"
          :width="200"
          :height="200"
          fit="scale-down"
          :src="imgItem.url"
        />
      </div>
      <div v-else class="img-loading">
        <p>图片加载中{{ imgItem.precent }}%</p>
        <GProgress :progress="imgItem.precent" />
      </div>
    </div>
    <a-radio
      v-if="imagesType === 'radio'"
      :disabled="disabled"
      :value="imgItem.code"
    >
      <template #radio v-if="chosenTemplateItem === imgItem.code">
        <span class="iconfont icon-success checked-icon" />
      </template>
      <template #radio v-else>
        <span class="radio-no-checked" />
      </template>
    </a-radio>
  </div>
  <CommonModal title="作品选择" ok-btn-text="选择该图" :width="626">
    <div class="container">
      <p
        >如果该图片是您喜欢的风格，请点击选择该图；您可以通过左右滑动进行查看，如果该组中没有您想要的图片，请点击取消后在主页选择重新生成</p
      >

      <div class="img-banner">
        <div>
          <span class="iconfont icon-a-zuhe7974" />
        </div>
        <a-carousel>
          <a-carousel-item
            v-for="(item, index) in data.imagesOptions"
            :key="index"
          >
            <a-image :src="item.url" :preview="false" />
          </a-carousel-item>
        </a-carousel>
        <div>
          <span class="iconfont icon-a-zuhe7974" />
        </div>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import { ImgOption, RobotMessage } from '@/interface';
import { toRefs } from 'vue';

interface Props {
  data: {
    imagesOptions: Array<ImgOption>;
    progress: number;
  };
  disabled?: boolean;
  imagesType: RobotMessage['imagesType'];
}

const props = defineProps<Props>();

const { data, disabled } = toRefs(props);

const handleChoseTemplateImg = (data: any, code: any) => {
  // console.log(data, code);
  // chosenTemplateItem.value = code;
  // const { url } = data.imagesOptions.find((item: any) => item.code === code);
  // data.activeImages = [url];
  // addCommit({
  //   author: 'user',
  //   data: {
  //     images: [url],
  //     content: '我已经选定了',
  //   },
  // });
  // emit('lastStep', code);
  // lastStep.value = true;
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
  }
}
</style>
