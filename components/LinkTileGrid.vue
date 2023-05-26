<template>
  <div
    class="link-tile-grid"
    :style="{
      '--color': section.textColor,
      '--bgcolor': section.backgroundColor || '#fff'
    }"
  >
    <div class="link-tile-grid__container">
      <h2 class="link-tile-grid__title">{{ section.title }}</h2>
      <div class="link-tile-grid__carousel" v-cloak>
        <div
          class="link-tile-grid__arrow link-tile-grid__arrow--left"
          @click="prev"
          v-if="$mq === 'sm'"
        >
          <Chevron :color="section.textColor" :size="24" />
        </div>
        <b-carousel-list
          v-model="carouselIndex"
          :data="tiles"
          :style="{ boxShadow: 'none' }"
          :items-to-show="itemsToShow"
          :animated="'fade'"
          :progress="false"
          :arrow="false"
          :arrow-hover="false"
          :repeat="true"
        >
          <template slot="item" slot-scope="props">
            <LinkTile :fields="props.fields" />
          </template>
        </b-carousel-list>
        <div
          class="link-tile-grid__arrow link-tile-grid__arrow--right"
          @click="next"
          v-if="$mq === 'sm'"
        >
          <Chevron :color="section.textColor" direction="right" :size="24" />
        </div>
      </div>
      <CarouselNav
        v-if="itemsToShow < tiles.length && $mq !== 'sm'"
        :color="section.textColor"
        :prev="prev"
        :next="next"
        :progress="progress"
      />
      <div class="link-tile-grid__button" v-if="section.ctaUrl && section.ctaLabel">
        <CTAButton :to="section.ctaUrl" :color="section.textColor" :ctaStyle="section.ctaStyle">
          {{ section.ctaLabel }}
        </CTAButton>
      </div>
    </div>
  </div>
</template>

<script>
import LinkTile from '~/components/LinkTile'
import CarouselNav from '~/components/CarouselNav'
import CTAButton from '~/components/nacelle/CtaButton'
import Chevron from '~/components/svg/Chevron'

// Mixins
import locationBasedRendering from '~/mixins/locationBasedRendering'

export default {
  components: {
    LinkTile,
    CarouselNav,
    CTAButton,
    Chevron
  },
  mixins: [locationBasedRendering],
  data() {
    return { carouselIndex: 0 }
  },
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  computed: {
    tiles() {
      // Parse out the tiles that should render for the user's country.
      return this.section.tiles.filter(t => this.isVisibleToUserCountry(t))
    },
    itemsToShow() {
      if (this.$mq === 'sm') return 1
      if (this.$mq === 'md') return 2
      return this.section.visibleTiles
    },
    progress() {
      return (this.carouselIndex + this.itemsToShow) / this.tiles.length
    }
  },
  methods: {
    prev() {
      this.carouselIndex > 0 ? this.carouselIndex-- : (this.carouselIndex = 0)
    },
    next() {
      this.carouselIndex < this.tiles.length ? this.carouselIndex++ : (this.carouselIndex = 0)
    }
  }
}
</script>

<style lang="scss" scoped>
[v-cloak],
[v-cloak] > * {
  display: none;
}
.link-tile-grid {
  background: var(--bgcolor);

  &__container {
    padding: 5rem 2rem;
    max-width: calc(1400px + 4rem);
    width: 100%;
    margin: 0 auto;
    min-height: var(--height);
    color: var(--color);
  }

  &__title {
    font-family: 'Bold';
    text-transform: uppercase;
    font-size: 24px;
    line-height: 22px;
    letter-spacing: 3px;
    text-align: center;
  }

  &__carousel {
    margin: 5rem 0;
    position: relative;
  }

  &__arrow {
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 50px;
    top: 0;
    cursor: pointer;

    &--left {
      left: -1.5rem;
    }

    &--right {
      right: -1.5rem;
    }
  }

  &__button {
    margin: 5rem 0 0;
    display: flex;
    justify-content: center;
  }

  .carousel-arrow .icon {
    color: var(--color);
    border-color: currentColor;
  }
}
</style>
