<template>
	<view :class="`membership-tag ${ type !== membershipTypeMap.personal.value ? 'yellow' : ''}`">
		<text v-show="type !== membershipTypeMap.personal.value" class="iconfont icon-vip"></text>
		{{ membershipValueMap[type].label }}
	</view>
</template>

<script lang="ts" setup>
	import { defineProps, computed } from 'vue';
	import { membershipTypeMap, membershipValueMap } from '@/common/constants.ts';
	
	const props = defineProps<{
		type: string | number
	}>();
	
	const type = computed(() => props.type);
	
	
</script>

<style lang="scss" scoped>
	.membership-tag {
		display: inline-flex;
		align-items: center;
		font-size: 24rpx;
		font-weight: 400;
		line-height: 40rpx;
		padding: 4rpx 16rpx;
		background: #ffffff4d;
		border-radius: 100rpx;
		color: #344156;
		
		.iconfont {
			font-size: 32rpx;
			background-image: $bg-color-1;
			background-clip: text;
			-webkit-background-clip: text;
			color: transparent;
			margin-right: 6rpx;
		}
		
		&.yellow {
			color: #6F4B19;;
		}
		
	}
</style>