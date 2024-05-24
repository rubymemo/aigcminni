<template>
	<view class="container">
		<view class="header" :style="innerContentStyle">
			<view class="iconfont icon-gengduo" @click="goUserCenter"></view>
			<view class="header-tit">设计</view>
		</view>

		<scroll-view id="scroll-view-content" class="scroll-view-content"
			:scroll-with-animation="true" scroll-y="true" :scroll-top="scrollTop">
			<view class="contact-container">
				<view v-for="(item, index) in dataList" :key="index" class="message">
					<view v-if="item.type === 'left'" class="robot-contact-item">
						<image class="avatar" src="@/static/png/robot.png"></image>
						<view class="robot-contact-info-box">
							<view v-if="item.title" class="title" :style="item.titleStyle || undefined">{{item.title}}
							</view>
							<view v-if="item.content" class="content">{{item.content}}</view>
							<view v-if="item.btns" class="btns">
								<button v-for="(btnItem, btnIndex) in item.btns" :key="btnIndex"
									:class="`robot-btn ${selectTags.includes(btnItem) ? 'active' : ''}`"
									@click="onRobotBtnClick(btnItem, index)">
									{{ btnItem }}
								</button>
							</view>
							<view v-if="item.imagesOptions" style="margin-top: 24rpx;">
								<radio-group>
									<view class="images-box">
										<view class="image-option-box"
											v-for="(imageItemSrc, imgIndex) in item.imagesOptions" :key="imgIndex">
											<image :src="imageItemSrc" @click="previewImg(imageItemSrc)"></image>
											<view class="radio-box">
												<radio class="img-radio" :value="imageItemSrc" color="#256AF7" />
											</view>
										</view>
									</view>
								</radio-group>
							</view>
						</view>
					</view>

					<view v-if="item.type === 'right'" class="human-contact-item">
						<view class="human-contact-info-box">
							<view v-if="item.content" class="content">{{ item.content }}</view>
							<view v-if="item.images" class="images">
								<view v-for="(imageItemSrc, imgIndex) in item.images" :key="imgIndex" class="image-box">
									<image :src="imageItemSrc" class="image" @click="previewImg(imageItemSrc)"></image>
								</view>
							</view>
						</view>
						<image class="avatar" src="@/static/png/robot.png"></image>
					</view>


				</view>

			</view>
		</scroll-view>

		<view class="footer">
			<view class="footer-header">
				<g-color-btn :height="56" :width="146" :active="true">
					<text class="iconfont icon-tianjia" style="font-size: 26rpx;"></text>
					新建对话
				</g-color-btn>
				<g-color-btn :height="56" :width="146" :active="true" @click="goHistoryPage">历史会话</g-color-btn>
			</view>
			<view class="input-box">
				<input v-model.trim="inputValue" :disabled="!canSend"
					:placeholder="canSend ? '输入对话后，可通过回车键发送指令' : '请先选择机器人提供的选项'" placeholder-style="color: #A3B4CC" />
				<view :class="`send-btn ${(canSend && inputValue) ? '' : 'disabled'} `"
					@click="onSendMessage(canSend && inputValue)">
					<image src="@/static/svg/icon-send.svg"></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { ref, onBeforeUnmount, nextTick, onMounted, getCurrentInstance } from 'vue';
	import { robotReply, manualReply } from '@/common/mockData.ts';
	import { httpsRequest } from '@/common/utils';

	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})

	// 试试滚动
	const scrollViewHeight = ref(0);
	const scrollTop = ref(0);

	const canSend = ref(false);
	const selectTags = ref([]);
	const inputValue = ref('');

	const dataList = ref([
		{
			...robotReply[0].data,
			type: 'left',
			// imagesOptions: ['http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png', 'http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png','http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png']
		}
	]);
	// 将来可删掉
	const timer = ref();
	const instance = getCurrentInstance(); // 获取组件实例


	const initScrollHeight = () => {
		uni.createSelectorQuery()
			.in(instance)
			.select('.scroll-view-content')
			.boundingClientRect(data => {
				if (data) {
					scrollTop.value = data.height
				}
			})
			.exec();
	}

	onMounted(() => {
		initScrollHeight()
	})

	const goUserCenter = () => {
		uni.navigateTo({
			url: '/pages/userCenter/userCenter'
		})
	}

	// 增加假机器人回复, 如果不是假机器人不用看这块代码
	const addMockRobotReply = (robotId : number) => {
		clearTimeout(timer.value);
		timer.value = setTimeout(() => {
			const robotReplyData = robotReply[robotId];
			dataList.value.push({
				...robotReplyData.data,
				startCreate: robotReplyData.startCreate,
				type: 'left',
			})
			if (robotReplyData.startCreate) {
				canSend.value = true;
			}
			scrollToBottom();
		}, 500)
	}

	// 点击机器人的提供的按钮
	const onRobotBtnClick = (btnStr : string, messageIndex : number) => {
		// 如果已经选择过了，就不能再选择了
		if (messageIndex < dataList.value.length - 1) {
			return;
		}

		selectTags.value.push(btnStr);
		const manualData = manualReply[btnStr];
		if (manualData.opertionType === 'chooseMedia') {
			// 上传图片
			uni.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				camera: 'back',
				success: (chooseImageRes) => {
					const tempFilePaths = chooseImageRes.tempFiles;
					uni.uploadFile({
						url: 'http://101.126.93.249/api/hh/comfyui_api/uploadImage', //仅为示例，非真实的接口地址
						filePath: tempFilePaths[0].tempFilePath,
						name: 'image',
						success: (uploadFileRes) => {
							const uploadData = JSON.parse(uploadFileRes.data);
							// filename: "8bcae338-8872-4982-855a-93651ea036aa.png"
							// subfolder: ""
							// type: "input"
							// `http://101.126.93.249/api/hh/comfyui_api/view?type=input&filename=8bcae338-8872-4982-855a-93651ea036aa.png`
							if (Number(uploadData.code) === 2000) {
								const url = `http://101.126.93.249/api/hh/comfyui_api/view?type=${uploadData.data.type}&filename=${uploadData.data.filename}`;
								console.log(url);
								dataList.value.push({
									type: 'right',
									content: '',
									images: [url],
								})
								addMockRobotReply(manualData.nextRobotId);
							} else {
								uni.showToast({
									icon: 'none', title: '上传失败，请联系客户或稍后重试'
								})
							}
						},
						fail: () => {
							uni.showToast({
								icon: 'none', title: '上传失败，请联系客户或稍后重试'
							})
						}
					});
				}
			});
		} else {
			// 假装回复
			dataList.value.push({
				content: manualData.content,
				type: 'right',
			})
			addMockRobotReply(manualData.nextRobotId);
		}
	}

	const fetchWebSocket = (promptData) => {

		uni.connectSocket({
			url: 'wss://region-101.seetacloud.com',
		});
		uni.onSocketOpen(function (res) {
			console.log('WebSocket连接已打开！');
			uni.sendSocketMessage({
				data: promptData
			});
		});
		uni.onSocketMessage(function (res) {
			console.log('收到服务器内容：' + res.data);
		});

	}

	const getPaintingTask = async () => {
		const UserMessages = dataList.value.filter((item, index) => item.type === 'right');
		const lastUserMessages = UserMessages[UserMessages.length - 1];
		const UserImagesMessages = UserMessages.filter(item => item.images);
		let params = {
			promptWords: lastUserMessages.content,
			promptImage: undefined
		};
		if (UserImagesMessages.length) {
			params.promptImage = UserImagesMessages[UserImagesMessages.length - 1].images[0];
		}

		const res = await httpsRequest('/comfyui_api/postPrompt', params);
		const promptId = res.promptId;
		console.log(res);
		fetchWebSocket(res)
	}


	const initContentHeight = () => {
		uni.createSelectorQuery().in(instance).select('.contact-container')
			.boundingClientRect((data) => {
				console.log(data)
				if (data) {

					let top = data.height - scrollTop.value;
					if (top > 0) {
						scrollTop.value = top;
					}
				}
			}).exec();
	}
	
	const scrollToBottom = () => {
		nextTick(() => {
			initContentHeight()
		})
	}
	const onSendMessage = async (canClick) => {
		if (!canClick) {
			return;
		}
		dataList.value.push({
			content: inputValue.value,
			type: 'right'
		})

		canSend.value = false;
		inputValue.value = '';

		// 这里写死下一步生成了
		addMockRobotReply(3);
		const res = await getPaintingTask();

		// uni.createSelectorQuery().in(this).select('#scroll-view-content').boundingClientRect((res)=>{
		//                     let top = res.height - this.scrollViewHeight;
		//                     if(top>0){
		//                         scrollTop.value = 999;
		//                     }
		//                 }).exec()
		// 滚动
		// scrollIntoView.value = `message-${dataList.value.length - 1}`
		// uni.pageScrollTo({
		// 	scrollTop: 9000,
		// 	duration: 300,
		// 	selector: '#scroll-view-content',
		// });
		// scrollToBottom();
	}

	const previewImg = (url : string) => {
		uni.previewImage({ urls: [url] });
	}

	onBeforeUnmount(() => {
		clearTimeout(timer.value);
	})

	const goHistoryPage = () => {
		uni.navigateTo({
			url: '/pages/historyDesign/historyDesign'
		})
	}
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

	.scroll-view-content {
		height: calc(100vh - 88rpx - 210rpx);
		box-sizing: border-box;
		background-image: url('../../static/png/bg3.png');
		background-size: 100%;
	}

	.contact-container {
		flex: 1;
		// background-image: url('../../static/png/bg3.png');
		// background-size: 100%;
		// padding: 32rpx;
		padding: 32rpx 32rpx 100rpx;
		// overflow-y: scroll;
	}

	.footer {
		    position: fixed;
		    bottom: 0;
		    left: 0;
		    width: 100%;
		border-radius: 40rpx 40rpx 0 0;
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
				border-radius: 20rpx;
				font-size: 28rpx;
				padding: 0 40rpx;
			}

			.send-btn {
				margin-left: 16px;
				width: 88rpx;
				height: 88rpx;
				border-radius: 24rpx;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(135deg, rgb(23, 242, 95), rgb(37, 106, 247));

				image {
					width: 56rpx;
					height: 56rpx;
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
			border-radius: 24rpx;
			padding: 32rpx;

			.title {
				font-size: 28rpx;
				line-height: 48rpx;
				font-weight: 500;
				margin-bottom: 8rpx;
				color: $font-primary-color2;
			}

			.content {
				font-size: 28rpx;
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
				background: linear-gradient(135.00deg, rgb(23, 242, 95, 0.2) 0%, rgb(37, 106, 247, 0.2) 100%);
				border-radius: 200rpx;
				height: 56rpx;
				line-height: 56rpx;
				color: $font-primary-color2;
				font-size: 26rpx;
				font-weight: 400;
				margin-left: 0 !important;

				&:not(:last-child) {
					margin-right: 36rpx !important;
				}

				&.active {
					background: linear-gradient(135.00deg, rgb(23, 242, 95), rgb(37, 106, 247) 100%);
				}
			}
		}

		.images-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-bottom: -28rpx;

			.image-option-box {
				display: inline-flex;
				flex-direction: column;
				align-items: center;

				image {
					width: 240rpx;
					height: 240rpx;
					border-radius: 24rpx;
					background: $border-grey-color;
				}
			}

			.radio-box {
				padding-top: 16rpx;
				margin-bottom: 28rpx;
			}

			.img-radio {

				transform: scale(0.6)
			}
		}
	}

	.human-contact-item {
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
		margin-bottom: 40rpx;

		.avatar {
			width: 68rpx;
			height: 68rpx;
		}

		.human-contact-info-box {
			margin-right: 20rpx;
		}

		.content {
			text-align: right;
			color: $font-primary-color2;
			font-size: 26rpx;
			font-weight: 500;
			line-height: 68rpx;
		}

		.images {

			.image-box {
				background: white;
				border-radius: 24rpx;
				overflow: hidden;
			}

			image.image {
				width: 240rpx;
				height: 240rpx;
				border-radius: 24rpx;
			}
		}
	}

	.footer-header {
		box-sizing: border-box;
		height: 104rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 40rpx;
		border-bottom: solid 1px #F2F3F4;
	}
</style>