<template>
	<view class="container">
		<view class="header" :style="innerContentStyle">
			<view class="iconfont icon-gengduo" @click="goUserCenter"></view>
			<view class="header-tit">设计</view>
		</view>

		<view class="add-new-contract-btn" @click="addNewWork"><text class="iconfont icon-new-contract"></text>新建</view>
		<scroll-view id="scroll-view-content" class="scroll-view-content" :scroll-with-animation="true" scroll-y="true"
			:scroll-top="scrollTop">
			<view class="contact-container">
				<view v-for="(item, index) in dataList" :key="index" class="message">
					<robotMessageVue 
						v-if="item.type === 'left'" 
						:msgInfo="item" :msgIndex="index" :msgList="dataList"
						:userInfo="userInfo" @btnClick="({ btnItem }) =>onRobotBtnClick(btnItem, index)"
						@imgSelect="({ imgValue }) => onUserSelectImg(imgValue, index)"
						@change="(newData, changeType) => onDataChange(newData, index, changeType)" @addUserReply="addUserReply" 
						:dialogId="workId"
					/>
					<userMessageVue v-if="item.type === 'right'" :msgInfo="item" :userInfo="userInfo"
						@change="newData => onDataChange(newData, index)" />
				</view>
			</view>
		</scroll-view>

		<view class="footer">
			<!-- v-if="workId" -->
			<view class="footer-header">
				<view @click="goHistoryPage" class="history-btn">
					<text class="iconfont icon-history"></text>历史会话
				</view>
				<!-- <g-color-btn :height="56" :width="146" :active="true" @click="goHistoryPage">历史会话</g-color-btn> -->
			</view>
			<view class="input-box">
				<input v-model.trim="inputValue" :disabled="!canSend" confirm-type="send"
					@confirm="onSendMessage(canSend && inputValue)"
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
	import userMessageVue from './components/userMessage.vue';
	import robotMessageVue from './components/robotMessage.vue';

	import { robotReply as defaultRobotReply, manualReply, ImgOption, BtnItem, MsgItem, UserMessage, MsgList } from '@/common/mockData.ts';
	import { httpsRequest, genImgURl, host } from '@/common/utils';
	import { onLoad } from '@dcloudio/uni-app';

	const res = uni.getSystemInfoSync();
	const innerContentStyle = ref({
		'padding-top': res.statusBarHeight + 'px'
	})

	// 滚动
	const scrollTop = ref(0);

	const canSend = ref(false);
	const inputValue = ref('');

	const lastRobotMsg = ref(false);
	const isGenLoading = ref(false);
	const RobotReply = reactive({ ...defaultRobotReply });

	const userInfo = ref({
		avatar: '',
		nickname: '',
		username: '',
		userId: ""
	})

	// 会话id
	const workId = ref<string | undefined>(undefined);
	const dataList = ref<MsgList>([
		{
			type: 'left',
			...RobotReply[0].data,
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

	const getWorkDataById = async (id : string) => {
		const res = await httpsRequest(`/hh/dialog/findItemHistory/${id}`, {}, 'GET');
		if (res) {
			const dataListTemp = res.items.map(item => {
				return JSON.parse(item.whoSay);
			})
			dataList.value = dataListTemp;
		}
	}

	onLoad(async (params) => {
		console.log('onLoad： 获取用户信息')
		const localUserInfo : { avatar : string; userId : string } = await getUserInfo();
		if (localUserInfo) {
			userInfo.value = localUserInfo;
		}

		if (params.id) {
			// 详情
			workId.value = params.id;
			getWorkDataById(params.id)
		}
	})
	const initScrollHeight = () => {
		// .select('.scroll-view-content')
		uni.createSelectorQuery()
			.in(instance)
			.select('.contact-container')
			.boundingClientRect(data => {
				if (data) {
					console.log(data.height)
					scrollTop.value = data.height
				}
			})
			.exec();
	}
	onMounted(async () => {
		// 滚动
		timer.value = setTimeout(() => {
			initScrollHeight()
		}, 500)
	})
	// 上传数据
	const putWorkData = async () => {
		let isFindTitle = false;
		const result = dataList.value.map((item, index) => {
			if (item.type === 'left') {
				const params = {
					whoId: 0,
					whoName: 'robot',
					whoSay: JSON.stringify(item),
					clipType: '',
					clipContent: ''
				}
				if (item.imagesOptions) {
					// 获取封面图
					params.clipType = 'info';
					params.clipContent = JSON.stringify({
						imgUrl: item.imagesOptions[0].url
					});
				}
				if (index === 0) {
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
					whoName: userInfo.value.nickname || userInfo.value.username,
					whoSay: JSON.stringify(item),
					clipType: '',
					clipContent: ''
				}
				if (item.interfaceParams && item.interfaceParams.promptWords && !isFindTitle) {
					// 将 promptWords 变成标题
					isFindTitle = true;
					params.clipType = 'info',
						params.clipContent = JSON.stringify({
							title: item.interfaceParams.promptWords.text,
							ownerId: userInfo.value.userId,
						})
				}
				return params
			}
		})

		const data = workId.value ? await httpsRequest(`/hh/dialog/replaceAllItemBy/${workId.value}`, result, 'POST') : await httpsRequest('/hh/dialog/addItemBy', result);
		if (data) {
			workId.value = data;
		}
	}

	const goUserCenter = () => {
		uni.navigateTo({
			url: '/pages/userCenter/userCenter'
		})
	}

	// 增加假机器人回复, 如果不是假机器人不用看这块代码
	const addMockRobotReply = (robotId : number) => {
		// clearTimeout(timer.value);
		// timer.value = setTimeout(() => {
		const robotReplyData = RobotReply[robotId].data;
		dataList.value.push({
			...robotReplyData,
			type: 'left',
		})
		if (robotReplyData.canUserSend) {
			canSend.value = true;
		}
		scrollToBottom();
		console.log(dataList.value);


		// 保存
		if(dataList.value.length > 3) {
			// 当用户输入了描述文字之后再保存
			putWorkData();
		}
		// }, 200)
	}

	const addUserReply = (data : UserMessage) => {
		dataList.value.push(data);
		if (data.nextRobotId) {
			addMockRobotReply(data.nextRobotId);
		}
	}

	// 点击机器人的提供的按钮
	const onRobotBtnClick = (btnItem : BtnItem, messageIndex : number) => {
		// 如果已经选择过了，就不能再选择了
		if (messageIndex < dataList.value.length - 1) {
			return;
		}
		dataList.value[messageIndex].activeBtns = [btnItem.value];

		const manualData = manualReply[btnItem.nextUserId];
		// 假装回复
		const userRelyStr = manualData.content.replaceAll('{replace}', btnItem.label); // 替换选择的按钮文案

		const interfaceParams = { ...manualData.interfaceParams };
		if (btnItem.value !== 0) {
			// 当选择0【没有】时，值还是默认值，只有不为0时才会有数据
			interfaceParams[Object.keys(interfaceParams)[0]] = btnItem.value;
		}

		dataList.value.push({
			type: 'right',
			content: userRelyStr,
			interfaceParams,
		})
		canSend.value = false;
		inputValue.value = '';
		addMockRobotReply(manualData.nextRobotId);
	}
	const initContentHeight = () => {
		uni.createSelectorQuery().in(instance).select('.contact-container')
			.boundingClientRect((data) => {
				if (data && data.height) {
					scrollTop.value = data.height;
				}
			}).exec();
	}

	const scrollToBottom = () => {
		nextTick(() => {
			initContentHeight()
		})
	}
	const onSendMessage = async (canClick : boolean) => {
		if (!canClick) {
			return;
		}

		// 在用户发送消息之前，机器人说了什么
		const prevRobotMsg = dataList.value[dataList.value.length - 1];

		/*** 构建用户消息结构
		interfaceParams: {
			promptWords: { text: '', fontfamily: '' }, 
		},
		---> 
		interfaceParams: {
			promptWords: { text: '用户输入', fontfamily: '' }, 
		},
		***/
		const nextUserRely = prevRobotMsg.nextUserReply || {};
		const interfaceParams = { ...nextUserRely.interfaceParams };
		interfaceParams[Object.keys(interfaceParams)[0]] = { text: inputValue.value, fontfamily: '' };

		// 给dataList添加用户数据
		dataList.value.push({
			type: 'right',
			content: inputValue.value,
			interfaceParams,
			tooltipsBtns: prevRobotMsg.nextUserReply.tooltipsBtns || undefined
		})

		// 保存用户说了什么
		// putWorkData();
		// 输入完成后，输入框不允许再输入
		canSend.value = false;
		inputValue.value = '';

		// 输入完后，机器人做出回应
		console.log(prevRobotMsg);
		if (prevRobotMsg.afterUserSendNextRobotId) {
			addMockRobotReply(prevRobotMsg.afterUserSendNextRobotId);
		}
	}

	const onUserSelectImg = async (imgValue : ImgOption, messageIndex : number) => {
		if (imgValue.status !== 'done') {
			return;
		}
		const imgUrl = imgValue.url;
		if (!imgUrl) {
			return;
		}
		if (messageIndex !== dataList.value.length - 1) {
			return;
		}
		dataList.value[messageIndex].activeImages = [imgUrl];

		/*** 构建用户消息结构 eg: 
		interfaceParams: {
			bgImgUrl: '', 
		},
		---> 
		interfaceParams: {
			bgImgUrl: 'https:***', 
		},
		
		如果imgValue有id，传imgValue.id
		interfaceParams: {
			templateId: '',
		},
		---> 
		interfaceParams: {
			templateId: '123', 
		},
		***/
		
		
		const manualData = manualReply[dataList.value[messageIndex].nextUserId];
		const interfaceParams = manualData.interfaceParams;
		interfaceParams[Object.keys(interfaceParams)[0]] = imgValue.id || imgUrl;

		dataList.value.push({
			type: 'right',
			content: manualData.content,
			interfaceParams
		})

		addMockRobotReply(manualData.nextRobotId);
	}

	onBeforeUnmount(() => {
		try {
			uni.closeSocket()
			clearTimeout(timer.value);
		} catch (e) {
			//TODO handle the exception
		}
	})

	const goHistoryPage = () => {
		uni.navigateTo({
			url: '/pages/historyDesign/historyDesign'
		})
	}

	// 新增会话
	const addNewWork = async () => {
		await putWorkData();
		try {
			uni.closeSocket()
			clearTimeout(timer.value);
		} catch (e) {
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

	const onDataChange = (newData, index : number, type?: 'done' | 'loading') => {
		dataList.value[index] = newData;
		if(type === 'done') {
			putWorkData();
		}
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
		padding: 32rpx 32rpx 160rpx;
		// overflow-y: scroll;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 40rpx 40rpx 0 0;
		background: white;

		.history-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			box-sizing: border-box;
			border: 1px solid rgb(237, 241, 246);
			width: 188rpx;
			color: $gray-color;
			font-size: 26rpx;
			background: #EDF1F6;
			border-radius: 24px;

			.iconfont {
				display: inline-block;
				margin-right: 8rpx;
				margin-top: 4rpx;
				font-size: 26rpx;
			}
		}

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

	.add-new-contract-btn {
		display: flex;
		align-items: center;
		position: fixed;
		right: 0;
		bottom: 340rpx;
		z-index: 99;
		width: 154rpx;
		height: 68rpx;
		line-height: 68rpx;
		background: linear-gradient(135.00deg, rgb(23, 242, 95) 0%, rgb(37, 106, 247) 100%);
		box-shadow: 0px 0px 10px 0px rgba(2, 32, 77, 0.15);
		border-radius: 34rpx 0 0 34rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: white;

		.iconfont {
			margin: 0 10rpx 0 26rpx;
			font-size: 36rpx;
		}
	}
</style>