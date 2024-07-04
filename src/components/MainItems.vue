<template>
<ul class="items-ul">
  <li class="item"
      v-for="(session, idx) in store.state.sessions" :key="session.strUsrName"
      :class="{ 'item-active': selectedItem === session.strUsrName }"
      @click="selectItem(session)">
    <div class="item-header">
      <!-- 订阅号的头像 -->
      <img v-if="session.strUsrName === '@publicUser'" src="../images/wx/public_user.png" alt="header">
      <img v-else :src="store.getters.getHeadImgPath + session.strUsrName + '.jpg'" alt="header">
    </div>
    <div class="item-msg">
      <p class="item-msg-title">{{ shortenCharts(session.strNickName, '25', '...') }}</p>
      <p class="item-msg-desc">{{ shortenCharts(session.strContent, '25', '...') }}</p>
    </div>
    <div class="item-info">
      <p class="item-info-time">15:11</p>
    </div>
  </li>
</ul>
</template>
<script setup>
import { ref } from 'vue'
import {useStore} from "vuex";
import {shortenCharts} from "../utils/common.js";

const store = useStore();

const selectedItem = ref(null)

const selectItem = (session) => {
  selectedItem.value = session.strUsrName
}

</script>
<style scoped lang="less">
.item {
  display: flex;
  padding: 13px;
  background-color: #ededed;
  .item-header {
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }
  }
  .item-msg {
    flex-grow: 1;
    padding-left: 10px;
    .item-msg-title {
      font-size: 14px;
    }
    .item-msg-desc {
      font-size: 12px;
      color: #AFAEAE;
    }
  }
  .item-info {
    width: 40px;
    height: 40px;
    .item-info-time {
      font-size: 12px;
      color: #AFAEAE;
      text-align: right;
    }
  }
}
.item:hover {
  background-color: #D0D0D2;
}
.item-active {
  background-color: #CAC8C6;
}
.item-active:hover {
  background-color: #CAC8C6;
}

</style>