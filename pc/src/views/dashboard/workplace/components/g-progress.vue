<template>
	<div class="g-progress">
		<div class="g-progress-inner" :style="{
			width: props.progress + '%'
		}"></div>
	</div>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';

	const props = defineProps<{
		progress: number
	}>()
</script>

<style lang="less" scoped>
	.g-progress {
		height: 6px;
		width: 100%;
		background-color: #F7F9FA;
		border-radius: 100px;
	}
	.g-progress-inner{
		background: linear-gradient(135.00deg, rgb(23, 242, 95) 0%,rgb(37, 106, 247) 100%);;
		border-radius: 100px;
		height: 6px;
		transition: all .3s cubic-bezier(.08,.82,.17,1) 0s;
	}
</style>