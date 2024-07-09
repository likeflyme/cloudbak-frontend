<script setup>
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {msgs, session as getSession} from "../../../api/msg.js"
import {useStore} from "vuex";
import {getUserNameByWxId, isChatRoom, parseXml} from "../../../utils/common.js";

const store = useStore();
const route = useRoute();

const id = route.params.id
const noMoreMsg = ref(false);
const images = reactive([]);

const query = reactive({
  strUsrName: id,
  page: 1,
  size: 30
});
const session = reactive({})

const isTop = ref(false);
const msg_list = reactive([])

const imageOptions = reactive({
  // 配置选项
  toolbar: true,
      title: true,
      tooltip: true,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: false,
      url: 'data-original',
      filter(image) {
        // 排除带有 exclude 类的 img 元素
        return !image.classList.contains('exclude');
      },
});

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
        // 图片数据处理
        parseImg(resp);
        // 添加到数据列表
        msg_list.push(...resp);
      } else {
        noMoreMsg.value = true;
      }
    });
  }
}

const parseImg = (data) => {
  for (let i of data) {
    // 图片信息处理
    if (i.Type === 3 && i.SubType === 0) {
      images.push({
        thumbnail: data.Thumb,
        source: data.Image
      })
      // data.StrContent
      if (i.StrContent) {
        const xmlDoc = parseXml(i.StrContent);
        const imgTag = xmlDoc.querySelector('img');
        if (imgTag) {
          const cdnthumbheight = imgTag.getAttribute('cdnthumbheight');
          i.cdnthumbheight = cdnthumbheight;

          const cdnthumbwidth = imgTag.getAttribute('cdnthumbwidth');
          i.cdnthumbwidth = cdnthumbwidth;

          const md5 = imgTag.getAttribute('md5');
          i.md5 = md5;
        }
      }
    }
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
  const now = new Date();

  // 获取今天的日期
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 获取昨天的日期
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // 获取年、月、日、小时、分钟
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // 根据日期判断输出格式
  if (date >= today) {
    return `${hours}:${minutes}`;
  } else if (date >= yesterday) {
    return `昨天 ${hours}:${minutes}`;
  } else {
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  }
};

const shouldDisplayTimestamp = (currentTimestamp, index) => {
  let nextIndex = index + 1;
  // 最后一条消息输出时间
  if (msg_list.length < nextIndex + 1) {
    return true;
  }
  let last = msg_list[index + 1]
  return (currentTimestamp - last.CreateTime) > 600;
}
</script>
<template>
  <div class="main-content">
    <div class="main-content-top">
      <p class="main-content-title">{{ session.strNickName }}</p>
    </div>
    <div class="main-content-info" @wheel="onWheel" @scroll="onScroll" ref="chatContainer" v-viewer="imageOptions">
      <div class="chat-container" v-for="(m, index) in msg_list" :key="m">
        <div class="tips" v-if="shouldDisplayTimestamp(m.CreateTime, index)">
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
            <img v-if="m.IsSender === 1" :src="store.getters.getCurrentWxHeadImgPath" alt="" class="exclude"/>
            <img v-else-if="isChatRoom(id)" :src="store.getters.getHeadImgPath + m.WxId + '.jpg'" alt="" class="exclude"/>
            <img v-else :src="store.getters.getHeadImgPath + id + '.jpg'" alt="" class="exclude"/>
          </div>
          <div class="chat-info">
            <div class="chat-nickname" v-if="isChatRoom(id)">
              <p v-if="isChatRoom(id) && m.IsSender === 0">{{ getUserNameByWxId(store, m.WxId) }} {{m.Type}} {{m.SubType}}</p>
            </div>
            <div v-if="m.Type === 3 && m.SubType ===0" class="chat-img">
              <img
                  :src="'/image?img_path=' + m.Thumb + '&session_name=' + store.getters.getCurrentSessionName"
                  :data-original="'/image?img_path=' + m.Image + '&session_name=' + store.getters.getCurrentSessionName"
                  alt="" :width="m.cdnthumbwidth"
                  :height="m.cdnthumbheight"/>
            </div>
            <div v-else class="chat-text">
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
    .chat-container {
      transform: rotate(180deg) translateZ(0);
      .tips {
        font-size: 12px;
        color: gray;
        text-align: center;
        padding: 10px;
        .tips-content {
          max-width: 300px;
          margin: 0 auto;
        }
      }
      .chat {
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
            margin-top: 3px;
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
          .chat-img {
            border-radius: 4px;
            border: 1px solid lightgray;
          }
          .chat-img:hover {
            cursor: pointer;
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