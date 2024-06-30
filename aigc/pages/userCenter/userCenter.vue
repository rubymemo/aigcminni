<template>
	<view class="container">
		<view class="inner-content" :style="innerContentStyle">
			<view class="page-header">
				<uni-icons class="back-icon" type="left" size="20" color="#2A2A2A" @click="goDesignCenter"></uni-icons>
				<text class="tit">个人中心</text>
			</view>

			<view :class="`user-info ${membershipType !== membershipTypeMap.personal.value ? 'vip' : ''}`" @click="goPage('/pages/editUserInfo/editUserInfo')">
				<view class="left">
					<image class="avatar" :src="userInfo.avatar"></image>
					<view class="user-left-info">
						<view class="name-box">
							<text class="nickname">{{ userInfo.nickname || userInfo.username || '暂无昵称'}}</text>
							<g-member-tag :type="membershipType"></g-member-tag>
						</view>

						<view class="membership">
							{{ membershipType === membershipTypeMap.personal.value ? '首次注册用户可免费设计3次' : '会员有效期至2021-03-16' }}
						</view>

					</view>
				</view>
				<view class="right">
					<text style="margin-right: 5px;">编辑资料</text>
					<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
				</view>
			</view>
			
			<view class="two-col">
				<view class="col-item membership-card">
					<view class="title">会员中心</view>
					<view class="desc">开通享受更多权益</view>
				</view>
				<view class="col-item inivit-card">
					<view class="title">邀请有礼</view>
					<view class="desc">邀请好友得红包</view>
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
				<view class="card-item" @click="goPage('/pages/historyDownloadImg/historyDownloadImg')">
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
				<view class="card-item" @click="goPage('/pages/userNotifications/userNotifications')">
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
				<view class="card-item" @click="goPage('/pages/userAgreement/userAgreement')">
					<view class="left">
						<view class="iconfont icon-a-zuhe7257"> </view>
						<text class="label">用户协议</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
				<view class="diliver"></view>
				<view class="card-item" @click="goPage('/pages/userAgreement/userAgreement')">
					<view class="left">
						<view class="iconfont icon-a-zuhe7258"> </view>
						<text class="label">隐私协议</text>
					</view>
					<view class="right">
						<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
					</view>
				</view>
			</view>

			<button class="normal big" @click="logout">退出账号</button>
		</view>


		<image class="bg" src="@/static/png/bg2.png"></image>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { onHide, onShow } from "@dcloudio/uni-app";
	import { httpsRequest } from '@/common/utils';
	import { membershipTypeMap } from '@/common/constants.ts';

	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})
	const userInfo = ref({
		avatar: '',
		nickname: ''
	})
	const timer = ref('');
	
	const membershipType = ref(0);
	
	const getUserInfo = async (id : string) => {
		const res = await httpsRequest(`/cx/member/findById/${id}`, userInfo.value, 'GET');
		userInfo.value = {
			id,
			...res
		};
	}

	onShow(() => {
		// 下面这个是为了万一editUserInfo修改用户信息。
		timer.value = setTimeout(() => {
			const local = JSON.parse(uni.getStorageSync('userInfo'));
			getUserInfo(local.userId)
		}, 200)
	})

	const goDesignCenter = () => {
		uni.redirectTo({
			url: '/pages/designCenter/designCenter'
		})
	}

	const goPage = (url) => {
		uni.navigateTo({
			url: url
		})
	}

	const waitTodo = () => {
		uni.showToast({
			icon: 'none',
			title: '功能开发中...请耐心等待'
		})
	}

	const logout = () => {
		uni.showModal({
			title: '确定退出？',
			success: () => {
				uni.clearStorageSync();
				uni.redirectTo({
					url: '/pages/index/index'
				})
			}
		})
	}

	onHide(() => {
		clearTimeout(timer.value);
	})
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		// height: 100vh;
		background-color: rgb(238, 239, 242);
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

			.avatar {
				width: 100rpx;
				height: 100rpx;
				background-color: #CFDAEB;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.user-left-info {
				.name-box {
					display: flex;
					align-items: center;
					margin-bottom: 6rpx;
				}

				.nickname {
					display: inline-block;
					font-size: 36rpx;
					font-weight: 500;
					color: $font-primary-color3;
					white-space: nowrap;
					text-overflow: ellipsis;
					max-width: 8em;
					overflow: hidden;
					margin-right: 16rpx;
				}

			

				.membership {
					color: #6B748F;
					font-size: 24rpx;
					font-weight: 400;
				}
			}
		}
		
		&.vip .user-left-info {
			.nickname, .membership {
				color: #6F4B19;
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

	.two-col {
		display: flex;
		gap: 32rpx;
		margin-bottom: 32rpx;
		.col-item {
			flex: 1;
			background-repeat: no-repeat;
			background-size: cover;
			padding: 16rpx  24rpx ;
			
			.title {
				font-size: 28rpx;
				line-height: 44rpx;
			}
			.desc {
				font-size: 20rpx;
				line-height: 44rpx;
			}
			
		}
		.membership-card {
			background-image: url('../../static/png/user-center-card-1.png');
			color: #6F4B19;
			
		}
		.inivit-card {
			background-image: url('../../static/png/user-center-card-2.png');
			color: $font-primary-color3;
		}
		
	}
	button.normal {
		margin-top: 68rpx;
	}
</style>