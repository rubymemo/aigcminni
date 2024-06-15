<template>
	<uni-popup ref="popup">
		<view class="popup-content">
			<view class="close" @click="closeModal">
				<text class="iconfont icon-close"></text>
			</view>
			<view class="popup-title">修改全文</view>
			<view class="textarea-box">
				<textarea v-model="textValue"></textarea>
			</view>
			<view class="button-box">
				<button class="normal-1" @click="closeModal">取消</button>
				<button class="primary confirm-btn" @click="clickOk">确认发送内容</button>
			</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
	import { ref, defineExpose, defineEmits } from 'vue';
	
	const emits = defineEmits(['ok', 'cancel']);
	const popup = ref(false);
	
	const textValue = ref('');
	
	const closeModal = () => {
		emits('cancel');
		popup.value.close();
	}
	const openModal = (text: string) => {
		console.log(text);
		textValue.value = text;
		popup.value.open()
	}
	
	
	const clickOk = () => {
		emits('ok', textValue.value);
		closeModal();
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
	.textarea-box {
		border-radius: 16rpx;
		border: solid 1px #E8E9EB;
		padding: 24rpx;
		margin-bottom: 56rpx;
		textarea {
			font-size: 28rpx;
			height: 88rpx;
			color: $font-primary-color2;
		}
	}

	.button-box {
		display: flex;
		justify-content: space-between;
		.normal-1 {
			width: 204rpx;
			height: 88rpx;
			line-height: 88rpx;
			margin: 0;
		}
		.confirm-btn {
			height: 88rpx; 
			line-height: 88rpx;
			font-weight: 400;
			width: 320rpx;
			margin: 0;
		}
	}
	
</style>