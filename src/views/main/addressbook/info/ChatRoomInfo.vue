<script setup>
import {useRoute, useRouter} from "vue-router";
import {chatroomInfo} from "@/api/msg.js";
import {reactive} from "vue";
import {getUserNameByWxId, shortenCharts} from "@/utils/common.js";
import {useStore} from "vuex";
import defaultImage from '@/assets/default-head.svg';

const store = useStore();
const router = useRouter();
const route = useRoute();
const chatroom = reactive({});
const userList = reactive([]);
const displayNameList = reactive([]);
const contactMap = reactive({});
const chatRoomNameMap = reactive({})

const id = route.params.id;

chatroomInfo(id).then(data => {
  if (data) {
    Object.assign(chatroom, data);
    if (data.UserNameList) {
      let ul = data.UserNameList.split('^G');
      userList.push(...ul);
    }
    if (data.DisplayNameList) {
      let dl = data.DisplayNameList.split('^G');
      displayNameList.push(...dl);
    }
    if (data.ContactList) {
      let contactList = data.ContactList;
      for (let i = 0; i < data.ContactList.length; i++) {
        let contact = contactList[i];
        contactMap[contact.UserName] = contact.NickName;
      }
    }
    if (data.ChatRoomMembers) {
      for (let i = 0; i < data.ChatRoomMembers.length; i++) {
        let m = data.ChatRoomMembers[i]
        chatRoomNameMap[m.userName] = m.remark;
      }
    }
  }
});


const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}

const comment = () => {
  router.push({ name: 'chat', params: { sessionId: route.params.sessionId, id: id} });
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
  let chatName = chatRoomNameMap[m.UserName];
  if (chatName) {
    return chatName;
  } else {
    return m.NickName
  }
}

</script>

<template>
  <div class="info-container">
    <div class="info-top">
      <p class="info-title">{{ chatroom.Remark ? chatroom.Remark : chatroom.NickName }}  </p>
    </div>
    <div class="info-msg" >
      <div class="comment-btn">
        <a class="weui-btn weui-btn_primary weui-btn_mini" @click="comment">查看消息</a>
      </div>
      <ul class="users-container">
        <li class="user" v-for="contact in chatroom.ContactList">
          <img class="user-img" :src="contact.smallHeadImgUrl?contact.smallHeadImgUrl:defaultImage" @error="setDefaultImage" alt=""/>
          <p class="user-name"> {{ displayName(contact) }} </p>
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped lang="less">
.info-container {
  background-color: #EFEFEF; /* 示例背景色 */
  display: flex;
  flex-direction: column; // 垂直排列
  overflow: hidden;
  height: 100%;
  .info-top {
    padding-left: 15px;
    display: flex;
    align-items: center; /* 垂直居中 */
    height: 63px;
    border-bottom: 1px solid lightgray;
    .info-title {
      height: 63px;
      font-size: 20px;
      line-height: 63px;
    }
  }
  .info-msg {
    flex-grow: 1;
    overflow-y: scroll;
    .users-container {
      display: flex;
      flex-wrap: wrap;
      width: 700px;
      margin: 20px auto;
      .user {
        margin-left: 20px;
        width: 50px;
        height: 100px;
        border-radius: 5px;
        padding: 10px;
        .user-img {
          width: 50px;
          height: 50px;
        }

        .user-name {
          font-size: 12px;
          text-align: center;
          color: #797979;
        }
      }
      .user:hover {
        background-color: #E6E6E6;
      }
    }
    .comment-btn {
      bottom: 10px;
      text-align: center;
      margin-top: 10px;
    }
  }
  // 以下是滚动条样式
  .info-msg::-webkit-scrollbar {
    width: 6px;
    background: transparent; /* 使滚动条轨道背景透明 */
  }

  /* 鼠标悬停时显示滚动条轨道 */
  .info-msg:hover::-webkit-scrollbar {
    width: 6px; /* 设置滚动条宽度 */
    background: #f0f0f0; /* 滚动条轨道背景颜色 */
  }

  /* 滚动条轨道样式 */
  .info-msg:hover::-webkit-scrollbar-track-piece {
    background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
    border-radius: 8px; /* 设置滚动条轨道圆角 */
  }

  /* 滚动条拇指样式 */
  .info-msg:hover::-webkit-scrollbar-thumb {
    background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
    border-radius: 8px; /* 设置滚动条拇指圆角 */
  }

  /* 鼠标悬停在滚动条拇指上时的样式 */
  .info-msg:hover::-webkit-scrollbar-thumb:hover {
    background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
  }
}
</style>