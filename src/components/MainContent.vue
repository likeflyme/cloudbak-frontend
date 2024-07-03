<template>
  <div class="main-content">
    <div class="main-content-top">
      <p class="main-content-title">家天下限制群（499）</p>
    </div>
    <div class="main-content-info">
      <div class="chat">
        <div class="chat-header"></div>
        <div class="chat-info">
          <div class="chat-nickname"></div>
          <div class="chat-text">这是文本消息！</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.main-content {
  flex-grow: 1; /* 让内容部分占据剩余的空间 */
  background-color: #F5F5F5; /* 示例背景色 */
  display: flex;
  flex-direction: column; // 垂直排列
  .main-content-top {
    padding-left: 15px;
    display: flex;
    align-items: center; /* 垂直居中 */
    height: 63px;
    border-bottom: 1px solid lightgray;
    .main-content-title {
      font-size: 20px;
    }
  }
  .main-content-info {
    padding-left: 10px;
    padding-right: 10px;
    overflow-y: scroll;

    .chat {
      display: flex;
    }
  }

  // 以下是滚动条样式
  /* 隐藏默认的滚动条轨道和拇指 */
  .main-content-info::-webkit-scrollbar {
    width: 0; /* 隐藏滚动条 */
    background: transparent; /* 使滚动条轨道背景透明 */
  }

  /* 鼠标悬停时显示滚动条轨道 */
  .main-content-info:hover::-webkit-scrollbar {
    width: 6px; /* 设置滚动条宽度 */
    background: #f0f0f0; /* 滚动条轨道背景颜色 */
  }

  /* 滚动条轨道样式 */
  .main-content-info:hover::-webkit-scrollbar-track-piece {
    background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
    border-radius: 8px; /* 设置滚动条轨道圆角 */
  }

  /* 滚动条拇指样式 */
  .main-content-info:hover::-webkit-scrollbar-thumb {
    background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
    border-radius: 8px; /* 设置滚动条拇指圆角 */
  }

  /* 鼠标悬停在滚动条拇指上时的样式 */
  .main-content-info:hover::-webkit-scrollbar-thumb:hover {
    background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
  }
}
</style>
<script setup lang="ts">
</script>