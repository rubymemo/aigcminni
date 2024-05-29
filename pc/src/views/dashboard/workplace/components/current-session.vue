<template>
  <div ref="boxRef" class="current-session-box">
    <SessionItem
      v-for="(item, index) in commitList"
      v-bind="item"
      :key="item.id"
      :disabled="actionDisabled(index)"
      :isLastStep="lastStep && index === commitList.length - 1"
      @reload="handleReload"
    >
      <template #sessionStart="{ data }">
        <a-button
          v-for="btn in data.btns"
          :key="btn"
          :disabled="actionDisabled(index)"
          class="action-button"
          :class="data.activeBtns.includes(btn) && 'active-button'"
          @click="handleCreateLogo(btn, data)"
          >{{ btn }}</a-button
        >
      </template>
      <template #refrenceImage="{ data, disabled }">
        <a-button
          class="action-button"
          :disabled="disabled"
          :class="data.activeBtns.includes(data.btns[0]) && 'active-button'"
          @click="noImageUpload(data.btns[0], data)"
          >{{ data.btns[0] }}</a-button
        >
        <a-upload
          accept="image/png, image/jpeg"
          :custom-request="customUpload"
          :disabled="disabled"
          class="upload-com"
        >
          <template #upload-button>
            <a-button
              :disabled="disabled"
              class="action-button"
              :class="data.activeBtns.includes(data.btns[1]) && 'active-button'"
              @click="data.activeBtns = [data.btns[1]]"
            >
              <template #icon>
                <img :src="PlusBlue" alt="" />
              </template>
              {{ data.btns[1] }}</a-button
            >
          </template>
        </a-upload>
      </template>
      <template #supplyText>
        <a-button
          class="action-button"
          :disabled="actionDisabled(index)"
          @click="noTextSupply"
          >没有</a-button
        >
      </template>
      <template #logoSelect="{ data, disabled }">
        <a-radio-group
          v-model="chosenLogoItem"
          class="template-commit-action"
          @change="handleChoseImg(data, $event)"
        >
          <div v-for="imgItem in 4" :key="imgItem" class="template-image-item">
            <div class="img-area">
              <div
                v-if="data.imagesOptions[imgItem - 1].url"
                class="img-box"
                @click="handleChoseImg(data, imgItem)"
              >
                <img :src="data.imagesOptions[imgItem - 1].url" alt="" />
              </div>
              <div v-else class="img-loading">
                图片加载中{{ data.progress }}%
              </div>
            </div>
            <a-radio :disabled="data.loading || disabled" :value="imgItem" />
          </div>
        </a-radio-group>
      </template>
      <template #templateImg="{ data, disabled }">
        <a-radio-group
          v-model="chosenTemplateItem"
          class="template-commit-action"
          @change="handleChoseTemplateImg(data, $event)"
        >
          <div v-for="imgItem in 2" :key="imgItem" class="template-image-item">
            <div class="img-area">
              <div
                v-if="data.imagesOptions[imgItem - 1].url"
                class="img-box"
                @click="handleChoseTemplateImg(data, imgItem)"
              >
                <img
                  :src="convertImgUrl(data.imagesOptions[imgItem - 1].url)"
                  alt=""
                />
              </div>
              <div v-else class="img-loading">
                图片加载中{{ data.progress }}%
              </div>
            </div>
            <a-radio :disabled="disabled" :value="imgItem" />
          </div>
        </a-radio-group>
      </template>
      <template #lastStep="{ data }">
        <div class="template-commit-action">
          <div v-for="imgItem in 4" :key="imgItem" class="template-image-item">
            <div class="img-area">
              <div
                v-if="data.imagesOptions[imgItem - 1].url"
                class="img-box"
                @click="handleChoseImg(data, imgItem)"
              >
                <img :src="data.imagesOptions[imgItem - 1].url" alt="" />
              </div>
              <div v-else class="img-loading">
                图片加载中{{ data.progress }}%
              </div>
            </div>
          </div>
        </div>
      </template>
    </SessionItem>
  </div>
</template>

<script lang="ts">
import {
  createNewSession,
  getSessionCommit,
  updateSession,
  uploadImage,
} from '@/api/dashboard';
import SessionItem, { SessionItemProps } from './session-item.vue';
import { onMounted, ref, watch } from 'vue';
import { v4 } from 'uuid';
import { robotReply } from '../mock';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import PlusBlue from '@/assets/images/plus-blue.png';

interface CommitItem extends SessionItemProps {
  id: string;
  loading?: boolean;
  // 兼容小程序的逻辑，保存会话内容时用到
  compute?: boolean;
  // 添加这条消息的时候先不提交，防止提交过于频繁
  disabledSubmit?: boolean;
}

interface AddCommitType extends Partial<SessionItemProps> {
  loading?: boolean;
  // 兼容小程序的逻辑，保存会话内容时用到
  compute?: boolean;
  // 添加这条消息的时候先不提交，防止提交过于频繁
  disabledSubmit?: boolean;
}
</script>

<script setup lang="ts">
const emit = defineEmits([
  'imageUploadSuccess',
  'waitInput',
  'textComplete',
  'noText',
  'chooseStyle',
  'enabledInput',
  'commitLengthChange',
  'lastStep',
  'reload',
  'refreshSessionHistory'
]);

const disabledUpload = ref(false);

const commitList = ref<CommitItem[]>([]);

const boxRef = ref();

const route = useRoute();
const sessionId = ref<number | string>(route.query.sessionId as string);

const userInfo = useUserStore();
const robotCommitStep = ref(0);

watch(
  () => commitList.value.length,
  () => {
    emit('commitLengthChange');
  },
  {
    flush: 'post',
  },
);

const chosenLogoItem = ref<number>();
const chosenTemplateItem = ref<number>();
const lastStep = ref(false);
const uploadImageName = ref('');

const handleChoseImg = (data: any, index: any) => {
  console.log(data, index);

  chosenLogoItem.value = index;
  const { url } = data.imagesOptions[index - 1];
  data.activeImages = [url];
  handleChooseTemplate(url);
};

const handleChoseTemplateImg = (data: any, index: any) => {
  console.log(data, index);
  chosenTemplateItem.value = index;
  const { url } = data.imagesOptions[index - 1];
  data.activeImages = [url];
  addCommit({
    author: 'user',
    data: {
      image: convertImgUrl(url),
      content: '我已经选定了',
    },
  });
  emit('lastStep', uploadImageName.value);
  lastStep.value = true;
};

const convertImgUrl = (url: string) => {
  const nameArr = url.split('/');
  const name = nameArr[nameArr.length - 1];
  return `/src/assets/images/${name}`;
};

const saveSession = async () => {
  let isFindTitle = false;
  const result = commitList.value.map((item, index) => {
    console.log(item, item.author);

    let params;
    if (item.author === 'robot') {
      item.data.type = 'left';
      params = {
        whoId: 0,
        whoName: 'robot',
        whoSay: JSON.stringify(item.data),
        clipType: '',
        clipContent: '',
      };
      if (item.compute && item.data.imagesOptions) {
        // 获取封面图
        params.clipType = 'info';
        params.clipContent = JSON.stringify({
          imgUrl: item.data.imagesOptions[0].url,
        });
      }
      if (index === 0) {
        // 获取图片类型
        params.clipType = 'info';
        params.clipContent = JSON.stringify({
          type: item.data.activeBtns.includes('logo') ? 1 : 2,
        });
      }
    } else {
      item.data.type = 'right';
      params = {
        whoId: userInfo.userId,
        whoName: userInfo.nickname || userInfo.username,
        whoSay: JSON.stringify(item.data),
        clipType: '',
        clipContent: '',
      };
      if (item.compute && !isFindTitle) {
        // 找到标题
        isFindTitle = true;
        params.clipType = 'info';
        params.clipContent = JSON.stringify({
          title: item.data.content,
          ownerId: userInfo.userId,
        });
      }
    }
    return params;
  });

  const data = await (sessionId.value
    ? updateSession(sessionId.value, result)
    : createNewSession(result));

    emit('refreshSessionHistory')
  
  sessionId.value = data.data;
};

const getRobotCommit = (index?: number) => {
  const c = robotReply[robotCommitStep.value];
  robotCommitStep.value += 1;
  return c;
};

const addCommit = (params: Partial<CommitItem>) => {
  const author = params.author || 'robot';
  commitList.value.push({
    data: {},
    ...params,
    author,
    id: v4(),
  });
  const lastCommit = commitList.value[commitList.value.length - 1];
  //
  if (lastCommit.disabledSubmit || commitList.value.length === 1) {
    return;
  }
  saveSession();
};

addCommit(getRobotCommit());

const actionDisabled = (index: number) => {
  return index < commitList.value.length - 1;
};

const handleReload = () => {
  emit('reload', uploadImageName.value);
};

const handleCreateLogo = (type: string, data: any) => {
  data.activeBtns = [type];
  addCommit({
    author: 'user',
    data: {
      content: `帮我设计一个${type}`,
    },
    disabledSubmit: true,
  });
  // addCommit({
  //   content: '您是否有参考图给我参考呢？',
  //   slotName: 'refrenceImage',
  // });
  addCommit(getRobotCommit());
};

const noImageUpload = (type: string, data: any) => {
  data.activeBtns = [type];
  addCommit({
    author: 'user',
    data: {
      content: `没有参考图`,
    },
  });
  addCommit(getRobotCommit());
  emit('enabledInput');
  disabledUpload.value = true;
};

const customUpload = (option: any): any => {
  // data.activeBtns = [data.btns[1]];
  const { fileItem } = option;

  const formData = new FormData();
  formData.append('image', fileItem.file);

  // robotCommitStep.value = 3;
  return uploadImage(formData).then((res: any) => {
    disabledUpload.value = true;
    addCommit({
      author: 'user',
      // image: `http://101.126.93.249/api/hh/comfyui_api/view?type=${res.data.type}&filename=${res.data.filename}`,
      data: {
        image: res.data.fileUrl,
      },
      disabledSubmit: true,
    });
    uploadImageName.value = res.data.fileName;
    addCommit(getRobotCommit());
    emit('enabledInput');
    emit('imageUploadSuccess', res.data.fileName);
  });
};

const handleChooseTemplate = (imgUrl: string) => {
  addCommit({
    author: 'user',
    data: {
      image: imgUrl,
      content: '我已经选定了',
    },
    disabledSubmit: true,
  });
  addCommit(getRobotCommit());
  emit('enabledInput');
  emit('chooseStyle', imgUrl);
};

const noTextSupply = () => {
  addCommit({
    author: 'user',
    data: {
      content: '没有补充',
    },
  });
  emit('noText');
};

const getLastOneStep = () => {
  return commitList.value[commitList.value.length - 1];
};

const refreshSession = async (id: any) => {
  if (!id) {
    robotCommitStep.value = 0;
    commitList.value = [];
    addCommit(getRobotCommit());
    return;
  }
  const res = await getSessionCommit(id);
  if (res) {
    let robotIndex = 0;
    const dataListTemp = res.data.items.map((item) => {
      const data = JSON.parse(item.whoSay);
      const result: any = { data };
      if (data.type === 'left') {
        result.author = 'robot';
        result.slotName = robotReply[robotIndex].slotName;
        robotIndex += 1;
        robotCommitStep.value = robotIndex;
      } else {
        result.author = 'user';
      }
      return result;
    });
    commitList.value = dataListTemp;
    console.log('dataListTemp', dataListTemp);

    // dataList.value = dataListTemp;
    // 根据数据做一些初始工作,先写死，后面再改
    const lastMsg = dataListTemp[dataListTemp.length - 1];
    console.log(lastMsg);
    if (lastMsg.type === 'right' && dataListTemp.length === 6) {
      console.log();
    }
    if (lastMsg.type === 'left' && dataListTemp.length === 9) {
      // 机器人说的，且接下来让人说
      lastStep.value = true;
      emit('enabledInput');
    }
  }
};

defineExpose({
  addCommit,
  getRobotCommit,
  saveSession,
  getLastOneStep,
  refreshSession
});
</script>

<style scoped lang="less">
:deep {
  .arco-btn-secondary.arco-btn-disabled {
    color: unset;
    background-color: unset;
    border: unset;
  }
}
.action-button {
  color: rgb(52, 65, 86);
  border: none;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  padding: 3px 16px;
  border-radius: 100px;
  background: linear-gradient(
    135deg,
    rgba(23, 242, 95, 0.2) 0%,
    rgba(37, 106, 247, 0.2) 100%
  );
  margin-right: 16px;

  &.active-button {
    color: rgb(255, 255, 255);
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    );
  }

  img {
    width: 12px;
    height: 12px;
    margin-top: 5px;
  }
}
.current-session-box {
  width: 100%;
  padding-bottom: 100px;

  .upload-com {
    :deep(.arco-upload-list) {
      display: none;
    }
  }
}

.template-commit-action {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.template-image-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  margin: 0 8px 8px 0;

  :deep(.arco-radio) {
    justify-content: center;
  }
  .img-area {
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;

    .img-box {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .img-loading {
      color: rgb(107, 116, 143);
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        rgba(23, 242, 95, 0.1) 0%,
        rgba(37, 106, 247, 0.1) 100%
      );
    }
  }
}
</style>
