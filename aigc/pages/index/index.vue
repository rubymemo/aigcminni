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

				<!-- 	<view class="mobile-login-form">
					<view class="number">137****3378</view>
					<view class="tips">
						<image class="icon-safe-img" src="@/static/svg/icon-safe.svg"></image>
						账号安全 放心登录
					</view>
				</view> -->

				<view class="mobile-code-login-form">
					<uni-forms ref="mobileCodeFormRef" :modelValue="formData">
						<uni-forms-item>
							<g-input placeholder="请输入手机号" v-model.trim="formData.mobile">
								<template v-slot:prepend>
									<view class="prepend">
										+86
										<view class="down-icon">
											<image src="@/static/svg/icon-down.svg"></image>
										</view>
									</view>
								</template>
							</g-input>
						</uni-forms-item>
						<uni-forms-item style="margin-bottom: 10px;">
							<g-input placeholder="请输入验证码" v-model.trim="formData.code">
								<template v-slot:append>
									<view class="append">
										<text v-show="timer === 0" style="color: #256AF7"
											@click="queryCode">获取验证码</text>
										<text v-show="timer > 0" style="color: #A3B4CC">重新发送{{ timer }}s</text>
									</view>
								</template>
							</g-input>
							<view class="not-get-code">收不到验证码？</view>
						</uni-forms-item>
					</uni-forms>
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
					已阅读并同意 <text class="link" @click="goUserAgreement">用户协议、隐私政策</text> 并授权使用账号信息
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
	import { ref, onMounted } from 'vue';
	import { onReady } from '@dcloudio/uni-app';
	// import { useIntervalFn } from '@vueuse/core';

	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 44 + 'px'
	})
	const mobileCodeFormRef = ref();
	const formData = ref({
		mobile: '',
		code: ''
	})

	const timer = ref(0); // 倒计时
	const isRead = ref(false);

	onReady(() => {
	})

	const validateMobile = () => {
		if(!formData.value.mobile) {
			return '请先输入手机号'
		}
		if(formData.value.mobile) {
			if(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(formData.value.mobile)) {
				return false
			} else {
				return '请填写正确的手机号'
			}
		} else {
			return false
		}
	}
	const validateCode = () => {
		if(!formData.value.code) {
			return '请先输入验证码'
		} else {
			return false;
		}
	}

	const handleClick = () => {
		// 如果是手机号和邮箱登录
		const err1 = validateMobile();
		const err2 = validateCode();
		if(err1 || err2) {
			uni.showToast({
				icon: 'none',
				title: err1 || err2
			})
		}
	}

	const handleSwitchRead = () => {
		isRead.value = !isRead.value
	}
	console.log(res);
	// 获取验证码
	const queryCode = async () => {
		const err = validateMobile();
		if(err) {
			uni.showToast({
				icon: 'none',
				title: err1
			})
		}
		// const err = await loginForm.value.validateField(['mobile']);
		if (!err) {
		 if (timer.value === 0) {
			   timer.value = 60;
			   // resume();
			   // 这里写向后台发送请求的代码
			   // getSendVerifyCode(userInfo.mobile)
			 }
		}
	};

	const goUserAgreement = () => {
		uni.navigateTo({
			url: '/pages/userAgreement/userAgreement'
		})
	}
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


		.mobile-code-login-form {
			padding: 0 32px;
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

	.prepend {
		width: 44px;
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
		margin-right: 16px;

		.down-icon {
			display: inline-flex;
			align-items: center;
			color: $font-primary-color2;

			image {
				width: 16px;
				height: 16px;
			}
		}
	}

	.not-get-code {
		font-size: 14px;
		font-weight: 400;
		display: flex;
		justify-content: flex-end;
		color: $border-gray-color;
		margin-top: 10px;
	}
</style>