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
          @upload-ok="uploadOk"
        />
      </template>
      <template #productSelect="{ data, disabled }">
        <ProductChoose
          :data="data"
          :disabled="disabled"
          @choose-img="handleChooseImg"
        />
      </template>
      <template #userUpload="{ data, disabled }">
        <UserImgUpload :data="data" :disabled="disabled" />
      </template>
    </SessionItem>
  </div>
</template>

<script lang="ts">
import {
  createNewSession,
  getSessionCommit,
  getWorkFlowTemplate,
  updateSession,
} from '@/api/dashboard';
import SessionItem, { SessionItemProps } from './session-item.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { v4 } from 'uuid';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import { cloneDeep, result } from 'lodash';
import {
  LogoRobotReply,
  ReplyTypeEnum,
  firstRobotReply,
  robotReply,
  userReply,
} from '../mock';
import RobotBtns from './robot-btns.vue';
import { BtnItem, ImgOption } from '@/interface';
import ProductChoose from './product-choose/product-choose.vue';
import UserImgUpload from './user-img-upload.vue';

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
const couldCreateAndUpdate = ref(false);

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

const saveSession = async () => {
  if (!couldCreateAndUpdate.value) {
    return;
  }

  let isFindTitle = false;
  const result = commitList.value.map((item, index) => {
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
      if (item.data.imagesOptions) {
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
      if (
        item.data.interfaceParams &&
        item.data.interfaceParams.promptWords &&
        !isFindTitle
      ) {
        // 找到标题
        isFindTitle = true;
        params.clipType = 'info';
        params.clipContent = JSON.stringify({
          title: item.data.interfaceParams.promptWords.text,
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
  const userReplyTemp = getUserReply(item.nextUserId);
  userReplyTemp.content = userReplyTemp.content?.replace(
    '{replace}',
    item.label,
  );
  if (item.value !== 0) {
    const interfaceParams = { ...userReplyTemp.interfaceParams };
    console.log(
      'interfaceParams',
      userReplyTemp,
      interfaceParams,
      userReply,
      item.nextUserId,
    );

    interfaceParams[Object.keys(interfaceParams)[0]] = item.value;
    userReplyTemp.interfaceParams = interfaceParams;
  } else {
    userReplyTemp.slotName = undefined;
  }
  replyState.robotReplyIndex = userReplyTemp.nextRobotId;
  addCommit(userReplyTemp, true);
  addCommit(getRobotCommit(userReplyTemp.nextRobotId));
};

const handleChooseImg = (imgItem: ImgOption) => {
  const lastStep = getLastOneStep();

  const manualData = getUserReply(lastStep.data.nextUserId);
  const { interfaceParams } = manualData;
  interfaceParams[Object.keys(interfaceParams)[0]] = imgItem.id || imgItem.url;

  addCommit(
    {
      author: 'user',
      data: {
        content: manualData.content,
        interfaceParams,
      },
    },
    true,
  );
  addCommit(getRobotCommit(manualData.nextRobotId));
};

const loadWorkflowTemplate = () => {
  const lastMessage = getLastOneStep();
  const params = createParams();
  getWorkFlowTemplate({ ...params, ...lastMessage.data.fetch.params }).then(
    (res) => {
      lastMessage.data.imagesOptions = res.data.map((item: any) => ({
        url: item.imgUrl,
        status: 'done',
        precent: 100,
        id: item.id,
      }));
      saveSession();
    },
  );
};

const addCommit = (params: Partial<CommitItem>, disabledSubmit = false) => {
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

  emit('enabledInput', !params.data?.canUserSend);

  if (!couldCreateAndUpdate.value && params.data?.canUserSend) {
    couldCreateAndUpdate.value = true;
  }

  if (author === 'robot' && params.data.fetch) {
    if (params.data.fetch.type === 'doPrompt') {
      emit('loadResult');
    } else if (params.data.fetch.type === 'workflow') {
      loadWorkflowTemplate();
      // 这一步先不保存，等模版返回再保存
      return;
    }
  }

  //
  if (disabledSubmit || commitList.value.length <= 3) {
    return;
  }
  saveSession();
};

addCommit(cloneDeep(firstRobotReply));

const actionDisabled = (index: number) => {
  return index < commitList.value.length - 1;
};

const handleReload = () => {
  emit('loadResult');
};

const uploadOk = (info: any) => {
  const lastMessage = getLastOneStep();
  const userReply = getUserReply(info.nextUserId);
  userReply.content = '';
  addCommit(
    {
      author: 'user',
      ...userReply,
      ...info,
    },
    true,
  );
  const robotReply = getRobotCommit(lastMessage.data.afterUserSendNextRobotId);
  addCommit(robotReply);
};

const getLastOneStep = () => {
  return commitList.value[commitList.value.length - 1];
};

const refreshSession = async (id: any) => {
  chosenLogoItem.value = 0;
  chosenTemplateItem.value = '';
  sessionId.value = id;
  if (!id) {
    commitList.value = [];
    couldCreateAndUpdate.value = false;
    addCommit(cloneDeep(firstRobotReply));
    return;
  }

  // 后续发生的操作可以直接保存了
  couldCreateAndUpdate.value = true;
  const res = await getSessionCommit(id);
  if (res) {
    const dataListTemp = res.data.items.map((item: any, index: number) => {
      const data = JSON.parse(item.whoSay);
      const result: any = { data };
      if (index === 0) {
        replyState.replyType = data.activeBtns[0];
      }
      if (data.type === 'left') {
        result.author = 'robot';
        if (data.btns || data.imgRatioOptions) {
          result.slotName = 'btns';
        }
        if (data.imagesOptions) {
          result.slotName = 'productSelect';
        }
      } else {
        result.author = 'user';
        if (
          data.interfaceParams.additionalReferImgs &&
          data.content !== '不需要'
        ) {
          result.slotName = 'userUpload';
        }
      }
      return result;
    });

    commitList.value = dataListTemp;
    const lastStep = dataListTemp[dataListTemp.length - 1];
    if (lastStep.data.imagesOptions && !lastStep.data.imagesOptions[0].url) {
      emit('loadResult');
    }
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

    // 一些特殊处理，后端不好处理的放前端处理
    if (
      result.tplCode === 'logo_draw' &&
      result.brandName &&
      result.brandName.length &&
      result.brandName[0].text
    ) {
      // 如果是logo绘画，并且品牌名存在，tplCode 变成另外的code
      result.tplCode = 'logo_a4';
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
  }
}
</style>
