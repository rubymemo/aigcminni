<template>
  <CommonModal
    title="作品下载"
    :width="630"
    v-model:visible="visible"
    @ok="handleDownload"
  >
    <div class="img-download-container">
      <div class="img-container">
        <a-image
          :src="url"
          :preview="false"
          :width="258"
          :height="258"
          fit="scale-down"
        />
      </div>
      <div class="option-area">
        <div class="title">保存格式选择</div>

        <a-radio-group v-model="activeBtn" class="radio-group">
          <div
            v-for="option in options"
            :key="option.type"
            class="type-option"
          >
            <div class="choose-area">
              <a-button
                class="type-button"
                :class="activeBtn === option.type && 'active-type-button'"
                @click="handleTypeChange(option.type)"
                >{{ option.type.toUpperCase() }}</a-button
              >
              <a-radio :value="option.type">
                <template #radio="{ checked }">
                  <span
                    v-if="checked"
                    class="iconfont icon-success checked-icon"
                  />
                  <span v-else class="radio-no-checked" />
                </template>
              </a-radio>
            </div>
            <div class="type-des">
              {{ option.des }}
            </div>
          </div>
        </a-radio-group>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import { getDownloadUrl, getSvgUrl, sendMessageV2 } from '@/api/dashboard';
import { computed, ref, toRefs, watch } from 'vue';
import CommonModal from '@/components/common-modal.vue';
import { useUserStore } from '@/store';

interface Props {
  url: string;
  visible: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:visible']);
const { url } = toRefs(props);

const visible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val),
});

const options = [
  {
    type: 'jpeg',
    des: '体积较小的图片，不支持透明背景',
  },
  {
    type: 'png',
    des: '无损图片画质更优，体积较大，支持透明背景',
  },
  {
    type: 'svg',
    des: '普遍应用标准图片，体积较小，易于修改和编辑',
  },
];

const imgObj = ref<any>({});
// const optionComputed = computed(() => {
//   const types = Object.keys(imgObj.value);
//   return options.filter((item) => types.includes(item.type));
// });

const activeBtn = ref(options[0].type);

const handleTypeChange = (type: string) => {
  activeBtn.value = type;
};

const userInfo = useUserStore()

const downloadByUrl = (url: string) => {
  window.open(url, '__blank');
  visible.value = false;
}

const downloadSvg = () => {
  const uid = userInfo.userId;
  const ws = new WebSocket(`wss://huatu.solart.pro/ws?clientId=${uid}`);
  let promptId = '';
  let nodeCount: number;
  let currentStep = 0;
  let stepLength = 0;
  let fileName = '';
  ws.onopen = () => {
    sendMessageV2({
      clientId: userInfo.userId,
      image: props.url,
      tplCode: 'png2svg'
    }).then((res) => {
      promptId = res.data.prompt_id;
      nodeCount = res.data.node_count;
      fileName = res.data.fileName;
      stepLength = Number((95 / nodeCount).toFixed(2));
    })
  };
  ws.onmessage = (message: any) => {
    const messageInfo = JSON.parse(message.data);
    const { data } = messageInfo || {};
    console.log('收到消息', data, messageInfo.type);

    if (messageInfo.type === 'status') {
      console.log('任务变更', messageInfo, data);
    }
    if (messageInfo.type === 'execution_start') {
      console.log('开始生成');
    }

    if (!promptId || !data.prompt_id || promptId !== data.prompt_id) {
      return;
    }

    // 有缓存需要把步数减掉
    if (messageInfo.type === 'execution_cached') {
      const nodesCacheLength = messageInfo.data.nodes?.length ?? 0;
      currentStep += nodesCacheLength;
    }

    if (messageInfo.type === 'executing' && messageInfo.data.node) {
      // console.log('正在执行');
      currentStep += 1;
      console.log('进度', currentStep);
    }
    if (messageInfo.type === 'progress') {
      currentStep += 1;
      console.log('进度', currentStep);
    }
    if (messageInfo.type === 'executing' && !messageInfo.data.node) {
      console.log('生成完成', messageInfo);
      if (!promptId) {
        return;
      }
      getSvgUrl(fileName).then(res => {
        console.log(res);
        downloadByUrl(res.data)
        
      })
      ws?.close();
    }
  };
  ws.onclose = () => {
    console.log('关闭链接');
  };
}



const handleDownload = () => {
  if (activeBtn.value === 'svg') {
    downloadSvg();
    return;
  }
  const activeUrl = imgObj.value[activeBtn.value];
  // downloadImage(activeUrl);
  downloadByUrl(activeUrl)
};

watch(
  visible,
  (val) => {
    if (val) {
      getDownloadUrl(props.url).then((res) => {
        const { data } = res;
        imgObj.value = data;
        activeBtn.value = Object.keys(data)[0] || '';
      });
    }
  },
  {
    immediate: true,
    flush: 'pre',
  },
);
</script>

<style scoped lang="less">
.img-download-container {
  display: flex;

  .img-container {
    width: 258px;
    height: 258px;

    border: 1px solid rgb(237, 241, 246);
    border-radius: 12px;
    overflow: hidden;
    margin-right: 24px;
    // background-image: url(/src/assets/images/download-bg.png);
    background-image: url(/src/assets/images/download-bg.png);

    background-size: cover;
    background-position: center;
  }

  .option-area {
    display: flex;
    flex-direction: column;

    .radio-group {
      width: 100%;
    }

    .title {
      color: rgb(52, 65, 86);
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: left;

      margin-bottom: 24px;
    }

    .type-option {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;

      &:last-child {
        margin-bottom: 0;
      }

      .choose-area {
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .type-button {
          height: 26px;
          padding: 0 16px;
          border-radius: 20px;
          border: none;
          background: rgba(207, 218, 235, 0.4);
          color: rgb(107, 116, 143);
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: 0px;
          text-align: left;
        }

        .active-type-button {
          background: linear-gradient(
            135deg,
            rgb(23, 242, 95),
            rgb(37, 106, 247) 100%
          );
          color: rgb(255, 255, 255);
        }

        .checked-icon {
          color: rgb(37, 106, 247);
          height: 16px;
          margin-bottom: 5px;
        }

        .radio-no-checked {
          width: 16px;
          height: 16px;
          box-sizing: border-box;
          border: 1px solid rgb(163, 180, 204);
          background: rgb(255, 255, 255);
          border-radius: 50%;
        }

        :deep {
          .arco-radio {
            margin-right: 0;
          }
        }
      }

      .type-des {
        color: rgb(107, 116, 143);
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
      }
    }
  }
}
</style>
