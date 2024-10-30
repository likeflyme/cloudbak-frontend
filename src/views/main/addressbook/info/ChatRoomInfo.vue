<script setup>
import {useRoute, useRouter} from "vue-router";
import {chatroomInfo} from "@/api/msg.js";
import {reactive} from "vue";
import {getUserNameByWxId, shortenCharts} from "@/utils/common.js";
import {useStore} from "vuex";
import defaultImage from '@/assets/default-head.svg';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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

// const comment = () => {
//   router.push({ name: 'chat', params: { sessionId: route.params.sessionId, id: id} });
// }

const comment = () => {
  router.push({
    name: 'chat',
    params: {
      sessionId: route.params.sessionId,
      id: id
    },
    query: {
      userName: id
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
  let chatName = chatRoomNameMap[m.UserName];
  if (chatName) {
    return chatName;
  } else {
    return m.NickName
  }
}

// 移动端返回
const emit = defineEmits(['goBack']);

</script>

<template>
  <div class="info-container">
    <div class="info-top">
      <p class="info-title main-back" @click="emit('goBack');"><font-awesome-icon class="main-back" :icon="['fas', 'chevron-left']"/></p>
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
@import "/src/style/main/addressbook/info/chatroom-info.less";
</style>