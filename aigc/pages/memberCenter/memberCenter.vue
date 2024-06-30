<template>
	<view :class="`member-center ${membershipType !== membershipTypeMap.personal.value ? 'vip' : ''}`">
		<view class="page-header">
			<image class="header-bg-img" mode="widthFix" :src="`
			${membershipType === membershipTypeMap.personal.value ? '../../static/png/member-bg-2.png' : '../../static/png/member-bg-1.png'}`"></image>
			<view class="page-header-nav" :style="navStyle">
				<uni-icons class="back-icon" type="left" size="20" color="#2A2A2A" @click="goDesignCenter"></uni-icons>
				<text class="tit">个人中心</text>
			</view>
			<view class="user-info">
				<image class="avatar" :src="userInfo.avatar"></image>
				<view class="name-box">
					<text class="nickname">{{ userInfo.nickname || userInfo.username || '暂无昵称'}}</text>
					<view class="membership-text">
						{{ membershipType === membershipTypeMap.personal.value ? '首次注册用户可免费设计3次' : '会员有效期至2021-03-16' }}
					</view>
				</view>
			</view>
			<view class="tag-box">
				<g-member-tag :type="membershipType"></g-member-tag>
			</view>
		</view>
		
		<memberCardVue :type="1"/>
		<memberCardVue :type="2"/>
		
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from "@dcloudio/uni-app";
	import { httpsRequest } from '@/common/utils';
	import { membershipTypeMap } from '@/common/constants.ts';
	import memberCardVue from './memberCard.vue';
	
	const res = uni.getSystemInfoSync();
	const navStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})
	const userInfo = ref({
		avatar: '',
		nickname: ''
	})
	const membershipType = ref(1);
	
	const getUserInfo = async (id : string) => {
		const res = await httpsRequest(`/cx/member/findById/${id}`, userInfo.value, 'GET');
		userInfo.value = {
			id,
			...res
		};
	}
	
	
	onShow(() => {
		// 下面这个是为了万一editUserInfo修改用户信息。
		const local = JSON.parse(uni.getStorageSync('userInfo'));
		getUserInfo(local.userId)
	})
	
	
	
</script>

<style lang="scss" scoped>
	.member-center {
		background: rgb(239, 239, 239);
		padding-bottom: 32rpx;
	}
	.page-header {
		position: relative;
		image.header-bg-img {
			width: 100%;
		}
		
		.page-header-nav {
			position: absolute;
			top: 0;
			width: 100%;
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
			padding: 0 0 0 43px;
			position: absolute;
			bottom: 40rpx;
			.avatar {
				width: 88rpx;
				height: 88rpx;
				background-color: #ffffff4d;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.name-box .nickname {
				display: inline-block;
				font-size: 32rpx;
				line-height: 26px;
				margin-bottom: 4rpx;
				font-weight: 500;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width: 10em;
				overflow: hidden;
				color: #344156;
			}
		
			.membership-text {
				font-size: 24rpx;
				line-height: 36rpx;
				font-weight: 400;
				color: #6B748F;
			}
		}
		.tag-box {
			position: absolute;
			right: 86rpx;
			bottom: 82rpx;
		}
	}
	.member-center.vip {
		.page-header .user-info .name-box .nickname,
		.page-header .user-info .name-box .membership-text{
			color: #6F4B19;
			
		}
	}
</style>
