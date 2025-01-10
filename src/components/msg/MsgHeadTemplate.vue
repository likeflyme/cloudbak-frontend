<script setup>
import {getCurrentInstance} from "vue";
import defaultImage from '@/assets/default-head.svg';
import AudioPlayer from "../AudioPlayer.vue";
import unknownFile from '@/assets/filetypeicon/unknown.svg';
import cleanedImage from '@/assets/cleaned.jpeg';
import {getThumbFromStringContent, fileSize, getReferFileName} from "@/utils/common.js";
import {get_msg_desc} from "@/utils/msgtp.js";
import {msgBySvrId} from "@/api/msg.js"

import {useStore} from "vuex";
import {reactive} from "vue";
import MsgTransfer from "./MsgTransfer.vue";
import MsgTransferDetail from "./MsgTransferDetail.vue";

const store = useStore();
const { proxy } = getCurrentInstance();

const props = defineProps({
  msg: {
    type: Object,
    required: true
  },
  chatRoomNameMap: {
    type: Object
  },
  isChatRoom: {
    type: Boolean,
    default: false
  }
});

const chatMapBySvrId = reactive({});

/**
 * 设置默认图片
 * @param event
 */
const setDefaultImage = (event) => {
  event.target.src = defaultImage;
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
  let chatName = props.chatRoomNameMap[m.WxId];
  if (chatName) {
    return chatName;
  } else {
    return m.NickName;
  }
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

const getOriMsgBySvrId = (svrId, DbNo) => {
  let msg = chatMapBySvrId[svrId];
  // 本地不存在，则到服务端查找
  if (!msg) {
    msgBySvrId(svrId, DbNo).then(data => {
      chatMapBySvrId[svrId] = data;
    });
  }
};

const openTransferDetail = (msg) => {
  proxy.$popup.open(MsgTransferDetail, { msg: props.msg }, { title: '聊天记录', width: '650px', height: '600px' });
}

</script>

<template>
  <div class="chat" :class="{'right': props.msg.IsSender === 1, 'left': props.msg.IsSender === 0}">
    <div class="chat-header">
      <img :src="props.msg.smallHeadImgUrl?props.msg.smallHeadImgUrl:defaultImage" @error="setDefaultImage" alt="" class="exclude"/>
    </div>
    <div class="chat-info">
      <div class="chat-nickname" v-if="props.isChatRoom">
        <p v-if="props.isChatRoom && props.msg.IsSender === 0"> {{ displayName(props.msg) }} </p>
      </div>
      <!-- 文本消息 -->
      <div class="chat-text" v-if="props.msg.Type === 1">
        <p>
          {{ props.msg.StrContent }}
        </p>
      </div>
      <!-- 图片消息 -->
      <div v-else-if="props.msg.Type === 3 && props.msg.SubType ===0" class="chat-img">
        <img
            :src="'/image?img_path=' + props.msg.Thumb + '&session_id=' + store.getters.getCurrentSessionId"
            :data-original="props.msg.Image ? '/image?img_path=' + props.msg.Image + '&session_id=' + store.getters.getCurrentSessionId : cleanedImage"
            alt=""/>
      </div>
      <!-- 语音消息 -->
      <div v-else-if="props.msg.Type === 34 && props.msg.SubType ===0" class="chat-media">
        <AudioPlayer
            :src="`/api/msg/media?MsgSvrID=${props.msg.MsgSvrIDStr}&session_id=${store.getters.getCurrentSessionId}&db_no=${props.msg.DbNo}`"
            :text="props.msg.StrContent"
            :right="props.msg.IsSender === 1"/>
      </div>
      <!-- 视频消息 -->
      <div v-else-if="props.msg.Type === 43 && props.msg.SubType ===0" class="chat-img exclude">
        <video controls width="250" :poster="`/image?img_path=${props.msg.Thumb}&session_id=${store.getters.getCurrentSessionId}`">
          <source v-if="props.msg.Image" :src="`/video?video_path=${props.msg.Image}&session_id=${store.getters.getCurrentSessionId}`" type="video/mp4" />
        </video>
      </div>
      <!-- 用户图片表情 -->
      <div v-else-if="props.msg.Type === 47 && props.msg.SubType === 0" class="chat-img">
        <img class="exclude"
             :src="getThumbFromStringContent(props.msg.StrContent)"
             :data-original="'/image?img_path=' + (props.msg.Image ? props.msg.Image : props.msg.Thumb) + '&session_id=' + store.getters.getCurrentSessionId"
             alt=""/>
      </div>
      <!-- 49.5 通知消息 -->
      <div v-else-if="props.msg.Type === 49 && props.msg.SubType === 5" class="chat-notice">
        通知消息
      </div>
      <!-- 引用消息 -->
      <div v-else-if="props.msg.Type === 49 && props.msg.SubType === 57" class="chat-text">
        <p>
          {{ props.msg.compress_content.msg.appmsg.title }}
        </p>
      </div>
      <!-- 文件消息 -->
      <div v-else-if="props.msg.Type === 49 && props.msg.SubType === 6" class="chat-file" @click="download(props.msg.Image)">
        <div class="chat-file-top">
          <div class="chat-file-left">
            <p class="chat-file-title">{{ props.msg.compress_content?.msg?.appmsg?.title }}</p>
            <p class="chat-file-content">{{ fileSize(props.msg.compress_content.msg?.appmsg?.appattach?.totallen)}}</p>
          </div>
          <div class="chat-file-icon">
            <img class="item-icon" :src="unknownFile" alt=""/>
          </div>
        </div>
        <div class="chat-file-bottom">
          <p v-if="props.msg.Image" class="chat-file-app-info">
            <p v-if="props.msg.compress_content.msg.appinfo" class="chat-file-app-info">{{ props.msg.compress_content.msg.appinfo.appname }}</p>
          </p>
          <p v-else class="chat-file-app-info">
            未下载的文件
          </p>
        </div>
        <!--              <p>-->
        <!--                {{ props.msg.compress_content.msg.appmsg.title }}-->
        <!--              </p>-->
      </div>
      <div class="chat-transfer" v-else-if="props.msg.Type === 49 && props.msg.SubType === 19">
        <MsgTransfer :msg="props.msg" @click="openTransferDetail(props.msg)"/>
      </div>
      <div v-else class="refer-msg">
        <p class="refer-text">
          暂不支持的消息类型：{{ get_msg_desc(props.msg.Type, props.msg.SubType) }}
        </p>
      </div>
      <!-- 引用消息 -->
      <div class="refer-msg" v-if="props.msg.Type === 49 && props.msg.SubType === 57">
        <!-- 引用文本消息 -->
        <p class="refer-text" v-if="props.msg.compress_content.msg.appmsg.refermsg.type === '1'">
          {{ props.msg.compress_content.msg.appmsg.refermsg.displayname }}: {{ props.msg.compress_content.msg.appmsg.refermsg.content }}
        </p>
        <!-- 引用文件消息 -->
        <p class="refer-text" v-else-if="props.msg.compress_content.msg.appmsg.refermsg.type === '49'">
          {{ props.msg.compress_content.msg.appmsg.refermsg.displayname }}: {{ getReferFileName(props.msg.compress_content.msg.appmsg.refermsg.content) }}
          <font-awesome-icon class="icon-file" :icon="['fas', 'file']" title="文件"/>
        </p>
        <!-- 引用图片消息 -->
        <div class="refer-img" v-else-if="props.msg.compress_content.msg.appmsg.refermsg.type === '3'">
          {{ getOriMsgBySvrId(props.msg.compress_content.msg.appmsg.refermsg.svrid, props.msg.DbNo) }}
          <p v-if="chatMapBySvrId[props.msg.compress_content.msg.appmsg.refermsg.svrid]" class="refer-img-title">{{ props.msg.compress_content.msg.appmsg.refermsg.displayname }}: </p>
          <img v-if="chatMapBySvrId[props.msg.compress_content.msg.appmsg.refermsg.svrid]"
               :src="'/image?img_path=' + chatMapBySvrId[props.msg.compress_content.msg.appmsg.refermsg.svrid].Thumb + '&session_id=' + store.getters.getCurrentSessionId"
               :data-original="chatMapBySvrId[props.msg.compress_content.msg.appmsg.refermsg.svrid].Image ? '/image?img_path=' + chatMapBySvrId[props.msg.compress_content.msg.appmsg.refermsg.svrid].Image + '&session_id=' + store.getters.getCurrentSessionId : cleanedImage"
               alt=""/>
        </div>
        <!-- 引用其他消息 -->
        <p class="refer-text" v-else>
          暂不支持的引用消息类型 refermsg.type = {{ props.msg.compress_content.msg.appmsg.refermsg.type }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.chat {
  margin-top: 0.714rem;
  display: flex;
  .chat-header {
    width: 2.5rem;
    height: 2.5rem;
    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.214rem;
    }
  }
  .chat-info {
    padding-left: 0.714rem;
    padding-right: 0.714rem;
    .chat-nickname {
      font-size: 0.857rem;
      color: #BEBEBE;
      text-align: left;
    }
    .chat-text {
      direction: ltr;
      font-size: 1rem;
      margin-top: 0.214rem;
      padding: 0.357rem 0.714rem;
      border-radius: 0.357rem;
      display: inline-block;
      color: #232323;
      word-wrap: break-word;
      max-width: 28.571rem;
    }
    .chat-text:hover {
      background-color: #EBEBEB;
    }
    .chat-img {
      border-radius: 0.286rem;
      img {
        max-width: 14.286rem;
      }
    }
    .chat-img:hover {
      cursor: pointer;
    }
    .chat-media {

    }
    .refer-msg {
      margin-top: 0.357rem;
      .refer-text {
        direction: ltr;
        font-size: 0.857rem;
        background-color: #E8E8E8;
        color: #797979;
        padding: 0.357rem;
        border-radius: 0.214rem;
        display: inline-block;
        max-width: 28.571rem;
        // 长文本换行
        word-wrap: break-word;
        word-break: break-all;
        .icon-file {
          color: #207346;
        }
      }
      .refer-img {
        font-size: 0.857rem;
        background-color: #E8E8E8;
        color: #797979;
        padding: 0.357rem 0.714rem;
        border-radius: 0.214rem;
        display: inline-block;
      }
    }
    .chat-file {
      height: 7.143rem;
      background-color: #FFFFFF;
      border-radius: 0.357rem;
      .chat-file-top {
        height: 5.357rem;
        border-bottom: 0.071rem solid #f0f0f0;
        display: flex;
        padding: 0.714rem;
        .chat-file-left {
          width: 16.429rem;
          height: 100%;
          .chat-file-title {
            font-size: 1rem;
          }
          .chat-file-content {
            font-size: 0.857rem;
            color: #797979;
            align-items: center;
          }
        }
        .chat-file-icon {
          width: 3.571rem;
          height: 100%;
          font-size: 2.143rem;
          text-align: center;
          color: #207346;
          .item-icon {
            width: 2.857rem;
          }
        }
      }
      .chat-file-bottom {
        .chat-file-app-info {
          font-size: 0.786rem;
          color: #797979;
          padding-left: 0.714rem;
          line-height: 1.786rem;
        }
      }
    }
    .chat-file:hover {
      cursor: pointer;
    }
  }
}
.chat:last-child {
  margin-bottom: 1.429rem;
}
.chat.right {
  .chat-info {
    .chat-nickname {
      text-align: right;
    }
    .chat-text {
      text-align: left;
      background-color: #95ec69;
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
    background-color: #ebebeb;
  }
}
</style>