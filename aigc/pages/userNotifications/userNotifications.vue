<template>
	<z-paging ref="paging" v-model="dataList" use-virtual-list auto-show-back-to-top refresher-enabled @query="queryList" class="cus-z-paging">
		<template #top>
			<view class="fix-header">
			</view>
		</template>
		<template v-slot:cell="{item,index}">
			<view style="background-color: white;">
			<view class="list-item" @click="clickItem(item)">
				<view class="image-box">
					<image :src="item.imgUrl"></image>
				</view>
				<view class="list-info">
					<view class="title">{{ item.title }}</view>
					<view class="desc">{{ item.createTime }}</view>
				</view>
				<view class="time">
					<view>{{ item.createTime }}</view>
				</view>
			</view>
			</view>
		</template> 
	</z-paging>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { httpsRequest } from '@/common/utils';
	
	const dataList = ref([]);
	const paging = ref();
		
	const queryList = async (pageNo, pageSize) => {
		console.log(pageNo, pageSize)
		const userInfo = JSON.parse(uni.getStorageSync('userInfo'));
		let query = {
			ownerId: userInfo.userId
		}	
			const res = await httpsRequest(`/hh/dialog/pageMeBy/${pageSize}/${pageNo}`, query, 'GET');
			paging.value.complete(res.data || []);
	}
</script>

<style lang="scss" scoped>
	.fix-header {
		border-top: solid 1px #EDF1F6;
	}

	.list-item {
		display: flex;
		margin: 0 32rpx;
		padding: 32rpx 0;
		border-bottom: solid 1px #EDF1F6;
		
		.image-box {
			display: inline-flex;
			align-items: center;
			width: 80rpx;
	
			margin-right: 24rpx;
		}
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		.list-info {
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			.title {
				font-size: 28rpx;
				line-height: 44rpx;
				font-weight: 500;
				margin-bottom: 16rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.desc {
				font-size: 24rpx;
				line-height: 40rpx;
				color: $gray-color;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.time {
			font-size: 24rpx;
			color: $border-gray-color;
		}
	}
</style>
