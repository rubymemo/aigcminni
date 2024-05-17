<template>
	<view class="page-bg">
		<view class="header" :style="headerStyle">
			<view v-if="showBack" class="back" @click="handleBack">
				<span class="icon iconfont icon-back"></span>
			</view>
		{{ props.title }}
		</view>
		<view class="page-container" :style="pageStyle">
			<slot />
		</view>
	</view>

</template>

<script setup lang="ts">
	import { onBeforeMount, ref, defineProps } from 'vue';
	const props = defineProps<{
		title: string;
		showBack?: boolean;
		backUrl?: string;
		headerStyle?: Record<string, any>;
		pageStyle?: Record<string, any>;
	}>();
	const headerStyle = ref();
	
	onBeforeMount(() => {
		let res = wx.getSystemInfoSync();
		headerStyle.value = {
			'padding-top': res.statusBarHeight + 'px',
			...(props.headerStyle || {})
		};	
	})
	
	const handleBack = () => {
		if(props.backUrl) {
			uni.navigateTo({
				url: props.backUrl
			});
		} else {
			uni.navigateBack();
		}
	}

</script>

<style lang="scss" scoped>
	.page-bg {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: $main-green;
		.header {
			height: 44px;
			line-height: 44px;
			text-align: center;
		}
		
		.page-container {
			flex: 1;
			background: $light-green-bg;
			padding: 60rpx 7vw 0;
			border-radius: 14vw 14vw 0 0;
			overflow-y: scroll;
		}
	}
	.back {
		.icon-back {
			position: absolute;
			left: 20px;
			font-size: 20px;
			color: white;
		}
			
	}
</style>