<template>
	<view>
	<uni-popup ref="popup">
		<view class="popup-content">
			<view class="close" @click="closeModal">
				<text class="iconfont icon-close"></text>
			</view>
			<view class="popup-title">上传信息</view>
			
			<view class="h1-title">品牌信息</view>
			<view class="desc">支持png、jpg格式最大不超过2M</view>
			<view class="uplist-box">
				<view class="up-box">
					<g-upload v-model="imgData.logo"></g-upload>
					<view class="img-info">品牌信息<text class="img-tips">(LOGO)</text></view>
				</view>
				<view class="up-box">
					<g-upload v-model="imgData.QRCode"></g-upload>
					<view class="img-info">品牌信息<text class="img-tips">(二维码)</text></view>
				</view>
			</view>
			<view class="h1-title">商品信息</view>
			<view class="desc">支持png、jpg格式最大不超过2M</view>
			<view class="uplist-box">
				<view class="up-box">
					<g-upload v-model="imgData.topicMap"></g-upload>
					<view class="img-info">添加主体图<text class="img-tips">(仅添加单个主体图，例：商品)</text></view>
				</view>
			</view>
			
			<button class="primary confirm-btn" @click="clickOk">确定</button>
		</view>
	</uni-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineExpose, reactive, defineEmits } from 'vue';

	const popup = ref(false);
	const emits = defineEmits(['ok']);
	
	const imgData = reactive({
		logo: '',
		QRCode: '',
		topicMap: '',
	})

	const closeModal = () => {
		popup.value.close();
	}
	const openModal = () => {
		popup.value.open()
	}

	const clickOk = () => {
		closeModal();
		emits('ok', imgData);
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
		margin-bottom: 32rpx;
	}

	.confirm-btn {
		height: 88rpx;
		line-height: 88rpx;
		margin-top: 32rpx;
	}

	.h1-title {
		color: $font-primary-color2;
		font-size: 32rpx;
		line-height: 48rpx;
		margin-bottom: 4rpx;
	}
	.desc {
		line-height: 40rpx;
		font-size: 24rpx;
		color: #6B748F;
		font-weight: 400;
		margin-bottom: 32rpx;
	}

	.uplist-box {
		display: flex;
		justify-content: space-between;
		margin-bottom: 32rpx;
		.up-box {
			.img-info {
				margin-top: 16rpx;
				text-align: center;
				font-size: 24rpx;
				line-height: 44rpx;
				text {
					color: #6B748F;
				}
			}
		}
	}
</style>