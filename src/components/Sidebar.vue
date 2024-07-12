<script setup>
import {sysSessions, updateCurrentSession as updateCurrentSessionOnServer} from "@/api/user.js";
import {useStore} from "vuex";

const store = useStore();

// 加载所有 session
sysSessions().then(data => {
  store.commit("setSysSessions", data)
});

const updateCurrentSession = (session) => {
  console.log(session);
  updateCurrentSessionOnServer(session.id).then((data) => {
    store.commit("setCurrentSession", data);
  });
}

const getStateDesc = (session) => {
  if (session.analyze_state === 1) {
    return '数据解析中'
  } else if (session.analyze_state === 2) {
    return '数据未初始化';
  } else {
    return ''
  }
}

</script>

<template>
  <div class="sidebar">
    <div class="open-close-container">
      <!--      <img class="open-close" src="../images/icon_nav_form.png" alt=" 展开" role="button">-->
    </div>
    <ul class="sidebar-ul">
      <li class="sidebar-li" v-for="session in store.getters.getSysSessions">
        <div class="name-container"
             :class="{'active': store.getters.getUserInfo.current_session_id === session.id}"
             :title="session.wx_name + ' ' + getStateDesc(session)"
             @click="updateCurrentSession(session)">
          {{ session.wx_name[0] }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80px;
  padding: 20px;

  .sidebar-ul {
    margin-top: 10px;

    .sidebar-li {
      width: 60px;
      height: 60px;
      padding: 0;
      border-radius: 10px;
      margin-bottom: 10px;

      .name-container {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        border: 1px solid lightgray;
        color: darkgray;
      }

      .active {
        //border-color: #059789;
        color: #059789;
        border-color: darkgray;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .name-container:hover {
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .open-close-container {
    text-align: center;

    .open-close {
      width: 30px;
      height: 30px;
    }
  }
}

.session {
  margin-bottom: 10px;

  .session_name {
  }

  .session-head-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .session-head-img:hover {
    cursor: pointer;
  }
}

.session-active {
  border: 2px solid var(--weui-BRAND-80);
}
</style>