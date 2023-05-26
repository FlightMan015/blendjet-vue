<template>
  <div class="marquee">
    <div class="as-seen-on">
      As seen on:
    </div>

    <div class="ticker__container">
      <div class="fade-block fade-block__left"></div>
      <custom-marquee :width="this.$mq === 'sm' ? 80 : 100" :height="60" :length="imgList.length">
        <div class="marquee-item" v-for="image in imgList" :key="image.altText">
          <img class="ticker__img" :src="image.url" :alt="image.altText" />
        </div>
      </custom-marquee>
      <div class="fade-block fade-block__right"></div>
    </div>
  </div>
</template>

<script>
import CustomMarquee from '~/components/CustomMarquee.vue'
export default {
  components: {
    CustomMarquee
  },
  props: {
    imgList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      repeatTimes: 2,
      loaded: false
    }
  },

  mounted() {
    setTimeout(() => {
      this.loaded = true
    }, 1200)
  }
}
</script>

<style scoped lang="scss">
.ticker__container {
  width: 100%;
  height: 60px;
}

.fade-block {
  position: absolute;
  width: 75px;
  top: 0;
  bottom: 1px;
  top: 1px;
  z-index: 20;
  height: 133px;
  @include respond-to('small') {
    width: 40px;
  }

  &__left {
    left: 0;
    background: -moz-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(70%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -o-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -ms-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: linear-gradient(to left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
  }

  &__right {
    right: 0;
    background: -moz-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(70%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -o-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -ms-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: linear-gradient(to right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
  }
}

.ticker__item {
  display: flex;
  align-items: center;
  width: 100%;
}

.ticker__img {
  height: 40px;
  width: 100%;
}

.as-seen-on {
  width: 100%;
  font-size: $text-small;
  color: $secondary-purple-2;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  line-height: 1.17;
  text-align: center;
  margin-bottom: 16px;
}
</style>
