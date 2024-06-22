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
  emit('change', item);
};
</script>

<style scoped lang="less">
</style>
