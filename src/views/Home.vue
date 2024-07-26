<template>
  <div class="page">
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
<!--    <Main v-if="showMain">-->

<!--    </Main>-->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {userinfo} from "@/api/auth.js";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {sysSessions, updateCurrentSession as updateCurrentSessionOnServer} from "@/api/user.js";
const store = useStore();
const router = useRouter();

const showMain = ref(false);

// 加载用户信息
userinfo().then(resp => {
  store.commit("setUserInfo", resp);
  if (resp.current_session ) {
    showMain.value = true;
  }
});

// 加载所有 session
sysSessions().then(data => {
  store.commit("setSysSessions", data);
  if (data.length > 0) {
    updateCurrentSession(data[0]);
  }
});

const updateCurrentSession = (session) => {
  updateCurrentSessionOnServer(session.id).then((data) => {
    console.log("跳转 session", session);
    store.commit("setCurrentSession", data);
    router.push({ name: "session", params: { sessionId: session.id } });
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

<style scoped lang="less">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
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