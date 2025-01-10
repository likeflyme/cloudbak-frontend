<script setup>
import {ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const emit = defineEmits(['close']);

const visible = ref(true);

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Popup Window'
  },
  width: {
    type: String,
    default: '400px'
  },
  height: {
    type: String,
    default: '300px'
  },
  top: {
    type: String,
    default: '50px'
  },
  left: {
    type: String,
    default: '50px'
  },
  zIndex: {
    type: Number,
    default: 1000
  },
  close: {
    type: Function,
    required: true
  }
});

const closeWindow = () => {
  visible.value = false;
  props.close();
}

</script>

<template>
  <div v-if="visible" class="popup-window" :style="{
    width: width,
    height: height,
    top: top,
    left: left,
    zIndex: zIndex
  }">
    <div class="popup-top">
      <div class="popup-title">
        <p>{{ props.title }}</p>
      </div>
      <div class="popup-top-grow"></div>
      <div class="popup-btns">
        <div class="popup-btn" @click="closeWindow">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </div>
      </div>
    </div>
    <!-- 动态组件 -->
    <div class="popup-slot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.popup-window {
  overflow: auto;
  position: absolute;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid lightgray;
  .popup-top {
    width: 100%;
    height: 60px;
    display: flex;
    border-bottom: 1px solid #f2f2f2;
    .popup-title {
      font-size: 13px;
      color: gray;
      p {
        padding: 5px;
      }
    }
    .popup-top-grow {
      flex-grow: 1;
    }
    .popup-btns {
      display: flex;
      .popup-btn {
        display: flex;
        justify-content: center;  /* 水平居中 */
        align-items: center;      /* 垂直居中 */
        width: 30px;
        height: 30px;
        cursor: pointer;
        color: #515151;
        font-size: 13px;
      }
      .popup-btn:hover {
        background-color: #fb7373;
        color: #FFFFFF;
      }
    }
  }
  .popup-slot {
    width: 100%;
    height: 540px;
    overflow-y: scroll;
  }
  // 以下是滚动条样式
  /* 隐藏默认的滚动条轨道和拇指 */
  .popup-slot::-webkit-scrollbar {
    width: 0.429rem; /* 隐藏滚动条 */
    background: transparent; /* 使滚动条轨道背景透明 */
  }

  /* 鼠标悬停时显示滚动条轨道 */
  .popup-slot:hover::-webkit-scrollbar {
    width: 0.429rem; /* 设置滚动条宽度 */
    background: #f0f0f0; /* 滚动条轨道背景颜色 */
  }

  /* 滚动条轨道样式 */
  .popup-slot:hover::-webkit-scrollbar-track-piece {
    background: #f0f0f0; /* 设置滚动条轨道背景颜色 */
    border-radius: 0.571rem; /* 设置滚动条轨道圆角 */
  }

  /* 滚动条拇指样式 */
  .popup-slot:hover::-webkit-scrollbar-thumb {
    background-color: #c8c9cc; /* 设置滚动条拇指背景颜色 */
    border-radius: 0.571rem; /* 设置滚动条拇指圆角 */
  }

  /* 鼠标悬停在滚动条拇指上时的样式 */
  .popup-slot:hover::-webkit-scrollbar-thumb:hover {
    background-color: #b0b0b0; /* 鼠标悬停时滚动条拇指背景颜色 */
  }
}
</style>