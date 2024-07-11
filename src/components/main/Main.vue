<template>
  <div class="main-container">
    <div class="main-sidebar">
      <ul class="item-container">
        <li class="item">
          <img class="u-header" src="https://static.raining.top/picgo/weixinhead.jpg" alt=" 展开" role="button">
        </li>
        <li class="item" v-for="m in menu">
          <router-link :to="m.path">
            <font-awesome-icon class="item-icon"
                               :class="{'item-icon-active': selectedItem === m.id }"
                               :icon="m.icon"
                               :title="m.title"
                                @click="selectedItem = m.id"/>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="main-right">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {contact} from "../../api/msg.js";
import {useStore} from "vuex";
import {reactive, ref} from "vue";

const store = useStore();
const router = useRouter();
const selectedItem = ref('comment');

const menu = reactive([
  {
    id: 'comment',
    title: '聊天',
    icon: ['far', 'comment'],
    path: '/comment'
  },
  {
    id: 'address-book',
    title: '通讯录',
    icon: ['far', 'user'],
    path: '/address-book'
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
contact().then(resp => {
  store.commit("setContact", resp)
});


router.push("/comment");
</script>
<style scoped lang="less">
  .main-container {
    position: absolute;
    width: 1250px;
    height: 950px;
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
  }
  .main-right {
    flex-grow: 1;
  }

  .item-container {
    height: 100%;
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