<template>
  <div class="product columns" v-if="product">
    <div class="column is-6 image-column">
      <!-- <product-media-select-view
        v-if="product && product.featuredMedia && product.media"
        :featuredMedia="product.featuredMedia"
        :media="product.media"
      /> -->
      <!-- <picture>
        <source :srcset="optimizeSource({url:product.featuredMedia.src})" />
      </picture> -->
      <div class="image-container">
        <img class="product-image" v-if="product.featuredMedia" :src="optimizeSource({url:product.featuredMedia.src})" />
        <picture v-else>
          <source srcset="https://nacelle-assets.s3-us-west-2.amazonaws.com/default-product-image.svg" type="image/webp"> 
          <source srcset="https://nacelle-assets.s3-us-west-2.amazonaws.com/default-product-image.svg" type="image/jpeg"> 
          <img src="https://nacelle-assets.s3-us-west-2.amazonaws.com/default-product-image.svg" alt="Featured Product Image" class="" style="--fade-in-time:0.3s;">
        </picture>
      </div>
      
    </div>
    <div class="column product-controls is-5 is-offset-1">
      <product-title :title="product.title" class="product-title"/>
      <product-add-to-cart-button
        :product="product"
        :variant="currentVariant"
        :allOptionsSelected="true"
        :onlyOneOption="true"
        :metafields="[{key:'test', value:'hi'}]"
      />
      <product-category v-if="product.productType" :category="product.productType" />
      <!-- <p class="price">
        <product-price v-if="currentVariant" :price="displayPrice" />
      </p> -->
      <product-variant-select
        v-if="currentVariant"
        :product="product"
        :variant="currentVariant"
        v-on:variant-selected="onVariantSelected"
      />
      <div class="product-description" v-html="product.description" v-if="product.description">
        <!-- {{product.description.replace(/(<([^>]+)>)/gi, "")}} -->
      </div>
      <!-- <product-description :description="product.description" /> -->
      <!-- <product-variant-select
        v-if="currentVariant"
        :product="product"
        :variant="currentVariant"
        v-on:variant-selected="onVariantSelected"
      /> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ProductCategory from '~/components/nacelle/ProductCategory'
import ProductMediaSelectView from '~/components/nacelle/ProductMediaSelectView'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
import ProductDescription from '~/components/nacelle/ProductDescription'
import ProductVariantSelect from '~/components/nacelle/ProductVariantSelect'
import getDisplayPriceForCurrency from '~/mixins/getDisplayPriceForCurrency'
import imageOptimize from '~/mixins/imageOptimize'
// import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'

export default {
  components: {
    ProductCategory,
    ProductMediaSelectView,
    ProductTitle,
    ProductPrice,
    ProductDescription,
    ProductVariantSelect,
    // ProductAddToCartButton,
    
  },
  mixins: [getDisplayPriceForCurrency, imageOptimize],
  data() {
    return {
      selectedVariant: undefined
    }
  },
  props: {
    product: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('user', ['locale']),
    displayPrice() {
      return this.getPriceForCurrency({
        product: this.product,
        fallbackPrice: this.currentVariant.price
      })
    },
    currentVariant() {
      if (this.selectedVariant) {
        return this.selectedVariant
      } else if (
        this.product &&
        this.product.variants &&
        this.product.variants.length
      ) {
        return this.product.variants[0]
      }

      return undefined
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    onVariantSelected({ selectedVariant }) {
      this.selectedVariant = selectedVariant
    }
  }
}
</script>

<style lang="scss" scoped>

.product {
  min-height: 650px;
  // @include gradient-primary-light-purple('to bottom')
}

.product-controls {

  // padding-top: 150px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: center;
}
.price {
  margin-bottom: 1rem;
}

.image-column {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.product-title {
  font-family: Medium;
  font-size: 28px;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: $primary-purple;
}

.product-image {
  height: 550px;
  width: auto;
  object-fit: contain;
  object-position: center;

  @include respond-to('small') {
    height: 320px;
  }
}
.product-description {
  margin-top: 35px;
  font-family: Regular;
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 1.13;
  color: $grayscale-gray;
  max-width: 425px;
}
</style>
