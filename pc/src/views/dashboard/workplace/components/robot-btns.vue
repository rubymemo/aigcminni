<template>
  <div
    v-for="btn in options"
    :key="btn.label"
    :class="acticveBtns.includes(btn.value) && 'active-button'"
  >
    <template v-if="data.btns">
      <a-button
        :disabled="disabled"
        class="action-button"
        @click="handleBtnClick(btn)"
        >{{ btn.label }}</a-button
      >
      <UploadContent v-model:visible="uploadModalState.visible" />
    </template>
    <template v-else-if="data.imgRatioOptions">
      <a-button
        :disabled="disabled"
        class="action-ratio"
        @click="handleBtnClick(btn)"
      >
        <div class="ratio-icon" :style="computeCube(btn.value as string)" />
        {{ btn.label }}</a-button
      >
    </template>
    <template v-else> </template>
  </div>
</template>

<script setup lang="ts">
import { BtnItem, RobotMessage } from '@/interface';
import { computed, reactive, toRefs } from 'vue';
import UploadContent from './upload-content.vue';

interface Props {
  data: RobotMessage;
  disabled?: boolean;
  commitIndex: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['change', 'updateSessionType']);

const { data } = toRefs(props);

const options = computed(() => data.value.btns || data.value.imgRatioOptions);

const acticveBtns = computed(() => data.value.activeBtns || []);

const uploadModalState = reactive({
  visible: false,
});

const computeCube = (ratioStr: string) => {
  const wRatio = Number(ratioStr.split(':')[0]);
  const hRatio = Number(ratioStr.split(':')[1]);
  const maxLen = 16;
  if (wRatio > hRatio) {
    return {
      height: `${maxLen}px`,
      width: `${(hRatio / wRatio) * maxLen}px`,
    };
  }
  return {
    height: `${(wRatio / hRatio) * maxLen}px`,
    width: `${maxLen}px`,
  };
};

const handleBtnClick = (item: BtnItem) => {
  if (item.opertionType === 'chooseMedia') {
    uploadModalState.visible = true;
    return;
  }
  data.value.activeBtns = [item.value];
  if (props.commitIndex === 0) {
    emit('updateSessionType', item);
  }
  emit('change', item);
};
</script>

<style scoped lang="less">
.action-button {
  color: rgb(52, 65, 86);
  border: none;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  padding: 3px 16px;
  border-radius: 100px;
  background: linear-gradient(
    135deg,
    rgba(23, 242, 95, 0.2) 0%,
    rgba(37, 106, 247, 0.2) 100%
  );
  margin-right: 16px;

  &:hover {
    color: white !important;
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    ) !important;
    .iconfont.icon-plus {
      color: white !important;
    }
  }

  img {
    width: 12px;
    height: 12px;
    margin-top: 5px;
  }

  &::v-deep {
    .arco-btn-icon {
      margin-right: 6px !important;
    }
  }

  &.arco-btn-secondary,
  &.arco-btn-secondary.arco-btn-disabled,
  &.arco-btn-secondary[type='button'].arco-btn-disabled {
    color: unset;
    background-color: unset;
    border: unset;
  }
}

.active-button .action-button {
  color: rgb(255, 255, 255);
  background: linear-gradient(
    135deg,
    rgb(23, 242, 95) 0%,
    rgb(37, 106, 247) 100%
  );
}

.action-ratio {
  box-sizing: border-box;
  /* 辅助色/描边色 */
  border: 1px solid rgb(207, 218, 235);
  border-radius: 6px;

  background: rgb(255, 255, 255);

  margin-right: 16px;

  .ratio-icon {
    border-radius: 2px;
    background: rgb(207, 218, 235);
    margin-right: 9px;
  }

  &.arco-btn-secondary.arco-btn-disabled,
  &.arco-btn-secondary[type='button'].arco-btn-disabled {
    border: 1px solid rgb(207, 218, 235);
    background: rgb(255, 255, 255);
  }

  &:hover {
    background: rgb(255, 255, 255);
    border-color: rgb(37, 106, 247);
    color: rgb(37, 106, 247);

    &.arco-btn-secondary.arco-btn-disabled,
    &.arco-btn-secondary[type='button'].arco-btn-disabled {
      border: 1px solid rgb(207, 218, 235);
      background: rgb(255, 255, 255);
      color: unset;
      .ratio-icon {
        background: rgb(207, 218, 235);
      }
    }

    .ratio-icon {
      background: rgb(37, 106, 247);
    }
  }
}

.active-button {
  .action-ratio {
    background: rgb(255, 255, 255);
    border-color: rgb(37, 106, 247);
    color: rgb(37, 106, 247);

    &.arco-btn-secondary.arco-btn-disabled,
    &.arco-btn-secondary[type='button'].arco-btn-disabled {
      background: rgb(255, 255, 255);
      border-color: rgb(37, 106, 247);
      color: rgb(37, 106, 247);
    }

    .ratio-icon {
      background: rgb(37, 106, 247);
    }
  }
}
</style>
