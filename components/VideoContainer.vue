<template>
  <span>
    <div v-show="isLoading" class="loading-video" :class="classObj">
      <div class="loader"></div>
    </div>
    <video
      v-show="!isLoading"
      :autoplay="autoplay"
      :loop="loop"
      muted=""
      webkit-playsinline=""
      playsinline=""
      @loadeddata="onVideoLoad"
    >
      <source :src="source" type="video/mp4" />
    </video>
  </span>
</template>

<script>
export default {
  props: {
    source: {
      type: String
    },
    autoplay: {
      type: String,
      default: 'autoplay'
    },
    loop: {
      type: String,
      default: 'loop'
    },
    showLoader: {
      type: Boolean,
      default: false
    },
    loaderHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isLoading: false,
      classObj: {
        height: this.loaderHeight + 'px'
      }
    }
  },
  mounted() {
    this.isLoading = this.showLoader
  },
  methods: {
    onVideoLoad() {
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  .loader {
    width: 60px;
    height: 60px;
  }
}
</style>
