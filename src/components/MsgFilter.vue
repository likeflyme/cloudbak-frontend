<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {nextTick, reactive, ref} from "vue";
import {parseXml, getReferFileName, getThumbFromStringContent, getVoiceLength, parseImg, formatFilterMsgDate} from "@/utils/common.js";
import {useStore} from "vuex";
import defaultImage from '@/assets/default-head.svg';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {filterDateFormatQuery, filterDateFormatView} from "../utils/common.js";
import {chatroom, msgsFilter, msgsByLocalId} from "../api/msg.js";

const store = useStore();
const props = defineProps({
  strUsrName: String,
  title: String
})
const selected = ref(false);
const selectedType = reactive({});
const msg_list = reactive([]);
const isLoading = ref(false);
// 滚动条反向滚动以及数据加载相关变量
const chatContainer = ref(null);
const isTop = ref(false);
const isBottom = ref(false);
// 展示上下文按钮
const isShowContext = ref(false);
// 日期选择相关变量
const date = ref();
const datepicker = ref();
const queryDayData = {
  type: 7,
  title: '日期',
  width: '120px',
  icon: ['fas', 'calendar-days']
}
// 是否为通过id定位查询
const isQueryByLocalId = ref(false);
// 普通查询
const query = reactive({
  strUsrName: props.strUsrName,
  page: 1,
  size: 20,
  start: 0,
  dbNo: -1,
  filterType: 0,
  filterText: '',
  filterDay: '',
  filterUser: '',
  filterMode: 0,
  noMoreMsg: false,
  isLoading: false,
  isTop: false
});

// 反向查询
const queryReverse = reactive({
  strUsrName: props.strUsrName,
  page: 0,
  size: 20,
  start: 0,
  dbNo: -1,
  filterType: 7,
  filterText: '',
  filterDay: '',
  filterUser: '',
  filterMode: -1,
  noMoreMsg: false,
  isLoading: false,
  isBottom: false
});

// 消息定位查询
const queryLocalId = reactive({
  strUsrName: props.strUsrName,
  localId: 0,
  CreateTime: 0,
  Sequence: 0,
  page: 0,
  size: 20,
  start: 0,
  dbNo: -1,
  filterMode: 0,
  noMoreMsg: false,
  isLoading: false,
  isTop: false
});

// 消息定位查询反向查询
const queryLocalIdReverse = reactive({
  strUsrName: props.strUsrName,
  localId: 0,
  CreateTime: 0,
  Sequence: 0,
  page: 1,
  size: 20,
  start: 0,
  dbNo: -1,
  filterMode: -1,
  noMoreMsg: false,
  isLoading: false,
  isBottom: false
});

const filterTypes = [
  {
    type: 1,
    title: '文件',
    width: '90px',
    icon: ['fas', 'file']
  },{
    type: 2,
    title: '图片与视频',
    width: '170px',
    icon: ['fas', 'image']
  },{
    type: 3,
    title: '链接',
    width: '100px',
    icon: ['fas', 'link']
  },{
    type: 4,
    title: '音乐与音频',
    width: '170px',
    icon: ['fas', 'volume-high']
  },{
    type: 5,
    title: '小程序',
    width: '120px',
    icon: ['fas', 'globe']
  },{
    type: 6,
    title: '视频号',
    width: '120px',
    icon: ['fas', 'video']
  }
  // ,{
  //   type: '8',
  //   title: '群成员',
  //   width: '120px',
  //   icon: ['fas', 'users']
  // },
];
const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}
const selectFilterType = (t) => {
  selected.value = true;
  query.filterType = t.type;
  Object.assign(selectedType, t);
  clearAndSearch();
}
const clear = () => {
  selected.value = false;
  query.filterText = '';
  query.filterType = 0;
  clearAndSearch();
}
const clearSelectType = () => {
  selected.value = false;
  query.filterType = 0;
  clearAndSearch();
}
// 回归初始化查询条件并加载数据函数
const clearAndSearch = (showContext = false) => {
  isShowContext.value = showContext;
  query.noMoreMsg = false;
  query.dbNo = -1;
  query.page = 1;
  query.filterMode = 0
  queryReverse.noMoreMsg = false;
  queryReverse.dbNo = -1;
  queryReverse.page = 0;
  queryLocalId.page = 0;
  queryLocalId.noMoreMsg = false;
  queryLocalIdReverse.page = 0;
  queryLocalIdReverse.noMoreMsg = false;
  isQueryByLocalId.value = false;
  msg_list.length = 0;
  isTop.value = false;
  loadData();
}
// 单纯的加载数据函数
const loadData = () => {
  if (!query.noMoreMsg) {
    query.isLoading = true;
    msgsFilter(query).then(resp => {
      query.isLoading = false;
      if (resp.msgs.length < query.size) {
        query.noMoreMsg = true;
      }
      if (resp.msgs.length > 0) {
        query.start = resp.start;
        // 设置数据库编号
        if (query.dbNo === -1) {
          query.dbNo = resp.dbNo;
        } else if (query.dbNo !== resp.dbNo) {
          query.page = 0;
          query.dbNo = resp.dbNo;
        }
        // 添加到数据列表
        msg_list.push(...resp.msgs);
      }
    }).catch(e => {
      query.isLoading = false;
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
}

// 反向加载数据函数
const loadDataReverse = () => {
  if (!queryReverse.noMoreMsg) {
    queryReverse.isLoading = true;
    msgsFilter(queryReverse).then(resp => {
      queryReverse.isLoading = false;
      if (resp.msgs.length < queryReverse.size) {
        queryReverse.noMoreMsg = true;
      }
      if (resp.msgs.length > 0) {
        queryReverse.start = resp.start;
        // 设置数据库编号
        if (queryReverse.dbNo === -1) {
          queryReverse.dbNo = resp.dbNo;
        } else if (queryReverse.dbNo !== resp.dbNo) {
          queryReverse.page = 0;
          queryReverse.dbNo = resp.dbNo;
        }
        // 添加数据前，记录当前页面高度
        const previousScrollHeight = chatContainer.value.scrollHeight;
        const previousScrollTop = chatContainer.value.scrollTop;
        // 添加到数据列表头部
        resp.msgs.reverse()
        msg_list.unshift(...resp.msgs);
        nextTick(() => {
          const newScrollHeight = chatContainer.value.scrollHeight;
          chatContainer.value.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        })
      }
    }).catch(e => {
      queryReverse.isLoading = false;
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
}

// 消息定位查询
const loadDataByLocalId = () => {
  if (!queryLocalId.noMoreMsg && !queryLocalId.isLoading) {
    queryLocalId.isLoading = true;
    isQueryByLocalId.value = true;
    queryLocalId.page = queryLocalId.page + 1;
    msgsByLocalId(queryLocalId).then(resp => {
      queryLocalId.isLoading = false;
      if (resp.msgs.length < queryLocalId.size) {
        queryLocalId.noMoreMsg = true;
      }
      if (resp.msgs.length > 0) {
        queryLocalId.start = resp.start;
        // 设置数据库编号
        if (query.dbNo === -1) {
          queryLocalId.dbNo = resp.dbNo;
        } else if (queryLocalId.dbNo !== resp.dbNo) {
          queryLocalId.page = 0;
          queryLocalId.dbNo = resp.dbNo;
        }
        // 添加到数据列表
        msg_list.push(...resp.msgs);
      }
    }).catch(e => {
      queryLocalId.isLoading = false;
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
}

// 消息定位反向查询
const loadDataByLocalIdReverse = () => {
  if (!queryLocalIdReverse.noMoreMsg && !queryLocalIdReverse.isLoading) {
    queryLocalIdReverse.isLoading = true;
    isQueryByLocalId.value = true;
    queryLocalIdReverse.page = queryLocalIdReverse.page + 1;
    msgsByLocalId(queryLocalIdReverse).then(resp => {
      queryLocalIdReverse.isLoading = false;
      if (resp.msgs.length < queryLocalIdReverse.size) {
        queryLocalIdReverse.noMoreMsg = true;
      }
      if (resp.msgs.length > 0) {
        queryLocalIdReverse.start = resp.start;
        // 设置数据库编号
        if (queryLocalIdReverse.dbNo === -1) {
          queryLocalIdReverse.dbNo = resp.dbNo;
        } else if (queryLocalIdReverse.dbNo !== resp.dbNo) {
          queryLocalIdReverse.page = 0;
          queryLocalIdReverse.dbNo = resp.dbNo;
        }
        // 添加数据前，记录当前页面高度
        const previousScrollHeight = chatContainer.value.scrollHeight;
        const previousScrollTop = chatContainer.value.scrollTop;
        // 添加到数据列表头部
        resp.msgs.reverse()
        msg_list.unshift(...resp.msgs);
        nextTick(() => {
          const newScrollHeight = chatContainer.value.scrollHeight;
          chatContainer.value.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        })
      }
    }).catch(e => {
      queryLocalIdReverse.isLoading = false;
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
}

// 页面初始化加载数据
clearAndSearch();

// 加载更多数据
const loadMore = () => {
  if (isQueryByLocalId.value) {
    loadDataByLocalId();
  } else {
    query.page = query.page + 1;
    query.filterMode = 1;
    loadData();
  }
};

// 反向加载更多数据
const loadReverse = () => {
  if (isQueryByLocalId.value) {
    loadDataByLocalIdReverse();
  } else {
    queryReverse.page = queryReverse.page + 1;
    loadDataReverse();
  }
};

// 消息定位查询
const loadLocation = (m) => {
  queryLocalId.dbNo = m.DbNo;
  queryLocalId.localId = m.localId;
  queryLocalId.CreateTime = m.CreateTime;
  queryLocalId.Sequence = m.Sequence;
  queryLocalIdReverse.dbNo = m.DbNo;
  queryLocalIdReverse.localId = m.localId;
  queryLocalIdReverse.CreateTime = m.CreateTime;
  queryLocalIdReverse.Sequence = m.Sequence;
  msg_list.length = 0;
  // 关闭查看上下文的按钮
  isShowContext.value = false;
  loadDataByLocalId()
}

// 滚动条反向滚动以及数据加载相关函数
// 滚动加载
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

// 反向滚动
const onWheel = (event) => {

  // 阻止默认滚动行为，以便完全自定义滚动效果
  event.preventDefault();

  // 根据滚轮事件的 deltaY 属性调整滚动条位置
  const delta = event.deltaY;

  // 根据滚轮方向调整滚动条位置，注意方向是反的
  chatContainer.value.scrollTop -= delta;
  if (chatContainer.value.scrollTop + chatContainer.value.clientHeight === chatContainer.value.scrollHeight) {
    loadMore();
  }
  if (chatContainer.value.scrollTop === 0) {
    if (query.filterType === 7 || isQueryByLocalId.value) {
      loadReverse();
    }
  }
};

// 日期选择
const datePicked = (modelData) => {
  let view = filterDateFormatView(modelData);
  let queryValue = filterDateFormatQuery(modelData);
  queryDayData.title = view;
  query.filterDay = queryValue;
  queryReverse.filterDay = queryValue;
  selectFilterType(queryDayData)
}

// 群聊用户名
const chatRoomNameMap = reactive({});
const isChatRoom = props.strUsrName.includes('@chatroom');
// 群聊，加载群聊信息（人数）
if (isChatRoom) {
  chatroom(props.strUsrName).then(data => {
    if(data) {
      if (data.ChatRoomMembers) {
        for (let i = 0; i < data.ChatRoomMembers.length; i++) {
          let m = data.ChatRoomMembers[i]
          chatRoomNameMap[m.userName] = m.remark;
        }
      }
    }
  });
}

/**
 * 有备注先用备注，其次群备注，最后昵称
 * @param m
 * @returns {*}
 */
const displayName = (m) => {
  if (m.Remark) {
    return m.Remark;
  }
  let chatName = chatRoomNameMap[m.WxId];
  if (chatName) {
    return chatName;
  } else {
    return m.NickName
  }
}

</script>

<template>
  <div class="filter-container">
    <div class="filter-head">
      <div class="head-title">
        <p class="head-title-title">
          {{ title }}
        </p>
        <p class="head-title-fill"></p>
        <p class="head-title-tools" @click="$emit('close-filter')">
          <font-awesome-icon :icon="['fas', 'xmark']"/>
        </p>
      </div>
      <div class="head-search">
        <div class="weui-search-bar weui-search-bar_outlined" id="searchBar">
          <div id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
            <div class="weui-search-bar__box">
              <div class="select-type" v-if="selected" @click="clearSelectType" :style="{'width': selectedType.width}">
                <font-awesome-icon class="select-type-clear" :icon="selectedType.icon"/>
                <p>{{ selectedType.title }}</p>
                <font-awesome-icon class="select-type-clear" :icon="['fas', 'xmark']"/>
              </div>
              <i v-else class="weui-icon-search"></i>
              <input type="search" aria-controls="searchResult" v-model="query.filterText" class="weui-search-bar__input" id="searchInput" @keydown.enter="clearAndSearch"/>
              <a v-if="selected || query.filterText" href="javascript:" role="button" title="清除" class="weui-icon-clear" @click="clear"></a>
            </div>
          </div>
        </div>
      </div>
      <div class="head-filter">
        <ul class="filter-ul">
          <li class="filter-item" v-for="t in filterTypes" @click="selectFilterType(t)">{{ t.title }}</li>
          <li class="filter-item">
            <VueDatePicker v-model="date" @update:model-value="datePicked" ref="datepicker" :enable-time-picker="false" style="z-index: 1000">
              <template #trigger>
                <p>日期</p>
              </template>
            </VueDatePicker>
          </li>
        </ul>

      </div>
    </div>
    <div class="msg-body" ref="chatContainer" @wheel="onWheel" @scroll="onScroll">
      <div class="load-more" v-if="!isQueryByLocalId && query.filterType === 7 && !queryReverse.noMoreMsg">
        <a href="javascript:void(0)" @click="loadReverse">
          <font-awesome-icon class="loading-icon" v-if="queryReverse.isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
      <div class="load-more" v-else-if="isQueryByLocalId && !queryLocalIdReverse.noMoreMsg">
        <a href="javascript:void(0)" @click="loadReverse">
          <font-awesome-icon class="loading-icon" v-if="queryLocalIdReverse.isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
      <ul class="msg-ul" v-if="msg_list.length > 0">
        <li v-for="m in msg_list" class="msg-li">
          <div class="msg-head">
            <img alt="" :src="m.smallHeadImgUrl?m.smallHeadImgUrl:defaultImage" @error="setDefaultImage"/>
          </div>
          <div class="msg-right">
            <div class="msg-title">
              <p class="msg-nickname">{{ displayName(m)}}</p>
              <p class="msg-grow"></p>
              <p class="msg-time">{{ formatFilterMsgDate(m.CreateTime) }}</p>
            </div>
            <div class="msg-content">
              <div class="msg-text">
                {{ m.StrContent }}
              </div>
              <div class="msg-ref" v-if="isShowContext">
                <p class="msg-checkout" @click="loadLocation(m)">查看上下文</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <p class="no-msg" v-else-if="msg_list.length === 0 && !isLoading"> 无内容 </p>
      <!-- 非定位查询，加载更多 -->
      <div class="load-more" v-if="!isQueryByLocalId && !query.noMoreMsg">
        <a href="javascript:void(0)" @click="loadMore">
          <font-awesome-icon class="loading-icon" v-if="query.isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
      <!-- 定位查询，加载更多 -->
      <div class="load-more" v-else-if="isQueryByLocalId && !queryLocalId.noMoreMsg">
        <a href="javascript:void(0)" @click="loadMore">
          <font-awesome-icon class="loading-icon" v-if="queryLocalId.isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 700px;
  border: 1px solid lightgray;
  background-color: #fff;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  font-size: 14px;
  .filter-head {
    height: 135px;
    background-color: #F5F5F5;
    .head-title {
      padding: 5px 15px;
      color: #AFAEAE;
      display: flex;
      .head-title-fill {
        flex-grow: 1;
      }
      .head-title-tools {
        cursor: pointer;
      }
    }
    .head-search {
      .weui-search-bar {
        background-color: #F5F5F5;
        .weui-search-bar__form {
          height: 40px;
          background-color: #fff;
          border: 1px solid lightgray;
          .weui-search-bar__box {
            .select-type {
              display: flex;
              align-items: center;
              background-color: #E6E6E6;
              border-radius: 3px;
              color: #797979;
              padding: 5px 10px;
              cursor: pointer;
              margin-right: 10px;
            }
            .select-type p {
              margin-left: 10px; /* 为第二个子元素（<p>）添加 margin-left */
            }
            .select-type .select-type-clear:nth-child(3) {
              margin-left: 5px; /* 为第三个子元素（font-awesome-icon）添加 margin-left */
            }
            .weui-search-bar__input {
              flex-grow: 1;
              font-size: 14px;
            }
            .weui-icon-clear {
              cursor: pointer;
            }
          }
        }
      }
    }
    .head-filter {
      padding: 0 10px;
      .filter-ul {
        display: flex;
        .filter-item {
          padding: 5px 10px;
          cursor: pointer;
        }
      }
    }
  }
  .msg-body {
    // 聊天框需要调转180度
    transform: rotate(180deg) translateZ(0);
    // 文本方向切换，目的是滚动条换个方向
    direction: rtl;
    flex-grow: 1;
    overflow-y: scroll;
    .msg-ul {
      // 避免内容方向被切换
      direction: ltr;
      width: 100%;
      .msg-li {
        // 再将每项调转180度
        transform: rotate(180deg) translateZ(0);
        word-break: break-word;
        padding: 0 20px;
        display: flex;
        .msg-head {
          padding-top: 15px;
          width: 35px;
          height: 35px;
          img {
            width: 35px;
            height: 35px;
            border-radius: 3px;
          }
        }
        .msg-right {
          flex-grow: 1;
          padding-left: 15px;
          padding-right: 15px;

          .msg-title {
            padding-top: 15px;
            border-top: 1px solid #EFEFEF;
            display: flex;
            color: gray;
            font-size: 12px;
            .msg-grow {
              flex-grow: 1;
            }
          }
          .msg-content {
            display: flex;
            .msg-text {
              max-width: 400px;
              padding: 15px 0;
            }
            .msg-ref {
              flex-grow: 1;
              display: flex;
              align-items: center;
              text-align: right;
              cursor: pointer;
              .msg-checkout {
                width: 100%;
                visibility: hidden;
              }
            }
          }
          .msg-content:hover {
            .msg-checkout {
              visibility: visible;
            }
          }
        }
      }
    }
    .no-msg {
      text-align: center;
      transform: rotate(180deg) translateZ(0);
      direction: ltr;
    }
    .load-more {
      transform: rotate(180deg) translateZ(0);
      direction: ltr;
      text-align: center;
      font-size: 12px;
      a {
        color: dimgray;
      }
    }
  }

  // 以下是滚动条样式
  /* 隐藏默认的滚动条轨道和拇指 */
  .msg-body::-webkit-scrollbar {
    width: 6px; /* 隐藏滚动条 */
    background: transparent; /* 使滚动条轨道背景透明 */
  }

  /* 鼠标悬停时显示滚动条轨道 */
  .msg-body:hover::-webkit-scrollbar {
    width: 6px; /* 设置滚动条宽度 */
    background: #f0f0f0; /* 滚动条轨道背景颜色 */
  }

  /* 滚动条轨道样式 */
  .msg-body:hover::-webkit-scrollbar-track-piece {
    background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
    border-radius: 8px; /* 设置滚动条轨道圆角 */
  }

  /* 滚动条拇指样式 */
  .msg-body:hover::-webkit-scrollbar-thumb {
    background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
    border-radius: 8px; /* 设置滚动条拇指圆角 */
  }

  /* 鼠标悬停在滚动条拇指上时的样式 */
  .msg-body:hover::-webkit-scrollbar-thumb:hover {
    background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
  }
}
/* Define an animation behavior */
@keyframes spinner {
  to { transform: rotate(360deg); }
}
/* This is the class name given by the Font Awesome component when icon contains 'spinner' */
.fa-spinner {
  /* Apply 'spinner' keyframes looping once every second (1s)  */
  animation: spinner 1s linear infinite;
}
</style>