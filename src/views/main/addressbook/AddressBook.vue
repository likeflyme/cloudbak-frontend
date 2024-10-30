<script setup>
import {shortenCharts} from "../../../utils/common.js";
import {useStore} from "vuex";
import {onBeforeMount, onUnmounted, reactive, ref, watch} from "vue";
import {contactSplit} from "../../../api/msg.js";
import {useRouter, useRoute} from "vue-router";
import defaultImage from '@/assets/default-head.svg';

const store = useStore();
const router = useRouter();
const route = useRoute();

const sessionId = route.params.sessionId;


const page = ref(1);
const size = ref(20);
const input = ref('');
const contact = reactive([]);
const chatRoom = reactive([]);
const selectedItem = ref('');
const search = ref('');
const noMore = ref(false);

const clear = () => {
  search.value = '';
}

const load = () => {
  contactSplit(page.value, size.value, search.value).then(data => {
    contact.push(...data);
    page.value = page.value + 1;
    if (data.length < size.value) {
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

const loadChatRoom = () => {
  contactSplit(1, 1000, search.value,2).then(data => {
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
  if (Math.abs(sub) <= 1) {
    load();
  }
}

const goChatRoomInfo = (contact) => {
  selectedItem.value = contact.UserName;
  router.push({ name: 'chat-room-info', params: {id: contact.UserName} });
}

const goUserInfo = (contact) => {
  selectedItem.value = contact.UserName;
  store.commit('setAddrShowUser', contact);
  router.push({ name: 'user-info', params: { sessionId: sessionId, id: contact.UserName} });
}

// 搜索
let timeout = null;
const sLoading = ref(false);


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
  noMore.value = false;
  sLoading.value = true;
  console.log('用户停止输入，执行函数');
  console.log(search.value);
  contact.length = 0;
  chatRoom.length = 0;
  loadChatRoom();
  load();
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

const closeInfo = () => {
  selectedItem.value = null;
}
</script>

<template>
  <div class="main-addr">
    <div class="addr-left">
      <div class="addr-search-container">
        <div class="weui-search-bar weui-search-bar_filled-grey weui-search-bar_focusing" id="searchBar">
          <div id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
            <div aria-hidden="false" id="searchBox" class="weui-search-bar__box">
              <i class="weui-icon-search"></i>
              <!--              <span class="weui-search-bar__words">微信</span>-->
              <input v-model="search" @keyup.enter="inputEnter" type="search" aria-controls="searchResult" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required/>
              <div class="weui-search-bar__mask"></div>
              <a href="javascript:" role="button" title="清除" class="weui-icon-clear" id="searchClear" @click="clear"></a>
            </div>
          </div>
        </div>
      </div>
      <div class="addr-items-container" ref="contactContainer" @scroll="onScroll">
        <ul class="addr-group" v-if="chatRoom.length > 0">
          <li class="group-title">群聊</li>
          <li class="group-item"
              :class="{'item-active': selectedItem === c.UserName}"
              v-for="c in chatRoom"
              @click="goChatRoomInfo(c)">
            <img class="item-img"
                 :src="c.smallHeadImgUrl"
                 @error="setDefaultImage"
                 alt="">
            <p class="item-title">{{ c.Remark ? c.Remark : c.NickName }}</p>
          </li>
        </ul>
        <ul class="addr-group" v-if="contact.length > 0">
          <li class="group-title">联系人</li>
          <li class="group-item"
              v-for="(c,index) in contact"
              :class="{'item-active': selectedItem === c.UserName}"
              @click="goUserInfo(c)">
            <img class="item-img"
                 :src="c.smallHeadImgUrl"
                 @error="setDefaultImage"
                 alt="">
            <p class="item-title">{{ c.Remark ? c.Remark : c.NickName }}</p>
          </li>
        </ul>
        <p class="load-more"> 加载更多 </p>
      </div>
    </div>
    <div class="addr-right" :class="{'open': selectedItem}">
      <router-view :key="$route.fullPath" @goBack="closeInfo"/>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "/src/style/main/addressbook/address-book.less";
</style>