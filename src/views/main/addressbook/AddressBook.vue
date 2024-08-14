<script setup>
import {shortenCharts} from "../../../utils/common.js";
import {useStore} from "vuex";
import {onBeforeMount, reactive, ref} from "vue";
import {contactSplit} from "../../../api/msg.js";
import {useRouter, useRoute} from "vue-router";
import defaultImage from '@/assets/default-head.png';

const store = useStore();
const router = useRouter();
const route = useRoute();

const sessionId = route.params.sessionId;

const routerKey = ref('');

const page = ref(1);
const size = ref(20);
const input = ref('');
const contact = reactive([]);
const chatRoom = reactive([]);
const selectedItem = ref('');

const clear = () => {
  input.value = '';
}

const load = () => {
  contactSplit(page.value, size.value).then(data => {
    contact.push(...data);
    page.value = page.value + 1;
  });
}

const loadChatRoom = () => {
  contactSplit(1, 100, 2).then(data => {
    chatRoom.push(...data);
  });
}

// 加载数据
loadChatRoom();
load();


const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}

const contactContainer = ref(null);

const onScroll = () => {
  let sub = contactContainer.value.scrollHeight - contactContainer.value.clientHeight - contactContainer.value.scrollTop;
  if (Math.abs(sub) < 1) {
    load();
  }
}

const goChatRoomInfo = (contact) => {
  selectedItem.value = contact.UserName;
  // const targetPath = '/address-book/chat-room-info/' + contact.UserName;
  // router.push(targetPath);
  routerKey.value = contact.UserName;
  router.push({ name: 'chat-room-info', params: { sessionId: sessionId, id: contact.UserName} });
}

const goUserInfo = (contact) => {
  selectedItem.value = contact.UserName;
  store.commit('setAddrShowUser', contact);
  // const targetPath = '/address-book/user-info/' + contact.UserName;
  // router.push(targetPath);
  routerKey.value = contact.UserName;
  router.push({ name: 'user-info', params: { sessionId: sessionId, id: contact.UserName} });
}

</script>

<template>
  <div class="main-addr">
    <div class="addr-left">
      <div class="addr-search-container">
        <div class="weui-search-bar weui-search-bar_filled-grey weui-search-bar_focusing" id="searchBar">
          <form id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
            <div aria-hidden="false" id="searchBox" class="weui-search-bar__box">
              <i class="weui-icon-search"></i>
              <!--              <span class="weui-search-bar__words">微信</span>-->
              <input v-model="input" type="search" aria-controls="searchResult" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required/>
              <div class="weui-search-bar__mask"></div>
              <a href="javascript:" role="button" title="清除" class="weui-icon-clear" id="searchClear" @click="clear"></a>
            </div>
          </form>
        </div>
      </div>
      <div class="addr-items-container" ref="contactContainer" @scroll="onScroll">
        <ul class="addr-group">
          <li class="group-title">群聊</li>
          <li class="group-item"
              :class="{'item-active': selectedItem === c.UserName}"
              v-for="c in chatRoom"
              @click="goChatRoomInfo(c)">
            <img class="item-img"
                 :src="store.getters.getHeadImgPath + c.UserName + '.jpg'"
                 @error="setDefaultImage"
                 alt="">
            <p class="item-title">{{ c.Remark ? c.Remark : c.NickName }}</p>
          </li>
        </ul>
        <ul class="addr-group">
          <li class="group-title">联系人</li>
          <li class="group-item"
              v-for="(c,index) in contact"
              :class="{'item-active': selectedItem === c.UserName}"
              @click="goUserInfo(c)">
            <img class="item-img"
                 :src="store.getters.getHeadImgPath + c.UserName + '.jpg'"
                 @error="setDefaultImage"
                 alt="">
            <p class="item-title">{{ c.Remark ? c.Remark : c.NickName }}</p>
          </li>
        </ul>
        <p class="load-more"> 加载更多 </p>
      </div>
    </div>
    <div class="addr-right">
      <router-view :key="routerKey"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.main-addr {
  display: flex;
  height: 100%;
  .addr-left {
    width: 300px; /* 设置 session 部分的宽度 */
    background-color: #E4E3E4;
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    border-right: 1px solid lightgray;
    .addr-search-container {
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
    .addr-items-container {
      flex-grow: 1; /* 占据剩余空间 */
      overflow-y: scroll; /* 启用垂直滚动 */
      overflow-x: hidden;
      .addr-group {
        border-bottom: 1px solid lightgray;
        width: 100%;
        .group-title {
          padding-left: 15px;
          font-size: 12px;
          color: #797979;
          padding-top: 20px;
        }
        .group-item {
          width: 100%;
          padding: 15px;
          display: flex;
          .item-img {
            width: 27px;
            height: 27px;
            border-radius: 3px;
          }
          .item-title {
            padding-left: 10px;
            font-size: 14px;
          }
        }
        .group-item:hover {
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
    }

    // 以下是滚动条样式
    /* 隐藏默认的滚动条轨道和拇指 */
    .addr-items-container::-webkit-scrollbar {
      width: 0; /* 隐藏滚动条 */
      background: transparent; /* 使滚动条轨道背景透明 */
    }

    /* 鼠标悬停时显示滚动条轨道 */
    .addr-items-container:hover::-webkit-scrollbar {
      width: 6px; /* 设置滚动条宽度 */
      background: #f0f0f0; /* 滚动条轨道背景颜色 */
    }

    /* 滚动条轨道样式 */
    .addr-items-container:hover::-webkit-scrollbar-track-piece {
      background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
      border-radius: 8px; /* 设置滚动条轨道圆角 */
    }

    /* 滚动条拇指样式 */
    .addr-items-container:hover::-webkit-scrollbar-thumb {
      background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
      border-radius: 8px; /* 设置滚动条拇指圆角 */
    }

    /* 鼠标悬停在滚动条拇指上时的样式 */
    .addr-items-container:hover::-webkit-scrollbar-thumb:hover {
      background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
    }
  }
  .addr-right {
    flex-grow: 1;
    height: 100%;
  }
}
</style>