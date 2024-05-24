<template>
	<view 
		:class="`g-color-btn-box ${props.active ? 'active' : ''}`" :style="{
		height: props.height + 'rpx',
		background: props.active ? 'linear-gradient(135.00deg, rgb(23, 242, 95),rgb(37, 106, 247) 100%)' : '#CFDAEB'
		}" 		@click="onClick">
		<view class="g-color-btn" 
		:style="{
		height: props.height - 4 + 'rpx',
		lineHeight: props.height - 4 + 'rpx',
		width: props.width ? props.width + 'rpx' : 'auto',
		color: props.active ? '#344156' : '#6B748F'
	}">
			<slot/>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	const emits = defineEmits(['click'])
	const props = defineProps<{
		height: number;
		width?: number;
		active: boolean;
	}>()
	const onClick = () => {
		emits('click')
	}
</script>

<style lang="scss" scoped>
	.g-color-btn-box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 2rpx;
		border-radius: 200rpx;
		.g-color-btn {
			background: white;
			border-radius: 200rpx;
			padding: 0 24rpx;
			text-align: center;
			font-size: 26rpx;
			font-weight: 400;
		}
	}
</style>