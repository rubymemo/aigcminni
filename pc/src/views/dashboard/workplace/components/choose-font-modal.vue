<template>
  <CommonModal title="字体选择" :width="400">
    <div class="container">
      <div v-for="item in fontList" :key="item.name" class="font-item">
        <div
          class="font-item-preview-area"
          :class="activeFont === item.name && 'active-font'"
          @click="chooseFont(item.name)"
        >
          <div class="inner-area">
            <img :src="item.img" :alt="item.name" />
          </div>
        </div>
        <span class="font-name">{{ item.name }}</span>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import alipuhuiImg from '@/assets/images/ali-puhui.png';
import youshebiaotiImg from '@/assets/images/youshebiaotihei.png';
import { ref } from 'vue';

const props = defineProps<{
  font: string;
}>();

const activeFont = ref('');

const chooseFont = (fontName: string) => {
  activeFont.value = fontName;
};

const fontList = [
  {
    name: '阿里巴巴普惠体',
    img: alipuhuiImg,
  },
  {
    name: '优设标题黑',
    img: youshebiaotiImg,
  },
];
</script>

<style scoped lang="less">
.container {
  display: flex;
  justify-content: space-between;
  .font-item {
    width: 46.6%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .font-item-preview-area {
      position: relative;
      padding: 1px;
      box-sizing: border-box;
      width: 100%;
      height: 70px;
      cursor: pointer;

      &::before {
        content: '';
        display: block;

        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 9998;
        background: rgb(237, 241, 246);
        border-radius: 8px;
      }

      .inner-area {
        position: relative;
        z-index: 9999;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 8px;
        img {
          height: 17px;
        }
      }
    }

    .active-font::before {
      background: linear-gradient(
        135deg,
        rgb(23, 242, 95),
        rgb(37, 106, 247) 100%
      );
    }

    .font-name {
      margin-top: 8px;
      color: rgb(107, 116, 143);
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
