<template>
	<view>
		<view class="up-box" @click="onClick">
			<image class="up-img" v-if="url" :src="url" mode="aspectFit" @click="previewImg"></image>
			<view v-else class="iconfont icon-tianjia"></view>
			<view v-if="url" class="tools">
				<view class="iconfont icon-delete" @click.stop="handleDelete"></view>
				<view class="iconfont icon-camera" @click.stop="handleUpImg" ></view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps,computed } from 'vue';
	import { uploadImg } from '@/common/utils';
	
	const emits = defineEmits(['update:modelValue'])
	const props = defineProps<{
		modelValue: '';
	}>()
	
	const url = computed(() => {
		return props.modelValue
	})
	
	const handleUpImg = () => {
		uploadImg({
			success: value => {
				emits('update:modelValue', value);
			}
		});
	}
	const onClick = () => {
		if(!url.value) {
			handleUpImg();
		}
	}
	
	const previewImg = () => {
		uni.previewImage({
			urls: [url.value],
			showmenu: false
		})
	}
	
	const handleDelete = (e) => {
		emits('update:modelValue', '');
	}
</script>

<style lang="scss" scoped>
	.up-box {
		box-sizing: border-box;
		position: relative;
		width: 268rpx;
		height: 268rpx;
		border: solid 2rpx #E8E9EB;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		image.up-img {
			width: 268rpx;
			height: 268rpx;
		}
		.icon-tianjia {
			font-size: 40rpx;
			color: #CFDAEB;
		}
		.tools {
			padding: 0 8rpx;
			position: absolute;
			bottom: -1rpx;
		    right: -1rpx;
			border-radius: 8rpx 8rpx 20rpx 8rpx;
			background: #EDF0F5;
			display: flex;
			
			.iconfont {
				font-size: 32rpx;
				color: #C4C4C4;
				padding: 8rpx;
			}
		}
	}
</style>