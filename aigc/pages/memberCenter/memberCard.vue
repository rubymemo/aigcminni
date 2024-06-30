<template>
	<view class="card">
		<view class="header">
			<view class="iconfont icon-squre-1"></view>
			<text class="title">
				{{ type === membershipTypeMap.personalpro.value ? '个人版PRO' : '团队版'}}
			</text>
		</view>
		<view class="price-list">
			<view v-for="(item, index) in list" :key="index" :class="`price-item ${activeMember === index ? 'active' : ''}`" @click="() => onClickMember(index)">
				<view class="label">{{ item.label }}</view>
				<view class="price"><text class="unit">¥</text>{{ item.price }}</view>
				<view class="line-price" v-show="item.linePrice">¥{{ item.linePrice }}</view>
			</view>
		</view>

		<view class="btn-box">
			<button class="submit-btn">立即开通</button>
		</view>
		<view class="card-tips">
			{{ type === membershipTypeMap.personalpro.value ? '个人版会员期内，可享受无限制设计与下载' : '享有个人版PRO全部功能；同时可添加5个子账号子账号同时享有个人版PRO的全部权益'}}
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, ref, computed } from 'vue';
	import { membershipTypeMap } from '@/common/constants.ts';

	const props = defineProps<{
		type : string | number
	}>();

	const type = computed(() => props.type);

	const list = ref([
		{ label: '连续包月', price: '19.00', linePrice: '39.00' },
		{ label: '连续包月', price: '19.00', linePrice: '39.00' },
		{ label: '连续包月', price: '19.00', linePrice: '' },
		{ label: '连续包月', price: '19.00', linePrice: '39.00' },
		{ label: '连续包月', price: '19.00', linePrice: '39.00' },
		{ label: '连续包月', price: '19.00', linePrice: '' },
	])
	
	const activeMember = ref<null | string | number>(null);
	
	const onClickMember = (activeMemberTemp: null | string | number) => {
		activeMember.value = activeMember.value !== activeMemberTemp ? activeMemberTemp : null;
	}
</script>

<style lang="scss" scoped>
	.card {
		background: #fff;
		border-radius: 30rpx;
		margin: 32rpx 32rpx 0;
	}

	.price-list {
		display: flex;
		overflow-y: scroll;
		padding-bottom: 20rpx;
	}

	.price-item {
		flex-shrink: 0;
		margin-left: 32rpx;
		width: 176rpx;
		border: solid 2rpx;
		border-radius: 24rpx;
		border-color: #CFDAEB;
		padding: 24rpx 0;
		text-align: center;

		.label {
			font-size: 28rpx;
			line-height: 44rpx;
			text-align: center;
			font-weight: 500;
			margin-bottom: 32rpx;
		}

		.price {
			color: #C05430;
			font-weight: 500;
			font-size: 36rpx;
			line-height: 60rpx;

			.unit {
				font-size: 28rpx;
				line-height: 44rpx;
				margin-right: 6rpx;
			}
		}

		.line-price {
			color: rgb(107, 116, 143);
			font-size: 24rpx;
			font-weight: 400;
			line-height: 44rpx;
			margin-top: 16rpx;
			text-decoration: line-through;
		}
		
		&.active {
			border-color: rgb(255, 213, 160);
			background: linear-gradient(180.00deg, rgb(255, 229, 197), rgb(252, 238, 199) 100%);
			.label {
				color: rgb(111, 75, 25);
			}
		}

	}

	.btn-box {
		margin: 20rpx auto 0;
		width: 288px;
		border-radius: 50px;
		padding: 4rpx 0;
		background: linear-gradient(180.00deg, rgba(255, 229, 197, 0.49), rgba(255, 200, 130, 0.25) 100%);
	}

	.submit-btn {
		box-sizing: border-box;
		border-radius: 50px;
		background: linear-gradient(180.00deg, rgb(255, 229, 197), rgb(255, 200, 130) 100%);
		font-size: 32rpx;
		font-weight: 500;
		width: 284px;
	}

	.card-tips {
		padding: 0 90rpx;
		text-align: center;
		color: #6B748F;
		font-size: 24rpx;
		font-weight: 400;
		margin-top: 32rpx;
		padding-bottom: 60rpx;
		line-height: 40rpx;
	}

	.icon-squre-1 {
		text-align: center;
		background: linear-gradient(180.00deg, rgb(255, 229, 197), rgb(252, 238, 199) 100%);
		opacity: 0.5;
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		font-size: 68rpx;
	}

	.header {
		position: relative;
		top: -1px;
		margin-bottom: 40rpx;
		.title {
			position: absolute;
			top: 10rpx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 32rpx;
			font-weight: 400;
			line-height: 48rpx;
		}
	}
</style>