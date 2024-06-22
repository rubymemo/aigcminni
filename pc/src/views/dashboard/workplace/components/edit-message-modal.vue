<template>
  <CommonModal
    v-model:visible="visible"
    title="修改全文"
    ok-text="确认修改"
    @ok="handleOk"
  >
    <textarea v-model="text" />
  </CommonModal>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';

interface Props {
  data: any;
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible']);

const { data } = toRefs(props);

const text = ref('');

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

watch(
  () => props.visible,
  (vis) => {
    if (vis) {
      text.value = props.data.content;
    }
  },
);

const handleOk = () => {
  data.value.content = text.value;
  const key = Object.keys(data.value.interfaceParams)[0];
  data.value.interfaceParams[key].text = text.value;
  visible.value = false;
};
</script>

<style scoped lang="less">
textarea {
  height: 100%;
  width: 100%;
  flex: 1;
  margin-right: 8px;
  border: none;
  outline: none;
  resize: none;
  box-sizing: border-box;
  border: 1px solid rgb(232, 233, 235);
  border-radius: 8px;
  background: rgb(255, 255, 255);
  height: 80px;
  padding: 12px;

  &:disabled {
    background: transparent;
    cursor: not-allowed;
  }
  &::placeholder {
    color: rgb(163, 180, 204);
    font-family: 思源黑体 CN;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
  }
}
</style>
