<script setup>
const props = defineProps({
  msg: {
    type: Object,
    required: true
  }
});
const noticeType = props.msg.compress_content?.msg?.appmsg?.mmreader?.category['@type'];

</script>

<template>
  <div class="n-container">
    <!-- 简单通知类消息 -->
    <div class="n-box" v-if="noticeType === '0'">
      <div class="n-row n-header" v-if="props.msg.compress_content?.msg?.appmsg?.mmreader?.template_header?.display_name">
        <img class="n-header-img" width="20" height="20" :src="props.msg.compress_content?.msg?.appmsg?.mmreader?.template_header?.icon_url" alt="商户图标"/>
        <p class="n-header-name">{{ props.msg.compress_content?.msg?.appmsg?.mmreader?.template_header?.display_name }}</p>
      </div>
      <div class="n-row n-body">
        <div class="n-body-trans-type">
          {{ props.msg.compress_content?.msg?.appmsg?.mmreader?.template_header?.title }}
        </div>
        <div class="n-body-trans">
          <p class="n-body-trans-title">{{ props.msg.compress_content?.msg?.appmsg?.mmreader?.template_detail?.line_content?.topline?.key?.word }}</p>
          <p class="n-body-trans-amt">{{ props.msg.compress_content?.msg?.appmsg?.mmreader?.template_detail?.line_content?.topline?.value?.word }}</p>
        </div>
        <div class="n-body-trans-desc" v-for="line in props.msg.compress_content?.msg?.appmsg?.mmreader?.template_detail?.line_content.lines.line">
          <p class="n-body-trans-desc-label">{{ line.key?.word }}</p>
          <p class="n-body-trans-desc-value">{{ line.value?.word }}</p>
        </div>
      </div>
    </div>
    <div class="n-box no-support" v-else>
      不支持的消息类型：{{ noticeType }}
    </div>
  </div>
</template>

<style scoped lang="less">
.n-container {
  width: 100%;
  .n-box {
    margin: 5px auto;
    background-color: #FFFFFF;
    border-radius: 3px;
    width: 350px;
    direction: ltr;
    .n-row {
      padding: 10px;
    }
    .n-header {
      display: flex;
      .n-header-img {
        width: 20px;
        height: 20px;
      }
      .n-header-name {
        margin-left: 20px;
      }
    }
    .n-body {
      .n-body-trans-type {
        padding: 10px 0;
      }
      .n-body-trans {
        padding: 10px 0;
        .n-body-trans-title {
          text-align: center;
          color: #888888;
        }
        .n-body-trans-amt {
          text-align: center;
          font-size: 30px;
        }
      }
      .n-body-trans-desc {
        display: flex;
        padding: 5px 0;
        .n-body-trans-desc-label {
          color: #888888;
          width: 70px;
        }
        .n-body-trans-desc-value {
          flex-grow: 1;
        }
      }
    }
  }
  .n-box .n-row {
    position: relative;
  }
  .n-box .n-row:not(:first-child)::before {
    content: "";                    /* 创建伪元素 */
    position: absolute;             /* 绝对定位 */
    top: 0;                         /* 定位到顶部 */
    left: 0;                        /* 从左边开始 */
    width: 100%;                    /* 横向填满 */
    height: 1px;                    /* 设置初始高度为1px */
    background-color: #e7e7e7;         /* 边框颜色 */
    transform: scaleY(0.7);         /* 缩小宽度为70% */
    transform-origin: left;         /* 缩放起点为左侧 */
  }
  .no-support {
    padding: 10px;
    color: #888888
  }
}
</style>