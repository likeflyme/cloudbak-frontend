<script setup>
import {reactive, ref, getCurrentInstance, toRaw } from "vue";
import {addSysSession} from "@/api/user.js";
import {useStore} from "vuex";

const store = useStore();
const { proxy } = getCurrentInstance();
const error_msg = ref('');
const login_btn_title = ref('确定添加');
const loading = ref(false);
const form = reactive({
  name: '',
  desc: '',
  wx_key: '',
  wx_id: '',
  wx_name: '',
  wx_acct_name: '',
  wx_mobile: ''
});

const submitForm = () => {
  formCheck(() => {
    doAddSysSession();
  });
}

const formCheck = (callback) => {
  if (!form.name) {
    error_msg.value = '会话名称不能为空';
    return;
  }
  if (!form.wx_key) {
    error_msg.value = '微信KEY不能为空';
    return;
  }
  if (!form.wx_id) {
    error_msg.value = '微信id不能为空';
    return;
  }
  if (!form.wx_name) {
    error_msg.value = '微信昵称不能为空';
    return;
  }
  if (!form.wx_acct_name) {
    error_msg.value = '微信号不能为空';
    return;
  }
  callback();
}

const doAddSysSession = () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  proxy.$dialog.open({
    title: '添加会话',
    desc: '您确定要添加会话吗？',
    onConfirmed: () => {
      console.log('用户确认添加');
      addSysSession(JSON.stringify(toRaw(form))).then((data) => {
        store.commit('addSysSessions', data);
        loading.value = false;
        proxy.$toast.success('添加会话成功');
      }).catch((e) => {
        loading.value = false;
        proxy.$toast.warn('添加会话失败');
        if ("response" in e) {
          store.commit("showErrorToastMsg", {
            msg: e.response.data
          })
        } else {
          store.commit("showErrorToastMsg", {
            msg: e
          })
        }
      })
    },
    onCancelled: () => {
      loading.value = false;
    }
  });
}

</script>

<template>
  <div class="weui-form">
    <div class="weui-form__bd">
      <div class="weui-form__control-area">
        <div class="weui-cells__group weui-cells__group_form">
          <!--            <div class="weui-cells__title">表单组标题</div>-->
          <div class="weui-cells">
            <label for="js_input1" class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><span class="weui-label">会话名称*</span></div>
              <div class="weui-cell__bd">
                <input id="js_input1" class="weui-input" v-model="form.name" placeholder=""/>
              </div>
            </label>
            <label for="js_input2" class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><span class="weui-label">会话备注</span></div>
              <div class="weui-cell__bd">
                <input id="js_input2" class="weui-input" v-model="form.desc" placeholder=""/>
              </div>
            </label>
            <label for="js_input2" class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><span class="weui-label">微信KEY*</span></div>
              <div class="weui-cell__bd">
                <input id="js_input2" class="weui-input" v-model="form.wx_key" placeholder=""/>
              </div>
            </label>
            <label for="js_input2" class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><span class="weui-label">微信id*</span></div>
              <div class="weui-cell__bd">
                <input id="js_input2" class="weui-input" v-model="form.wx_id" placeholder=""/>
              </div>
            </label>
            <label for="js_input2" class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><span class="weui-label">微信昵称*</span></div>
              <div class="weui-cell__bd">
                <input id="js_input2" class="weui-input" v-model="form.wx_name" placeholder=""/>
              </div>
            </label>
            <label for="js_input2" class="weui-cell weui-cell_active">
              <div class="weui-cell__hd"><span class="weui-label">微信号*</span></div>
              <div class="weui-cell__bd">
                <input id="js_input2" class="weui-input" v-model="form.wx_acct_name" placeholder=""/>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="weui-form__ft">
      <div class="weui-form__opr-area">
        <a href="javascript:"
           role="button"
           class="weui-btn"
           @click="submitForm"
           :class="{'weui-btn_primary': !loading, 'weui-btn_default': loading, 'weui-btn_loading': loading}">
          <i v-if="loading" class="weui-mask-loading"></i>
          {{ login_btn_title }}
        </a>
      </div>
    </div>
  </div>
  <div v-if="error_msg" class="error_msg">{{ error_msg }}</div>
</template>

<style scoped lang="less">
.error_msg {
  color: #990C15;
}
.weui-form {
  padding:0!important;
}
.weui-form__control-area {
  margin: 0!important;

}
.weui-label {
  font-size: 14px;
}
.weui-cell {
  padding: 10px;
}
.weui-form__opr-area {
}
</style>