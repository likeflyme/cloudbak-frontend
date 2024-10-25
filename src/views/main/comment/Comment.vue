<script setup>
import {onUnmounted, reactive, ref, watch} from 'vue'
import {sessions as getSessions, contactSearch} from "@/api/msg.js";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import defaultImage from '@/assets/default-head.svg';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const store = useStore();
const router = useRouter();
const route = useRoute();

const page = ref(1);
const size = ref(20);
const noMore = ref(false);

const sessions = reactive([]);

const contactContainer = ref(null);

const sysSessionId = route.params.sessionId;

const selectedItem = ref(null)

const selectItem = (wxId) => {
  selectedItem.value = wxId;
  // const targetPath = '/comment/' + session.strUsrName;

  router.push({ name: 'chat', params: { sessionId: sysSessionId, id: wxId} });
  // router.push(targetPath);
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  // 获取今天的日期
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 获取昨天的日期
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // 获取年、月、日、小时、分钟
  // const year = date.getFullYear();
  const year = String(date.getFullYear()).slice(-2); // 只取年份的后两位
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
    return `${year}/${month}/${day}`;
  }
};

const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}

const load = () => {
  // 没有更多数据不再获取了
  if (noMore.value) {
    return;
  }
  // 加载用户聊天会话数据
  getSessions(page.value, size.value).then(resp => {
    sessions.push(...resp);
    page.value = page.value + 1;
    if (resp.length < size.value) {
      noMore.value = true;
    }
  }).catch(e => {
    if ("response" in e) {
      store.commit("showErrorToastMsg", {
        msg: e.response.data
      })
    } else {
      store.commit("showErrorToastMsg", {
        msg: e
      })
    }
  });
}

const onScroll = () => {
  let sub = contactContainer.value.scrollHeight - contactContainer.value.clientHeight - contactContainer.value.scrollTop;
  if (Math.abs(sub) <= 1) {
    load();
  }
}

// 加载session数据
load();


// 搜索
const search = ref('');
const contacts = reactive([]);
const chatRooms = reactive([]);
const sLoading = ref(false);

const clear = () => {
  search.value = '';
}
let timeout = null;

// 监听输入框值的变化
watch(search, () => {
  // 清除之前的计时器
  if (timeout) clearTimeout(timeout);

  // 设置一个新的计时器
  timeout = setTimeout(() => {
    handleInputEnd();
  }, 1000); // 1秒后触发
});


// 输入停止1秒后执行的函数
const handleInputEnd = () => {
  sLoading.value = true;
  console.log('用户停止输入，执行函数');
  console.log(search.value);
  contacts.length = 0;
  chatRooms.length = 0;
  if (search.value) {
    contactSearch(search.value).then(resp => {
      if ('contacts' in resp) {
        contacts.push(...resp.contacts);
      }
      if ('chatrooms' in resp) {
        chatRooms.push(...resp.chatrooms);
      }
      sLoading.value = false;
    }).catch(e => {
      sLoading.value = false;
      if ("response" in e) {
        store.commit("showErrorToastMsg", {
          msg: e.response.data
        })
      } else {
        store.commit("showErrorToastMsg", {
          msg: e
        })
      }
    });
  }
};

// 清除计时器以防内存泄漏
onUnmounted(() => {
  if (timeout) clearTimeout(timeout);
});

// enter 事件搜索
const inputEnter = () => {
  if (timeout) clearTimeout(timeout);
  handleInputEnd();
}

</script>

<template>
  <div class="main-comment">
    <div class="main-session">
      <div class="session-search-container">
        <div class="weui-search-bar weui-search-bar_filled-grey weui-search-bar_focusing" id="searchBar">
          <div id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
            <div aria-hidden="false" id="searchBox" class="weui-search-bar__box">
              <i class="weui-icon-search"></i>
              <input v-model="search" @keyup.enter="inputEnter" type="search" aria-controls="searchResult" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required/>
              <div class="weui-search-bar__mask"></div>
              <a href="javascript:" role="button" title="清除" class="weui-icon-clear" id="searchClear" @click="clear"></a>
            </div>
          </div>
        </div>
      </div>
      <div class="session-items-container" v-if="search">
        <div class="session-items-fix-roller">
          <div class="loading" v-if="sLoading" >
            <font-awesome-icon class="loading-icon" :icon="['fas', 'spinner']"/>
          </div>
          <div v-else>
            <div class="session-group">
              <div class="session-items-title">联系人</div>
              <ul class="items-ul">
                <li class="item" v-for="contact in contacts" @click="selectItem(contact.UserName)">
                  <div class="item-header">
                    <img :src="contact.smallHeadImgUrl" @error="setDefaultImage" alt="header">
                  </div>
                  <div class="item-msg no-wrap-text">
                    <p class="item-msg-title">{{contact.NickName}}</p>
                    <p class="item-msg-desc" v-if="contact.Remark" >{{contact.Remark}}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="session-group">
              <div class="session-items-title">群聊</div>
              <ul class="items-ul">
                <li class="item" v-for="chatroom in chatRooms" @click="selectItem(chatroom.UserName)">
                  <div class="item-header">
                    <img :src="chatroom.smallHeadImgUrl" @error="setDefaultImage" alt="header">
                  </div>
                  <div class="item-msg no-wrap-text">
                    <p class="item-msg-title">{{chatroom.NickName}}</p>
                    <p class="item-msg-desc" v-if="chatroom.Remark" >{{chatroom.Remark}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="session-items-container" v-else ref="contactContainer" @scroll="onScroll">
        <div class="session-items-fix-roller">
          <ul class="items-ul">
            <li class="item"
                v-for="(session, idx) in sessions" :key="session.strUsrName"
                :class="{ 'item-active': selectedItem === session.strUsrName }"
                @click="selectItem(session.strUsrName)">
              <div class="item-header">
                <img :src="session.smallHeadImgUrl" @error="setDefaultImage" alt="header">
              </div>
              <div class="item-msg no-wrap-text">
                <p class="item-msg-title">{{ session.Remark? session.Remark:session.strNickName }}</p>
                <p class="item-msg-desc">{{ session.strContent }}</p>
              </div>
              <div class="item-info">
                <p class="item-info-time">{{ formatDate(session.nTime) }}</p>
              </div>
            </li>
          </ul>
        </div>
        <p class="load-more" :class="{'load-more-hide': noMore}" @click="load"> 加载更多 </p>
      </div>
    </div>
    <div class="main-msg">
      <router-view :key="$route.fullPath"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.no-wrap-text {
  white-space: nowrap;
}
.main-comment {
  display: flex;
  height: 100%;
  .main-session {
    width: 320px; /* 设置 session 部分的宽度 */
    background-color: #e0e0e0; /* 示例背景色 */
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    border-right: 1px solid lightgray;
    .session-search-container {
      height: 63px; /* 固定高度 */
      width: 100%; /* 宽度为100% */
      background-color: #F7F7F7; /* 示例背景色 */
      .weui-search-bar {
        height: 63px;
        background-color: #F7F7F7;
        .weui-search-bar__form {
          height: 25px;
          top: 10px;
        }
        .weui-search-bar__mask {
          height: 25px;
        }
      }
      .weui-search-bar__input {
        font-size: 13px;
      }
    }
    .session-items-container {
      flex-grow: 1; /* 占据剩余空间 */
      overflow-y: scroll; /* 启用垂直滚动 */
      overflow-x: hidden;
      .session-items-fix-roller {
        width: 320px !important;
        .loading {
          text-align: center;
          .loading-icon {
            color: gray;
            font-size: 12px;
          }
        }
        .session-items-title {
          font-size: 12px;
          color: gray;
          padding: 10px;
        }
        .item {
          display: flex;
          padding: 13px;
          background-color: #ededed;
          .item-header {
            width: 40px;
            height: 40px;
            img {
              width: 40px;
              height: 40px;
              border-radius: 2px;
            }
          }
          .item-msg {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding-left: 10px;
            margin-right: 5px;
            overflow: hidden;
            .item-msg-title {
              font-size: 14px;
            }
            .item-msg-desc {
              font-size: 12px;
              color: #AFAEAE;
            }
          }
          .item-info {
            width: 50px;
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
      }
      .load-more {
        font-size: 13px;
        text-align: center;
        color: #56A5FD;
        padding: 5px 0;
      }
      .load-more-hide {
        display: none;
      }
    }

    // 以下是滚动条样式
    /* 隐藏默认的滚动条轨道和拇指 */
    .session-items-container::-webkit-scrollbar {
      width: 0; /* 隐藏滚动条 */
      background: transparent; /* 使滚动条轨道背景透明 */
    }

    /* 鼠标悬停时显示滚动条轨道 */
    .session-items-container:hover::-webkit-scrollbar {
      width: 6px; /* 设置滚动条宽度 */
      background: #f0f0f0; /* 滚动条轨道背景颜色 */
    }

    /* 滚动条轨道样式 */
    .session-items-container:hover::-webkit-scrollbar-track-piece {
      background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
      border-radius: 8px; /* 设置滚动条轨道圆角 */
    }

    /* 滚动条拇指样式 */
    .session-items-container:hover::-webkit-scrollbar-thumb {
      background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
      border-radius: 8px; /* 设置滚动条拇指圆角 */
    }

    /* 鼠标悬停在滚动条拇指上时的样式 */
    .session-items-container:hover::-webkit-scrollbar-thumb:hover {
      background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
    }
  }
  .main-msg {
    flex-grow: 1;
    height: 100%;
  }
}
@keyframes spinner {
  to { transform: rotate(360deg); }
}
/* This is the class name given by the Font Awesome component when icon contains 'spinner' */
.fa-spinner {
  /* Apply 'spinner' keyframes looping once every second (1s)  */
  animation: spinner 1s linear infinite;
}
</style>