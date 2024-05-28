<template>
  <a-avatar :image-url="imgUrl" />
</template>

<script setup lang="ts">
import RobotPng from '@/assets/images/robot.png';
import { useUserStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{ role?: 'robot' | 'user' }>();

const imgUrl = computed(() => {
  return props.role === 'robot' ? RobotPng : useUserStore().avatar;
});
</script>
