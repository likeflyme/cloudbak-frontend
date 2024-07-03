<script setup>

</script>

<template>
  <div class="sidebar">
    <div class="open-close-container">
      <img class="open-close" src="../images/icon_nav_form.png" alt=" 展开" role="button">
    </div>
    <ul class="sidebar-ul">
      <li class="sidebar-li session session-active">
        <img class="session-head-img" src="https://static.raining.top/picgo/weixinhead.jpg" alt="相忘于江湖" title="相忘于江湖">
      </li>
      <li class="sidebar-li session">
        <img class="session-head-img" src="https://static.raining.top/picgo/weixinhead.jpg" alt="相忘于江湖" title="相忘于江湖">
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80px;
  background-color: var(--weui-BG);
  padding: 20px;
  .sidebar-ul {
    margin-top: 10px;
    .sidebar-li {
      width: 80px;
      height: 80px;
      padding: 0;
      border-radius: 10px;
    }
  }
  .open-close-container {
    text-align: center;
    .open-close {
      width: 30px;
      height: 30px;
    }
  }
}
.session {
  margin-bottom: 10px;
  .session-head-img {
    width: 80px;
    height: 80px;
    border-radius: 7px;
  }
  .session-head-img:hover {
    cursor: pointer;
  }
}
.session-active {
  border: 2px solid var(--weui-BRAND-80);
}
</style>