<template>
	<view class="human-contact-item">
		<view class="human-contact-info-box">
			<view v-if="showTooltips" class="tooltips">
				<view v-for="(item, index) in toolList" :key="item.index" class="tooltips-btn" @click="item.click">
					<view :class="`iconfont ${item.icon}`"></view>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
			<view v-if="showTooltips" class="tooltips-bg" @touchstart="onTooltipsBgTouchstart"></view>
			<view v-if="msgInfo.content" class="content" @longpress="toggleShowTooltips"><text :class="showTooltips ? 'user-select': ''">{{ msgInfo.content }}</text></view>
			<view v-if="msgInfo.images" class="images">
				<view v-for="(imageItemSrc, imgIndex) in msgInfo.images" :key="imgIndex" class="image-box">
					<image :src="imageItemSrc" class="image" mode="aspectFit" @click="previewImg(imageItemSrc)"></image>
				</view>
			</view>
		</view>
		<image class="avatar" :src="userInfo.avatar"></image>
		<FontFamilyModal ref="FontFamilyModalRef" @ok="onSelectFontFamilyOk"></FontFamilyModal>
		<EditContentModal ref="EditContentModalRef" @ok="editContentModalOk"></EditContentModal>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, ref, defineEmits, computed, onMounted } from 'vue';
	import { UserMessage } from '@/common/mockData.ts';
	import FontFamilyModal from './fontFamilyModal.vue';
	import EditContentModal from './editContentModal.vue';
	
	const emits = defineEmits(['change']);

	const props = defineProps<{
		msgInfo: UserMessage
		userInfo : {
			avatar : string;
		}
	}>();
	

	const FontFamilyModalRef = ref();
	const EditContentModalRef = ref();
	const showTooltips = ref(false);
	// 是否存在工具栏
	const hasTooltips = computed(() => {
		if(props.msgInfo.tooltipsBtns && props.msgInfo.tooltipsBtns.length > 0) {
			return true;
		}
		return false;
	})
	
	const handleCopy = () => {
		uni.setClipboardData({
			data: props.msgInfo.content, //要被复制的内容
			success: () => { //复制成功的回调函数
				toggleShowTooltips();
				uni.showToast({ //提示
					icon: 'none',
					title: '复制成功'
				})
			}
		});
	}
	
	const handleEdit = () => {
		toggleShowTooltips();
		EditContentModalRef.value && EditContentModalRef.value.openModal(props.msgInfo.content);
	}
	
	const openFamilyModal = () => {
		toggleShowTooltips();
		
		const defaultFamily = props.msgInfo.interfaceParams[Object.keys(props.msgInfo.interfaceParams)[0]].fontfamily || '';
		FontFamilyModalRef.value && FontFamilyModalRef.value.openModal({
			defaultFamily
		});
	}
	
	
	const toolsMap = {
		'copy': {
			text: '复制全文',
			click: handleCopy,
			icon: 'icon-copy',
		},
		'edit': {
			text: '修改全文',
			click: handleEdit,
			icon: 'icon-edit',
		}, 
		'family': {
			text: '字体选择',
			click: openFamilyModal,
			icon: 'icon-font-family'
		}
	}
	
	const toolList = computed(() => {
		return props.msgInfo.tooltipsBtns.map((key) => toolsMap[key])
	});
	
	
	const toggleShowTooltips = () => {
		if (hasTooltips.value) {
			showTooltips.value = !showTooltips.value;
		}
	}
	
	const previewImg = (url : string) => {
		console.log(url);
		uni.previewImage({
			urls: [url],
		});
	}


	const onTooltipsBgTouchstart = () => {
		toggleShowTooltips();
	}
	
	const editContentModalOk = (newContent: string) => {
		const data = { ...props.msgInfo };
		data.content = newContent;
		data.interfaceParams[Object.keys(data.interfaceParams)[0]] = {
			...data.interfaceParams[Object.keys(data.interfaceParams)[0]],
			text: newContent,
		}
		emits('change', data);
	}
	
	const onSelectFontFamilyOk = (newFamily: string) => {
		const data = { ...props.msgInfo };
		data.interfaceParams[Object.keys(data.interfaceParams)[0]] = {
			...data.interfaceParams[Object.keys(data.interfaceParams)[0]],
			fontfamily: newFamily,
		}
		emits('change', data);
	}
</script>

<style scoped lang="scss">
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
			position: relative;
			margin-right: 20rpx;
		}

		.content {
			text-align: right;
			color: $font-primary-color2;
			background: rgba(37, 106, 247, 0.05);
			font-size: 26rpx;
			font-weight: 400;
			/* line-height: 68rpx; */
			padding: 20rpx 24rpx;
			box-sizing: border-box;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
		}

		.images {
			display: flex;
			    background: white;
			    border-radius: 24rpx;
			    padding: 16rpx;

			.image-box {
				margin: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				width: 148rpx;
				height: 148rpx;
				background: white;
				border: 2rpx solid #E8E9EB;
				border-radius: 24rpx;
				overflow: hidden;
				box-sizing: b; 
			}

			image.image {
				width: 148rpx;
				height: 148rpx;
				border-radius: 24rpx;
			}
		}
	}

	.tooltips {
		display: flex;
		position: absolute;
		right: 0;
		bottom: 100rpx;
		background: #424448;
		border-radius: 16rpx;
		// background: rgba(4, 8 , 13, 0.8);
		padding: 24rpx 16rpx;
		z-index: 80;

		.tooltips-btn {
			color: rgb(253, 253, 253);
			margin: 0 16rpx;
			width: 96rpx;
			text-align: center;

			&:active {
				opacity: 0.6;
			}
		}

		.iconfont {
			font-size: 44rpx;
		}

		.text {
			margin-top: 8rpx;
			height: 40rpx;
			line-height: 40rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: rgb(253, 253, 255, 0.8);
		}
	}
	.tooltips-bg {
		position: fixed;
		width: 100vw;
		height: 100vh;
		// background: red;
		top: 0;
		left: 0;
		z-index: 70;
	}
	.user-select {
		background: #b1c9f9;
	}
</style>