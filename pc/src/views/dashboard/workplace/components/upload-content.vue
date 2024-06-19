<template>
  <CommonModal title="上传内容" :width="570" @ok="uploadOk">
    <div class="container">
      <div class="brand-info">
        <div class="title-name">品牌信息</div>
        <div class="des">支持png、jpg格式最大不超过2M</div>
        <div class="upload-items">
          <div class="item">
            <UploadImageItem v-model="valueRef.logo" />
            <div class="item-des">
              <div class="main-des">品牌信息</div>
              <div class="sub-des">(LOGO)</div>
            </div>
          </div>
          <div class="item">
            <UploadImageItem v-model="valueRef.QRCode" />
            <div class="item-des">
              <div class="main-des">品牌信息</div>
              <div class="sub-des">(二维码)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-info">
        <div class="title-name">商品信息</div>
        <div class="des">支持png、jpg格式最大不超过2M</div>
        <div class="upload-items">
          <div class="item">
            <UploadImageItem v-model="valueRef.topicMap" />
            <div class="item-des">
              <div class="main-des">添加主体图</div>
              <div class="sub-des">(仅添加单个主体图，例：商品)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CommonModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import UploadImageItem from './upload-img-item.vue';
import { Message } from '@arco-design/web-vue';

const emits = defineEmits(['uploadOk']);

const valueRef = reactive({
  logo: '',
  QRCode: '',
  topicMap: '',
});

const uploadOk = () => {
  // if (!valueRef.brand && !valueRef.logo && !valueRef.main) {
  //   Message.warning('请至少上传一张图片，或者点击不需要');
  //   return;
  // }
  emits('uploadOk', valueRef);
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  .brand-info,
  .goods-info {
    display: flex;
    flex-direction: column;
  }

  .brand-info {
    margin-right: 24px;
  }

  .title-name {
    color: rgb(52, 65, 86);
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
    margin-bottom: 2px;
  }

  .des {
    color: rgb(107, 116, 143);
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0px;
    margin-bottom: 16px;
  }

  .upload-items {
    display: flex;

    .item {
      margin-right: 24px;
      display: flex;
      flex-direction: column;

      .item-des {
        display: flex;
        margin-top: 8px;
        align-items: center;
        justify-content: center;

        .main-des {
          margin-right: 4px;
          color: rgb(52, 65, 86);
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 500;
          line-height: 22px;
          letter-spacing: 0px;
          text-align: left;
        }

        .sub-des {
          color: rgb(107, 116, 143);
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: 0px;
          text-align: center;
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
