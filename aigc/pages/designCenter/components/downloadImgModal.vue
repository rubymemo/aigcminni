<template>
	<view>
	<uni-popup ref="popup">
		<view class="popup-content">
			<view class="close" @click="closeModal">
				<text class="iconfont icon-close"></text>
			</view>
			<view class="popup-title">作品下载</view>
			<view class="image-box">
				<image :src="imageUrl" mode="aspectFit"></image>
			</view>
			<view class="radio-title">保存格式选择</view>
			<view class="radio-group" :style="{
				height: screenHeight < 800 ? '200rpx' : 'auto'
			}">
				<radio-group @change="onRadioSelect">
					<view class="radio-item" v-for="(item, index) in list" :key="index" @click="handleSelectRadio(item.value)">
						<view class="radio-btn-box">
							<button
								:class="`${item.value === radioValue ? 'primary' : 'gray-btn'} radio-item-button`">{{ item.label}}</button>
							<radio class="radio" :value="item.value" color="#256AF7"
								:checked="item.value === radioValue" />
						</view>
						<view class="desc">{{ item.desc }}</view>
					</view>
				</radio-group>
			</view>
			<button class="primary confirm-btn" @click="clickDownLoad">确认下载</button>
		</view>
	</uni-popup>
	<downloadImgResultModal ref="DownloadImgResultModalRef"></downloadImgResultModal>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineExpose, onMounted } from 'vue';
	import { ImgOption } from '@/common/mockData.ts';
	import downloadImgResultModal from './downloadImgResultModal.vue';

	const popup = ref(false);
	const DownloadImgResultModalRef = ref();

	const list = [
		{ label: 'JPEG', desc: '体积较小的图片，不支持透明背景', value: 'jpeg' },
		{ label: 'PNG', desc: '无损图片画质更优，体积较大，支持透明背景', value: 'png' },
		{ label: 'SVG', desc: '普遍应用标准图片，体积较小，易于修改和编辑', value: 'svg' },
	]
	const radioValue = ref('');
	const imageUrl = ref('');

	const sysInfo = uni.getSystemInfoSync();
	const screenHeight = sysInfo.screenHeight;

	const closeModal = () => {
		popup.value.close();
	}
	const openModal = (data: {
		imageOptions: ImgOption[],
		imgIndex: number
	}) => {
		imageUrl.value = data.imageOptions[data.imgIndex].url;
		popup.value.open()
	}

	const handleSelectRadio = (value : string) => {
		radioValue.value = value;
	}
	const onRadioSelect = (evt) => {
		radioValue.value = evt.detail.value;
	}

	const clickDownLoad = () => {
		console.log('下载')
		DownloadImgResultModalRef.value && DownloadImgResultModalRef.value.openModal({ type: "png" });
		// uni.downloadFile({
		// 	url: 'https://cdn.wwads.cn/creatives/YI1kTCUXJYqB9fIaOHz5qNw9pO5Fsgtq1PivY0Ea.jpg',
		// 	success: (res) => {
		// 		if (res.statusCode === 200) {
		// 			uni.saveImageToPhotosAlbum({
		// 				filePath: res.tempFilePath,
		// 				success: function () {
		// 					closeModal();
		// 					DownloadImgResultModalRef.value && DownloadImgResultModalRef.value.openModal({ type: "svg" });
		// 				},
		// 				fail: function () {
		// 					uni.showToast({
		// 						title: "保存失败，请稍后重试",
		// 						icon: "none"
		// 					});
		// 				}
		// 			});
		// 		}
		// 	}
		// })
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

	.image-box {
		width: 100%;
		height: 400rpx;
		border-radius: 24rpx;
		background-image: url('../../../static/png/image-bg.png');
		background-size: 100%;
		margin-bottom: 56rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.confirm-btn {
		height: 88rpx;
		line-height: 88rpx;
	}

	.radio-title {
		color: $font-primary-color2;
		font-size: 32rpx;
		line-height: 48rpx;
		margin-bottom: 24rpx;
	}

	.radio-group {
		overflow: scroll;
		margin-bottom: 54rpx;
	}

	.radio-item {
		&:not(:last-child) {
			margin-bottom: 24rpx;
		}

		.radio-btn-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		button.radio-item-button {
			width: 126rpx;
			height: 52rpx;
			font-size: 24rpx;
			line-height: 52rpx;
			margin: 0;
		}

		button.gray-btn {
			background: rgba(207, 218, 235, 0.4);
			color: #6B748F;
			border-radius: 40rpx;
		}

		.radio {
			transform: scale(0.6);
		}

		.desc {
			font-size: 24rpx;
			font-weight: 400;
			color: #6B748F;
			margin: 16rpx 0 0;
		}
	}
</style>