<template>
	<view class="robot-contact-item">
		<image class="avatar" src="@/static/png/robot.png"></image>
		<view class="robot-contact-info-root-box">
			<view class="robot-contact-info-box">
				<view v-if="msgInfo.title" class="title" :style="msgInfo.titleStyle || undefined">
					{{msgInfo.title}}
				</view>
				<view v-if="msgInfo.content" class="content">{{msgInfo.content}}</view>

				<view v-if="msgInfo.btns" class="btns">
					<view v-for="(btnItem, btnIndex) in msgInfo.btns" :key="btnIndex" class="robot-btn-box">
						<button :class="`robot-btn ${msgInfo.activeBtns.includes(btnItem.value) ? 'active' : ''}`"
							@click="onRobotBtnClick(btnItem)">
							{{ btnItem.label }}
						</button>
					</view>

				</view>

				<view v-if="msgInfo.imgRatioOptions" class="img-ratio-options">
					<view v-for="(ratioItem, ratioIndex) in msgInfo.imgRatioOptions" :key="ratioIndex"
						class="robot-btn-box">
						<button :class="`robot-ratio-btn ${msgInfo.activeBtns.includes(ratioItem.value) ? 'active' : ''}`"
							@click="onRobotBtnClick(ratioItem)">
							<view class="ratio-cube-box">
								<view 
									class="ratio-cube"
									:style="computeCube(ratioItem.value)"
								></view>
							</view>
							{{ ratioItem.label }}
						</button>
					</view>
				</view>

				<view v-if="msgInfo.imagesOptions" style="margin-top: 24rpx;">
					<template v-if="msgInfo.imagesType === 'radio'">
						<radio-group @change="onImgSelect">
							<view class="images-box" style="margin-bottom: -28rpx;">
								<view class="image-option-box" v-for="(imageItem, imgIndex) in msgInfo.imagesOptions"
									:key="imgIndex">
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
										@click="previewImg({
											...imageItem,
											imgIndex
										})">
									</image>
									<view class="radio-box" :style="{
										marginBottom: '28rpx'
									}">
										<radio 
											class="img-radio" 
											:value="JSON.stringify(imageItem)"
											color="#256AF7"
											:disabled="imgSelectDisabled"
											:checked="msgInfo.activeImages.includes(imageItem.url)" />
									</view>
								</view>
							</view>
						</radio-group>
					</template>
					<template v-else>
						<view class="images-box">
							<!-- style-倒数两个没有margin -->
							<view class="image-option-box" v-for="(imageItem, imgIndex) in msgInfo.imagesOptions"
								:key="imgIndex" :style="{
									marginBottom: 
									((msgInfo.imagesOptions.length % 2 === 1 && imgIndex === msgInfo.imagesOptions.length - 1) || 
									(msgInfo.imagesOptions.length % 2 === 0 && (imgIndex === msgInfo.imagesOptions.length - 1 || imgIndex === msgInfo.imagesOptions.length - 2)))
									 ? 0 : '18rpx'
								}">
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
									@click="clickDownLoadImg(imgIndex)">
								</image>
							</view>
						</view>
					</template>
				</view>
			</view>
			<!-- 只能是最后一条 -->
			<view 
				v-if="msgInfo.reload && !isGenLoading && props.msgIndex === props.msgList.length - 1" 
				:class="`reload ${isGenLoading ? 'loading' : ''}`"
				@click="reloadGen"
			>
				<view class="iconfont icon-loading"></view>重新生成
			</view>
		</view>

		<DownloadImgModal ref="DownloadImgModalRef"></DownloadImgModal>
		<UploadImgModal ref="UploadImgModalRef" @ok="uploadImgModalOk"></UploadImgModal>
		<PreviewImgModal ref="PreviewImgModalRef" @ok="previewImgModalOnOk"></PreviewImgModal>
	</view>

</template>

<script setup lang="ts">
	import { ref, defineProps, defineEmits, computed, reactive, nextTick, onMounted } from 'vue';
	import { RobotMessage, MsgList, BtnItem, MsgItem } from '@/common/mockData.ts';
	import DownloadImgModal from './downloadImgModal.vue';
	import UploadImgModal from './uploadImgModal.vue';
	import PreviewImgModal from './previewImgModal.vue';
	import { httpsRequest } from '@/common/utils';

	const props = defineProps<{
		msgInfo: RobotMessage;
		msgIndex : number;
		msgList : MsgList;
		userInfo: {
			userId: string;
		}
	}>();
	
	const msgInfo = computed(() => props.msgInfo);
	

	const emits = defineEmits(['btnClick', 'imgSelect', 'change', 'addUserMsg']);

	const isGenLoading = ref(false);
	const DownloadImgModalRef = ref();
	const UploadImgModalRef = ref();
	const PreviewImgModalRef = ref();
	const precentState = reactive({ // 用户计算百分比
		nodeCount: 22, // 生成时总共有几个节点,
		numerator: 0, // 分子
	})
	
	const imgSelectDisabled = computed(() => {
		const status = props.msgInfo.imagesOptions[0].status;
		return props.msgIndex < props.msgList.length - 1 || status !== 'done'
	})

	const previewImg = (data: {
		status: string
		url : string, 
		imgIndex: number
	}) => {
		console.log(imgSelectDisabled.value)
		if(imgSelectDisabled.value) {
			// 已经选择过了，不能再选择了，这个时候就是预览
			uni.previewImage({
				urls: props.msgInfo.imagesOptions.map(item => item.url),
				current: data.imgIndex,
				showmenu: false
			})
		} else {
			// 选择
			PreviewImgModalRef.value && PreviewImgModalRef.value.openModal({
				images: props.msgInfo.imagesOptions, 
				imgIndex: data.imgIndex
			});
		}
	}

	const onRobotBtnClick = (btnItem : BtnItem) => {
		if(btnItem.opertionType === 'chooseMedia') {
			UploadImgModalRef.value && UploadImgModalRef.value.openModal();
		} else {
			emits('btnClick', {
				btnItem: btnItem
			});
		}
	}

	const onImgSelect = (evt) => {
		const imgValue = JSON.parse(evt.detail.value);
		emits('imgSelect', {
			imgValue: imgValue
		});
	}
	
	const uploadImgModalOk = (data: { logo: string, QRCode: string,  topicMap: string }) => {
		const images = [];
		
		for(let key in data) {
			if(data[key]) {
				images.push(data[key]);
			}
		}
		
		// 构建用户的回复
		const interfaceParamsKey = Object.keys(props.msgInfo.nextUserReply.interfaceParams)[0];
		const nextUserMsg = {
			type: 'right',
			images: images,
			interfaceParams: {
				[interfaceParamsKey]: data
			},
			nextRobotId: props.msgInfo.afterUserSendNextRobotId
		}
		emits('addUserReply', nextUserMsg);
	}
	
	const previewImgModalOnOk = ({ selectImgValue }) => {
		emits('imgSelect', {
			imgValue: selectImgValue
		});
	}
	
	const clickDownLoadImg = (imgIndex: number) => {
		DownloadImgModalRef.value && DownloadImgModalRef.value.openModal({
			imageOptions: props.msgInfo.imagesOptions,
			imgIndex: imgIndex
		});
	}
	
	const computeCube = (ratioStr: string) => {
		const wRatio = Number(ratioStr.split(':')[0]);
		const hRatio = Number(ratioStr.split(':')[1]);
		const maxLen = 28;
		if(wRatio > hRatio) {
			return {
				width: `${maxLen}rpx`,
				height: `${(hRatio / wRatio * 28)}rpx`,
			}
		} else {
			return {
				width:`${(wRatio / hRatio * 28)}rpx`,
				height: `${maxLen}rpx`,
			}
		}
	}
	
	// 监听ws
	const fetchWebSocket = (promptData) => {
		uni.onSocketOpen(async function (res) {
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
				if (!imagesRes) return;
				const msgInfoTemp = props.msgInfo;
				msgInfoTemp.imagesOptions = imagesRes.map(imgItemSrc => {
					return {
						url: imgItemSrc,
						status: 'done',
						precent: 100
					}
				})
				emits('change', msgInfoTemp);
				nextTick(() => {
					isGenLoading.value = false;
				})
			} else if (msgData.type === 'progress' || msgData.type === 'executing') {
				let precent = 0;
				precentState.numerator = precentState.numerator + 1;
				if (precentState.numerator === precentState.nodeCount) {
					precent = 95;
				} else {
					precent = ((precentState.numerator / precentState.nodeCount).toFixed(2) * 100).toFixed(0);
				}
				const msgInfoTemp = props.msgInfo;
				if (msgInfoTemp.imagesOptions) {
					msgInfoTemp.imagesOptions = msgInfoTemp.imagesOptions
						.map(imgItem => {
							return {
								url: '',
								status: 'loading',
								precent: precent
							}
						})
				}
				emits('change', msgInfoTemp);
			} else if (msgData.type === 'execution_cached') {
				precentState.nodeCount = precentState.nodeCount - (msgData.data.nodes || []).length;
			}
		})
	
		uni.onSocketClose(function (res) {
			console.log('WebSocket 已关闭！');
		})
	}
	
	
	// 请求绘画任务
	const fetchPaintingTask = async () => {
		// 构建请求参数
		const createParams = () => {
			let params:Record<string, any> = {
				clientId: props.userInfo.userId
			}; 
			props.msgList.forEach((msgItem) => {
				if(!msgItem.interfaceParams) {
					return;
				}
				// 如果存在接口参数，
				const interfaceParamsKey = Object.keys(msgItem.interfaceParams)[0];
				const paramsValue = msgItem.interfaceParams[interfaceParamsKey];
				
				if(typeof paramsValue === 'string') {
					// 如果值只是字符串
					params[interfaceParamsKey] = paramsValue;
				} 
				if (Object.prototype.toString.call(paramsValue) === '[object Object]' && paramsValue.hasOwnProperty('text') && paramsValue.hasOwnProperty('fontfamily')) {
					// 如果是对象，且是{ text: '', fontfamily: ''} => [{ text: '', fontfamily: ''}]
					const newValue = (params[interfaceParamsKey] ? params[interfaceParamsKey] : []).concat([paramsValue]);
					params[interfaceParamsKey] = newValue;
				}
			})
			return params;
		}
		
		const queryData = createParams();
		// 在这里，先打开ws， 开始请求生成图片
		isGenLoading.value = true;
		uni.connectSocket({
			url: `wss://huatu.solart.pro/ws?clientId=${props.userInfo.userId}`
		});
		const promptRes = await httpsRequest('/hh/comfyui_api_v2/doPrompt', queryData);
		if (promptRes) {
			precentState.numerator = 0;
			precentState.nodeCount = promptRes.node_count;
			fetchWebSocket(promptRes);
		} else {
			isGenLoading.value = false;
		}
	}
	
	// 获取模版
	const fetchWorkflowTemplateList = async (type: string) => {
		const workflowListTemp = await httpsRequest(`/hh/prompt_workflow/listByType/${type}`, {}, 'GET');
		const msgInfoTemp = props.msgInfo;
		msgInfoTemp.imagesOptions = workflowListTemp.map(imgSrc => {
			return {
				url: imgSrc,
				status: 'done',
				precent: 100
			}
		})
		emits('change', msgInfoTemp);
	}
	
	
	onMounted(() => {
		if(props.msgInfo.fetch && props.msgInfo.fetch.type === 'doPrompt' && props.msgInfo.imagesOptions[0].status !== 'done') {
			fetchPaintingTask();
		} else if (props.msgInfo.fetch && props.msgInfo.fetch.type === 'workflow') {
			fetchWorkflowTemplateList();
		}
	})
	const reloadGen = () => {
		fetchPaintingTask();
	}
</script>

<style scoped lang="scss">
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
			display: flex;
			flex-wrap: wrap;
			margin: 8rpx -16rpx 0;

			.robot-btn-box {
				padding: 16rpx 16rpx 0;
				min-width: 145rpx; // 占比 30%
			}

			.robot-btn {
				background: linear-gradient(135.00deg, rgb(23, 242, 95, 0.2) 0%, rgb(37, 106, 247, 0.2) 100%);
				border-radius: 200rpx;
				height: 56rpx;
				line-height: 56rpx;
				color: $font-primary-color2;
				font-size: 26rpx;
				font-weight: 400;

				&.active {
					color: #fff;
					background: linear-gradient(135.00deg, rgb(23, 242, 95), rgb(37, 106, 247) 100%);
				}
			}
		}

		.img-ratio-options {
			display: flex;
			flex-wrap: wrap;
			margin: 8rpx -16rpx 0;

			.robot-btn-box {
				padding: 16rpx 16rpx 0;
				min-width: 145rpx;
			}
			button.robot-ratio-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 64rpx;
				border-radius: 12rpx;
				border: solid 2rpx #CFDAEB;
				background: #fff;
				font-size: 28rpx;
				color: $font-primary-color2;
				&.active {
					border-color: #256AF7;
					color: #256AF7;
					.ratio-cube {
						background: #256AF7;
					}
				}
			}
			.ratio-cube-box {
				width: 28rpx;
				height: 28rpx;
				margin-right: 16rpx;
				display: inline-flex;
				align-items: center;
				justify-content: center;
			}
			.ratio-cube {
				background: #CFDAEB;
				border-radius: 4rpx;
			}
		}

		.images-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			// margin-bottom: -28rpx;


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
			}
		}
	}
</style>