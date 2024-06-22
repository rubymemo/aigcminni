<template>
  <CommonModal
    v-model:visible="visible"
    title="字体选择"
    :width="400"
    @ok="handleOk"
  >
    <div class="container">
      <div v-for="item in fontList" :key="item.name" class="font-item">
        <div
          class="font-item-preview-area"
          :class="activeFont === item.value && 'active-font'"
          @click="chooseFont(item)"
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
import { Message } from '@arco-design/web-vue';
import { computed, ref, toRefs, watch } from 'vue';
import CommonModal from '@/components/common-modal.vue';

const props = defineProps<{
  data: any;
  visible: boolean;
}>();

const emit = defineEmits(['update:visible']);

const { data } = toRefs(props);

const activeFont = ref('');

const chooseFont = (font: any) => {
  activeFont.value = font.value;
};

const fontList = [
  {
    name: '阿里巴巴普惠体',
    value: 'Alibaba-PuHuiTi-Heavy.ttf',
    img: alipuhuiImg,
  },
  {
    name: '优设标题黑',
    value: 'YouSheBiaoTiHei.ttf',
    img: youshebiaotiImg,
  },
];

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

watch(
  () => props.visible,
  (vis) => {
    if (vis) {
      const key = Object.keys(data.value.interfaceParams)[0];
      activeFont.value = data.value.interfaceParams[key].fontfamily;
      // text.value = props.data.content;
    }
  },
);

const handleOk = () => {
  if (!activeFont.value) {
    Message.warning('请选择字体');
    return;
  }
  const key = Object.keys(data.value.interfaceParams)[0];
  data.value.interfaceParams[key].fontfamily = activeFont.value;
  // data.value.content = text.value;
  visible.value = false;
};
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
