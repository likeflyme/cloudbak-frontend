<script setup>
const props = defineProps({
  msg: {
    type: Object,
    required: true
  }
});

const replaceBreak = (str) => {
  return str.replaceAll("\n", "<br>");
}
</script>

<template>
<div class="transfer">
  <div class="transfer-title">
    {{ props.msg.compress_content?.msg?.appmsg?.title }}
  </div>
  <div class="transfer-desc" v-html="replaceBreak(props.msg.compress_content?.msg?.appmsg?.des)">

  </div>
  <div class="transfer-footer">
    聊天记录
  </div>
</div>
</template>

<style scoped lang="less">
.transfer {
  background-color: #FFFFFF;
  border-radius: 3px;
  padding: 10px;
  direction: ltr;
  .transfer-title {

  }
  .transfer-desc {
    font-size: 11px;
    color: #797979;
  }
  .transfer-footer {
    padding-top: 5px;
    font-size: 11px;
    color: #797979;
  }
}
.transfer:hover {
  background-color: #ebebeb;
  cursor: pointer;
}
</style>