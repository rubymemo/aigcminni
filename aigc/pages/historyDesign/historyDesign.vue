<template>
	<z-paging ref="paging" v-model="dataList" use-virtual-list auto-show-back-to-top refresher-enabled @query="queryList" class="cus-z-paging">
		<template #top>
			<view class="fix-header">
				<g-color-btn :height="66" :width="180">全部</g-color-btn>
				<g-color-btn :height="66" :width="180">全部</g-color-btn>
				<g-color-btn :height="66" :width="180">全部</g-color-btn>
			</view>
		</template>
		<template v-slot:cell="{item,index}">
			<view class="list-item">
				<view class="list-info">
					<view class="desc">据交通运输部公众号，根据国务院物流保通保畅工作领导小组办公室监</view>
					<view class="time">2024/04/03</view>
				</view>
				<view class="image-box">
					<image src="../../static/c1.png"></image>
				</view>
			</view>
		</template> 
	</z-paging>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	// import { httpsRequest } from '@/common/utils';
	const dataList = ref([]);
	const paging = ref();
	
	const queryList = async (pageNo, pageSize) => {
		console.log(pageNo, pageSize)
		if(pageNo === 1) {
			// const data = await httpsRequest('/api/channelGameRelation/queryForPageChannelGameRelation', {
			// 	pageNo, 
			// 	pageSize,
			// });
			paging.value.complete([1,2,3,4,5]);
		} else {
			paging.value.complete([]);
		}
	}
</script>

<style lang="scss" scoped>
	.fix-header {
		background-color: white;
		display: flex;
		height: 130rpx;
		align-items: center;
		border-top: solid 1px #EDF1F6;
	}
	.list-item {
		display: flex;
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		margin: 32rpx 32rpx 0;
	
		
		.list-info {
			flex: 1;
			.desc {
				font-size: 14px;
				font-weight: 400;
				color: $font-primary-color2;
			}
			.time {
				margin-top: 28rpx;
				font-size: 14px;
				font-weight: 400;
				color: $gray-color;
			}
		}
		
		.image-box {
			width: 160rpx;
			height: 160rpx;
		}
		image {
			width: 160rpx;
			height: 160rpx;
		}
	}
</style>
