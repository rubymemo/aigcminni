<template>
	<view class="g-progress">
		<view class="g-progress-inner" :style="{
			width: props.progress + '%'
		}"></view>
	</view>
</template>

<script setup lang="ts">
	import {computed, defineProps} from 'vue';
	const props = defineProps<{
		progress: number
	}>()
	
</script>

<style lang="scss" scoped>
	.g-progress {
		height: 12rpx;
		width: 100%;
		background-color: #F7F9FA;
		border-radius: 200rpx;
	}
	.g-progress-inner{
		background: linear-gradient(135.00deg, rgb(23, 242, 95) 0%,rgb(37, 106, 247) 100%);;
		border-radius: 200rpx;
		height: 12rpx;
		transition: all .3s cubic-bezier(.08,.82,.17,1) 0s;
	}
</style>