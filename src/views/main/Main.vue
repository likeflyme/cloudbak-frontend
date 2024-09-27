<template>
  <div class="main-container">
    <div class="main-sidebar">
      <ul class="item-container">
        <li class="item">
          <img class="u-header" :src="wxHeadImage.smallHeadImgUrl" alt="头像" role="button">
        </li>
        <li class="item" v-for="m in menu">
          <font-awesome-icon class="item-icon"
                             :class="{'item-icon-active': selectedItem === m.id }"
                             :icon="m.icon"
                             :title="m.title"
                             @click="selectItem(m)"/>
        </li>
      </ul>
      <ul class="sidebar-bottom">
        <li class="item-icon" @click="toggleSettings" ref="toggleButton">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </li>
      </ul>
    </div>
    <div class="main-right">
      <router-view :key="routerKey"/>
    </div>
    <div v-if="showSettings" class="main-settings-bar" :style="settingsStyle" ref="settingsDiv">
      <ul class="settings-bar-ul">
        <li class="settings-bar-item" @click="store.commit('openSysTool')">系统工具</li>
        <li class="settings-bar-item" @click="showDeleteDialog?showDeleteDialog=false:showDeleteDialog=true">删除会话</li>
      </ul>
    </div>
  </div>
  <div role="dialog" aria-hidden="true" aria-modal="true" aria-labelledby="js_title1" id="iosDialog1" v-if="showDeleteDialog">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__hd"><strong class="weui-dialog__title" id="js_title1">删除会话</strong></div>
      <div class="weui-dialog__bd">
        <p>确定要删除会话吗？</p>
        <p>确定删除后，该会话的数据文件将在后台静默删除！</p>
        <p>会话名称：{{ store.getters.getCurrentSession.name }}</p>
        <p>会话备注：{{ store.getters.getCurrentSession.desc }}</p>
        <p>微信账号：{{ store.getters.getCurrentSession.wx_acct_name }}</p>
        <p>微信昵称：{{ store.getters.getCurrentSession.wx_name }}</p>
      </div>
      <div class="weui-dialog__ft">
        <a role="button" href="javascript:" class="weui-dialog__btn weui-dialog__btn_default" @click="showDeleteDialog=false">取消</a>
        <a role="button" href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary" @click="sessionDelete(store.getters.getCurrentSession.id)">确定删除</a>
      </div>
    </div>
  </div>
  <sys-tools v-if="store.getters.isShowSysTools"></sys-tools>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import {headImage} from "../../api/msg.js";
import {deleteSession, updateCurrentSession as updateCurrentSessionOnServer} from "../../api/user.js";
import {useStore} from "vuex";
import {reactive, ref, computed, onMounted, onUnmounted, getCurrentInstance} from "vue";
import defaultImage from '@/assets/default-head.svg';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import SysTools from "../../components/tools/SysTools.vue";

const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const route = useRoute();
const selectedItem = ref('comment');
const sessionId = route.params.sessionId;
const routerKey = ref('');
const wxHeadImage = reactive({smallHeadImgUrl: defaultImage});
const showSettings = ref(false);
const showDeleteDialog = ref(false);
// 获取按钮和设置窗口的引用
const settingsDiv = ref(null);
const toggleButton = ref(null);
const isOnDelete = ref(false);

const menu = reactive([
  {
    id: 'comment',
    title: '聊天',
    icon: ['far', 'comment'],
    path: 'comment'
  },
  {
    id: 'address-book',
    title: '通讯录',
    icon: ['far', 'user'],
    path: 'address-book'
  }
  // ,
  // {
  //   id: 'collect',
  //   title: '收藏',
  //   icon: ['fas', 'cube'],
  //   path: '/collect'
  // },
  // {
  //   id: 'files',
  //   title: '聊天文件',
  //   icon: ['far', 'folder'],
  //   path: '/files'
  // },
  // {
  //   id: 'community',
  //   title: '朋友圈',
  //   icon: ['fas', 'camera'],
  //   path: '/community'
  // }
])


// 加载联系人数据
// contact().then(resp => {
//   store.commit("setContact", resp)
// });
// 加载session数据
headImage(store.getters.getCurrentWxId).then(resp => {
  Object.assign(wxHeadImage, resp);
}).catch(e => {
  console.log(e);
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

const selectItem = (item) => {
  selectedItem.value = item.id;
  routerKey.value = item.id;
  router.push({ name: item.id, params: { sessionId: sessionId } });
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const settingsStyle = computed(() => {
  const mainSidebar = document.querySelector('.main-sidebar');
  if (mainSidebar) {
    const mainSidebarHeight = mainSidebar.offsetHeight;
    return {
      position: 'absolute',
      left: `${mainSidebar.offsetWidth}px`,
      top: `${mainSidebarHeight - 90}px`,
    };
  }
  return {};
});

// 监听点击事件，判断是否点击到页面其他位置
const handleClickOutside = (event) => {
  if (
      showSettings.value &&
      settingsDiv.value &&
      toggleButton.value &&
      !settingsDiv.value.contains(event.target) &&
      !toggleButton.value.contains(event.target)
  ) {
    showSettings.value = false;
  }
};

// 在组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 在组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const sessionDelete = (id) => {
  if (isOnDelete.value) {
    console.log("正在删除，无效的重复点击");
    return;
  }
  isOnDelete.value = true;
  deleteSession(id).then(resp => {
    let sessions = store.getters.getSysSessions;
    if (sessions && sessions.length > 0) {
      let first = sessions[0];
      proxy.$toast.success('删除会话成功');
      updateCurrentSessionOnServer(first.id).then((data) => {
        store.commit("dropSession", id);
        isOnDelete.value = false;
        router.push({ name: 'home'});
      }).catch(e => {
        isOnDelete.value = false;
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
  }).catch(e => {
    isOnDelete.value = false;
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

// 默认加载comment
routerKey.value = 'comment';
router.push({ name: 'comment', params: { sessionId: sessionId } });

</script>
<style scoped lang="less">
  .main-container {
    position: absolute;
    width: 1150px;
    height: 850px;
    max-height: 100vh; /* 限制最大高度为视口高度 */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 1px solid lightgray;
    display: flex;
  }
  .main-sidebar, .main-session, .main-content {
    /* 设置子元素的基本样式 */
    height: 100%; /* 让子元素的高度与父容器一致 */
  }

  .main-sidebar {
    width: 55px; /* 设置侧边栏的宽度 */
    background-color: #2E2E2E;
    display: flex;
    flex-direction: column;
    .sidebar-bottom {
      width: 100%;
      height: 40px;
      .item-icon {
        text-align: center;
        font-size: 19px;
        color: #999999;
      }
      .item-icon:hover {
        cursor: pointer;
      }
    }
  }
  .main-right {
    flex-grow: 1;
  }
  .main-settings-bar {
    width: 100px;
    background-color: #232323;
    .settings-bar-ul {
      .settings-bar-item {
        font-size: 14px;
        color: #999999;
        padding: 10px 15px;
      }
      .settings-bar-item:hover {
        cursor: pointer;
        background-color: #2E2E2E;
      }
    }
  }

  .item-container {
    flex-grow: 1;
    .item {
      margin-top: 16px;
      text-align: center;
      .u-header {
        width: 40px;
        height: 40px;
        border-radius: 3px;
      }
      .item-icon {
        font-size: 19px;
        color: #999999;
      }
      .item-icon:hover {
        cursor: pointer;
      }
      .item-icon-active {
        color: #07C160!important;
      }
    }
    .item:first-child {
      margin-top: 30px;
    }
  }

</style>