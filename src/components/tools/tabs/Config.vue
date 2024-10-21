<script setup>
import {useStore} from "vuex";
import {reactive} from "vue";
const store = useStore();
const session = store.getters.getCurrentSession;

const formData = reactive({
  name: session.name,
  desc: session.desc,
  wx_id: session.wx_id,
  wx_key: session.wx_key,
  wx_name: session.wx_name,
  wx_acct_name: session.wx_acct_name,
  wx_mobile: session.wx_mobile,
  update_time: session.update_time,
});
</script>

<template>
  <div class="s-page">
    <div class="conf-group">
      <div class="conf-title">定时解析</div>
      <div class="conf-detail">
        <input aria-labelledby="cb_txt" class="weui-switch" type="checkbox"/>
      </div>
      <div class="conf-detail">
        <div class="weui-cell__bd weui-flex">
          <label>cron 表达式：</label>
          <input class="weui-input" type="text" placeholder="请输入 cron 表达式" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.s-page {
  padding: 10px 10px;
  background-color: #FFFFFF;
  .weui-switch, .weui-switch-cp__box {
    width: 40px;
    height: 20px;
  }
  .weui-switch-cp__box::after, .weui-switch::after {
    width: 17px;
    height: 17px;
  }
  .weui-cell__bd {
    label {
      width: 110px;
    }
  }
  .conf-group {
    font-size: 13px;
    .conf-title {
    }
    .conf-detail {
      margin-top: 5px;
    }
  }
}
</style>