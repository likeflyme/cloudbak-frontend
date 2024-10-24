<script setup>
import {useStore} from "vuex";
import {getCurrentInstance, reactive, ref, toRaw} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {updateConf} from "@/api/conf.js";
import {isValidCron} from "cron-validator";

const store = useStore();

const { proxy } = getCurrentInstance();
const loading = ref(false);
const error = ref('');

const sessionConf = store.getters.getSessionConf;

const sessionId = store.getters.getCurrentSessionId;
const conf = sessionConf[sessionId] || {};
const analyzeConf = conf.analyze || {}

const form = reactive({
  analyze: conf.analyze || {
    analyze_open: analyzeConf.analyze_open || false,
    analyze_cron: analyzeConf.analyze_cron || "0 1 * * *"
  }
});

const setError = (err) => {
  error.value = err;
}

const validForm = () => {
  if (form.analyze.analyze_open) {
    if (!isValidCron(form.analyze.analyze_cron)) {
      setError('cron 表达式错误');
      return false;
    }
  }
  return true;
}

const save = () => {
  setError('');
  console.log(JSON.stringify(toRaw(form)));
  if (validForm()) {
    loading.value = true;
    updateConf("session_conf", JSON.stringify(toRaw(form))).then(resp => {
      proxy.$toast.success('修改配置成功');
    }).catch(e => {
      if (e.response.data) {
        setError(e.response.data.detail);
      } else {
        setError(e.message);
      }
    }).finally(() => {
      loading.value = false;
    });
  }

}
</script>

<template>
  <div class="s-page">
    <div class="page-body">
      <div class="conf-group">
        <div class="conf-title">定时解析
          <a class="conf-title-help" title="帮助文档" href="https://www.cloudbak.org/advanced/timing-analysis.html" target="_blank">
            <font-awesome-icon :icon="['fas', 'fa-arrow-up-right-from-square']" />
          </a>
        </div>
        <div class="conf-detail">
          <input aria-labelledby="cb_txt" class="weui-switch" type="checkbox" v-model="form.analyze.analyze_open"/>
        </div>
        <div class="conf-detail" v-if="form.analyze.analyze_open">
          <div class="weui-cell__bd weui-flex">
            <label>cron 表达式：</label>
            <input class="weui-input" type="text" placeholder="请输入 cron 表达式" v-model="form.analyze.analyze_cron" />
          </div>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <div class="error">
        {{ error }}
      </div>
      <a href="javascript:" role="button" class="weui-btn weui-btn_mini weui-btn_primary weui-wa-hotarea weui-btn_loading" @click="save" >
        <i v-if="loading" class="weui-mask-loading weui-mask-loading_only"></i>
        保存
      </a>
    </div>
  </div>

</template>

<style scoped lang="less">
.s-page {
  background-color: #FFFFFF;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .page-footer {
    .error {
      flex-grow: 1;
      color: darkred;
      font-size: 13px;
    }
    padding: 5px;
    display: flex;
  }
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
  .page-body {
    flex-grow: 1;
    .conf-group {
      padding: 10px;
      font-size: 13px;
      .conf-title {
        font-weight: bold;
        padding: 5px 0;
        .conf-title-help {
          font-size: 12px;
          color: gray;
          cursor: pointer;
        }
      }
      .conf-detail {
        margin-top: 5px;
      }
    }
  }
}
.s-button {
  border: none;
  background-color: #07C160;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #FFFFFF;
}
</style>