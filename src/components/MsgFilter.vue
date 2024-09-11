<script setup>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
</script>

<template>
  <div class="filter-container">
    <div class="filter-head">
      <div class="head-title">
        <p class="head-title-title">
          昵称
        </p>
        <p class="head-title-fill"></p>
        <p class="head-title-tools">
          <font-awesome-icon :icon="['fas', 'xmark']"/>
        </p>
      </div>
      <div class="head-search">
        <div class="weui-search-bar weui-search-bar_outlined" id="searchBar">
          <form id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
            <div class="weui-search-bar__box">
              <div>图片与视频</div>
              <input type="search" aria-controls="searchResult" class="weui-search-bar__input" id="searchInput" required/>
              <a href="javascript:" role="button" title="清除" class="weui-icon-clear" id="searchClear"></a>
            </div>
          </form>
        </div>
      </div>
      <div class="head-filter">
        <ul class="filter-ul">
          <li class="filter-item">文件</li>
          <li class="filter-item">图片与视频</li>
          <li class="filter-item">链接</li>
          <li class="filter-item">音乐与音频</li>
          <li class="filter-item">小程序</li>
          <li class="filter-item">视频号</li>
          <li class="filter-item">日期</li>
          <li class="filter-item">群成员</li>
        </ul>
      </div>
    </div>
    <div class="filter-body">

    </div>
  </div>
</template>

<style scoped lang="less">
.filter-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 700px;
  border: 1px solid lightgray;
  background-color: #fff;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  font-size: 14px;
  .filter-head {
    height: 135px;
    background-color: #F5F5F5;
    .head-title {
      padding: 5px 15px;
      color: #AFAEAE;
      display: flex;
      .head-title-fill {
        flex-grow: 1;
      }
      .head-title-tools {
        cursor: pointer;
      }
    }
    .head-search {
      .weui-search-bar {
        background-color: #F5F5F5;
        .weui-search-bar__form {
          height: 40px;
          background-color: #fff;
          border: 1px solid lightgray;
          .weui-search-bar__box {
            display: flex;
            .weui-search-bar__input {
              flex-grow: 1;
              font-size: 14px;
            }
          }
        }
      }
    }
    .head-filter {
      padding: 0 10px;
      .filter-ul {
        display: flex;
        .filter-item {
          padding: 5px 10px;
          cursor: pointer;
        }
      }
    }
  }
  .filter-body {
    flex-grow: 1;
  }
}
</style>