<script setup>
import {reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {msgs, session as getSession, chatroomInfo, msgBySvrId, chatroom} from "@/api/msg.js"
import {useStore} from "vuex";
import {parseXml, getReferFileName, getThumbFromStringContent, getVoiceLength} from "@/utils/common.js";
import {get_msg_desc} from "@/utils/msgtp.js";
import defaultImage from '@/assets/default-head.svg';
import cleanedImage from '@/assets/cleaned.jpeg';
import unknownFile from '@/assets/filetypeicon/unknown.svg';
import AudioPlayer from "../../../components/AudioPlayer.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const store = useStore();
const route = useRoute();

const id = route.params.id
const isChatRoom = id.includes('@chatroom');
const userList = reactive([]);
const userLength = ref(0);
const chatMapBySvrId = reactive({})
const displayNameMap = reactive({})
const chatRoomNameMap = reactive({})
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

const loadData = () => {
  if (!noMoreMsg.value) {
    isLoading.value = true;
    msgs(query).then(resp => {
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
      console.log(e)
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
const fileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else {
    return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
  }
}
const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}
const getOriMsgBySvrId = (svrId, DbNo) => {
  let msg = chatMapBySvrId[svrId];
  // 本地不存在，则到服务端查找
  if (!msg) {
    msgBySvrId(svrId, DbNo).then(data => {
      chatMapBySvrId[svrId] = data;
    });
  }
};

const convertSysMsg = (strContent) => {
  return strContent.replace(/<\/?revokemsg>/g, '');
}

const download = (path) => {
  if (path) {
    path = path.replace('\\', '/');
    const fileName = path.split('/').pop();
    let sessionId = store.getters.getCurrentSessionId;
    let url = `/file?path=${encodeURIComponent(path)}&session_id=${sessionId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    // 将<a>元素添加到DOM
    document.body.appendChild(link);
    // 触发点击事件
    link.click();
    // 移除<a>元素
    document.body.removeChild(link);
  }
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
  <div class="main-content">
    <div class="main-content-top">
      <p class="main-content-title">{{ session.Remark?session.Remark:session.strNickName }}</p>
      <p class="main-content-title" v-if="isChatRoom"> ({{userLength}})</p>
    </div>
    <div class="main-content-info" @wheel="onWheel" @scroll="onScroll" ref="chatContainer" v-viewer="imageOptions">
      <div class="chat-container" v-for="(m, index) in msg_list" :key="m">
        <div class="tips" v-if="shouldDisplayTimestamp(m.CreateTime, index)">
          <p class="tips-content">
            {{ formatDate(m.CreateTime) }}
          </p>
        </div>
        <!-- 系统通知类消息 -->
        <div class="tips" v-if="m.Type === 10000">
          <p class="tips-content">
            {{ convertSysMsg(m.StrContent) }}
          </p>
        </div>
        <div v-else class="chat" :class="{'right': m.IsSender === 1, 'left': m.IsSender === 0}" >
          <div class="chat-header">
            <img :src="m.smallHeadImgUrl?m.smallHeadImgUrl:defaultImage" @error="setDefaultImage" alt="" class="exclude"/>
          </div>
          <div class="chat-info">
            <div class="chat-nickname" v-if="isChatRoom">
              <p v-if="isChatRoom && m.IsSender === 0"> {{ displayName(m) }} </p>
            </div>
            <!-- 文本消息 -->
            <div v-if="m.Type === 1" class="chat-text">
              <p>
                {{ m.StrContent }}
              </p>
            </div>
            <!-- 图片消息 -->
            <div v-else-if="m.Type === 3 && m.SubType ===0" class="chat-img">
              <img
                  :src="'/image?img_path=' + m.Thumb + '&session_id=' + store.getters.getCurrentSessionId"
                  :data-original="m.Image ? '/image?img_path=' + m.Image + '&session_id=' + store.getters.getCurrentSessionId : cleanedImage"
                  alt=""/>
            </div>
            <!-- 语音消息 -->
            <div v-else-if="m.Type === 34 && m.SubType ===0" class="chat-media">
              <AudioPlayer
                :src="`/api/msg/media?MsgSvrID=${m.MsgSvrIDStr}&session_id=${store.getters.getCurrentSessionId}&db_no=${m.DbNo}`"
                :text="getVoiceLength(m.StrContent)"
                :right="m.IsSender === 1"/>
            </div>
            <!-- 视频消息 -->
            <div v-else-if="m.Type === 43 && m.SubType ===0" class="chat-img exclude">
              <video controls width="250" :poster="`/image?img_path=${m.Thumb}&session_id=${store.getters.getCurrentSessionId}`">
                <source v-if="m.Image" :src="`/video?video_path=${m.Image}&session_id=${store.getters.getCurrentSessionId}`" type="video/mp4" />
              </video>
            </div>
            <!-- 用户图片表情 -->
            <div v-else-if="m.Type === 47 && m.SubType === 0" class="chat-img">
              <img class="exclude"
                  :src="getThumbFromStringContent(m.StrContent)"
                  :data-original="'/image?img_path=' + (m.Image ? m.Image : m.Thumb) + '&session_id=' + store.getters.getCurrentSessionId"
                  alt=""/>
            </div>
            <!-- 引用消息 -->
            <div v-else-if="m.Type === 49 && m.SubType === 57" class="chat-text">
              <p>
                {{ m.compress_content.msg.appmsg.title }}
              </p>
            </div>
            <!-- 文件消息 -->
            <div v-else-if="m.Type === 49 && m.SubType === 6" class="chat-file" @click="download(m.Image)">
              <div class="chat-file-top">
                <div class="chat-file-left">
                  <p class="chat-file-title">{{ m.compress_content.msg.appmsg.title }}</p>
                  <p class="chat-file-content">{{ fileSize(m.compress_content.msg.appmsg.appattach.totallen)}}</p>
                </div>
                <div class="chat-file-icon">
                  <img class="item-icon" :src="unknownFile" alt=""/>
                </div>
              </div>
              <div class="chat-file-bottom">
                <p v-if="m.Image" class="chat-file-app-info">
                  <p v-if="m.compress_content.msg.appinfo" class="chat-file-app-info">{{ m.compress_content.msg.appinfo.appname }}</p>
                </p>
                <p v-else class="chat-file-app-info">
                  未下载的文件
                </p>
              </div>
<!--              <p>-->
<!--                {{ m.compress_content.msg.appmsg.title }}-->
<!--              </p>-->
            </div>
            <div v-else class="refer-msg">
              <p class="refer-text">
                暂不支持的消息类型：{{ get_msg_desc(m.Type, m.SubType) }}
              </p>
            </div>
            <!-- 引用消息 -->
            <div class="refer-msg" v-if="m.Type === 49 && m.SubType === 57">
              <!-- 引用文本消息 -->
              <p class="refer-text" v-if="m.compress_content.msg.appmsg.refermsg.type === '1'">
                {{ m.compress_content.msg.appmsg.refermsg.displayname }}: {{ m.compress_content.msg.appmsg.refermsg.content }}
              </p>
              <!-- 引用文件消息 -->
              <p class="refer-text" v-else-if="m.compress_content.msg.appmsg.refermsg.type === '49'">
                {{ m.compress_content.msg.appmsg.refermsg.displayname }}: {{ getReferFileName(m.compress_content.msg.appmsg.refermsg.content) }}
                <font-awesome-icon class="icon-file" :icon="['fas', 'file']" title="文件"/>
              </p>
              <!-- 引用图片消息 -->
              <div class="refer-img" v-else-if="m.compress_content.msg.appmsg.refermsg.type === '3'">
                {{ getOriMsgBySvrId(m.compress_content.msg.appmsg.refermsg.svrid, m.DbNo) }}
                <p v-if="chatMapBySvrId[m.compress_content.msg.appmsg.refermsg.svrid]" class="refer-img-title">{{ m.compress_content.msg.appmsg.refermsg.displayname }}: </p>
                <img v-if="chatMapBySvrId[m.compress_content.msg.appmsg.refermsg.svrid]"
                    :src="'/image?img_path=' + chatMapBySvrId[m.compress_content.msg.appmsg.refermsg.svrid].Thumb + '&session_id=' + store.getters.getCurrentSessionId"
                    :data-original="chatMapBySvrId[m.compress_content.msg.appmsg.refermsg.svrid].Image ? '/image?img_path=' + chatMapBySvrId[m.compress_content.msg.appmsg.refermsg.svrid].Image + '&session_id=' + store.getters.getCurrentSessionId : cleanedImage"
                    alt=""/>
              </div>
              <!-- 引用其他消息 -->
              <p class="refer-text" v-else>
                暂不支持的引用消息类型 refermsg.type = {{ m.compress_content.msg.appmsg.refermsg.type }}
              </p>
            </div>

          </div>
        </div>
      </div>
      <div class="load-more">
        <a v-if="!noMoreMsg" href="javascript:void(0)" @click="loadMore">
          <font-awesome-icon class="loading-icon" v-if="isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
* {
  box-sizing: border-box;
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
            width: 35px;
            height: 35px;
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
            //border: 1px solid lightgray;
            img {
              max-width: 200px;
            }
          }
          .chat-img:hover {
            cursor: pointer;
          }
          .chat-media {

          }
          .refer-msg {
            direction: ltr;
            margin-top: 5px;
            .refer-text {
              font-size: 12px;
              background-color: #E8E8E8;
              color: #797979;
              padding: 5px;
              border-radius: 3px;
              display: inline-block;
              max-width: 400px;
              // 长文本换行
              word-wrap: break-word;
              word-break: break-all;
              .icon-file {
                color: #207346;
              }
            }
            .refer-img {
              font-size: 12px;
              background-color: #E8E8E8;
              color: #797979;
              padding: 5px 10px;
              border-radius: 3px;
              display: inline-block;
            }
          }
          .chat-file {
            direction: ltr;
            width: 300px;
            height: 100px;
            background-color: #FFFFFF;
            border-radius: 5px;
            .chat-file-top {
              height: 75px;
              border-bottom: 1px solid #f0f0f0;
              display: flex;
              padding: 10px;
              .chat-file-left {
                width: 230px;
                height: 100%;
                .chat-file-title {
                  font-size: 14px;
                }
                .chat-file-content {
                  font-size: 12px;
                  color: #797979;
                  align-items: center;
                }
              }
              .chat-file-icon {
                width: 50px;
                height: 100%;
                font-size: 30px;
                text-align: center;
                color: #207346;
                .item-icon {
                  width: 40px;
                }
              }
            }
            .chat-file-bottom {
              .chat-file-app-info {
                font-size: 11px;
                color: #797979;
                padding-left: 10px;
                line-height: 25px;
              }
            }
          }
          .chat-file:hover {
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
          .chat-media {
            direction: ltr;
          }
        }
      }
      .chat.right .chat-info:hover {
        .chat-text {
          background-color: #89D961;
        }
      }
      .chat.left .chat-info:hover {
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
      .loading-icon {
        color: gray;
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