<template>
  <div ref="boxRef" class="current-session-box">
    <SessionItem
      v-for="(item, index) in commitList"
      v-bind="item"
      :key="item.id"
      :disabled="actionDisabled(index)"
      @reload="handleReload"
    >
      <template #btns="{ data, disabled }">
        <RobotBtns
          :data="data"
          :disabled="disabled"
          :commit-index="index"
          @change="robotReplyChange"
          @update-session-type="updateSessionType"
        />
      </template>
      <template #productSelect="{ data, disabled }">
        <ProductChoose :data="data" :disabled="disabled" />
      </template>
    </SessionItem>
  </div>
</template>

<script lang="ts">
import {
  createNewSession,
  getSessionCommit,
  updateSession,
} from '@/api/dashboard';
import SessionItem, { SessionItemProps } from './session-item.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { v4 } from 'uuid';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import GProgress from './g-progress.vue';
import { cloneDeep, result } from 'lodash';
import {
  LogoRobotReply,
  ReplyTypeEnum,
  firstRobotReply,
  robotReply,
  userReply,
} from '../mock';
import RobotBtns from './robot-btns.vue';
import { BtnItem } from '@/interface';
import ProductChoose from './product-choose/product-choose.vue';

interface CommitItem extends SessionItemProps {
  id: string;
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
  'refreshSessionHistory',
  'noImgeUpload',
  'regenerateLogo',
  'beforeLastStep',
  'loadResult',
]);

const commitList = ref<CommitItem[]>([]);

const boxRef = ref();

const route = useRoute();
const sessionId = ref<number | string>(route.query.sessionId as string);

const userInfo = useUserStore();
const robotCommitStep = ref(0);
const couldCreateAndUpdate = ref(false);

const robotReplyRef = ref(LogoRobotReply);

const replyState = reactive({
  robotReplyIndex: 0,
  userReplyIndex: 0,
  replyType: ReplyTypeEnum.LOGO_DRAW,
});

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
const chosenTemplateItem = ref<string>();
const uploadImageName = ref('');

const saveSession = async () => {
  if (!couldCreateAndUpdate.value) {
    return;
  }
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

  // 仅限创建时刷新历史记录列表
  if (!sessionId.value) {
    emit('refreshSessionHistory');
  }

  sessionId.value = data.data;
};

const updateSessionType = (item: BtnItem) => {
  replyState.replyType = item.value as ReplyTypeEnum;
};

const getRobotCommit = (index: any) => {
  const c = robotReply[replyState.replyType][index];
  return cloneDeep(c);
};

const getUserReply = (index: any) => {
  const c = userReply[replyState.replyType][index];
  c.author = 'user';
  return cloneDeep(c);
};

const robotReplyChange = (item: BtnItem) => {
  replyState.userReplyIndex = item.nextUserId;
  const userReply = getUserReply(item.nextUserId);
  userReply.content = userReply.content?.replace('{replace}', item.label);
  if (item.value !== 0) {
    const interfaceParams = { ...userReply.interfaceParams };
    interfaceParams[Object.keys(interfaceParams)[0]] = item.value;
    userReply.interfaceParams = interfaceParams;
  }
  replyState.robotReplyIndex = userReply.nextRobotId;
  addCommit(userReply);
  addCommit(getRobotCommit(userReply.nextRobotId));
};

const addCommit = (params: Partial<CommitItem>) => {
  const author = params.author || 'robot';

  if (author === 'user') {
    const lastRobotReply = commitList.value[commitList.value.length - 1];
    params.data = {
      interfaceParams: params.interfaceParams,
      content: params.content,
      tooltipsBtns: lastRobotReply.data.nextUserReply?.tooltipsBtns ?? [],
      ...params.data,
    };
  }
  commitList.value.push({
    data: {},
    ...params,
    author,
    id: v4(),
  });

  if (
    author === 'robot' &&
    params.data.fetch &&
    params.data.fetch.type === 'doPrompt'
  ) {
    emit('loadResult');
  }

  emit('enabledInput', !params.data?.canUserSend);
  //
  if (params.disabledSubmit || commitList.value.length === 1) {
    return;
  }
  saveSession();
};

addCommit(firstRobotReply);

const actionDisabled = (index: number) => {
  return index < commitList.value.length - 1;
};

const handleReload = () => {
  emit('reload', uploadImageName.value);
};

// const handleCreateLogo = (type: string, data: any) => {
//   data.activeBtns = [type];
//   robotReplyRef.value =
//     type === firstRobotReply.data!.btns[0] ? LogoRobotReply : PosterRobotReply;
//   addCommit({
//     author: 'user',
//     data: {
//       content: `帮我设计一个${type}`,
//     },
//     disabledSubmit: true,
//   });
//   // addCommit({
//   //   content: '您是否有参考图给我参考呢？',
//   //   slotName: 'refrenceImage',
//   // });
//   addCommit(getRobotCommit());
// };
const getLastOneStep = () => {
  return commitList.value[commitList.value.length - 1];
};

const refreshSession = async (id: any) => {
  chosenLogoItem.value = 0;
  chosenTemplateItem.value = '';
  sessionId.value = id;
  if (!id) {
    robotCommitStep.value = 0;
    commitList.value = [];
    couldCreateAndUpdate.value = false;
    addCommit(firstRobotReply);
    return;
  }

  // 后续发生的操作可以直接保存了
  couldCreateAndUpdate.value = true;
  const res = await getSessionCommit(id);
  if (res) {
    let robotIndex = 0;
    const dataListTemp = res.data.items.map((item: any) => {
      const data = JSON.parse(item.whoSay);
      const result: any = { data };
      if (data.type === 'left') {
        result.author = 'robot';
        result.slotName = robotReplyRef.value[robotIndex].slotName;
        robotIndex += 1;
      } else {
        result.author = 'user';
        // 兼容小程序的数据结构
        if (data.image) {
          data.images = [data.image];
        }
      }
      return result;
    });

    // 停在生成logo那一步
    if (
      dataListTemp.length === 7 &&
      // 没有生成成功
      !dataListTemp[6].data.imagesOptions[0].url
    ) {
      // 拿到上传的图片url
      const url = dataListTemp[3].data.images
        ? dataListTemp[3].data.images[0]
        : '';
      const userWords = dataListTemp[5].data.content;
      // 前6步记录恢复
      commitList.value = dataListTemp.slice(0, 6);
      robotCommitStep.value = 3;
      emit('regenerateLogo', url, userWords);
      return;
    }

    if (dataListTemp.length === 7) {
      return;
    }

    // 找到选定的logo
    const chosenLogostyle = dataListTemp[7].data.images[0];
    emit('chooseStyle', chosenLogostyle);

    chosenLogoItem.value =
      dataListTemp[6].data.imagesOptions.findIndex(
        (imgItem: any) => imgItem.url === chosenLogostyle,
      ) + 1;

    if (dataListTemp.length === 9) {
      robotCommitStep.value = robotIndex;
      commitList.value = dataListTemp;
      emit('enabledInput');
      return;
    }

    let userWords = dataListTemp[9].data.content;
    if (userWords === '没有品牌') {
      userWords = '';
    }
    console.log('dataListTemp[9]', dataListTemp[9]);

    robotCommitStep.value = robotIndex;
    // 保存用户选好的logo和用户最后输入的内容
    emit('beforeLastStep', chosenLogostyle, userWords);

    if (dataListTemp.length === 11) {
      commitList.value = dataListTemp;
      return;
    }
    // eslint-disable-next-line prefer-destructuring
    const templateImageUrl = dataListTemp[11].data.images[0];
    chosenTemplateItem.value = dataListTemp[10].data.imagesOptions.find(
      (item: any) => item.url === templateImageUrl,
    ).code;
    // 最后一步生成失败
    if (
      dataListTemp.length === 12 ||
      (dataListTemp.length === 13 &&
        !dataListTemp[12].data.imagesOptions[0].url)
    ) {
      robotCommitStep.value = 6;
      commitList.value = dataListTemp.slice(0, 12);
      emit('lastStep', chosenTemplateItem.value);
    } else {
      commitList.value = dataListTemp;
    }
    // commitList.value = dataListTemp;
    console.log('dataListTemp', dataListTemp);

    // dataList.value = dataListTemp;
    // 根据数据做一些初始工作,先写死，后面再改
  }
};

const createParams = () => {
  return commitList.value.reduce<Record<string, any>>((result, current) => {
    if (!current.data.interfaceParams) {
      return result;
    }

    const { interfaceParams } = current.data;
    // 如果存在接口参数，
    const interfaceParamsKey = Object.keys(interfaceParams)[0];
    const paramsValue = interfaceParams[interfaceParamsKey];

    if (typeof paramsValue === 'string') {
      // 如果值只是字符串
      result[interfaceParamsKey] = paramsValue;
    }
    if (
      Object.prototype.toString.call(paramsValue) === '[object Object]' &&
      Object.prototype.hasOwnProperty.call(paramsValue, 'text') &&
      Object.prototype.hasOwnProperty.call(paramsValue, 'fontfamily')
    ) {
      // 如果是对象，且是{ text: '', fontfamily: ''} => [{ text: '', fontfamily: ''}]
      const newValue = (
        result[interfaceParamsKey] ? result[interfaceParamsKey] : []
      ).concat([paramsValue]);
      result[interfaceParamsKey] = newValue;
    }
    return result;
  }, {});
};

defineExpose({
  addCommit,
  getRobotCommit,
  saveSession,
  getLastOneStep,
  refreshSession,
  createParams,
});
</script>

<style scoped lang="less">
:deep {
  .arco-btn-secondary {
    border: none !important;
  }
  .arco-btn-secondary.arco-btn-disabled {
    color: unset !important;
    background-color: unset !important;
    border: unset !important;
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

  &:hover {
    color: white !important;
    background: linear-gradient(
      135deg,
      rgb(23, 242, 95) 0%,
      rgb(37, 106, 247) 100%
    ) !important;
    .iconfont.icon-plus {
      color: white !important;
    }
  }
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

  &::v-deep {
    .arco-btn-icon {
      margin-right: 6px !important;
    }
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

  :deep(.arco-radio) {
    margin-right: 0;
  }
}

.template-image-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  margin: 0 24px 16px 0;

  &:last-child {
    margin-right: 0;
  }

  .radio-no-checked {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 1px solid rgb(163, 180, 204);
    background: rgb(255, 255, 255);
    border-radius: 50%;
  }
  .checked-icon {
    color: rgb(37, 106, 247);
    height: 16px;
  }

  :deep(.arco-radio) {
    justify-content: center;
  }
  .img-area {
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;
    // margin-bottom: 16px;

    .img-box {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .img-loading {
      padding: 24px;
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

      p {
        margin: 0;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
