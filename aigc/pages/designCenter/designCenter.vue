<template>
	<view class="container">
		<view class="header" :style="innerContentStyle">
			<view class="iconfont icon-gengduo" @click="goUserCenter"></view>
			<view class="header-tit">设计</view>
		</view>
		<view class="contact-container">
			<view
				v-for="(item, index) in dataList"
				:key="index"
			>
				<view v-if="item.type === 'left'" class="robot-contact-item">
					<image class="avatar" src="@/static/png/robot.png"></image>
					<view class="robot-contact-info-box">
						<view v-if="item.title" class="title">{{item.title}}</view>
						<view v-if="item.content" class="content">{{item.content}}</view>
						<view v-if="item.btns" class="btns">
							<button 
								v-for="(btnItem, btnIndex) in item.btns" :key="btnIndex" 
								:class="`robot-btn ${selectTags.includes(btnItem) ? 'active' : ''}`" 
								@click="onRobotBtnClick(btnItem)"
							>
								{{ btnItem }}
							</button>
						</view>
					</view>
				</view>
				
				<view v-if="item.type === 'right'" class="human-contact-item">
					<view class="content">{{ item.content }}</view>
					<image class="avatar" src="@/static/png/robot.png"></image>
				</view>
				
				
			</view>
			
		</view>
		<view class="footer">
			<view class="input-box">
				<input v-model.trim="inputValue" :disabled="!canSend" :placeholder="canSend ? '输入对话后，可通过回车键发送指令' : '请先选择机器人提供的选项'" placeholder-style="color: #A3B4CC"/>
				<view :class="`send-btn ${(canSend && inputValue) ? '' : 'disabled'} `" @click="onSendMessage(canSend && inputValue)">
					<image src="@/static/svg/icon-send.svg"></image>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script setup lang="ts">
	import { ref, onBeforeUnmount } from 'vue';
	import { robotReply, manualReply } from '@/common/mockData.ts';
	
	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})
	
	const canSend = ref(false);
	const selectTags = ref([]);
	const inputValue = ref('');
	
	const dataList = ref([
		{
			...robotReply[0].data,
			type: 'left',
		}
	]);
	// 将来可删掉
	const timer = ref();
	
	const goUserCenter = () => {
		uni.navigateTo({
			url: '/pages/userCenter/userCenter'
		})
	}
	
	// 点击机器人的提供的按钮
	const onRobotBtnClick = (btnStr: string) => {
		selectTags.value.push(btnStr);
		const manualData = manualReply[btnStr];
		dataList.value.push({
			content: manualData.content,
			type: 'right',
		})
		
		timer.value = setTimeout(() => {
			const robotReplyData = robotReply[manualData.nextRobotId];
			dataList.value.push({
				...robotReplyData.data,
				startCreate: robotReplyData.startCreate,
				type: 'left',
			})
			if(robotReplyData.startCreate) {
				canSend.value = true;
			}
		}, 500)
	}
	
	const onSendMessage = (canClick) => {
		if(!canClick) {
			return;
		}
		dataList.value.push({
			content: inputValue.value,
			type: 'right'
		})
		canSend.value = false;
	}
	onBeforeUnmount(() => {
		clearTimeout(timer.value);
	})
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.header {
		
		background-color: white;
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;

		.icon-gengduo {
			color: $font-primary-color;
			position: absolute;
			width: 48rpx;
			font-size: 40rpx;
			left: 50rpx;
		}

		.header-tit {
			font-size: 17px;
			color: $font-primary-color3;
		}
	}
	.contact-container {
		flex: 1;
		background-image: url('../../static/png/bg3.png');
		background-size: 100%;
		padding: 32rpx;
		overflow-y: scroll;
	}
	.footer {
		background: white;
		
		.input-box {
			padding: 40rpx 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			input {
				flex: 1;
				height: 88rpx;
				background: #F2F3F4;
				border-radius: 10px;
				font-size: 14px;
				padding: 0 40rpx;
			}
			
			.send-btn {
				margin-left: 16px;
				width: 88rpx;
				height: 88rpx;
				border-radius: 12px;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(135deg, rgb(23, 242, 95), rgb(37, 106, 247));
				
				image {
					width: 28px;
					height: 28px;
				}
				
				&.disabled {
					opacity: 0.5;
				}
			}
		}
		
	}
	.robot-contact-item {
		display: flex;
		.avatar {
			width: 68rpx;
			height: 68rpx;
		}
		.robot-contact-info-box {
			margin-left: 24rpx;
			margin-bottom: 40rpx;
			width: 500rpx;
			background: white;
			border-radius: 12px;
			padding: 32rpx;
			.title {
				font-size: 14px;
				line-height: 48rpx;
				font-weight: 500;
				margin-bottom: 4px;
				color: $font-primary-color2;
			}
			.content {
				font-size: 14px;
				line-height: 44rpx;
				font-weight: 400;
				color: $font-primary-color2;
				white-space: pre-wrap;
			}
		}
		.btns {
			margin-top: 24rpx;
			display: flex;
			.robot-btn {
				background: linear-gradient(135.00deg, rgb(23, 242, 95, 0.2) 0%,rgb(37, 106, 247, 0.2) 100%);
				border-radius: 100px;
				height: 56rpx;
				line-height: 56rpx;
				color: $font-primary-color2;
				font-size: 13px;
				font-weight: 400;
				margin-left: 0 !important;
				&:not(:last-child) {
					margin-right: 36rpx !important;
				}
				&.active {
					background:  linear-gradient(135.00deg, rgb(23, 242, 95),rgb(37, 106, 247) 100%);
				}
			}
		}
	}
	.human-contact-item {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 40rpx;
		.avatar {
			width: 68rpx;
			height: 68rpx;
		}
		.content {
			color:  $font-primary-color2;
			font-size: 13px;
			font-weight: 500;
			line-height: 22px;
			margin-right: 20rpx;
		}
	}
</style>