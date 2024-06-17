<template>
	<z-paging ref="paging" v-model="dataList" use-virtual-list auto-show-back-to-top refresher-enabled @query="queryList" class="cus-z-paging">
		<template #top>
			<view class="fix-header">
				<g-color-btn :height="66" :width="180" @click="clickAll" :active="isAll">全部</g-color-btn>
				<g-select
					v-model="searchValues.type"
					:height="66" 
					:width="212" 
					:options="[{ label: 'logo生成', value: '1'}, { label: '创意营销大图', value: '2'}]" 
					@change="selectOptions"
					placeholder="类型"
				>
				</g-select>
				<g-select
					v-model="searchValues.time"
					:height="66" 
					:width="212" 
					:options="[{label: '昨天起', value: '1'}, {label: '近7天', value: '7'}, { label: '近一个月', value: '30'}]" 
					@change="selectOptions"
					placeholder="时间">
				</g-select>
			</view>
		</template>
		<template v-slot:cell="{item,index}">
			<view class="list-item" @click="clickItem(item)">
				<view class="list-info">
					<view class="desc">{{ item.title }}</view>
					<view class="time">{{ item.createTime }}</view>
				</view>
				<view class="image-box">
					<image :src="item.imgUrl"></image>
				</view>
			</view>
		</template> 
	</z-paging>
</template>

<script setup lang="ts">
	import { ref,reactive, watch, nextTick } from 'vue';
	import { httpsRequest, getDay } from '@/common/utils';
	const dataList = ref([]);
	const paging = ref();
	const searchValues = reactive({
		type: null,
		time: null,
	});
	const isAll = ref(true);
	


	const selectOptions = (value) => {
		isAll.value = false
		nextTick(() => {
			paging.value.reload()
		})
	}
	
	
		
	const queryList = async (pageNo, pageSize) => {
		console.log(pageNo, pageSize)
		// if(pageNo === 1) {
		const userInfo = JSON.parse(uni.getStorageSync('userInfo'));
		let query = {
			ownerId: userInfo.userId
		}	
		if(searchValues.type) {
			query.type =searchValues.type;
		}
		if(searchValues.time) {
			const type = Number(searchValues.time);
			query.endTime = `${getDay(0)} 23:59:59`;
			if(type === 1) {
				// 昨天
				query.startTime = `${getDay(-1)} 00:00:00`;
			} else if(type === 7) {
				query.startTime = `${getDay(-6)} 00:00:00`;
			} else if(type === 30) {
				query.startTime = `${getDay(-29)} 00:00:00`;
			}
		}
			const res = await httpsRequest(`/hh/dialog_dl/pageBy/${pageSize}/${pageNo}`, query, 'GET');
			paging.value.complete(res.data || []);
		// } else {
		// 	paging.value.complete([]);
		// }
	}
	
	const clickAll = () => {
		isAll.value = true;
		searchValues.time = null;
		searchValues.type = null;
		paging.value.reload();
	}
	
	const clickItem = (item) => {
		if(item.imgType !== 'svg') {
			uni.previewImage({
				urls: [item.imgUrl]
			})
		}
		
		// uni.reLaunch({
		// 	url: `/pages/designCenter/designCenter?id=${item.id}`,
		// })
		// uni.redirectTo({
		// 	url: `/pages/designCenter/designCenter?id=${item.id}`,
		// })
	}
</script>

<style lang="scss" scoped>
	.fix-header {
		background-color: white;
		display: flex;
		justify-content: space-evenly;
		height: 130rpx;
		align-items: center;
		border-top: solid 1px #EDF1F6;
		padding: 0 16rpx;
	}
	.list-item {
		display: flex;
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		margin: 32rpx 32rpx 0;
	
		
		.list-info {
			flex: 1;
			display: flex;
			    flex-direction: column;
			    justify-content: space-between;
	
			.desc {
				font-size: 28rpx;
				font-weight: 400;
				color: $font-primary-color2;
				overflow: hidden;
				   text-overflow: ellipsis;
				   display: -webkit-box;
				   -webkit-line-clamp: 2;
				   -webkit-box-orient: vertical;
			}
			.time {
				margin-top: 28rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: $gray-color;
			}
		}
		
		.image-box {
			width: 160rpx;
			height: 160rpx;
			margin-left: 36rpx;
		}
		image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 12rpx;
			background-color: $border-grey-color;
		}
	}
</style>
