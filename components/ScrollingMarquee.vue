<template>
  <div
    class="scrolling-marquee"
    :style="{ '--bg': section.background, '--color': section.textColor }"
  >
    <h2 v-if="section.title" class="scrolling-marquee__title">
      {{ section.title }}
    </h2>
    <MarqueeText
      :reverse="section.reverse"
      :repeat="section.images.length ? 3 : 20"
      :duration="section.images.length ? 45 : 5"
    >
      <template v-if="section.images.length">
        <span
          class="scrolling-marquee__image"
          v-for="img in section.images"
          :key="img.fields.title"
        >
          <img :src="img.fields.file.url" :alt="img.fields.title" />
        </span>
      </template>
      <span v-else class="scrolling-marquee__repeating-text">
        {{ section.repeatingText }}
      </span>
    </MarqueeText>
  </div>
</template>

<script>
export default {
  components: {
    MarqueeText: () =>
      process.client
        ? import('vue-marquee-text-component')
        : Promise.resolve({ render: h => h('div') })
  },
  props: {
    section: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.scrolling-marquee {
  padding: 1.5rem 0;
  background: var(--bg);
  position: relative;
  color: var(--color);

  &__title {
    text-align: center;
    font-family: 'Bold';
    font-size: 12px;
    font-weight: 700;
    line-height: 14px;
    letter-spacing: 1.75px;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  &__image {
    padding: 0 2rem;

    img {
      height: 2rem;
    }
  }

  &__repeating-text {
    padding: 0 2rem;
    text-transform: uppercase;
    font-family: 'Bold';
    font-size: 18px;
    font-style: italic;
    line-height: 24px;
    letter-spacing: 2.5px;
    text-align: center;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    display: block;
    height: 100%;
    min-width: 40px;
    width: 15%;
    top: 0;
    z-index: 1;
    background: var(--bg);
  }

  &:before {
    left: 0;
    mask-image: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0, rgba(0, 0, 0, 1)),
      color-stop(1, rgba(0, 0, 0, 0))
    );
  }

  &:after {
    right: 0;
    mask-image: -webkit-gradient(
      linear,
      right top,
      left top,
      color-stop(0, rgba(0, 0, 0, 1)),
      color-stop(1, rgba(0, 0, 0, 0))
    );
  }
}
</style>
