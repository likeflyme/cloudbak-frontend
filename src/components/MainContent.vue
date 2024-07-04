<script setup>
import {reactive, ref} from "vue";

const number = ref(0);
const isTop = ref(false);
const msg_list = reactive([
])
for (let i = 0; i < 50; i++) {
  number.value = number.value + 1;
  msg_list.push({"msg": number.value + ": 这是一个新文本消息，添加到头部！"});
}


const chatContainer = ref(null);

// 反向滚动
const onWheel = (event) => {
  // 阻止默认滚动行为，以便完全自定义滚动效果
  event.preventDefault();

  // 根据滚轮事件的 deltaY 属性调整滚动条位置
  const delta = event.deltaY;

  // 根据滚轮方向调整滚动条位置，注意方向是反的
  chatContainer.value.scrollTop -= delta;
  if (isTop.value === true) {
    // 只有在到达顶部的标记为 true 时才加载数据，加载完后将标记修改为 false;
    load();
    isTop.value = false;
  }
};

const onScroll = () => {
  // 翻转计算，为避免滚动到底部时有一点误差，允许误差在2以内
  let top = chatContainer.value.scrollHeight - chatContainer.value.clientHeight;
  if (Math.abs(chatContainer.value.scrollTop - top) < 2) {
    // 避免过快加载数据，这里只标记到达顶部
    if (!isTop.value) {
      isTop.value = true;
    }
  }
};
const load = () => {
  for (let i = 0; i < 50; i++) {
    number.value = number.value + 1;
    // msg_list.unshift({"msg": number.value + ": 这是一个新文本消息，添加到头部！"});
    msg_list.push({"msg": number.value + ": 这是一个新文本消息，添加到头部！"});
  }
};
</script>
<template>
  <div class="main-content">
    <div class="main-content-top">
      <p class="main-content-title">家天下限制群（499）</p>
    </div>
    <div class="main-content-info" @wheel="onWheel" @scroll="onScroll" ref="chatContainer">
      <div class="chat" :class="{'right': index === 10, 'left': index !== 10}" v-for="(n, index) in msg_list" :key="n">
        <div class="chat-header">
          <img src="https://static.raining.top/picgo/weixinhead.jpg" alt=""/>
        </div>
        <div class="chat-info">
          <div class="chat-nickname">昵称</div>
          <div class="chat-text">{{ n.msg }}</div>
        </div>
      </div>
      <div class="load-more">
        <a href="javascript:void(0)" @click="load">查看更多信息</a>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
* {
  box-sizing: border-box;
}
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
      height: 63px;
      font-size: 20px;
      line-height: 63px;
    }
  }
  .main-content-info {
    // 聊天框需要调转180度
    transform: rotate(180deg) translateZ(0);
    direction: rtl;
    padding-left: 20px;
    padding-right: 20px;
    overflow-y: scroll;
    flex-direction: column-reverse;
    .load-more {
      text-align: center;
      font-size: 12px;
      transform: rotate(180deg) translateZ(0);
    }
    .chat {
      transform: rotate(180deg) translateZ(0);
      margin-top: 10px;
      display: flex;
      .chat-header {
        width: 35px;
        height: 35px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
      }
      .chat-info {
        padding-left: 10px;
        padding-right: 10px;
        .chat-nickname {
          font-size: 12px;
          color: #BEBEBE;
          text-align: left;
        }
        .chat-text {
          font-size: 14px;
          margin-top: 5px;
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          color: #232323;
        }
        .chat-text:hover {
          background-color: #EBEBEB;
        }
      }
    }
    .chat:last-child {
      margin-bottom: 20px;
    }
    .chat.right {
      .chat-info {
        .chat-nickname {
          text-align: right;
        }
        .chat-text {
          text-align: right;
          background-color: #51C332;
        }
      }
    }
    .chat.left {
      flex-direction: row-reverse;
      .chat-info {
        .chat-nickname {
          text-align: left;
        }
        .chat-text {
          text-align: left;
          background-color: #FFFFFF;
        }
      }
    }
    .chat.right:hover {
      .chat-text {
        background-color: #89D961;
      }
    }
    .chat.left:hover {
      .chat-text {
        background-color: #EBEBEB;
      }
    }

  }

  // 以下是滚动条样式
  /* 隐藏默认的滚动条轨道和拇指 */
  .main-content-info::-webkit-scrollbar {
    width: 6px; /* 隐藏滚动条 */
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