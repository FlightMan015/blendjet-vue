<template>
  <div class="blendjet-demo">
    <div class="blendjet-demo__title-block">
      <h1 class="blendjet-demo__title-block__title">
        Introducing BlendJet 2 <br />
        <span style="font-size:55%">Next-Gen Portable Blender</span>
      </h1>
      <div class="mobile-demo">
        <picture>
          <img :src="demo" class="mobile-demo__image" alt="BlendJet 2 in Black Color" />
        </picture>
      </div>
      <div class="blendjet-demo__title-block__subtitle">
        The BlendJet 2 portable blender delivers game-changing technology that lets you make fresh
        smoothies, shakes, or mixed drinks wherever you go.
      </div>
      <div class="blendjet-demo__mobile-value-props" v-if="screenWidth < 768">
        <BlendjetFeatures />
      </div>
    </div>
    <div class="blendjet-demo__display">
      <!-- placeholder for future animation -->
      <div class="blendjet-demo__display__animation">
        <img
          class="blendjet-demo__display__animation__img"
          :src="demo"
          alt="BlendJet 2 in Black Color"
        />
      </div>
      <div class="blendjet-demo__display__value-props">
        <BlendjetFeatures />
      </div>
    </div>
    <div style="{height:300px}" v-if="screenWidth < 768"></div>
    <div class="blendjet-demo__buy-now">
      <a href="/products/blendjet-2">
        <button role="button" class="blendjet-demo__buy-now__button">
          Get yours now
        </button>
      </a>
    </div>
  </div>
</template>

<script>
// import BlendJetPDPModal from '~/components/blendJetPDPModal'
// import imageOptimize from '~/mixins/imageOptimize'
import BlendjetFeatures from '~/components/blendjetFeatures'

// components/blendJetPDPModal.vue
export default {
  props: {
    demo: {
      type: String
    }
  },
  data() {
    return {
      blnData: {
        empty: true
      },
      modalWidth: '60%',
      screenWidth: null
    }
  },
  methods: {
    handleBuyNow() {
      // this.$modal.show(BlendJetPDPModal, {productData: this.blnData}, {height: 'auto', width: this.modalWidth, scrollable: false, adaptive: true})
    }
  },
  async mounted() {
    this.screenWidth = window.innerWidth
    this.modalWidth = this.screenWidth > 768 ? '60%' : '100%'
    this.blnData = await this.$nacelle.data.product({ handle: 'blendjet-2' })
  },
  components: {
    // BlendJetPDPModal,
    BlendjetFeatures
  }
}
</script>

<style lang="scss" scoped>
.blendjet-demo {
  @include gradient-primary-purple-turquoise(to bottom);
  height: 950px;
  padding-top: 65px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  @include respond-to('small') {
    height: auto;
    padding-bottom: 50px;
  }

  // &__mobile-value-props {
  //   @media
  // }

  &__title-block {
    display: flex;
    align-items: center;
    flex-flow: column nowrap;
    color: $grayscale-white;
    width: 570px;
    margin-bottom: 80px;

    @include respond-to('small') {
      width: auto;
      padding-right: 45px;
      padding-left: 45px;
      margin-bottom: 35px;
    }

    &__title {
      line-height: 32px;
      letter-spacing: 3.5px;
      font-size: 28px;
      font-weight: 500;
      text-transform: uppercase;
      font-family: Medium;
      text-align: center;
      margin-bottom: 20px;

      @include respond-to('small') {
        font-size: 24px;
      }
      // @media screen and (max-width: 768px) {
      //   font-size: 24px;
      // }
    }

    &__subtitle {
      font-family: Regular;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: 0.5px;
      text-align: center;
      width: 420px;

      @media screen and (max-width: 768px) {
        margin-bottom: 20px;
        width: auto;
      }
    }
  }

  &__display {
    display: flex;
    flex-flow: row wrap;
    margin-bottom: 50px;
    @include respond-to('small') {
      display: none;
    }

    &__animation {
      margin-right: 75px;
      // margin-top: 130px;

      @include respond-to('small') {
        margin-right: 0;
        margin-top: 30px;
      }
      &__img {
        height: 500px;
        width: auto;

        @include respond-to('small') {
          height: 375px;
        }
      }
    }

    &__value-props {
      display: flex;
      flex-flow: column;
      justify-content: center;
      padding-top: 25px;
      max-width: 390px;
      @include respond-to('small') {
        max-width: none;
      }

      & img {
        margin-bottom: 2.5rem;
      }
    }
  }

  &__buy-now {
    &__button {
      @include button-primary('white');
      width: 300px;
    }
  }
}

.mobile-demo {
  margin-top: 20px;
  margin-bottom: 25px;

  @media screen and (min-width: 768px) {
    display: none;
  }
}
</style>
