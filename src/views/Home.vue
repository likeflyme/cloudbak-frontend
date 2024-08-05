<template>
  <div role="alert" class="weui-information-bar weui-information-bar_warn-weak" v-if="showDownload">
    <div class="weui-information-bar__hd">
      <i class="weui-icon-outlined-warn"></i>
    </div>
    <div class="weui-information-bar__bd">
      您还没有同步任何数据到服务器，<a class="downloadClient" target="_blank" href="https://static.raining.top/wechat-cloud-bak/WechatCloudBakDesktop.zip">下载 Windows 同步客户端</a>。
    </div>
    <div class="weui-information-bar__ft">
      <button class="weui-btn_icon" @click="closeError">关闭<i class="weui-icon-close-thin"></i></button>
    </div>
  </div>
  <div class="page-home">
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
    <router-view :key="routerKey"/>
    <Toolbar></Toolbar>
  </div>

</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {userinfo} from "@/api/auth.js";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {sysSessions, updateCurrentSession as updateCurrentSessionOnServer} from "@/api/user.js";
import Toolbar from "../components/toolbar/Toolbar.vue";
const store = useStore();
const router = useRouter();

const routerKey = ref(0);

const showMain = ref(false);
const showDownload = ref(false);

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
  } else {
    showDownload.value = true;
  }
});

const updateCurrentSession = (session) => {
  updateCurrentSessionOnServer(session.id).then((data) => {
    console.log("跳转 session", session);
    store.commit("setCurrentSession", data);
    routerKey.value = session.id;
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
.downloadClient:hover {
  cursor: pointer;
}
.page-home {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #EDEDED;
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