<template>
  <div class="main-container">
    <MainSidebar class="main-sidebar">

    </MainSidebar>
    <div class="main-session">
      <div class="session-search-container">
        <MainSearchBar></MainSearchBar>
      </div>
      <div class="session-items-container">
        <div class="session-items-fix-roller">
          <MainItems></MainItems>
        </div>
      </div>
    </div>
    <MainContent></MainContent>
  </div>
</template>

<script setup>
import MainSidebar from "../components/MainSidebar.vue";
import MainSearchBar from "../components/MainSearchBar.vue";
import MainItems from "../components/MainItems.vue";
import MainContent from "../components/MainContent.vue";

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
    }
    .session-items-container {
      flex-grow: 1; /* 占据剩余空间 */
      overflow-y: scroll; /* 启用垂直滚动 */
      overflow-x: hidden;
      .session-items-fix-roller {
        width: 300px !important;
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


</style>