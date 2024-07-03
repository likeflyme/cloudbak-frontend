<template>
  <ul class="item-container">
    <li class="item">
      <img class="u-header" src="https://static.raining.top/picgo/weixinhead.jpg" alt=" 展开" role="button">
    </li>
    <li class="item">
      <font-awesome-icon class="item-icon item-icon-active" :icon="['fas', 'comment']" title="聊天"/>
    </li>
    <li class="item">
      <font-awesome-icon class="item-icon" :icon="['far', 'user']" title="通讯录"/>
    </li>
    <li class="item">
      <font-awesome-icon class="item-icon" :icon="['fas', 'cube']" title="收藏"/>
    </li>
    <li class="item">
      <font-awesome-icon class="item-icon" :icon="['fas', 'folder-closed']" title="聊天文件"/>
    </li>
    <li class="item">
      <font-awesome-icon class="item-icon" :icon="['fas', 'camera']" title="朋友圈"/>
    </li>
  </ul>
</template>

<style scoped lang="less">
.item-container {
  height: 100%;
  .item {
    margin-top: 16px;
    text-align: center;
    .u-header {
      width: 40px;
      height: 40px;
      border-radius: 3px;
    }
    .item-icon {
      font-size: 19px;
      color: #999999;
    }
    .item-icon:hover {
      cursor: pointer;
    }
    .item-icon-active {
      color: #07C160!important;
    }
  }
  .item:first-child {
    margin-top: 30px;
  }
}
</style>