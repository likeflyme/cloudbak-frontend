<template>
<ul class="items-ul">
  <li class="item"
      v-for="n in 20"
      :key="n"
      :class="{ 'item-active': selectedItem === n }"
      @click="selectItem(n)">
    <div class="item-header">
      <img src="https://static.raining.top/picgo/weixinhead.jpg" alt="header">
    </div>
    <div class="item-msg">
      <p class="item-msg-title">家天下闲置群</p>
      <p class="item-msg-desc">杨小杨 这是一个测试消息</p>
    </div>
    <div class="item-info">
      <p class="item-info-time">15:11</p>
    </div>
  </li>
</ul>
</template>
<script setup>
import { ref } from 'vue'

const selectedItem = ref(null)

const selectItem = (n) => {
  selectedItem.value = n
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
    background-color: #07C160;
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