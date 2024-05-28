<template>
	<view :class="`g-color-btn-box ${isShowOptions ? 'active' : ''}`" :style="{
		height: props.height + 'rpx',
		background: (isShowOptions || activeTab !== null) ? 'linear-gradient(135.00deg, rgb(23, 242, 95),rgb(37, 106, 247) 100%)' : '#CFDAEB'
		}">
		<view class="g-color-btn" :style="{
			height: props.height - 4 + 'rpx',
			lineHeight: props.height - 4 + 'rpx',
			width: props.width ? props.width + 'rpx' : 'auto',
			color: (isShowOptions || activeTab !== null) ? '#344156' : '#6B748F'
		}" @click="switchShowOptions">
			<text>{{ activeOption ? activeOption.label : (props.placeholder || '') }}</text>
			<view class="iconfont icon-a-zuhe7205"></view>

		</view>
		<view class="options-plain" v-show="isShowOptions" :style="{
			width: props.width ? props.width + 'rpx' : 'auto'
		}">
			<view v-for="(item) in props.options" :key="item.value"
				:class="`option-item ${activeTab === item.value ? 'active' : ''}`" @click="chooseOption(item)">
				{{ item.label }}</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, ref, defineEmits, watch } from 'vue';
	const props = defineProps<{
		modelValue?: string | number | null;
		height : number;
		width ?: number;
		placeholder ?: string;
		options ?: Array<{
			label : string,
			value : string | number,
		}>
	}>()
	const emits = defineEmits(['update:modelValue', 'change']);
	// 选择的值
	const activeTab = ref<string | number | null>(null);

	const isShowOptions = ref(false);

	const activeOption = ref<{
		label : string | number,
		value : string | number,
	} | null>(null)
	
	watch(() => props.modelValue, (newValue) => {
		if(newValue !== activeTab.value) {
			if(!newValue) {
				activeTab.value = null;
				activeOption.value = null;
			} else {
				activeTab.value = newValue;
				activeOption.value = {
					label: newValue,
					value: newValue
				}
			}
		}
	})

	const switchShowOptions = () => {
		isShowOptions.value = !isShowOptions.value;
	}
	const chooseOption = (item) => {
		activeTab.value = item.value;
		activeOption.value = item;
		switchShowOptions();
		emits('update:modelValue', item.value);
		emits('change', item.value)
	}
	
	
</script>

<style lang="scss" scoped>
	.g-color-btn-box {
		position: relative;
		// background: $border-grey-color;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 2rpx;
		border-radius: 200rpx;

		.g-color-btn {
			position: relative;
			background: white;
			border-radius: 200rpx;
			text-align: center;
			// color: $gray-color;
			font-size: 28rpx;
			font-weight: 400;
		}

		&.active,
		&::active {
			// background: $bg-color;
			// color: $font-primary-color2;
		}

		&.active {
			.icon-a-zuhe7205 {
				transform: rotate(180deg);
			}
		}
	}

	.icon-a-zuhe7205 {
		font-size: 32rpx;
		width: 32rpx;
		height: 32rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: 8rpx;
		color: $border-gray-color;
	}

	.options-plain {
		box-sizing: border-box;
		position: absolute;
		top: 80rpx;
		background: white;
		padding: 8rpx;
		z-index: 200;
		border-radius: 12rpx;
		box-shadow: 0px 8px 16px 0px rgba(2, 32, 77, 0.12);
	}

	.option-item {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		font-weight: 400;
		padding: 8rpx 12rpx;
		color: $font-primary-color2;

		&.active {
			color: $link-color;
			background: linear-gradient(135.00deg, rgb(23, 242, 95, 0.1) 0%, rgb(37, 106, 247, 0.1) 100%);
		}
	}
</style>