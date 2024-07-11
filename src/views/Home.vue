<template>
  <div class="page">
<!--    <Sidebar></Sidebar>-->
    <Main></Main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import Main from "../components/main/Main.vue";
import {onBeforeMount} from "vue";
import {sessions} from "../api/msg.js";
import {userinfo} from "../api/auth.js";
import {useStore} from "vuex";
const store = useStore();

onBeforeMount(() => {
  sessions().then(resp => {
    store.commit("setSessions", resp);
  });
  userinfo().then(resp => {
    store.commit("setUserInfo", resp);
  });
})


</script>

<style scoped lang="less">

</style>