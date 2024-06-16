<template>
  <div
    v-for="btn in data.btns"
    :key="btn.label"
    :class="acticveBtns.includes(btn.value) && 'active-button'"
  >
    <template v-if="btn.opertionType !== 'chooseMedia'">
      <a-button
        :disabled="disabled"
        class="action-button"
        @click="handleBtnClick(btn)"
        >{{ btn.label }}</a-button
      >
    </template>
    <template v-else> </template>
  </div>
</template>

<script setup lang="ts">
import { BtnItem, RobotMessage } from '@/interface';
import { computed, toRefs } from 'vue';

interface Props {
  data: RobotMessage;
  disabled?: boolean;
  commitIndex: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['change', 'updateSessionType']);

const { data } = toRefs(props);

const acticveBtns = computed(() => data.value.activeBtns || []);

const handleBtnClick = (item: BtnItem) => {
  data.value.activeBtns = [item.value];
  if (props.commitIndex === 0) {
    emit('updateSessionType', item.value);
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
}

.active-button .action-button {
  color: rgb(255, 255, 255);
  background: linear-gradient(
    135deg,
    rgb(23, 242, 95) 0%,
    rgb(37, 106, 247) 100%
  );
}
</style>
