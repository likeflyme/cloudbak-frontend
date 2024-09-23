<script setup>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {ref} from "@vue/reactivity";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {taskList, singleDecrypt} from "@/api/task.js"
import {reactive} from "vue";
import {TaskState} from "@/enums/TaskState.js";
import {formatFilterMsgDate} from "@/utils/common.js";


const router = useRouter();
const store = useStore();

const activeMenu = ref('tools');
const page = ref(1);
const size = ref(30);
const tasks = reactive([]);
const noMoreMsg = ref(false);
const isLoading = ref(false);
const toolContent = ref();
const dialogConfirm = ref(false);
const dialogShow = ref(false);
const passwd = ref('');

const menus = [
  {
    title: '系统工具',
    path: 'tools',
  },
  {
    title: '系统任务',
    path: 'task',
  }
]

const menuSelect = (m) => {
  activeMenu.value = m.path;
  router.push({
    path: router.currentRoute.value.path,  // 保持当前路径
    query: { toolsView: m.path }
  });
}

function formatTimestamp(timestamp) {
  if (timestamp < 60) {
    // 小于 60 秒，保留两位小数
    return `${timestamp.toFixed(2)} 秒`;
  } else if (timestamp < 3600) {
    // 小于 1 小时，返回 xx 分 xx.xx 秒
    const minutes = Math.floor(timestamp / 60);
    const seconds = (timestamp % 60).toFixed(2);
    return `${minutes} 分 ${seconds} 秒`;
  } else if (timestamp < 86400) {
    // 小于 1 天，返回 xx 小时 xx 分 xx.xx 秒
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = (timestamp % 60).toFixed(2);
    return `${hours} 小时 ${minutes} 分 ${seconds} 秒`;
  } else {
    // 大于等于 1 天
    return "大于1天";
  }
}


const loadTasks = () => {
  if (!noMoreMsg.value) {
    taskList(page.value, size.value).then(data => {
      if (data.length < size.value) {
        noMoreMsg.value = true;
      }
      tasks.push(...data);
      page.value = page.value + 1;
    }).catch(e => {
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

const refreshTasks = () => {
  tasks.length = 0;
  page.value = 1;
  loadTasks();
}

// 滚动
const onWheel = (event) => {
  const scrollTop = toolContent.value.scrollTop;
  const clientHeight = toolContent.value.clientHeight;
  const scrollHeight = toolContent.value.scrollHeight;
  if (scrollTop + clientHeight === scrollHeight) {
    loadTasks();
  }
};

const openLog = (taskId) => {
  window.open("/api/task/log?task_id=" + taskId);
}

const exeAnalyze = () => {
  if (dialogConfirm.value) {
    console.log('重复点击，跳过');
    return;
  }
  dialogConfirm.value = true;
  singleDecrypt(store.getters.getCurrentSessionId, passwd.value).then((data) => {
    dialogConfirm.value = false;
    dialogShow.value = false;
    // 刷新数据
    refreshTasks();
  }).catch(e => {
    dialogConfirm.value = false;
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

loadTasks()

</script>

<template>
<div class="sys-tools">
  <div class="tools-head">
    <div class="tools-title">系统工具</div>
    <div class="tools-grow"></div>
    <div class="tools-close">
      <font-awesome-icon :icon="['fas', 'xmark']" @click="store.commit('closeSysTool')"/>
    </div>
  </div>
  <div class="tools-body">
    <div class="tools-menu">
      <ul class="menu-ul">
        <li v-for="m in menus"
            class="menu-item menu-item-active"
            :class="{'menu-item-active': activeMenu.value === m.path}">{{ m.title }}</li>
      </ul>
    </div>
    <div class="tools-content" ref="toolContent" @wheel="onWheel">

      <div class="task-tools">
        <a class="sys-btn" @click="dialogShow=true">执行数据解密任务</a>
        <font-awesome-icon class="sys-btn" :icon="['fas', 'rotate-right']" title="刷新" @click="refreshTasks"/>
      </div>
      <ul class="tasks-ul">
        <li class="tasks-li" v-for="t in tasks">
          <p class="tb-base tb-text">{{ t.name }}</p>
          <p class="tb-base tb-time">{{ formatFilterMsgDate(t.create_time) }}</p>
          <p class="tb-base tb-grow"></p>
          <p class="tb-base tb-time">执行：{{ formatTimestamp(t.update_time - t.create_time) }}</p>
          <p class="tb-base tb-text"
             :class="{
              'tb-success': t.state === TaskState.SUCCESS.value,
              'tb-failed': t.state === TaskState.FAILED.value
            }">{{ TaskState[t.state].desc }}</p>
          <p class="tb-base tb-checkout">
            <font-awesome-icon v-if="t.detail" :icon="['fas', 'eye']" title="查看日志" @click="openLog(t.id)"/>
          </p>
        </li>
      </ul>
      <div class="load-more">
        <a v-if="!noMoreMsg" href="javascript:void(0)" @click="loadTasks">
          <font-awesome-icon class="loading-icon" v-if="isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多任务</p>
        </a>
      </div>
    </div>
  </div>
</div>
<div role="dialog" aria-hidden="true" aria-modal="true" aria-labelledby="js_title1" id="iosDialog1" v-if="dialogShow">
  <div class="weui-mask"></div>
  <div class="weui-dialog">
    <div class="weui-dialog__hd"><strong class="weui-dialog__title" id="js_title1">创建数据解密任务</strong></div>
    <div class="weui-dialog__bd">
      <p>确定要创建数据解密任务吗？</p>
      <p>系统将重新解密当前会话的数据库文件，这需要些时间。尽量不要在这期间查询该会话数据，避免造成库文件写入失败。</p>
<!--      <br/>-->
<!--      <p>-->
<!--        <label for="js_input2" class="weui-cell weui-cell_active">-->
<!--          <div class="weui-cell__hd"><span class="weui-label">登录密码</span></div>-->
<!--          <div class="weui-cell__bd">-->
<!--            <input id="js_input2" class="weui-input " type="password" v-model="passwd" @keydown.enter="login" placeholder="填写密码"/>-->
<!--          </div>-->
<!--        </label>-->
<!--      </p>-->
    </div>
    <div class="weui-dialog__ft">
      <a role="button" href="javascript:" class="weui-dialog__btn weui-dialog__btn_default" @click="dialogShow=false">取消</a>
      <a role="button" href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary" @click="exeAnalyze()">确定</a>
    </div>
  </div>
</div>
</template>

<style scoped lang="less">
.sys-btn {
  color: #2C90FF;
  cursor: pointer;
}
.sys-tools {
  width: 600px;
  height: 500px;
  border: 1px solid lightgray;
  background-color: #f5f5f5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .tools-head {
    display: flex;
    font-size: 14px;
    color: #999999;
    .tools-title {
      padding-left: 10px;
      padding-top: 5px;

    }
    .tools-grow {
      flex-grow: 1;
    }
    .tools-close {
      padding-right: 5px;
      cursor: pointer;
    }
  }
  .tools-body {
    display: flex;
    font-size: 14px;
    height: 470px;
    .tools-menu {
      width: 100px;
      height: 100%;
      text-align: center;
      overflow-y: hidden;
      border-right: 1px solid #E8E8E8;
      .menu-item {
          padding-top: 5px;
          padding-bottom: 5px;
      }
      .menu-item-active {
        border-right: 1px solid #07C160;
        color: #07C160
      }
    }
    .tools-content {
      flex-grow: 1;
      padding: 10px;
      overflow-y: scroll;
      .task-tools {
        font-size: 12px;
        display: flex;
        //text-align: right;
        align-items: center;
        .sys-btn {
          margin-right: 10px;
        }
      }
      .tasks-ul {
        .tasks-li {
          font-size: 12px;
          display: flex;
          align-items: center;
          padding: 8px 10px;
          .tb-grow {
            flex-grow: 1;
          }
          .tb-time {
            font-size: 11px;
            color: #797979;
            padding: 0 10px;
          }
          .tb-success {
            color: #2ba245
          }
          .tb-failed {
            color: #ed1e45;
          }
          .tb-running {
            color: #797979;
          }
          .tb-checkout{
            padding-left: 5px;
            cursor: pointer;
            visibility: hidden;
          }
        }
        .tasks-li:hover {
          background-color: #ededed;
          .tb-checkout {
            visibility: visible;
          }
        }
      }
      .load-more {
        text-align: center;
        font-size: 12px;
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
  }
}
</style>