<template>
  <div class="pdp-container" v-if="currentVariant">
    <div class="close-modal" aria-label="Close" @click="this.$modal.hideAll">
     <Close />
    </div>
    <div class="pdp-title">
      {{productData.title}}
    </div>
    <div class="pdp-prices">
      <product-price v-if="currentVariant" :price="currentVariant.price" /> 
          <product-price v-if="currentVariant.compareAtPrice && currentVariant.compareAtPrice !== currentVariant.price" 
              :price="currentVariant.compareAtPrice" :strikethrough="true" />
      
    </div>
    <div class="variant-image">
      <transition name="fade" mode="out-in">
        <picture>
          <source :srcset="optimizeSource({url: currentVariant.featuredMedia.src })" />
          <img v-if="currentVariant.featuredMedia.src" class="variant-image__img" :src="optimizeSource({url: currentVariant.featuredMedia.src })" />
        </picture>
      </transition>
    </div>
    <div class="variant-color">
      <span class="variant-color__color">Color: </span><span class="variant-color__label">{{currentVariant.title}}</span>
    </div>

    <div class="variant-swatches">
      <product-variant-select
        v-if="currentVariant"
        :product="productData"
        :variant="currentVariant"
        
        @variantSelected="updateVariant"
      />
    </div>
    <div class="shipping-notification">
      <ShippingTime />
    </div>
    <div class="learn-more">
      <nuxt-link to="/products/blendjet-one">Learn More </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ProductVariantSelect from '~/components/nacelle/ProductVariantSelect'

import ProductPrice from '~/components/nacelle/ProductPrice'

import allOptionsSelected from '~/mixins/allOptionsSelected'
import imageOptimize from '~/mixins/imageOptimize'
import ShippingTime from '~/components/shippingTime'

import Close from '~/components/svg/modalClose'


export default {
  data() {
    return {
      currentVariant: undefined,
      currency: '$',
      selectedOptions: [],
      shippingTime: 'saturday, October 23rd',
      shippingCountdown: '1 hr, 23 minutes',

    }
  },

  methods: {
     ...mapMutations('cart', ['showCart']),
    setDefaultVariant() {
      if (this.currentVariant) {
        return this.currentVariant
      } else if (
        this.productData &&
        this.productData.variants &&
        this.productData.variants.length
      ) {
        return this.productData.variants[0]
      }

      return undefined
    },
    updateVariant(variant) {
      this.currentVariant = variant
    },
    closeModal() {
      this.$emit('closeBlnModal')
    }
  },
  props: {
    productData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.currentVariant = this.setDefaultVariant();
  },
  mixins: [imageOptimize, allOptionsSelected],
  components: {
    ProductVariantSelect,
    Close,
    ShippingTime
  }
}

</script>

<style lang="scss" scoped>

div, span {
  text-transform: uppercase;
}

.pdp-title {
  font-size: 24px;
  text-align: center;
  margin-top: 1rem;
  line-height: 1.17;
  letter-spacing: 3.5px;
  text-align: center;
  font-family: Medium;
  color: $primary-purple;
}

.pdp-prices {
  display: flex;
  justify-content: center;
  font-family: Bold;
  line-height: 1.25;
  letter-spacing: 1.75px;
  text-align: center;
  color: $primary-purple;
  margin-bottom: 15px;
  
  & span {
    padding: 0.5rem 0.75rem;
  }

  &__compare {
    opacity: 0.7;
    text-decoration: line-through;
  }
}

.variant-color {
  display: flex;
  justify-content: center;
  font-size: $text-small;
  line-height: 1.33;
  letter-spacing: 1.75px;
  text-align: center;
  margin-bottom: 20px;

  &__color {
    color: $grayscale-gray;
  }

  &__label {
    color: $primary-purple;
  }
}


.variant-image {
  display: flex;
  justify-content: center;
  &__img {
    height: 340px;
    width: auto;

    @media screen and (max-width: 768px) {
      height: 300px;
    }
  }
}

.shipping-notification {
  font-family: Bold;
  letter-spacing: 1.75px;
  text-align: center;
  line-height: 1.33;
  font-size: $text-small;
  margin-bottom: 20px;
  margin-top: 20px;

  &__label {
    color: $primary-purple;
  }

  &__countdown {
    color: $secondary-purple-2;
  }
}

.learn-more {
  text-align: center;
  margin-bottom: 20px;
  & > a {
    color: $primary-purple;
    font-size: $text-small;
    line-height: 1.17;
    font-family: Bold;
    letter-spacing: 1.75px;
  }
}

.close-modal {
  text-align: right;
  margin-top: 5px;
  margin-right: 8px;
  font-size: 18px;
  font-family: Bold;
  cursor: pointer;
}



.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>