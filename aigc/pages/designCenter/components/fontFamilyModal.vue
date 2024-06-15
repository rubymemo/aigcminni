<template>
	<uni-popup ref="popup">
		<view class="popup-content">
			<view class="close" @click="closeModal">
				<text class="iconfont icon-close"></text>
			</view>
			<view class="popup-title">字体选择</view>
			<view class="options-box">
				<view class="option-item" v-for="(item, index) in familyList" :key="index" @click="selectFamily(item)">
					<view :class="`cube-box ${activeFamily === item.value ? 'active' : ''}`">
						<view class="cube-content">
							<image :src="item.src"></image>
						</view>
					</view>
					<view class="cube-text">
						{{ item.label }}
					</view>
				</view>
			</view>
			<button class="primary confirm-btn" @click="clickOk">确定</button>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
	import { ref, defineExpose, defineEmits } from 'vue';
	
	type OptionItem = {
		label: string; value: string
	}
	const popup = ref(false);
	const emits = defineEmits(['ok'])
	
	const familyList = [
		{ label: '阿里巴巴普惠体', value: '阿里巴巴普惠体', src: '../../../static/png/font-family1.png' },
		{ label: '优设标题黑', value: '优设标题黑', src: '../../../static/png/font-family2.png' },
	]
	const activeFamily = ref<string | number | null>(null);
	
	const closeModal = () => {
		popup.value.close();
	}
	const openModal = (data: { defaultFamily: string }) => {
		activeFamily.value = data.defaultFamily || null;
		popup.value.open()
	}
	
	const selectFamily = (item: OptionItem) => {
		activeFamily.value = item.value;
	}
	
	const clickOk = () => {
		emits('ok', activeFamily.value)
		closeModal();
	}
	
	defineExpose({
		openModal,
	})
</script>

<style lang="scss" scoped>
	.close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
		.iconfont {
			font-size: 40rpx;
		}
	}
	.popup-content {
		width: 668rpx;
		box-sizing: border-box;
		padding: 56rpx 48rpx;
		border-radius: 32rpx;
		background: #fff;
		// margin: 0 -22rpx;
	}
	.popup-title {
		color: rgb(52, 65, 86);
		font-size: 36rpx;
		line-height: 48rpx;
		text-align: center;
		margin-bottom: 56rpx;
	}
	.options-box {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		
	}
	.option-item {
		// margin: 0 22rpx 56rpx;
		width: 270rpx;
		margin-bottom: 56rpx;
	}
	.cube-box {
		height: 140rpx;
		padding: 2rpx;
		background: rgb(232, 233, 235);
		border-radius: 16rpx;
		&.active {
			background: linear-gradient(135deg, rgba(23, 242, 95) 0%, rgba(37, 106, 247) 100%);
		}
		.cube-content {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			background-color: white;
			border-radius: 16rpx;
			image {
				width: 244rpx;
				height: 72rpx;
			}
		}
		
	}
	.cube-text {
		margin-top: 16rpx;
		text-align: center;
		font-size: 28rpx;
		color: #6B748F;
	}
	.confirm-btn {
		height: 88rpx; 
		line-height: 88rpx;
	}
</style>