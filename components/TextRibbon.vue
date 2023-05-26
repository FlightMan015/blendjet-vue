<template>
  <div
    class="text-ribbon"
    :id="section.anchor || null"
    :style="{
      '--bgcolor': section.backgroundColor,
      '--left-bg': `url(${leftBg})`,
      '--right-bg': `url(${rightBg})`,
      '--color': section.textColor,
      '--align': section.textAlign,
      '--height': `${section.height || 250}px`,
      '--content-max-width': section.contentMaxWidth ? `${section.contentMaxWidth}px` : 'none'
    }"
  >
    <div class="text-ribbon__content">
      <div class="text-ribbon__content-inner">
        <h2 class="text-ribbon__title">
          {{ section.title }}
        </h2>
        <div class="text-ribbon__description">
          <RichTextRenderer :document="section.description" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import imageOptimize from '~/mixins/imageOptimize'

export default {
  mixins: [imageOptimize],
  components: { RichTextRenderer },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  computed: {
    leftBg() {
      return this.optimizeSource({
        url: this.section.leftBackgroundImage?.fields.file.url ?? ''
      })
    },
    rightBg() {
      return this.optimizeSource({
        url: this.section.rightBackgroundImage?.fields.file.url ?? ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-ribbon {
  background: var(--bgcolor);
  background-size: cover;
  background-position: top center;
  scroll-padding: 100px;

  &__content {
    color: var(--color);
    background: var(--left-bg), var(--right-bg);
    background-position: 2rem bottom, calc(100% - 2rem) bottom;
    background-repeat: no-repeat;
    display: grid;
    place-content: center var(--align);
    text-align: var(--align);
    padding: 2rem;
    max-width: calc(1400px + 4rem);
    width: 100%;
    margin: 0 auto;
    min-height: var(--height);

    @include respond-to('small') {
      background: none;
    }
  }

  &__content-inner {
    max-width: var(--content-max-width);
  }

  &__title {
    font-family: 'Bold';
    font-size: 28px;
    line-height: 32px;
    letter-spacing: 3.5px;
    margin-bottom: 1rem;
  }

  &__description {
    font-family: 'Regular';
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
