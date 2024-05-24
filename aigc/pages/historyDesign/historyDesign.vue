<template>
	<z-paging ref="paging" v-model="dataList" use-virtual-list auto-show-back-to-top refresher-enabled @query="queryList" class="cus-z-paging">
		<template #top>
			<view class="fix-header">
				<g-color-btn :height="66" :width="180" @click="clickAll" :active="isAll">全部</g-color-btn>
				<g-select
					v-model="searchValues.type"
					:height="66" 
					:width="212" 
					:options="[{ label: 'logo生成', value: '0'}, { label: '创意营销大图', value: '1'}]" 
					@change="selectOptions"
					placeholder="类型"
				>
				</g-select>
				<g-select
					v-model="searchValues.time"
					:height="66" 
					:width="212" 
					:options="[{ label: '近一个月', value: '0'}, { label: '近7天', value: '1'}]" 
					@change="selectOptions"
					placeholder="时间">
				</g-select>
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
	import { ref,reactive, watch } from 'vue';
	// import { httpsRequest } from '@/common/utils';
	const dataList = ref([]);
	const paging = ref();
	const searchValues = reactive({
		type: null,
		time: null,
	});
	const isAll = ref(true);
	

	const selectOptions = (value) => {
		isAll.value = false
	}
	
		
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
	
	const clickAll = () => {
		isAll.value = true;
		searchValues.time = null;
		searchValues.type = null;
		console.log('clickAll')
		console.log(searchValues);
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
