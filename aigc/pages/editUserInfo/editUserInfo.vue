<template>
	<view class="container">
		<view class="avatar-div">
			<view class="avatar-box" @click="handleChooseImg">
				<image class="avatar" :src="userInfo.avatar" ></image>
				<view class="camera-box">
					<view class="iconfont icon-camera"></view>
				</view>
			</view>
		</view>
		
		<view class="card">
			<view class="card-item">
				<view class="left">
					<text class="label">昵称</text>
				</view>
				<view class="right">
					<input class="label" @blur="putUserInfo" v-model.trim="userInfo.nickname" focus placeholder="请输入昵称" placeholder-style="color: #6B748F"/>
				</view>
			</view>
			<view class="diliver"></view>
			<view class="card-item">
				<view class="left">
					<text class="label">性别</text>
				</view>
				<view class="right">
					<view :class="`gender-btn ${userInfo.gender === 'M' ? 'active' : ''}`" style="margin-right: 20px;" @click="choseGener('M')">
						<view class="gender-btn-inner"><view class="iconfont icon-nan"></view>男</view>
					</view>
					<view :class="`gender-btn ${userInfo.gender === 'F' ? 'active' : ''}`" @click="choseGener('F')">
						<view class="gender-btn-inner"><view class="iconfont icon-nv"></view>女</view>
					</view>
				</view>
			</view>
			<view class="diliver"></view>
			<view class="card-item">
				<view class="left">
					<text class="label">生日</text>
				</view>
				<view class="right cus-data-picker">
					
					<uni-datetime-picker type="date" :clear-icon="false" v-model="userInfo.birth" />
					<!-- <text class="label">番茄炒蛋</text> -->
				</view>
			</view>
			<view class="diliver"></view>
			<view class="card-item">
				<view class="left">
					<text class="label">手机号</text>
				</view>
				<view class="right">
					<input class="label" v-model.trim="userInfo.mobile" type="number" placeholder="请输入手机号" placeholder-style="color: #6B748F"/>
				</view>
			</view>
		</view>
	
<!-- 		<view class="card">
			<view class="tit">账号绑定</view>
			<view class="card-item">
				<view class="left">
					<image class="weixin" src="@/static/svg/weixin.svg"></image>
					<text class="label">微信</text>
				</view>
				<view class="right">
					<text class="label" style="margin-right: 4px;">已绑定</text>
					<uni-icons class="right-icon" type="right" size="14" color="#6b748fab"></uni-icons>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script setup lang="ts">
	import { nextTick, ref } from 'vue';
	import { onLoad, onBackPress, onHide, onUnload } from "@dcloudio/uni-app";
	import { httpsRequest, genImgURl, host } from '@/common/utils';
	
	
	const userInfo = ref({
		id: '',
		avatar: '',
		nickname: '',
		birth: '',
		gender: '',
		mobile: ''
	})
	
	
	const getUserInfo = async (id: string) => {
		const res = await httpsRequest(`/cx/member/findById/${id}`, userInfo.value, 'GET');
		userInfo.value = {
			id,
			...res
		};
	}
	
	const putUserInfo = async () => {
		const res = await httpsRequest('/cx/member/editById', userInfo.value, 'PUT');
	}
	
	const choseGener = (gender: string) => {
		userInfo.value.gender = gender;
	}
	onLoad(() => {
		const res = JSON.parse(uni.getStorageSync('userInfo'));
		getUserInfo(res.userId);
		
	})
	const handleChooseImg = () => {
		uni.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			camera: 'back',
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFiles;
				uni.uploadFile({
					url: `${host}/hh/comfyui_api_v2/uploadImage`, //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0].tempFilePath,
					name: 'image',
					success: (uploadFileRes) => {
						const uploadData = JSON.parse(uploadFileRes.data);
						if (Number(uploadData.code) === 2000) {
							const url = uploadData.data;
							userInfo.value.avatar = url;
						} else {
							uni.showToast({
								icon: 'none', title: '上传失败，请联系客服或稍后重试'
							})
						}
					},
					fail: () => {
						uni.showToast({
							icon: 'none', title: '上传失败，请联系客服或稍后重试'
						})
					}
				});
			}
		});
				
	}
	onUnload(() => {
		putUserInfo();
	})
</script>

<style lang="scss" scoped>
.container {
	padding: 0 32rpx;
	.avatar-div {
		padding: 48rpx 0;
		text-align: center;
	}
	.avatar-box {
		position: relative;
		width: 140rpx;
		height: 140rpx;
		background: $bg-color;
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		.avatar {
			width: 136rpx;
			height: 136rpx;
			border-radius: 50%;
			background: white;
			// background-color: #CFDAEB;
		}
		.camera-box {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			bottom: 0;
			right: 0;
			width: 20px;
			height: 20px;
			border-radius: 4px;
			background: $bg-color;
			.iconfont {
				margin-left: 2rpx;
				font-size: 26rpx;
				color: white;
				    margin-left: 3rpx;
				    margin-top: 2rpx;
			}
		}
	}
	
}

	.card {
		background: white;
		border-radius: 12px;
		padding: 0 40rpx;
		color: $font-primary-color2;
		margin-bottom: 32rpx;
		.tit {
			padding: 40rpx 0 8rpx;
			font-weight: 500;
			font-size: 16px;
			line-height: 24px;
			
		}
		.card-item {
			display: flex;
			justify-content: space-between;
			height: 108rpx;
			line-height: 108rpx;
			
			.left {
				display: flex;
				align-items: center;
				.label {
					font-size: 28rpx;
				}
			}
			.right {
				display: inline-flex;
				align-items: center;
				.label {
					font-size: 28rpx;
					color: $gray-color;
				}
				input {
					text-align: right;
				}
			}
			.label {
				margin-left: 16rpx;
			}
		}
		.diliver {
			width: 100%;
			height: 2rpx;
			background: #EDF1F6;
		}
		
	}
	
	.gender-btn {
		height: 48rpx;
		line-height: 48rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 2rpx;
		border-radius: 200rpx;
		background: $border-grey-color;
		
		.gender-btn-inner {
			border-radius: 200rpx;
			height: 44rpx;
			line-height: 44rpx;
			background: white;
			padding: 0 24rpx;
			font-size: 14px;
			font-weight: 400;
			color: $gray-color;
		}
		
		.iconfont {
			display: inline-block;
			font-size: 14px;
			margin-right: 12rpx;
		}
		.iconfont.icon-nan {
			color: #256AF7;
		}
		.iconfont.icon-nv {
			color: #FF42BE;
		}
		
		&.active {
			background: $bg-color;
		}
	}
	.weixin {
		width: 48rpx;
		height: 48rpx;
	}
	.cus-data-picker {
		&::v-deep {
			.uni-date-x--border {
				border: none;
			}
			.icon-calendar {
				display: none;
			}
			.uni-date__x-input {
				height: 60rpx !important;
				line-height: 60rpx !important;
				color: $gray-color !important;
			}
			
		}
	}
</style>
