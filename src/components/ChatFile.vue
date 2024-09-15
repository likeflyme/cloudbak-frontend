<script setup>
import unknownFile from '@/assets/filetypeicon/unknown.svg';
import {fileSize} from "@/utils/common.js";
import {useStore} from "vuex";

const store = useStore();
defineProps({
  msg: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Unknown',
      age: 0
    })
  }
})
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

</script>

<template>
  <div class="chat-file" @click="download($props.msg.Image)">
    <div class="chat-file-top">
      <div class="chat-file-left">
        <p class="chat-file-title">{{ $props.msg.compress_content.msg.appmsg.title }}</p>
        <p class="chat-file-content">{{ fileSize($props.msg.compress_content.msg.appmsg.appattach.totallen)}}</p>
      </div>
      <div class="chat-file-icon">
        <img class="item-icon" :src="unknownFile" alt=""/>
      </div>
    </div>
    <div class="chat-file-bottom">
      <p v-if="$props.msg.Image" class="chat-file-app-info">
        <p v-if="$props.msg.compress_content.msg.appinfo" class="chat-file-app-info">{{ $props.msg.compress_content.msg.appinfo.appname }}</p>
      </p>
      <p v-else class="chat-file-app-info">
        未下载的文件
      </p>
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-file {
  border: 1px solid #EDEDED;
  direction: ltr;
  width: 300px;
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
</style>