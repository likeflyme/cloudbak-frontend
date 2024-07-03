<template>
  <div class="weui-search-bar weui-search-bar_filled-grey weui-search-bar_focusing" id="searchBar">
    <form id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
      <div aria-hidden="false" id="searchBox" class="weui-search-bar__box">
        <i class="weui-icon-search"></i>
        <!--              <span class="weui-search-bar__words">微信</span>-->
        <input v-model="input" type="search" aria-controls="searchResult" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required/>
        <div class="weui-search-bar__mask"></div>
        <a href="javascript:" role="button" title="清除" class="weui-icon-clear" id="searchClear" @click="clear"></a>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref} from "vue";

const input = ref('');

const clear = () => {
  input.value = '';
}
</script>

<style scoped lang="less">
.weui-search-bar {
  height: 63px;
  background-color: #F7F7F7;
  .weui-search-bar__form {
    height: 25px;
    top: 10px;
  }
  .weui-search-bar__mask {
    height: 25px;
  }
}
.weui-search-bar__input {
  font-size: 13px;
}
</style>