<template>
	<uni-popup ref="popup">
		<view class="popup-content">
			<view class="close" @click="closeModal">
				<text class="iconfont icon-close"></text>
			</view>
			<view class="popup-title">作品选择</view>
			
			<view class="banner">
				<view class="left-arrow" @click="changeCurrent('prev')">
					<view class="iconfont icon-arrow"></view>
				</view>
				<view class="banner-box">
					<swiper class="swiper-box" :current="current" :indicator-dots="false" :circular="true">
						<swiper-item v-for="(item ,index) in swiperInfo" :key="index">
							<view class="swiper-item">
								<image :src="item.url" mode="aspectFit" @click="previewImg(index)"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="right-arrow" @click="changeCurrent('next')">
					<view class="iconfont icon-arrow"></view>
				</view>
			</view>
			
			<view class="desc">
				<text>
				如果该图片是您喜欢的风格，请点击选择该图。您可以通过左右滑动进行查看，如果该组中没
				有您想要的图片，请点击取消后在主页选择重新生成
				</text>
			</view>
			<view class="button-box">
				<button class="normal-1" @click="closeModal">取消</button>
				<button class="primary confirm-btn" @click="onOk">选择当前内容</button>
			</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
	import { ref, defineExpose, defineEmits } from 'vue';
	import { ImgOption } from '@/common/mockData.ts';
	
	type SwiperItem = ImgOption;
	
	const emits = defineEmits(['ok']);

	const popup = ref(false);

	const swiperInfo = ref<Array<SwiperItem>>([]);
	const current = ref(0);

	const closeModal = () => {
		popup.value.close();
	}
	const openModal = (data: {
		images: SwiperItem[],
		imgIndex: number
	}) => {
		swiperInfo.value = data.images;
		current.value = data.imgIndex;
		popup.value.open()
	}
	
	const changeCurrent = (type: 'next' | 'prev') => {
		if(type === 'next') {
			current.value = current.value === swiperInfo.value.length - 1 ? 0 : current.value + 1;
		} else {
			current.value = current.value === 0 ? swiperInfo.value.length - 1 : current.value - 1;
		}
	}
	
	const previewImg = (index: number) => {
		uni.previewImage({
			urls: swiperInfo.value.map(item => item.url),
			current: index,
			showmenu: false
		})
	}
	
	const onOk = () => {
		emits('ok',{
			selectImgValue: swiperInfo.value[current.value],
		})
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


	.button-box {
		display: flex;
		justify-content: space-between;
		.normal-1 {
			width: 204rpx;
			height: 88rpx;
			line-height: 88rpx;
			margin: 0;
		}
		.confirm-btn {
			height: 88rpx; 
			line-height: 88rpx;
			font-weight: 400;
			width: 320rpx;
			margin: 0;
		}
	}
	.desc{
		color: #6B748F;
		font-size: 28rpx;
		line-height: 44rpx;
		margin: 40rpx 0 56rpx;
	}
	.banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left-arrow, .right-arrow {
			width: 48rpx;
			height: 48rpx;
			line-height: 48rpx;
			text-align: center;
			background: #8a8a8a;
			border-radius: 50%;
			.iconfont {
				font-size: 36rpx;
				color: white;
			}
		}
		.left-arrow {
			.icon-arrow {
				transform: rotate(180deg);
				transform-origin: center;
			}
		}
	}
	
	.banner-box {
		width: 406rpx;
		height: 306rpx;
		.swiper-box{
			height: 306rpx;
			border-radius: 12rpx;
		}
	}
	.swiper-item {
		image {
			width: 406rpx;
			height: 306rpx;
		}
	}
</style>