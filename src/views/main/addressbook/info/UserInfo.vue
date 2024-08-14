<script setup>
import {useStore} from "vuex";
import {getUserNameByWxId, shortenCharts} from "@/utils/common.js";
import defaultImage from '@/assets/default-head.svg';

const store = useStore();
const user = store.getters.getAddrShowUser;
const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}
</script>

<template>
  <div class="info-container">
    <div class="info-head bottom-border">
      <img class="info-img" :src="store.getters.getHeadImgPath + user.UserName + '.jpg'" @error="setDefaultImage" alt=""/>
      <div class="info-desc-container">
        <p class="info-title">{{ getUserNameByWxId(store, user.UserName) }}</p>
        <p class="info-wxid">微信号：{{ user.UserName }}</p>
<!--        <p class="info-area">地区：中国大陆</p>-->
      </div>
    </div>
    <div class="info-other bottom-border">
      <div class="info-other-item">
        <p class="info-key">备注</p>
        <p class="info-value">{{ user.Remark }}</p>
      </div>
      <div class="info-other-item">
        <p class="info-key">个性签名</p>
        <p class="info-value"></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.info-container {
  width: 400px;
  height: 500px;
  margin: 100px auto;
  .info-head {
    display: flex;
    padding-bottom: 20px;
    .info-img {
      width: 80px;
      height: 80px;
    }
    .info-desc-container {
      padding: 10px;
      .info-title {
        font-size: 14px;
      }
      .info-wxid {
        font-size: 12px;
        color: #797979;
      }
      .info-area {
        font-size: 12px;
        color: #797979;
      }
    }
  }
  .info-other {
    padding-top: 20px;
    padding-bottom: 20px;
    .info-other-item {
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      .info-key {
        width: 80px;
        font-size: 14px;
        color: #797979;
        display: block;
      }
      .info-value {
        font-size: 14px;
        flex-grow: 1;
        display: block;
      }
    }
  }
  .bottom-border {
    border-bottom: 1px solid lightgray;
  }
}
</style>