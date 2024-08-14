<template>
  <div class="audio-player" :class="{'player-disable': !isEnable, 'player-right': right}" @click="toggleAudio">
    <p class="audio-player-icon">
      <font-awesome-icon class="audio-icon" :icon="['fas', currentIcon]" title="语音"/>
    </p>
    <p class="audio-player-text"> {{ text }}</p>
    <p class="audio-player-text"> {{ tips }}</p>
    <audio ref="audio" :src="src" @ended="onAudioEnded" @error="onError"></audio>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    right: {
      type: Boolean,
      default: 0
    }
  },
  data() {
    return {
      isPlaying: false,
      currentIcon: 'volume-high',
      updateInterval: null, // 用于保存定时器的引用,
      icons: ['volume-off', 'volume-low', 'volume-high'],
      currentIndex: 0,
      maxIndex: 2,
      isEnable: true,
      tips: ''
    };
  },
  methods: {
    toggleAudio() {
      if (!this.isEnable) {
        return;
      }
      const audio = this.$refs.audio;

      if (this.isPlaying) {
        audio.pause();
        this.resetIcon();
      } else {
        audio.play();
        // 每500毫秒更新一次图标
        this.updateInterval = setInterval(this.updateIcon, 500);
      }

      this.isPlaying = !this.isPlaying;
    },
    updateIcon() {
      this.currentIndex = this.currentIndex + 1;
      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = 0;
      }
      this.currentIcon = this.icons[this.currentIndex];
    },
    resetIcon() {
      clearInterval(this.updateInterval);
      this.currentIcon = 'volume-high';
    },
    onAudioEnded() {
      this.resetIcon();
      this.isPlaying = false; // 重置播放状态
    },
    onError(e) {
      console.log("语音获取失败，修改为不可用", e)
      this.isEnable = false;
      this.tips = '未同步的语音';
    }
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    clearInterval(this.updateInterval);
  }
};
</script>

<style scoped>
.audio-player {
  padding: 5px 10px;
  min-width: 100px;
  position: relative;
  font-size: 12px;
  background-color: #FFFFFF;
  border-radius: 4px;
  display: flex;
  direction: ltr;
  .audio-player-icon {
    width: 20px;
    text-align: left;
  }
}
.audio-player:hover {
  cursor: pointer;
  background-color: #EBEBEB;
}
.audio-player-text {
  margin-right: 5px;
}
.audio-player.player-disable {
  color: gray;
}
.player-right.player-right {
  direction: rtl;
  .audio-player-icon {
    transform: rotate(180deg) translateZ(0);
  }
  .audio-player-text {
    direction: ltr;
  }
}
</style>
