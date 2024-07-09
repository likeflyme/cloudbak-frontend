<script setup>
import {ref} from 'vue'
import {shortenCharts} from "../../../utils/common.js";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

const input = ref('');

const clear = () => {
  input.value = '';
}

const selectedItem = ref(null)

const selectItem = (session) => {
  selectedItem.value = session.strUsrName;
  const targetPath = '/comment/' + session.strUsrName;
  router.push(targetPath);
}
</script>

<template>
  <div class="main-comment">
    <div class="main-session">
      <div class="session-search-container">
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
      </div>
      <div class="session-items-container">
        <div class="session-items-fix-roller">
          <ul class="items-ul">
            <li class="item"
                v-for="(session, idx) in store.state.sessions" :key="session.strUsrName"
                :class="{ 'item-active': selectedItem === session.strUsrName }"
                @click="selectItem(session)">
              <div class="item-header">
                <!-- 订阅号的头像 -->
                <img v-if="session.strUsrName === '@publicUser'" src="../../../images/wx/public_user.png" alt="header">
                <img v-else :src="store.getters.getHeadImgPath + session.strUsrName + '.jpg'" alt="header">
              </div>
              <div class="item-msg">
                <p class="item-msg-title">{{ shortenCharts(session.strNickName, '23', '...') }}</p>
                <p class="item-msg-desc">{{ shortenCharts(session.strContent, '23', '...') }}</p>
              </div>
              <div class="item-info">
                <p class="item-info-time">15:11</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="main-msg">
      <router-view :key="$route.fullPath"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.main-comment {
  display: flex;
  height: 100%;
  .main-session {
    width: 300px; /* 设置 session 部分的宽度 */
    background-color: #e0e0e0; /* 示例背景色 */
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    border-right: 1px solid lightgray;
    .session-search-container {
      height: 63px; /* 固定高度 */
      width: 100%; /* 宽度为100% */
      background-color: #F7F7F7; /* 示例背景色 */
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
    }
    .session-items-container {
      flex-grow: 1; /* 占据剩余空间 */
      overflow-y: scroll; /* 启用垂直滚动 */
      overflow-x: hidden;
      .session-items-fix-roller {
        width: 300px !important;
        .item {
          display: flex;
          padding: 13px;
          background-color: #ededed;
          .item-header {
            width: 40px;
            height: 40px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 2px;
            }
          }
          .item-msg {
            flex-grow: 1;
            padding-left: 10px;
            .item-msg-title {
              font-size: 14px;
            }
            .item-msg-desc {
              font-size: 12px;
              color: #AFAEAE;
            }
          }
          .item-info {
            width: 40px;
            height: 40px;
            .item-info-time {
              font-size: 12px;
              color: #AFAEAE;
              text-align: right;
            }
          }
        }
        .item:hover {
          background-color: #D0D0D2;
        }
        .item-active {
          background-color: #CAC8C6;
        }
        .item-active:hover {
          background-color: #CAC8C6;
        }
      }
    }

    // 以下是滚动条样式
    /* 隐藏默认的滚动条轨道和拇指 */
    .session-items-container::-webkit-scrollbar {
      width: 0; /* 隐藏滚动条 */
      background: transparent; /* 使滚动条轨道背景透明 */
    }

    /* 鼠标悬停时显示滚动条轨道 */
    .session-items-container:hover::-webkit-scrollbar {
      width: 6px; /* 设置滚动条宽度 */
      background: #f0f0f0; /* 滚动条轨道背景颜色 */
    }

    /* 滚动条轨道样式 */
    .session-items-container:hover::-webkit-scrollbar-track-piece {
      background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
      border-radius: 8px; /* 设置滚动条轨道圆角 */
    }

    /* 滚动条拇指样式 */
    .session-items-container:hover::-webkit-scrollbar-thumb {
      background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
      border-radius: 8px; /* 设置滚动条拇指圆角 */
    }

    /* 鼠标悬停在滚动条拇指上时的样式 */
    .session-items-container:hover::-webkit-scrollbar-thumb:hover {
      background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
    }
  }
  .main-msg {
    flex-grow: 1;
    height: 100%;
  }
}
</style>