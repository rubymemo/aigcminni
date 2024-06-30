<template>
	<view>
		<uni-popup ref="popup">
			<view class="popup-content">
				<view class="close" @click="closeModal">
					<text class="iconfont icon-close"></text>
				</view>
				<view class="popup-title">作品下载</view>
				<view class="image-box">
					<image :src="imageUrl" mode="aspectFit" @click="previewImg"></image>
				</view>
				<view class="radio-title">保存格式选择</view>
				<view class="radio-group" :style="{
				height: screenHeight < 800 ? '200rpx' : 'auto'
			}">
					<radio-group @change="onRadioSelect">
						<view class="radio-item" v-for="(item, index) in list" :key="index"
							@click="handleSelectRadio(item.value)">
							<view class="radio-btn-box">
								<button
									:class="`${item.value === radioValue ? 'primary' : 'gray-btn'} radio-item-button`">{{ item.label}}</button>
								<radio class="radio" :value="item.value" color="#256AF7"
									:checked="item.value === radioValue" />
							</view>
							<view class="desc">{{ item.desc }}</view>
						</view>
					</radio-group>
				</view>
				<button class="primary confirm-btn" @click="clickDownLoad">确认下载</button>
			</view>
		</uni-popup>
		<downloadImgResultModal ref="DownloadImgResultModalRef"></downloadImgResultModal>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineExpose, defineProps } from 'vue';
	import { ImgOption } from '@/common/mockData.ts';
	import downloadImgResultModal from './downloadImgResultModal.vue';
	import { httpsRequest } from '@/common/utils';

	const props = defineProps<{
		dialogId : string;
		userId : string;
	}>();

	const popup = ref(false);
	const DownloadImgResultModalRef = ref();

	const list = [
		{ label: 'JPEG', desc: '体积较小的图片，不支持透明背景', value: 'jpeg' },
		{ label: 'PNG', desc: '无损图片画质更优，体积较大，支持透明背景', value: 'png' },
		{ label: 'SVG', desc: '普遍应用标准图片，体积较小，易于修改和编辑', value: 'svg' },
	]
	const radioValue = ref('');
	const imageUrl = ref('');
	const imageObj = ref({
		jpeg: '',
		png: '',
		svg: ''
	})
	const btnLoading = ref(false);
	const sysInfo = uni.getSystemInfoSync();
	const screenHeight = sysInfo.screenHeight;

	const fetchImageUrl = async (url : string) => {
		const res = await httpsRequest('/hh/dialog_dl/listUrls', {
			url,
		}, 'GET');
		if (res) {
			imageObj.value = {
				...imageObj.value,
				...res
			};
		}
	}

	const closeModal = () => {
		popup.value.close();
	}
	const openModal = (data : {
		imageOptions : ImgOption[],
		imgIndex : number
	}) => {
		radioValue.value = '';
		imageObj.value = {
			jpeg: '',
			png: '',
			svg: '',
		};
		const url = data.imageOptions[data.imgIndex].url;
		imageUrl.value = url;

		fetchImageUrl(url);
		popup.value.open()
	}

	const handleSelectRadio = (value : string) => {
		radioValue.value = value;
	}
	const onRadioSelect = (evt) => {
		radioValue.value = evt.detail.value;
	}

	const fetchAddHistory = async ({
		imgUrl,
		imgType
	}) => {
		const params = {
			dialogId: props.dialogId,
			imgUrl,
			imgType
		}
		await httpsRequest('/hh/dialog_dl/addHistory', params);
	}

	const saveSuccess = () => {
		btnLoading.value = false;
		uni.hideLoading();
		fetchAddHistory({
			imgType: radioValue.value,
			imgUrl: imageObj.value[radioValue.value]
		})
		closeModal();
		DownloadImgResultModalRef.value && DownloadImgResultModalRef.value.openModal({ type: radioValue.value });
	}

	const saveFail = (res : { errMsg : string }) => {
		btnLoading.value = false;
		uni.hideLoading();
		return uni.showToast({
			icon: 'error',
			title: '下载失败',
		});
	}

	const savePosterPath = (url) => {
		//获取用户的当前设置。获取相册权限
		uni.getSetting({
			success: (res) => {
				//如果没有相册权限
				if (!res.authSetting["scope.writePhotosAlbum"]) {
					//向用户发起授权请求
					uni.authorize({
						scope: "scope.writePhotosAlbum",
						success: () => {
							//授权成功保存图片到系统相册
							uni.saveImageToPhotosAlbum({
								//图片路径，不支持网络图片路径
								filePath: url,
								success: saveSuccess,
								fail: saveFail,
							});
						},
						//授权失败
						fail: () => {
							uni.hideLoading();
							uni.showModal({
								title: "您已拒绝获取相册权限",
								content: "是否进入权限管理，调整授权？",
								success: (res) => {
									if (res.confirm) {
										//调起客户端小程序设置界面，返回用户设置的操作结果。（重新让用户授权）
										uni.openSetting({
											success: (res) => {
												console.log(res.authSetting);
											},
										});
									} else if (res.cancel) {
										return uni.showToast({
											title: "已取消！",
										});
									}
								},
							});
						},
					});
				} else {
					//如果已有相册权限，直接保存图片到系统相册
					uni.saveImageToPhotosAlbum({
						filePath: url,
						success: saveSuccess,
						fail: saveFail,
					});
				}
			},
			fail: (res) => {
			},
		});
	};

	const fetchDownloadSvg = async () => {
		
		const findSvg = await httpsRequest('/hh/comfyui_api_v2/png2svg', {
			fileUrl: imageObj.value.png,
			dialogId: props.dialogId,
		}, 'GET')
		
		if(typeof findSvg === 'string') {
			// svg已经下载过了
			imageObj.value.svg = findSvg;
			uni.downloadFile({
				url: findSvg,
				success: (res) => {
					if (res.statusCode === 200) {
						savePosterPath(res.tempFilePath)
					}
				}
			})
			return;
		}
		
		uni.connectSocket({
			url: `wss://huatu.solart.pro/ws?clientId=${props.userId}`,
		});
		const promptRes = await httpsRequest('/hh/comfyui_api_v2/doPrompt', {
			clientId: props.userId,
			image: imageObj.value.png,
			tplCode: 'png2svg',
		});
		if (promptRes) {
			uni.onSocketOpen(async function (res) {
				console.log('WebSocket连接已打开！');
			});
			uni.onSocketMessage(async function (res) {
				const msgData = JSON.parse(res.data);
				if (msgData.type === 'executing' && msgData.data.node === null) {
					uni.closeSocket()

					const imagesSvgUrl = await httpsRequest(`/hh/comfyui_api_v2/png2svg`, {
						fileName: promptRes.fileName,
						dialogId: props.dialogId,
						fileUrl: imageObj.value.png,
					}, 'GET');

					if (!imagesSvgUrl) return;
					imageObj.value.svg = imagesSvgUrl;
					uni.downloadFile({
						url: imagesSvgUrl,
						success: (res) => {
							if (res.statusCode === 200) {
								savePosterPath(res.tempFilePath)
							}
						}
					})
				}
			})

			uni.onSocketClose(function (res) {
				console.log('WebSocket 已关闭！');
			})
		} else {
		}
	}


	const clickDownLoad = () => {
		if (!radioValue.value) {
			uni.showToast({
				title: "请先选择要下载的格式",
				icon: "none"
			})
			return;
		}
		btnLoading.value = true;
		uni.showLoading({
			title: '正在保存...'
		});
		
		if (radioValue.value === 'svg') {
			// 如果是svg需要监听ws
			fetchDownloadSvg();
		} else {
			// png | jpeg
			uni.downloadFile({
				url: imageObj.value[radioValue.value],
				success: (res) => {
					if (res.statusCode === 200) {
						savePosterPath(res.tempFilePath)
					}
				}
			})
		}
	}

	const previewImg = () => {
		uni.previewImage({
			urls: [imageUrl.value],
			showmenu: false
		})
	}

	defineExpose({
		openModal,
	})
</script>

<style lang="scss" scoped>
	.close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;

		.iconfont {
			font-size: 40rpx;
		}
	}

	.popup-content {
		width: 668rpx;
		box-sizing: border-box;
		padding: 56rpx 48rpx;
		border-radius: 32rpx;
		background: #fff;
		// margin: 0 -22rpx;
	}

	.popup-title {
		color: rgb(52, 65, 86);
		font-size: 36rpx;
		line-height: 48rpx;
		text-align: center;
		margin-bottom: 56rpx;
	}

	.image-box {
		width: 100%;
		height: 400rpx;
		border-radius: 24rpx;
		background-image: url('../../../static/png/image-bg.png');
		background-size: 100%;
		margin-bottom: 56rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.confirm-btn {
		height: 88rpx;
		line-height: 88rpx;

		&:hover,
		&:active {
			opacity: 0.8;
		}
	}

	.radio-title {
		color: $font-primary-color2;
		font-size: 32rpx;
		line-height: 48rpx;
		margin-bottom: 24rpx;
	}

	.radio-group {
		overflow: scroll;
		margin-bottom: 54rpx;
	}

	.radio-item {
		&:not(:last-child) {
			margin-bottom: 24rpx;
		}

		.radio-btn-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		button.radio-item-button {
			width: 126rpx;
			height: 52rpx;
			font-size: 24rpx;
			line-height: 52rpx;
			margin: 0;
		}

		button.gray-btn {
			background: rgba(207, 218, 235, 0.4);
			color: #6B748F;
			border-radius: 40rpx;
		}

		.radio {
			transform: scale(0.6);
		}

		.desc {
			font-size: 24rpx;
			font-weight: 400;
			color: #6B748F;
			margin: 16rpx 0 0;
		}
	}
</style>