<script setup>

</script>

<template>
  <div role="dialog" aria-hidden="true" aria-modal="true" aria-labelledby="js_title1" id="iosDialog1">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__hd"><strong class="weui-dialog__title" id="js_title1">删除会话</strong></div>
      <div class="weui-dialog__bd">
        <p>确定要删除会话吗？</p>
        <p>确定删除后，该会话的数据文件将在后台静默删除！</p>
        <p>会话名称：{{ store.getters.getCurrentSession.name }}</p>
        <p>会话备注：{{ store.getters.getCurrentSession.desc }}</p>
        <p>微信账号：{{ store.getters.getCurrentSession.wx_acct_name }}</p>
        <p>微信昵称：{{ store.getters.getCurrentSession.wx_name }}</p>
      </div>
      <div class="weui-dialog__ft">
        <a role="button" href="javascript:" class="weui-dialog__btn weui-dialog__btn_default" @click="showDeleteDialog=false">取消</a>
        <a role="button" href="javascript:" class="weui-dialog__btn weui-dialog__btn_primary" @click="sessionDelete(store.getters.getCurrentSession.id)">确定删除</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>