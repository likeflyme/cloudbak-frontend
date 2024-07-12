<template>
  <div class="page">
    <Sidebar></Sidebar>
    <Main v-if="showMain">

    </Main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import Main from "../components/main/Main.vue";
import {onBeforeMount, ref} from "vue";
import {userinfo} from "../api/auth.js";
import {useStore} from "vuex";
const store = useStore();

const showMain = ref(false);

onBeforeMount(() => {
  userinfo().then(resp => {
    store.commit("setUserInfo", resp);
    if (resp.current_session ) {
      showMain.value = true;
    }
  });
})


</script>

<style scoped lang="less">

</style>