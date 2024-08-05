<script setup>
import {logout} from "@/utils/common.js";
import {useRouter} from "vue-router";

const router = useRouter();

const clickLogout = () => {
  logout();
  router.push("/login")
}
</script>

<template>
<div class="toolbar">
  <font-awesome-icon class="t-icon" :icon="['fas', 'gear']" title="设置"/>
  <font-awesome-icon class="t-icon icon-sign-out" :icon="['fas', 'right-from-bracket']" title="登出" @click="clickLogout"/>
</div>
</template>

<style scoped lang="less">
.toolbar {
  position: absolute;
  width: 100px;
  right: 30px;
  top: 30px;
  display: flex;
  z-index: 6000;
  .t-icon {
    cursor: pointer;
    margin-left: 10px;
  }
  .icon-sign-out {
    color: #990C15
  }
}
</style>