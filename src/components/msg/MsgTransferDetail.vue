<script setup>
const props = defineProps({
  msg: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="td">
    暂不支持
    <div class="td-row">
      <div class="td-left">
        <div class="td-head"></div>
      </div>
      <div class="td-right">
        <div class="td-right-head"></div>
        <div class="td-right-content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.td {
  width: 500px;
  margin: 0 auto;
  word-break: break-word;
  .td-row {
    .td-left {
      width: 50px;
    }
  }
}
</style>