<script setup>
import {ref} from "@vue/reactivity";
import {useStore} from "vuex";
import Tasks from "./tabs/Tasks.vue";
import Info from "./tabs/Info.vue";

const store = useStore();

const activeMenu = ref('info');


const menus = [
  {
    name: 'info',
    title: '会话信息',
    component: Info,
  },
  {
    name: 'tasks',
    title: '系统任务',
    component: Tasks
  }
]

const getCurrentComponent = () => {
  const menuItem = menus.find(m => m.name === activeMenu.value);
  return menuItem ? menuItem.component : null;
};

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
            class="menu-item"
            :class="{'menu-item-active': activeMenu === m.name}"
            @click="activeMenu = m.name">{{ m.title }}</li>
      </ul>
    </div>
    <div class="tools-content">
      <component :is="getCurrentComponent()" />
    </div>
  </div>
</div>

</template>

<style scoped lang="less">
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
        cursor: pointer;
      }
      .menu-item-active {
        border-right: 1px solid #07C160;
        color: #07C160
      }
    }
    .tools-content {
      flex-grow: 1;
      padding: 10px;
    }
  }
}
</style>