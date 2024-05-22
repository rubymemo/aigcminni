<template>
	<view class="container">
		<view class="inner-content" :style="innerContentStyle">
			<view class="tit">登录</view>
			<view class="login-form-box">

				<view class="logo-box">
					<view class="logo">
						<image class="logo-img" src="@/static/svg/logo.svg"></image>
					</view>
				</view>

				<view class="mobile-login-form">
					<view class="number">137****3378</view>
					<view class="tips">
						<image class="icon-safe-img" src="@/static/svg/icon-safe.svg"></image>
						账号安全 放心登录
					</view>
				</view>

				<view class="button-box">
					<button class="primary big" @click="handleClick">本机号码一键登录</button>
				</view>

				<view class="rule">
					<view class="circle" @click="handleSwitchRead" :style="{
							border: isRead ? 'none' : 'solid 1px $border-gray-color'
						}">
						<uni-icons class="rule-checked" type="checkbox-filled" color="#256AF7" :size="18"></uni-icons>
					</view>
					已阅读并同意 <text class="link">用户协议、隐私政策</text> 并授权使用账号信息
				</view>


				<view class="diliver">
					<view class="line"></view>
					<view style="0 12px">其他方式登录/注册</view>
					<view class="line"></view>
				</view>


				<view class="login-type">
					<image class="mobile-icon" src="@/static/svg/mobile.svg"></image>
					<image class="weixin-icon" src="@/static/svg/weixin.svg"></image>
				</view>

			</view>
		</view>
		<image class="bg" src="@/static/png/bg.png"></image>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';

	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 44  + 'px'
	})

	const isRead = ref(false);

	const handleClick = () => {

	}

	const handleSwitchRead = () => {
		isRead.value = !isRead.value
	}
	console.log(res);
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100vh;
		background-color: #ffff;
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
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;

		// height: 100%;
		.tit {
			font-size: 17px;
			text-align: center;
		}
	}

	.login-form-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;

		// height: 100%;
		// padding-bottom: 30px;
		.logo-box {
			text-align: center;
			margin-bottom: 30px;
		}

		.logo {
			width: 90px;
			height: 90px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: #fff;
			border-radius: 50%;
			box-sizing: border-box;
			border: solid 1px #0000000d;

			.logo-img {
				width: 55px;
				height: 60px;
			}
		}

		.mobile-login-form {
			.number {
				font-size: 24px;
				text-align: center;
				margin-bottom: 18px;
			}

			.icon-safe-img {
				width: 20px;
				height: 20px;
			}

			.tips {
				display: flex;
				height: 20px;
				align-items: center;
				justify-content: center;
				font-weight: 400;
				font-size: 16px;
				color: #6B748F;
				margin-bottom: 40px;
				.icon-safe-img {
					margin-right: 8px;
				}
			}
		}

		.button-box {
			padding: 0 32px;
		}


		.rule {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 24px;
			height: 20px;
			font-size: 12px;
			color: $gray-color;

			.circle {
				position: relative;
				display: inline-block;
				width: 12px;
				height: 12px;
				border-radius: 50%;
				border: solid 1px $border-gray-color;
				margin-right: 8px;

				.rule-checked {
					position: absolute;
					top: -4px;
					left: -2px;
				}
			}

			.link {
				color: $link-color;
			}
		}

		.diliver {
			display: flex;
			align-items: center;
			justify-content: center;
			color: $border-grey-color;
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
			margin: 40rpx 0 30rpx;

			.line {
				width: 60px;
				height: 1px;
				background: $border-grey-color;
			}
		}

		.login-type {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 44px;
			margin-bottom: 120rpx;

			.mobile-icon,
			.weixin-icon {
				width: 44px;
				height: 44px;
				margin: 0 31px;
			}
		}

	}
</style>