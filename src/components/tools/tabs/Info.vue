<script setup>
import {useStore} from "vuex";
import {updateSysSession} from "@/api/user.js";
import {reactive, ref, nextTick, getCurrentInstance} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
const store = useStore();
const session = store.getters.getCurrentSession;
const wxNameRef = ref(null);
const {proxy} = getCurrentInstance();

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

const editStatus = reactive({
  name: false,
  desc: false,
  wx_id: false,
  wx_key: false,
  wx_name: {
    edit: false,
    ref: ref()
  },
  wx_acct_name: false,
  wx_mobile: false,
  update_time: false
});

const showEdit = (row, refName) => {
  row.edit = true;
  console.log(proxy.$refs);
};

const maskString = (str) => {
  if (str.length <= 8) {
    return str; // 如果字符串长度小于等于8，返回原字符串
  }
  const start = str.slice(0, 4); // 获取前四个字符
  const end = str.slice(-4); // 获取后四个字符
  const maskedLength = str.length - 8; // 计算需要替换的字符数量
  const maskedPart = '*'.repeat(maskedLength); // 生成星号字符串

  return start + maskedPart + end; // 拼接结果
}

 const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  // 获取年、月、日、小时、分钟
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  // 根据日期判断输出格式
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};
</script>

<template>
  <div class="info">
    <div class="info-base">
      <div class="info-head">
        <img :src="store.getters.getCurrentSession.smallHeadImgUrl" alt=""/>
      </div>
      <div class="info-wx">
        <div class="info-wx-item info-wx-item-nickname">
<!--          <input  class="item-input" v-model="formData.wx_name" :ref="'wxNameRef'"/>-->
          <p class="item-value">{{session.wx_name}}
<!--            <font-awesome-icon class="item-edit" :icon="['fas', 'pencil']" @click="showEdit(editStatus.wx_name, 'wxNameRef')"/>-->
          </p>
        </div>
        <div class="info-wx-item">
          微信号：<p class="item-value">{{session.wx_acct_name}}</p>
<!--          <input class="item-input" v-model="formData.wx_acct_name"/>-->
        </div>
        <div class="info-wx-item">
          微信id：{{session.wx_id}}
<!--          <input v-model="formData.wx_id"/>-->
        </div>
        <div class="info-wx-item">手机号：{{session.wx_mobile}}
<!--          <input v-model="formData.wx_mobile"/>-->
        </div>
      </div>
    </div>
    <div class="info-row">
      <div class="info-row-item">
        会话名称：{{session.name}}
<!--        <input v-model="formData.name"/>-->
      </div>
      <div class="info-row-item">
        会话描述：{{session.desc}}
<!--        <input v-model="formData.desc"/>-->
      </div>
      <div class="info-row-item">
        KEY：{{maskString(session.wx_key)}}
<!--        <input v-model="formData.wx_key"/>-->
      </div>
      <div class="info-row-item">
        客户端微信目录：{{session.wx_dir}}
      </div>
      <div class="info-row-item">
        服务端数据目录：{{session.data_path}}
      </div>
      <div class="info-row-item">
        创建时间：{{formatTimestamp(session.create_time)}}
      </div>
      <div class="info-row-item">
        修改时间：{{formatTimestamp(session.update_time)}}  （记录上次同步时间，从未同步过与创建时间相同）
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.info {
  padding: 0 10px;
  background-color: #FFFFFF;
  .info-base {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f3f3f3;
    .info-head {
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
    .info-wx {
      font-size: 12px;
      padding-left: 20px;
      .info-wx-item {
        color: #a7a7a7;
        display: flex;
        align-items: center;
        .item-edit {
          font-size: 12px;
          visibility: hidden;
        }
      }
      .info-wx-item:hover {
        .item-edit {
          visibility: visible;
          cursor: pointer;
        }
      }
      .info-wx-item-nickname {
        color: #4b4b4b;
        font-size: 16px;
      }
    }
  }
  .info-row {
    padding: 10px 0;
    //border-bottom: 1px solid #f3f3f3;
    .info-row-item {
      font-size: 12px;
      padding: 8px 0;
      color: #4b4b4b;
    }
  }
}
</style>