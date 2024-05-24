<template>
	<view class="container">
		<view class="avatar-div">
			<view class="avatar-box">
				<image class="avatar" src="../../static/c1.png"></image>
				<view class="camera-box"></view>
			</view>
		</view>
		
		<view class="card">
			<view class="card-item">
				<view class="left">
					<text class="label">昵称</text>
				</view>
				<view class="right">
					<text class="label">番茄炒蛋</text>
				</view>
			</view>
			<view class="diliver"></view>
			<view class="card-item">
				<view class="left">
					<text class="label">性别</text>
				</view>
				<view class="right">
					<view class="gender-btn active" style="margin-right: 20px;">
						<view class="gender-btn-inner"><view class="iconfont icon-nan"></view>男</view>
						
					</view>
					<view class="gender-btn">
						<view class="gender-btn-inner"><view class="iconfont icon-nv"></view>女</view>
					</view>
				</view>
			</view>
			<view class="diliver"></view>
			<view class="card-item">
				<view class="left">
					<text class="label">生日</text>
				</view>
				<view class="right">
					<text class="label">番茄炒蛋</text>
				</view>
			</view>
			<view class="diliver"></view>
			<view class="card-item">
				<view class="left">
					<text class="label">手机号</text>
				</view>
				<view class="right">
					<text class="label">番茄炒蛋</text>
				</view>
			</view>
		</view>
	
<!-- 		<view class="card">
			<view class="tit">账号绑定</view>
			<view class="card-item">
				<view class="left">
					<image class="weixin" src="@/static/svg/weixin.svg"></image>
					<text class="label">微信</text>
				</view>
				<view class="right">
					<text class="label" style="margin-right: 4px;">已绑定</text>
					<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.container {
	padding: 0 32rpx;
	.avatar-div {
		padding: 48rpx 0;
		text-align: center;
	}
	.avatar-box {
		position: relative;
		width: 140rpx;
		height: 140rpx;
		background: $bg-color;
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		.avatar {
			width: 136rpx;
			height: 136rpx;
			border-radius: 50%;
			background: white;
			
		}
		.camera-box {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 0;
			right: 0;
			width: 20px;
			height: 20px;
			border-radius: 4px;
			background: $bg-color;
		}
	}
	
}

	.card {
		background: white;
		border-radius: 12px;
		padding: 0 40rpx;
		color: $font-primary-color2;
		margin-bottom: 32rpx;
		.tit {
			padding: 40rpx 0 8rpx;
			font-weight: 500;
			font-size: 16px;
			line-height: 24px;
			
		}
		.card-item {
			display: flex;
			justify-content: space-between;
			height: 108rpx;
			line-height: 108rpx;
			
			.left {
				display: flex;
				align-items: center;
				.label {
					font-size: 14px;
				}
			}
			.right {
				.label {
					font-size: 14px;
					color: $gray-color;
				}
			}
			.label {
				margin-left: 16rpx;
			}
		}
		.diliver {
			width: 100%;
			height: 2rpx;
			background: #EDF1F6;
		}
		
	}
	
	.gender-btn {
		height: 48rpx;
		line-height: 48rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 2rpx;
		border-radius: 200rpx;
		background: $border-grey-color;
		
		.gender-btn-inner {
			border-radius: 200rpx;
			height: 44rpx;
			line-height: 44rpx;
			background: white;
			padding: 0 24rpx;
			font-size: 14px;
			font-weight: 400;
			color: $gray-color;
		}
		
		.iconfont {
			display: inline-block;
			font-size: 14px;
			margin-right: 12rpx;
		}
		.iconfont.icon-nan {
			color: #256AF7;
		}
		.iconfont.icon-nv {
			color: #FF42BE;
		}
		
		&.active {
			background: $bg-color;
		}
	}
	.weixin {
		width: 48rpx;
		height: 48rpx;
	}
</style>
