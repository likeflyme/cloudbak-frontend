<script setup>
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {msgs, msgsAll, session as getSession, msgBySvrId, chatroom, ghMsgs} from "@/api/msg.js"
import {useStore} from "vuex";
import {parseXml, formatMsgDate} from "@/utils/common.js";
import defaultImage from '@/assets/default-head.svg';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import MsgFilter from "../../../components/MsgFilter.vue";
import {shortenCharts} from "../../../utils/common.js";
import MsgSysMsg from "../../../components/msg/MsgSysMsg.vue";
import MsgHeadTemplate from "../../../components/msg/MsgHeadTemplate.vue";
import MsgNotice from "../../../components/msg/MsgNotice.vue";

const store = useStore();
const route = useRoute();

const id = route.params.id
console.log(id);
const isChatRoom = id.includes('@chatroom');
const userLength = ref(0);
const chatMapBySvrId = reactive({});
const chatRoomNameMap = reactive({});
const showTool = ref(false);
const showFilter = ref(false);
// 群聊，加载群聊信息（人数）
if (isChatRoom) {
  chatroom(id).then(data => {
    if(data) {
      let ul = data.UserNameList.split('^G');
      userLength.value = ul.length;
      if (data.ChatRoomMembers) {
        for (let i = 0; i < data.ChatRoomMembers.length; i++) {
          let m = data.ChatRoomMembers[i]
          chatRoomNameMap[m.userName] = m.remark;
        }
      }
    }
  });
}

const noMoreMsg = ref(false);
const isLoading = ref(false);
const images = reactive([]);

const query = reactive({
  strUsrName: id,
  page: 1,
  size: 30,
  start: 0,
  dbNo: -1
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

const loadData = () => {
  if (!noMoreMsg.value) {
    isLoading.value = true;
    // 公众号聊天查询
    // if (id.startsWith('gh_') || id.endsWith("@openim")) {
    //   ghMsgs(query).then(resp => {
    //     isLoading.value = false;
    //     if (resp.msgs.length < query.size) {
    //       noMoreMsg.value = true;
    //     }
    //     msg_list.push(...resp.msgs);
    //   });
    //   return;
    // }
    // 其他按照对话处理
    msgsAll(query).then(resp => {
      isLoading.value = false;
      if (resp.msgs.length < query.size) {
        noMoreMsg.value = true;
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
        // 图片数据处理
        try{
          parseImg(resp.msgs);
        } catch (e) {
          console.log('parse img error: ', e);
        }
        // 添加到数据列表
        // msg_list.push(...resp);
        for (let c of resp.msgs) {
          msg_list.push(c);
          // 图片类型存一份到映射中方便引用类型查找
          if (c.Type === 3 && c.SubType === 0) {
            chatMapBySvrId[c.MsgSvrIDStr] = c;
          }
        }
      }
    }).catch(e => {
      isLoading.value = false;
      console.log("load msg error:", e)
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

const handleTouchMove = () => {
  let top = chatContainer.value.scrollHeight - chatContainer.value.clientHeight;
  if (Math.abs(chatContainer.value.scrollTop - top) < 2) {
    // 避免过快加载数据，这里只标记到达顶部
    if (!isTop.value) {
      isTop.value = true;
    } else {
      loadMore();
      isTop.value = false;
    }
  }
}
const loadMore = () => {
  query.page = query.page + 1;
  loadData();
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

const closeFilter = () => {
  showFilter.value = false;
}
// 移动端返回
const emit = defineEmits(['goBack']);

const titleShorten = (title) => {
  const width = window.innerWidth;
  if (width > 768) {
    return title;
  } else {
    return shortenCharts(title, 26, '...');
  }
}
</script>
<template>
  <div class="main-content">
    <div class="main-content-top">
      <p class="main-content-title" @click="emit('goBack');"><font-awesome-icon class="main-back" :icon="['fas', 'chevron-left']"/></p>
      <p class="main-content-title">{{ titleShorten(session.Remark?session.Remark:session.strNickName) }}</p>
      <p class="main-content-title" v-if="isChatRoom"> ({{userLength}})</p>
      <p style="flex-grow: 1"></p>
      <p class="main-content-toolbar" @click="showTool?showTool=false:showTool=true">...</p>
    </div>
    <div class="main-content-info"
         @wheel="onWheel"
         @scroll="onScroll"
         @touchmove="handleTouchMove"
         ref="chatContainer"
         v-viewer="imageOptions">
      <div class="chat-grow">
      </div>
      <div class="chat-container" v-for="(m, index) in msg_list" :key="m">
        <div class="tips" v-if="shouldDisplayTimestamp(m.CreateTime, index)">
          <p class="tips-content">
            {{ formatMsgDate(m.CreateTime) }}
          </p>
        </div>
        <!-- 系统消息 -->
        <MsgSysMsg
            v-if="m.Type === 10000"
            :msg="m"></MsgSysMsg>
        <!-- 通知消息，支持公众号类型与服务通知的通知类消息，主要支持微信支付与服务通知 -->
        <MsgNotice
            v-else-if="m.Type === 49 && m.SubType === 5 && (id.startsWith('gh_') || id === 'notifymessage')"
            :msg="m"></MsgNotice>
        <MsgHeadTemplate
            v-else
            :roomId="route.params.id"
            :msg="m"
            :chatRoomNameMap="chatRoomNameMap"
            :isChatRoom="isChatRoom"
        ></MsgHeadTemplate>
      </div>
      <div class="load-more">
        <a v-if="!noMoreMsg" href="javascript:void(0)" @click="loadMore">
          <font-awesome-icon class="loading-icon" v-if="isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
    </div>
    <div class="main-tools" v-if="showTool">
      <ul class="main-tools-ul">
        <li class="main-tools-li" v-if="isChatRoom">
          <div class="chatroom-item">
            <p>群聊名称</p>
            <p class="chatroom-value"> {{ session.strNickName }} </p>
          </div>
          <div class="chatroom-item">
            <p>群聊公告</p>
            <p class="chatroom-value"> 暂不支持 </p>
          </div>
          <div class="chatroom-item">
            <p>群聊备注</p>
            <p class="chatroom-value"> {{ session.Remark?session.Remark:'未设置' }} </p>
          </div>
          <div class="chatroom-item">
            <p>我在本群的昵称</p>
            <p class="chatroom-value"> 暂不支持 </p>
          </div>
        </li>
        <li class="main-tools-li flex tool-chat" @click="showFilter?showFilter = false: showFilter = true">
          <p>聊天记录</p>
          <p style="flex-grow: 1"></p>
          <p class="tool-chevron-right"><font-awesome-icon :icon="['fas', 'chevron-right']"/></p>
        </li>
      </ul>
    </div>
  </div>
  <div class="msg-filter" :class="{'open': showFilter}" v-if="showFilter" >
    <MsgFilter @close-filter="closeFilter" :str-usr-name="id" :title="session.Remark?session.Remark:session.strNickName"></MsgFilter>
  </div>
</template>
<style scoped lang="less">
@import "/src/style/main/comment/comment-chat.less";
</style>