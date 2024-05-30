<template>
	<view class="container">
		<view class="header" :style="innerContentStyle">
			<view class="iconfont icon-gengduo" @click="goUserCenter"></view>
			<view class="header-tit">设计</view>
		</view>

		<scroll-view id="scroll-view-content" class="scroll-view-content" :scroll-with-animation="true" scroll-y="true"
			:scroll-top="scrollTop">
			<view class="contact-container">
				<view v-for="(item, index) in dataList" :key="index" class="message">
					<view v-if="item.type === 'left'" class="robot-contact-item">
						<image class="avatar" src="@/static/png/robot.png"></image>
						<view class="robot-contact-info-root-box">
							<view class="robot-contact-info-box">
								<view v-if="item.title" class="title" :style="item.titleStyle || undefined">
									{{item.title}}
								</view>
								<view v-if="item.content" class="content">{{item.content}}</view>
								<view v-if="item.btns" class="btns">
									<button v-for="(btnItem, btnIndex) in item.btns" :key="btnIndex"
										:class="`robot-btn ${item.activeBtns.includes(btnItem) ? 'active' : ''}`"
										@click="onRobotBtnClick(btnItem, index)">
										{{ btnItem }}
									</button>
								</view>
								<view v-if="item.imagesOptions" style="margin-top: 24rpx;">
									<radio-group @change="e => onUserSelectImg(e, index)">
										<view class="images-box">
											<view class="image-option-box"
												v-for="(imageItem, imgIndex) in item.imagesOptions" :key="imgIndex">
												<view class="imageCover"
													v-if="imageItem.status === 'loading' || imageItem.status === 'queue_remaining'">
													<view>
													{{imageItem.status === 'queue_remaining' ? '任务排队中，请稍等' : ''}}
													{{imageItem.status === 'loading' ? `图片加载中${imageItem.precent}%` : ''}}
													</view>
													<view class="progress-box" v-show="imageItem.status === 'loading'">
														<g-progress :progress="imageItem.precent"></g-progress>
													</view>
												</view>
												<image :src="imageItem.status === 'done' ? imageItem.url : ''"
													@click="previewImg(imageItem.url)">
												</image>
												<view class="radio-box" :style="{
													marginBottom: item.reload ? '0rpx' : '28rpx'
												}">
													<radio 
														v-if="!item.reload" 
														class="img-radio" 
														:value="imageItem.url" 
														color="#256AF7"
														:disabled="index < dataList.length - 1"
														:checked="item.activeImages.includes(imageItem.url)"
													/>
												</view>
											</view>
										</view>
									</radio-group>
								</view>
							</view>
							<!-- <view v-if="item.reload && !isGenLoading" :class="`reload ${isGenLoading ? 'loading' : ''}`" @click="reloadGen"><view class="iconfont icon-loading"></view>重新生成</view> -->
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
						<image class="avatar" :src="userInfo.avatar"></image>
					</view>


				</view>

			</view>
		</scroll-view>

		<view class="footer">
			<view class="footer-header" v-if="workId">
				<g-color-btn :height="56" :width="146" :active="true" @click="addNewWork">
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
	import { ref, onBeforeUnmount, nextTick, onMounted, getCurrentInstance, reactive } from 'vue';
	import { robotReply as defaultRobotReply, manualReply, findNextRobotId } from '@/common/mockData.ts';
	import { httpsRequest, genImgURl, host  } from '@/common/utils';
	import { onLoad } from '@dcloudio/uni-app';

	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})

	// 滚动
	const scrollTop = ref(0);

	const canSend = ref(false);
	const inputValue = ref('');

	const clientUNIId = ref('');
	const lastRobotMsg = ref(false);
	const isGenLoading = ref(false);
	const workflowList = ref([]); // 模版
	const RobotReply = reactive({ ...defaultRobotReply });
	
	const userInfo = ref({
		avatar: '',
		nickname: '',
		username: '',
	})
	
	// 会话id
	const workId = ref<string | undefined>(undefined);
	const dataList = ref([
		{
			...RobotReply[0].data,
			type: 'left',
			// imagesOptions: [{
			// 	url: '/static/png/mock1.png',
			// 	status: 'loading',
			// 	precent: 80
			// },{
			// 	url: '/static/png/mock2.png',
			// 	status: 'queue_remaining',
			// 	precent: 80
			// }],
			// activeImages: [],
		}
	]);
	// 将来可删掉
	const timer = ref();
	const instance = getCurrentInstance(); // 获取组件实例
	
	const getUserInfo = async () => {
		const res = await httpsRequest('/cx/meByMobile', {}, 'GET');
		uni.setStorageSync('userInfo', JSON.stringify(res));
		return res;
	}
	
	const getWorkDataById = async (id: string) => {
		const res = await httpsRequest(`/hh/dialog/findItemHistory/${id}`, {}, 'GET');
		if(res) {
			const dataListTemp = res.items.map(item => {
				return JSON.parse(item.whoSay);
			})
			dataList.value = dataListTemp;
			// 根据数据做一些初始工作,先写死，后面再改
			const lastMsg = dataListTemp[dataListTemp.length - 1];
			console.log(lastMsg)
			if(lastMsg.type === 'right' && dataListTemp.length === 6) {
				// 人说的，且是第一条
				addMockRobotReply(3);
				const UserMessages = dataList.value.filter((item, index) => item.type === 'right' && item.compute === true);
				getPaintingTask('logo_draw', UserMessages[0].content);
			}
			if(lastMsg.type === 'left' && dataListTemp.length >= 9) {
				lastRobotMsg.value = true;
				if(dataListTemp.length === 9) {
					// 机器人说的:请输入您的品牌名称
					canSend.value = true;
				}
			}
		}
	}
	// 获取模版
	const fetchWorkFlowList = async (type) => {
		const workflowListTemp = await httpsRequest(`/hh/prompt_workflow/listByType/${type}`, {}, 'GET');
		workflowList.value = workflowListTemp;
		RobotReply[5].data.imagesOptions = workflowListTemp.map(item => ({
			url: item.imgUrl,
			status: 'done',
			precent: 100
		}))
	}
	
	onLoad(async (params) => {
		console.log('onLoad')
		const localUserInfo: { avatar: string; userId : string} = await getUserInfo();
		if(localUserInfo) {
			userInfo.value = localUserInfo;
			clientUNIId.value = localUserInfo.userId;
		}
	
		fetchWorkFlowList('logo_compose');
		
		if(params.id) {
			// 详情
			workId.value = params.id;
			getWorkDataById(params.id)
		}
	})
	// 上传数据
	const putWorkData = async () => {		
		let isFindTitle = false;
		const result = dataList.value.map((item, index) => {
			if(item.type === 'left') {
				const params = {
					whoId: 0,
					whoName: 'robot',
					whoSay: JSON.stringify(item),
					clipType: '',
					clipContent: ''
				}
				if(item.imagesOptions) {
					// 获取封面图
					params.clipType = 'info';
					params.clipContent = JSON.stringify({
						imgUrl: item.imagesOptions[0].url
					});
				}
				if(index === 0) {
					// 获取图片类型
					params.clipType = 'info';
					params.clipContent = JSON.stringify({
						type: item.activeBtns.includes('logo') ? 1 : 2,
					});
				}
				return params
			} else {
				const params = {
					whoId: userInfo.value.userId,
					whoName: userInfo.value.nickname  || userInfo.value.username,
					whoSay: JSON.stringify(item),
					clipType: '',
					clipContent: ''
				}
				if(item.compute && !isFindTitle) {
					// 找到标题
					isFindTitle = true; 
					params.clipType = 'info',
					params.clipContent = JSON.stringify({
						title: item.content,
						ownerId: userInfo.value.userId,
					})
				}
				return params
			}	
		})

		const data = workId.value ? await httpsRequest(`/hh/dialog/replaceAllItemBy/${workId.value}`, result, 'POST') : await httpsRequest('/hh/dialog/addItemBy', result);
		if(data) {
			workId.value = data;
		}
	}


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
	onMounted(async() => {
		// 获取用户信息
		initScrollHeight()
		// const sysTempRes = uni.getSystemInfoSync();
	})

	const goUserCenter = () => {
		uni.redirectTo({
			url: '/pages/userCenter/userCenter'
		})
	}

	// 增加假机器人回复, 如果不是假机器人不用看这块代码
	const addMockRobotReply = (robotId : number) => {
		clearTimeout(timer.value);
		timer.value = setTimeout(() => {
			const robotReplyData = RobotReply[robotId];
			dataList.value.push({
				...robotReplyData.data,
				startCreate: robotReplyData.startCreate,
				type: 'left',
				reload: robotId === 6 ? true : false
			})
			console.log(dataList.value);
			if (robotReplyData.startCreate) {
				canSend.value = true;
			}
			scrollToBottom();
			
			// 保存
			if(workId.value && [4, 5].includes(robotId)) {
				putWorkData();
			}
		}, 500)
	}

	// 点击机器人的提供的按钮
	const onRobotBtnClick = (btnStr : string, messageIndex : number) => {
		// 如果已经选择过了，就不能再选择了
		if (messageIndex < dataList.value.length - 1) {
			return;
		}
		dataList.value[messageIndex].activeBtns = [btnStr];
		
		// selectTags.value.push(btnStr);
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
						url: `${host}/hh/comfyui_api_v2/uploadImage`,
						filePath: tempFilePaths[0].tempFilePath,
						name: 'image',
						success: (uploadFileRes) => {
							const uploadData = JSON.parse(uploadFileRes.data);
							if (Number(uploadData.code) === 2000) {
								dataList.value.push({
									type: 'right',
									content: '',
									images: [uploadData.data],
									refer: true,
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
		isGenLoading.value = true;
		uni.connectSocket({
			url: `wss://u262838-87ee-75614327.westx.seetacloud.com:8443/ws?clientId=${clientUNIId.value}`
			// url: 'wss://101.126.93.249/ws/?clientId=' + clientUNIId.value
		});

		uni.onSocketOpen(function (res) {
			console.log('WebSocket连接已打开！');
		});
		uni.onSocketMessage(async function (res) {
			console.log('收到服务器内容：');
			const msgData = JSON.parse(res.data);
			console.log(msgData)
			if (msgData.type === 'executed' && Number(msgData.data.node) == 100) {
				console.log('最终结果')
				uni.closeSocket()
				
				const imagesRes = await httpsRequest(`/hh/comfyui_api_v2/historyByPromptId/${promptData.prompt_id}`, {}, 'GET');
				if(!imagesRes) return;
				const dataListTemp = JSON.parse(JSON.stringify(dataList.value))
				dataListTemp[dataListTemp.length - 1].imagesOptions = imagesRes.map(imgItemSrc => {
					return {
						url: imgItemSrc,
						status: 'done',
						precent: 100
					}
				})
				dataList.value = dataListTemp;
				nextTick(() => {
					isGenLoading.value = false;
					
					// 保存
					putWorkData();
				})
			} else if (msgData.type === 'progress') {
				// "data": {"'value": 8, "max": 8,
				dataList.value[dataList.value.length - 1].imagesOptions = dataList.value[dataList.value.length - 1].imagesOptions.map(imgItem => {
					return {
						url: '',
						status: 'loading',
						precent: Number(msgData.data.value) / Number(msgData.data.max) === 1 ? 95 : (Number(msgData.data.value) / Number(msgData.data.max)).toFixed(2) * 100
					}
				})
			}
		});

		uni.onSocketClose(function (res) {
			console.log('WebSocket 已关闭！');
		})
	}

	const getPaintingTask = async (code: string, promptWords: string) => {
		const UserImagesMessages = dataList.value.filter((item, index) => item.type === 'right' && item.refer === true);
		const params = {
			code,
			promptWords: promptWords || ' ',
			fileUrl: undefined,
			clientId: clientUNIId.value
		};
		if (UserImagesMessages.length) {
			// 是否有用户参考图
			const promptImageUrl = UserImagesMessages[UserImagesMessages.length - 1].images[0];
			 params.fileUrl = promptImageUrl;
		}
		console.log('promt传的参数')
		console.log(params)
		const promptRes = await httpsRequest('/hh/comfyui_api_v2/doPrompt', params);
		fetchWebSocket(promptRes);
	}


	const initContentHeight = () => {
		uni.createSelectorQuery().in(instance).select('.contact-container')
			.boundingClientRect((data) => {
				console.log(data)
				if (data) {
					let top = data.height - scrollTop.value;
					if (top > 0) {
						scrollTop.value = top + 900;
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
			type: 'right',
			compute: true // 用于标识加入计算
		})
		putWorkData();

		canSend.value = false;
		inputValue.value = '';

		if (lastRobotMsg.value) {
			// 这里写死是选择模版。
			addMockRobotReply(5);
		} else {
			// 这里写死下一步生成了logo
			addMockRobotReply(3);
			const UserMessages = dataList.value.filter((item, index) => item.type === 'right' && item.compute === true);
			const res = await getPaintingTask('logo_draw', UserMessages[0].content);
		}
	}

	const onUserSelectImg = (evt, messageIndex) => {
		const imgUrl = evt.detail.value;
		if (!imgUrl) {
			return;
		}
		if(messageIndex !== dataList.value.length -1) {
			return;
		}
		
		dataList.value[messageIndex].activeImages = [imgUrl];

		if (lastRobotMsg.value) {
			// 最后选模版
			dataList.value.push({
				type: 'right',
				content: '我已经选定了',
				images: [imgUrl],
				// compute: true // 用于标识加入计算
			})
			addMockRobotReply(6);
			
			const findWorkFlow = workflowList.value.find(workflow => workflow.imgUrl === imgUrl);
			const UserMessages = dataList.value.filter((item, index) => item.type === 'right' && item.compute === true);
			const promptText = UserMessages.length === 2 ? UserMessages[1].content : ''
			getPaintingTask(findWorkFlow.code, promptText);
		} else {
			dataList.value.push({
				type: 'right',
				content: '我已经选定了',
				images: [imgUrl],
				refer: true // 用于标识下发任务时的图片
			})
			addMockRobotReply(4);
			lastRobotMsg.value = true;
			canSend.value = true;
		}
	}

	const previewImg = (url : string) => {
		console.log(url);
		uni.previewImage({ 
			urls: [url],
		});
	}

	onBeforeUnmount(() => {
		try{
			uni.closeSocket()
			clearTimeout(timer.value);
		}catch(e){
			//TODO handle the exception
		}
	})

	const goHistoryPage = () => {
		uni.redirectTo({
			url: '/pages/historyDesign/historyDesign'
		})
	}
	
	// 重新生成
	const reloadGen = () => {
		// 后面会改
		if(isGenLoading.value) {
			uni.showToast({
				icon: 'none',
				title: '任务正在生成，请稍等'
			})
			return;
		}
		dataList.value[dataList.value.length - 1].imagesOptions = dataList.value[dataList.value.length - 1].imagesOptions.map(imgItem => {
			return {
				url: '',
				status: 'queue_remaining',
				precent: 0
			}
		})
		const workFlowUrl = dataList.value[dataList.value.length - 2].images[0]; // 用户选了哪个模版
		const findWorkFlow = workflowList.value.find(workflow => workflow.imgUrl === workFlowUrl);
		// getPaintingTask(findWorkFlow.code);
	}
	
	// 新增会话
	const addNewWork = async () => {
		await putWorkData();
		try{
			uni.closeSocket()
			clearTimeout(timer.value);
		}catch(e){
			//TODO handle the exception
		}
		nextTick(() => {
			dataList.value = [
				{
					...RobotReply[0].data,
					type: 'left',
				}
			];
			workId.value = undefined;
			canSend.value = false;
			inputValue.value = ''
			lastRobotMsg.value = false;
			isGenLoading.value = false;
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
		
		.robot-contact-info-root-box {
			margin-left: 24rpx;
			margin-bottom: 40rpx;
			.reload {
				color: $link-color;
				font-size: 28rpx;
				padding-top: 16rpx;
				
				&.loading {
					color: $gray-color;
				}
				.iconfont {
					display: inline-block;
					font-size: 24rpx;
					margin-right: 20rpx;
				}
			}
		}
		.robot-contact-info-box {
			
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

				.imageCover {
					position: absolute;
					// line-height: 240rpx;
					text-align: center;
					width: 240rpx;
					height: 240rpx;
					border-radius: 24rpx;
					background: linear-gradient(135.00deg, rgb(23, 242, 95, 0.1) 0%, rgb(37, 106, 247, 0.1) 100%);
					color: rgb(107, 116, 143);
					font-size: 24rpx;
					font-weight: 400;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.progress-box {
						width: 186rpx;
						margin-top: 16rpx;
					}
				}

				image {
					width: 240rpx;
					height: 240rpx;
					border-radius: 24rpx;
					// background: $border-grey-color;
				}
			}

			.radio-box {
				padding-top: 16rpx;
				margin-bottom: 28rpx;
			}

			.img-radio {

				transform: scale(0.6);
				
				&::v-deep {
					.wx-radio-input.wx-radio-input-disabled {
					  // border : none;
					  border-radius: 100%;
					  background : white;
					  color: #fff;
					}
					.wx-radio-input.wx-radio-input-disabled.wx-radio-input-checked {
						border: none;
						border-radius: 100%;
						color: red;
						background : #256AF7;
					}
					.wx-radio-input.wx-radio-input-disabled.wx-radio-input-checked::before {
					  border-radius : 50%;
					  width : 20px;
					  height : 20px;
					  line-height : 20px;
					  text-align : center;
					  font-size : 15px;
					  color : #fff;
					  background : transparent;
					  transform : translate(-50%, -50%) scale(1);
					  -webkit-transform: translate(-50%, -50%) scale(1);
					  }
				}
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
			background: #CFDAEB;
			border-radius: 50%;
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
				height: 240rpx;
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