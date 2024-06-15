<template>
  <div>
    <a-button
      v-for="btn in data.btns"
      :key="btn.label"
      :disabled="disabled"
      class="action-button"
      :class="acticveBtns.includes(btn.label) && 'active-button'"
      >{{ btn.label }}</a-button
    >
  </div>
</template>

<script setup lang="ts">
import { RobotMessage } from '@/interface';
import { computed, toRefs } from 'vue';

interface Props {
  data: RobotMessage;
  disabled?: boolean;
}

const props = defineProps<Props>();

const { data } = toRefs(props);

const acticveBtns = computed(() => data.value.activeBtns || []);
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
  &.active-button {
    color: rgb(255, 255, 255);
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    );
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
}
</style>
