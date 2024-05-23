<template>
  <view :class="`input-box ${inputClass}`">
		<view class="input">
			<slot name="prepend"></slot>
			<input
				v-model="inputvalue"
				:placeholder="props.placeholder"
				@focus="onInputFocus"
				@blur="onInputBlur"
				placeholder-style="color: #A3B4CC"
			/>
			<slot name="append"></slot>
		</view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, watch, defineProps } from 'vue';

	const props = defineProps<{
		placeholder: string
	}>()

  const emits = defineEmits(['update:modelValue', 'blur']);

	const inputvalue = ref('');
	const inputClass = ref('');

	watch(() => inputvalue.value, (newValue: string) => {
		emits('update:modelValue', newValue);
	})

	const onInputFocus = () => {
		inputClass.value = 'input-focus';
	}
	const onInputBlur = () => {
		inputClass.value = '';
		emits('blur');
	}

</script>

<style lang="scss" scoped>
		.input-box {
			padding: 1px;
			background: #ffff;
			border-radius: 100px;
			&.input-focus {

				background: linear-gradient(to right, rgb(23, 242, 95), rgb(37, 106, 247));
				// border-image-slice: 1;
				// border-color: linear-gradient(135.00deg, rgb(23, 242, 95) 0%,rgb(37, 106, 247) 100%);;
			}
		}
			
    .input {			
      display: flex;
      align-items: center;  
      box-sizing: border-box;
      // width: 32;
      height: 100rpx;
      line-height: 100rpx;
      border-radius: 100px;
      // border: 1px solid rgb(163, 180, 204);
      background: rgb(255, 255, 255);
      overflow: hidden;
      padding: 0px 24px;
			
		
      input {
        height: 22px;
        border: none;
        flex: 1;
		color: $font-primary-color2;
		
        &:focus-visible {
          outline: none;
        }
      }
      .append {
        &::v-deep {
          .arco-link {
            color: #256AF7;
          }
        }
      }
    }
</style>
