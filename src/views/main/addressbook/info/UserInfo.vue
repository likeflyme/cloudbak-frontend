<script setup>
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import {getUserNameByWxId, shortenCharts} from "@/utils/common.js";
import defaultImage from '@/assets/default-head.svg';

const store = useStore();
const router = useRouter();
const route = useRoute();
const user = store.getters.getAddrShowUser;
const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}
const comment = () => {
  router.push({ name: 'chat', params: { sessionId: route.params.sessionId, id: user.UserName} });
}
</script>

<template>
  <div class="info-container">
    <div class="info-head bottom-border">
      <img class="info-img" :src="user.smallHeadImgUrl" @error="setDefaultImage" alt=""/>
      <div class="info-desc-container">
        <p class="info-title">{{ user.Remark?user.Remark:user.NickName }}</p>
        <p class="info-area">昵称：{{ user.NickName }}</p>
        <p class="info-wxid">微信号：{{ user.UserName }}</p>
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
      <div class="info-other-item">
        <p class="info-value">
          <a class="weui-btn weui-btn_primary weui-btn_mini" @click="comment">查看消息</a>
        </p>
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