<script setup>
import {useStore} from "vuex";
const store = useStore();
const session = store.getters.getCurrentSession;

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
        <p class="info-wx-item info-wx-item-nickname">{{session.wx_name}}</p>
        <p class="info-wx-item">微信号: {{session.wx_acct_name}}</p>
        <p class="info-wx-item">微信id: {{session.wx_id}}</p>
        <p class="info-wx-item">手机号: {{session.wx_mobile}}</p>
      </div>
    </div>
    <div class="info-row">
      <p class="info-row-item">
        会话名称：{{session.name}}
      </p>
      <p class="info-row-item">
        会话描述：{{session.desc}}
      </p>
      <p class="info-row-item">
        KEY：{{maskString(session.wx_key)}}
      </p>
      <p class="info-row-item">
        客户端微信目录：{{session.wx_dir}}
      </p>
      <p class="info-row-item">
        服务端数据目录：{{session.data_path}}
      </p>
      <p class="info-row-item">
        创建时间：{{formatTimestamp(session.create_time)}}
      </p>
      <p class="info-row-item">
        修改时间：{{formatTimestamp(session.update_time)}} （记录上次同步时间，从未同步过与创建时间相同）
      </p>
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
        color: #a7a7a7
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