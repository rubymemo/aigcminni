<template>
	<view class="container">
		<view class="inner-content" :style="innerContentStyle">
			<view class="page-header" >
				<uni-icons class="back-icon" type="left" size="20" color="#2A2A2A" @click="goDesignCenter"></uni-icons>
				<text class="tit">个人中心</text>
			</view>
			
			<view class="user-info" @click="goPage('/pages/editUserInfo/editUserInfo')">
				<view class="left">
					<image class="avatar" src="../../static/c1.png"></image>
					<view>番茄炒蛋</view>
				</view>
				<view class="right">
					<text style="margin-right: 5px;">编辑资料</text>
					<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
				</view>
			</view>
			
			<view class="card">
				<view class="tit">创作中心</view>
				<view class="card-item" @click="goPage('/pages/historyDesign/historyDesign')">
					<view class="left">
						<view class="iconfont icon-a-lishi1"> </view>
						<text class="label">历史创作</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
				<view class="diliver"></view>
				<view class="card-item">
					<view class="left">
						<view class="iconfont icon-a-zuhe7276"> </view>
						<text class="label">历史下载</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
			</view>
		
			<view class="card">
				<view class="card-item">
					<view class="left">
						<view class="iconfont icon-xiaoxi"> </view>
						<text class="label">我的消息</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
			</view>
			
			
			<view class="card">
				<view class="card-item">
					<view class="left">
						<view class="iconfont icon-a-zuhe7257"> </view>
						<text class="label">用户协议</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
				<view class="diliver"></view>
				<view class="card-item">
					<view class="left">
						<view class="iconfont icon-a-zuhe7258"> </view>
						<text class="label">隐私协议</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
			</view>
			
			<button class="normal big">退出账号</button>
		</view>
		
		
		<image class="bg" src="@/static/png/bg2.png"></image>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	
	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})
	
	const goDesignCenter = () => {
		uni.navigateTo({
			url: '/pages/designCenter/designCenter'
		})
	}
	
	const goPage = (url) => {
		uni.navigateTo({
			url: url
		})
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		// height: 100vh;
		background-color: rgb(238,239,242);
	}
	.bg {
		top: 0;
		position: absolute;
		width: 100vw;
		height: 100vh;
		left: 0;
		z-index: 0;
	}
	.inner-content {
		position: relative;
		z-index: 1;
		padding: 0 32rpx;
	}
	.page-header {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		margin-bottom: 30rpx;
		.tit {
			font-size: 34rpx;
			font-weight: 500;
			color: $font-primary-color;
		}
		&::v-deep {
			.back-icon {
				position: absolute;
				left: 32rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
	.user-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 52rpx;
		.left {
			display: flex;
			align-items: center;
			font-size: 36rpx;
			font-weight: 500;
			color: $font-primary-color3;
			.avatar {
				width: 100rpx;
				height: 100rpx;
				background-color: gray;
				border-radius: 50%;
				margin-right: 20rpx;
			}
		}
		.right {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			line-height: 24rpx;
			font-weight: 400;
			color: $gray-color;
		}
	}
	.card {
		background: white;
		border-radius: 24rpx;
		padding: 0 40rpx;
		color: $font-primary-color2;
		margin-bottom: 32rpx;
		.tit {
			padding: 40rpx 0 8rpx;
			font-weight: 500;
			font-size: 36rpx;
			line-height: 48rpx;
			
		}
		.card-item {
			display: flex;
			justify-content: space-between;
			height: 108rpx;
			line-height: 108rpx;
			.left {
				display: flex;
				align-items: center;
			}
			
			.label {
				font-size: 28rpx;
				margin-left: 16rpx;
			}
		}
		.diliver {
			width: 100%;
			height: 2rpx;
			background: #EDF1F6;
		}
		
	}
	
	.left-icon {
		width: 32rpx;
		height: 32rpx;
	}
	button.normal {
		margin-top: 68rpx;
	}

</style>
