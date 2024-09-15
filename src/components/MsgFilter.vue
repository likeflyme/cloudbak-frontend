<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {nextTick, reactive, ref} from "vue";
import {parseXml, getReferFileName, getThumbFromStringContent, getVoiceLength, parseImg, formatFilterMsgDate} from "@/utils/common.js";
import {useStore} from "vuex";
import defaultImage from '@/assets/default-head.svg';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {filterDateFormatQuery, filterDateFormatView} from "../utils/common.js";
import {get_msg_desc} from "../utils/msgtp.js";
import {chatroom, msgsFilter, msgsByLocalId} from "../api/msg.js";
import cleanedImage from '@/assets/cleaned.jpeg';
import AudioPlayer from "./AudioPlayer.vue";
import ChatFile from "./ChatFile.vue";

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

// 图片查看器配置
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
    <div class="msg-body" ref="chatContainer" @wheel="onWheel" @scroll="onScroll" v-viewer="imageOptions">
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
            <img alt="" :src="m.smallHeadImgUrl?m.smallHeadImgUrl:defaultImage" @error="setDefaultImage" class="exclude"/>
          </div>
          <div class="msg-right">
            <div class="msg-title">
              <p class="msg-nickname">{{ displayName(m)}}</p>
              <p class="msg-grow"></p>
              <p class="msg-time">{{ formatFilterMsgDate(m.CreateTime) }}</p>
            </div>
            <div class="msg-content">
              <!-- 文本 -->
              <div v-if="m.Type === 1 && m.SubType === 0" class="msg-base msg-text">
                {{ m.StrContent }}
              </div>
              <!-- 图片 -->
              <div v-else-if="m.Type === 3 && m.SubType === 0" class="msg-base msg-images">
                <img
                    :src="'/image?img_path=' + m.Thumb + '&session_id=' + store.getters.getCurrentSessionId"
                    :data-original="m.Image ? '/image?img_path=' + m.Image + '&session_id=' + store.getters.getCurrentSessionId : cleanedImage"
                    alt=""/>
              </div>
              <!-- 语音 -->
              <div v-else-if="m.Type === 34 && m.SubType === 0" class="msg-base msg-media">
                <AudioPlayer class="audio-player"
                    :src="`/api/msg/media?MsgSvrID=${m.MsgSvrIDStr}&session_id=${store.getters.getCurrentSessionId}&db_no=${m.DbNo}`"
                    :text="getVoiceLength(m.StrContent)"/>
              </div>
              <!-- 视频 -->
              <div v-else-if="m.Type === 43 && m.SubType === 0" class="msg-base msg-video">
                <video controls width="150" :poster="`/image?img_path=${m.Thumb}&session_id=${store.getters.getCurrentSessionId}`">
                  <source v-if="m.Image" :src="`/video?video_path=${m.Image}&session_id=${store.getters.getCurrentSessionId}`" type="video/mp4" />
                </video>
              </div>
              <div class="msg-base msg-chat-file" v-else-if="m.Type === 49 && m.SubType === 6" >
                <ChatFile :msg="m"></ChatFile>
              </div>
              <div v-else class="msg-base msg-no-support">
                不支持的类型：{{ get_msg_desc(m.Type, m.SubType) }}
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
@import "/src/style/msg-filter.less";
</style>