<script setup>
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {msgs, session as getSession} from "../../../api/msg.js"
import {useStore} from "vuex";

const store = useStore();
const route = useRoute();

const id = route.params.id
const noMoreMsg = ref(false);

const query = reactive({
  strUsrName: id,
  page: 1,
  size: 30
});
const session = reactive({})

const number = ref(0);
const isTop = ref(false);
const msg_list = reactive([
])

const loadSession = () => {
  getSession(id).then(resp => {
    Object.assign(session, resp);
  })
}
loadSession();

const loadData = () => {
  if (!noMoreMsg.value) {
    msgs(query).then(resp => {
      if (resp.length > 0) {
        msg_list.push(...resp);
      } else {
        noMoreMsg.value = true;
      }
    });
  }
}

// 加载数据
loadData();

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
    loadMore();
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
const loadMore = () => {
  query.page = query.page + 1;
  loadData();
};
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);

  // 使用 Date 对象的方法获取年、月、日等信息
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  // const seconds = String(date.getSeconds()).padStart(2, '0');

  // 返回格式化后的字符串
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}
</script>
<template>
  <div class="main-content">
    <div class="main-content-top">
      <p class="main-content-title">{{ session.strNickName }}</p>
    </div>
    <div class="main-content-info" @wheel="onWheel" @scroll="onScroll" ref="chatContainer">
      <div v-for="(m, index) in msg_list" :key="m">
        <div class="tips">
          <p class="tips-content">
            {{ formatDate(m.CreateTime) }}
          </p>
        </div>
        <div class="tips" v-if="m.Type === 10000 && m.SubType === 0">
          <p class="tips-content">
            {{ m.StrContent }}
          </p>
        </div>
        <div v-else class="chat" :class="{'right': m.IsSender === 1, 'left': m.IsSender === 0}" >
          <div class="chat-header">
            <img v-if="m.IsSender === 1" :src="store.getters.getCurrentWxHeadImgPath" alt=""/>
            <img v-else :src="store.getters.getHeadImgPath + m.WxId + '.jpg'" alt=""/>
          </div>
          <div class="chat-info">
            <div class="chat-nickname">{{m.StrTalker}} {{ m.WxId }}</div>
            <div class="chat-text">
              {{ m.StrContent }}
            </div>
          </div>
        </div>
      </div>
      <div class="load-more">
        <a v-if="!noMoreMsg" href="javascript:void(0)" @click="loadMore">查看更多消息</a>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
* {
  box-sizing: border-box;
}
.main-content {
  background-color: #F5F5F5; /* 示例背景色 */
  display: flex;
  flex-direction: column; // 垂直排列
  overflow: hidden;
  height: 100%;
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
    flex-grow: 1;
    // 聊天框需要调转180度
    transform: rotate(180deg) translateZ(0);
    direction: rtl;
    padding-left: 20px;
    padding-right: 20px;
    overflow-y: scroll;
    flex-direction: column-reverse;
    .tips {
      font-size: 12px;
      color: gray;
      text-align: center;
      transform: rotate(180deg) translateZ(0);
      padding: 10px;
      .tips-content {
        max-width: 300px;
        margin: 0 auto;
      }
    }
    .load-more {
      text-align: center;
      font-size: 12px;
      transform: rotate(180deg) translateZ(0);
      color: #2C90FF;
      .no-more-msg {
        font-size: 12px;
        color: dimgray;
      }
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
          direction: ltr;
          font-size: 14px;
          margin-top: 5px;
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
          //box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          color: #232323;
          word-wrap: break-word;
          max-width: 400px;
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
          text-align: left;
          background-color: #9DFF5C;
        }
      }
    }
    .chat.left {
      flex-direction: row-reverse;
      .chat-info {
        text-align: left;
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