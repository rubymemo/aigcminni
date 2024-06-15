<template>
	<uni-popup ref="popup">
		<view class="popup-content">
			<view class="popup-title">作品保存完整</view>
			<view class="circle-box">
				<view class="circle-1">
					<view class="circle-2">
						<view class="circle-3">
							<view class="iconfont icon-check"></view>
						</view>
					</view>
				</view>
			</view>
	
			<view class="desc">
				<text v-if="descType === 'svg'">
					SVG格式作品已保存在\n
					“个人中心-历史下载中”\n
					请使用电脑端huatu并保存在本地进行使用
				</text>
				<text v-else>作品下载完成已经保存到相册中</text>
			</view>
			<button class="primary confirm-btn" @click="clickOk">知道了</button>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
	import { ref, defineExpose } from 'vue';
	
	type OptionItem = {
		label: string; value: string
	}
	const popup = ref(false);
	const descType = ref('');
	
	
	const closeModal = () => {
		popup.value.close();
	}
	const openModal = ({ type }) => {
		descType.value = type;
		popup.value.open()
	}
	
	const clickOk = () => {
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
		background-image: url('../../../static/png/download-result-bg.png');
		background-size: 100%;
		background-repeat: no-repeat;
		// margin: 0 -22rpx;
	}
	.popup-title {
		color: #191D32;
		font-size: 36rpx;
		line-height: 48rpx;
		text-align: center;
		margin-bottom: 60rpx;
	}
	.desc {
		    margin: 40rpx 0 76rpx;
		    color: #6B748F;
		    font-size: 30rpx;
		    font-weight: 400;
		    text-align: center;
	}
	
	.confirm-btn {
		height: 88rpx; 
		line-height: 88rpx;
	}
	.circle-box {
		display: flex;
		justify-content: center;
	}
	.circle-1,.circle-2,.circle-3 {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
	.circle-1 {
		width: 180rpx;
		height: 180rpx;
		background-color: #f5f8ff;
	}
	.circle-2 {
		width: 140rpx;
		height: 140rpx;
		background-color: #eaf1fe;
	}
	.circle-3 {
		width: 80rpx;
		height: 80rpx;
		background-color: #256AF7;
	}
	.icon-check {
		color: #fff;
		font-size: 36rpx;
	}
</style>