<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {reactive, ref} from "vue";
import {msgs} from "@/api/msg.js"
import {parseXml, getReferFileName, getThumbFromStringContent, getVoiceLength, parseImg, formatMsgDate} from "@/utils/common.js";
import {useStore} from "vuex";
import defaultImage from '@/assets/default-head.svg';
const store = useStore();
const props = defineProps({
  strUsrName: String,
  title: String
})
const selected = ref(false);
const selectedType = reactive({});
const msg_list = reactive([]);
const noMoreMsg = ref(false);
const isLoading = ref(false);
const queryDayData = {
  type: 7,
  title: '日期',
  width: '90px',
  icon: ['fas', 'calendar-days']
}
const query = reactive({
  strUsrName: props.strUsrName,
  page: 1,
  size: 30,
  start: 0,
  dbNo: -1,
  filterType: 0,
  filterText: '',
  filterDay: '',
  filterUser: ''
});
const filterTypes = [
  {
    type: 1,
    title: '文件',
    width: '90px',
    icon: ['fas', 'file']
  },{
    type: 2,
    title: '图片与视频',
    width: '170px',
    icon: ['fas', 'image']
  },{
    type: 3,
    title: '链接',
    width: '100px',
    icon: ['fas', 'link']
  },{
    type: 4,
    title: '音乐与音频',
    width: '170px',
    icon: ['fas', 'volume-high']
  },{
    type: 5,
    title: '小程序',
    width: '120px',
    icon: ['fas', 'globe']
  },{
    type: 6,
    title: '视频号',
    width: '120px',
    icon: ['fas', 'video']
  }
  // ,{
  //   type: '8',
  //   title: '群成员',
  //   width: '120px',
  //   icon: ['fas', 'users']
  // },
];
const showCalendar = () => {

}
const setDefaultImage = (event) => {
  event.target.src = defaultImage;
}
const selectFilterType = (t) => {
  selected.value = true;
  query.filterType = t.type;
  Object.assign(selectedType, t);
  clearAndSearch();
}
const clear = () => {
  selected.value = false;
  query.filterText = '';
  query.filterType = 0;
  clearAndSearch();
}
const clearSelectType = () => {
  selected.value = false;
  query.filterType = 0;
  clearAndSearch();
}
const clearAndSearch = () => {
  noMoreMsg.value = false;
  query.dbNo = -1;
  msg_list.length = 0;
  loadData();
}
const loadData = () => {
  if (!noMoreMsg.value) {
    isLoading.value = true;
    console.log("查询前打印", query.filterText);
    msgs(query).then(resp => {
      isLoading.value = false;
      if (resp.msgs.length < query.size) {
        noMoreMsg.value = true;
      }
      if (resp.msgs.length > 0) {
        query.start = resp.start;
        // 设置数据库编号
        if (query.dbNo === -1) {
          query.dbNo = resp.dbNo;
        } else if (query.dbNo !== resp.dbNo) {
          query.page = 0;
          query.dbNo = resp.dbNo;
        }
        // 图片数据处理
        try{
          parseImg(resp.msgs);
        } catch (e) {
          console.log('parse img error: ', e);
        }
        // 添加到数据列表
        msg_list.push(...resp.msgs);
      }
    }).catch(e => {
      isLoading.value = false;
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
clearAndSearch();

const loadMore = () => {
  query.page = query.page + 1;
  loadData();
};


</script>

<template>
  <div class="filter-container">
    <div class="filter-head">
      <div class="head-title">
        <p class="head-title-title">
          {{ title }}
        </p>
        <p class="head-title-fill"></p>
        <p class="head-title-tools" @click="$emit('close-filter')">
          <font-awesome-icon :icon="['fas', 'xmark']"/>
        </p>
      </div>
      <div class="head-search">
        <div class="weui-search-bar weui-search-bar_outlined" id="searchBar">
          <div id="searchForm" role="combobox" aria-haspopup="true" aria-expanded="false" aria-owns="searchResult" class="weui-search-bar__form">
            <div class="weui-search-bar__box">
              <div class="select-type" v-if="selected" @click="clearSelectType" :style="{'width': selectedType.width}">
                <font-awesome-icon class="select-type-clear" :icon="selectedType.icon"/>
                <p>{{ selectedType.title }}</p>
                <font-awesome-icon class="select-type-clear" :icon="['fas', 'xmark']"/>
              </div>
              <i v-else class="weui-icon-search"></i>
              <input type="search" aria-controls="searchResult" v-model="query.filterText" class="weui-search-bar__input" id="searchInput" @keydown.enter="clearAndSearch"/>
              <a v-if="selected || query.filterText" href="javascript:" role="button" title="清除" class="weui-icon-clear" @click="clear"></a>
            </div>
          </div>
        </div>
      </div>
      <div class="head-filter">
        <ul class="filter-ul">
          <li class="filter-item" v-for="t in filterTypes" @click="selectFilterType(t)">{{ t.title }}</li>
          <li class="filter-item" @click="showCalendar()">日期</li>
        </ul>
      </div>
    </div>
    <div class="msg-body">
      <ul class="msg-ul" v-if="msg_list.length > 0">
        <li v-for="m in msg_list" class="msg-li">
          <div class="msg-head">
            <img alt="" :src="m.smallHeadImgUrl?m.smallHeadImgUrl:defaultImage" @error="setDefaultImage"/>
          </div>
          <div class="msg-right">
            <div class="msg-title">
              <p class="msg-nickname">{{ m.Remark?m.Remark:m.NickName}}</p>
              <p class="msg-grow"></p>
              <p class="msg-time">{{ formatMsgDate(m.CreateTime) }}</p>
            </div>
            <div class="msg-content">
              <div class="msg-text">
                {{ m.StrContent }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <p class="no-msg" v-else-if="msg_list.length === 0 && !isLoading"> 无内容 </p>
      <div class="load-more" v-if="!noMoreMsg">
        <a href="javascript:void(0)" @click="loadMore">
          <font-awesome-icon class="loading-icon" v-if="isLoading" :icon="['fas', 'spinner']"/>
          <p v-else>查看更多消息</p>
        </a>
      </div>
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
            .select-type {
              display: flex;
              align-items: center;
              background-color: #E6E6E6;
              border-radius: 3px;
              color: #797979;
              padding: 5px 10px;
              cursor: pointer;
              margin-right: 10px;
            }
            .select-type p {
              margin-left: 10px; /* 为第二个子元素（<p>）添加 margin-left */
            }
            .select-type .select-type-clear:nth-child(3) {
              margin-left: 5px; /* 为第三个子元素（font-awesome-icon）添加 margin-left */
            }
            .weui-search-bar__input {
              flex-grow: 1;
              font-size: 14px;
            }
            .weui-icon-clear {
              cursor: pointer;
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
  .msg-body {
    flex-grow: 1;
    overflow-y: scroll;
    .msg-ul {
      width: 100%;
      .msg-li {
        word-break: break-word;
        padding: 0 20px;
        display: flex;
        .msg-head {
          padding-top: 15px;
          width: 35px;
          height: 35px;
          img {
            width: 35px;
            height: 35px;
            border-radius: 3px;
          }
        }
        .msg-right {
          flex-grow: 1;
          padding-left: 15px;
          padding-right: 15px;

          .msg-title {
            padding-top: 15px;
            border-top: 1px solid #EFEFEF;
            display: flex;
            color: gray;
            font-size: 12px;
            .msg-grow {
              flex-grow: 1;
            }
          }
          .msg-content {
            .msg-text {
              padding: 15px 0;
            }
          }
        }
      }
    }
    .no-msg {
      text-align: center;
    }
    .load-more {
      text-align: center;
      font-size: 12px;
      a {
        color: dimgray;
      }
    }
  }

  // 以下是滚动条样式
  /* 隐藏默认的滚动条轨道和拇指 */
  .msg-body::-webkit-scrollbar {
    width: 6px; /* 隐藏滚动条 */
    background: transparent; /* 使滚动条轨道背景透明 */
  }

  /* 鼠标悬停时显示滚动条轨道 */
  .msg-body:hover::-webkit-scrollbar {
    width: 6px; /* 设置滚动条宽度 */
    background: #f0f0f0; /* 滚动条轨道背景颜色 */
  }

  /* 滚动条轨道样式 */
  .msg-body:hover::-webkit-scrollbar-track-piece {
    background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
    border-radius: 8px; /* 设置滚动条轨道圆角 */
  }

  /* 滚动条拇指样式 */
  .msg-body:hover::-webkit-scrollbar-thumb {
    background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
    border-radius: 8px; /* 设置滚动条拇指圆角 */
  }

  /* 鼠标悬停在滚动条拇指上时的样式 */
  .msg-body:hover::-webkit-scrollbar-thumb:hover {
    background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
  }
}
/* Define an animation behavior */
@keyframes spinner {
  to { transform: rotate(360deg); }
}
/* This is the class name given by the Font Awesome component when icon contains 'spinner' */
.fa-spinner {
  /* Apply 'spinner' keyframes looping once every second (1s)  */
  animation: spinner 1s linear infinite;
}
</style>