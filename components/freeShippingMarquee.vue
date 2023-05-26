<template>
  <div class="marquee-container" v-if="loaded">
    <marquee-text :repeat="50" :duration="5">
      <span class="item">Free&nbsp;Shipping</span>
    </marquee-text>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false
    }
  },
  mounted() {
    this.loaded = true
  },
  components: {
    MarqueeText: () =>
      process.client
        ? import('vue-marquee-text-component')
        : Promise.resolve({ render: h => h('div') })
  }
}
</script>

<style lang="scss" scoped>
.item {
  font-family: BoldItalic;
  font-size: 18px;
  line-height: 1.33;
  letter-spacing: 2.5px;
  text-align: center;
  color: $grayscale-white;
  margin: 0 37.5px;
  text-transform: uppercase;

  @include respond-to('small') {
    font-size: $text-small;
    margin: 0 15px;
  }
}
</style>
