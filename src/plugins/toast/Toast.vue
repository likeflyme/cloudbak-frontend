<script setup>
import {ref} from "vue";

const message = ref('');
const type = ref('success');
const visible = ref(false);

const open = (options) => {
  message.value = options.message;
  type.value = options.type || 'success';
  visible.value = true;
}
const close = () => {
  visible.value = false;
}
defineExpose({
  open,
  close
});
</script>

<template>
<div role="alert" v-if="visible">
  <div class="weui-mask_transparent"></div>
  <div class="weui-toast">
    <i class="weui-icon_toast"
       :class="{'weui-icon-success-no-circle': type === 'success', 'weui-icon-warn': type === 'warn'}"></i>
    <p class="weui-toast__content">{{ message }}</p>
  </div>
</div>
</template>

<style scoped lang="less">
</style>