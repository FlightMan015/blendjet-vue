<!-- STICKY SELECTOR - Appears on scroll, renders the variant selectors  -->
<template>
  <div class="sticky-product-select" v-if="product && currentVariant">
    <!-- INFO - Thumbnail image, title, price (Desktop Only)-->
    <div class="sticky-product-select__info-container">
      <div class="header-product-select__thumbnail">
        <img
          v-if="!currentVariant.withVarietyPack"
          class="header-product-select__thumbnail__img"
          :src="optimizeSource({ url: variantImage, width: 80 })"
        />
        <template v-else v-for="(item, index) in variants">
          <img
            :key="index"
            v-show="index === imageIndex"
            class="header-product-select__thumbnail__img"
            :src="optimizeSource({ url: item.featuredMedia.thumbnailSrc, width: 80 })"
          />
        </template>
      </div>
      <div class="sticky-product-select__title-container">
        <div class="sticky-product-select__title-container__title">
          {{ product.title }}
        </div>
        <div class="sticky-product-select__title-container__price">
          <ProductPrice
            v-if="currentVariant"
            :price="isSubscriptionOn ? subscriptionPrice : currentVariant.price"
            :variantId="currentVariant.id"
            :product="product"
            :isVarietyPack="currentVariant.sku === 'variety-pack'"
            :isSubscriptionOn="isSubscriptionOn"
          />
          <ProductPrice
            v-if="
              currentVariant.compareAtPrice &&
                currentVariant.compareAtPrice !== currentVariant.price &&
                currentVariant.compareAtPrice !== currentVariant.displayPrice
            "
            :price="currentVariant.compareAtPrice"
            :strikethrough="true"
            :variantId="currentVariant.id"
          />
        </div>
      </div>
    </div>

    <div class="sticky-product-select__controls-container custom-row">
      <!--
        Variant selector dropdown
        ---
        Note:
        This is currently *only* rendered for products with
        exactly 1 variant option, due to spacing issues
      -->
      <div
        v-if="Array.isArray(allOptions) && allOptions.length == 1"
        class="sticky-product-select__variant-select custom-col"
      >
        <ProductVariantsDropdown
          v-if="hasVariants"
          :variants="variants || product.variants"
          :currentVariant="currentVariant"
          @update="updateVariant"
          :direction="$mq === 'sm' ? 'up' : 'down'"
          :styleObj="{ width: $mq === 'sm' ? '100%' : '250px' }"
        />
      </div>

      <div class="sticky-product-select__add-to-cart custom-col">
        <QuantitySelector :quantity="quantity" v-on:update:quantity="updateQuantity" />

        <SubscriptionAddToCartButton
          class="add-to-cart"
          :product="product"
          :variant="currentVariant"
          :metafields="product.metafields"
          :all-options-selected="true"
          :only-one-option="true"
          :quantity="quantity"
          :showPrice="true"
          :isSubscriptionOn="isSubscriptionOn"
          :style="{ flexGrow: $mq === 'sm' ? '1' : 'unset' }"
          :styleObj="{ width: $mq === 'sm' ? '100%' : 'auto' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'

// Components
import ProductPrice from '~/components/nacelle/ProductPrice'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
// import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
import ProductVariantsDropdown from '~/components/ProductVariantsDropdown'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'

// Mixins
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'
import rechargeMixin from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'

export default {
  props: {
    product: {
      type: Object,
      default: null
    },
    currentVariant: {
      type: Object,
      default: null
    },
    updateVariant: {
      type: Function,
      default: f => f
    },
    quantity: {
      type: Number,
      default: 1
    },
    optionsQty: {
      type: Number,
      default: 3
    },
    thresholdMobile: {
      type: Number,
      default: 900
    },
    thresholdDesktop: {
      type: Number,
      default: 300
    },
    isSubscriptionOn: { type: Boolean, default: true },
    variants: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      isDesktop: false,
      isVisible: false,
      variantSelectMenuIsOpen: false,
      imageIndex: 0,
      imageInterval: null
    }
  },
  components: {
    // ProductAddToCartButton,
    ProductPrice,
    ProductVariantsDropdown,
    QuantitySelector,
    SubscriptionAddToCartButton
  },
  mixins: [imageOptimize, availableOptions, allOptionsSelected, rechargeMixin, productMetafields],
  computed: {
    variantImage() {
      return this.currentVariant?.featuredMedia?.thumbnailSrc
    },
    hasVariants() {
      return (
        this.product && Array.isArray(this.product.variants) && this.product.variants.length > 1
      )
    },
    /**
     * Get the subscription price for the current variant.
     */
    subscriptionPrice() {
      if (!this.currentVariant) {
        return undefined
      }
      const decodedId = this.decodeBase64VariantId(this.currentVariant.id)
      let variantSubscriptionPrice = 0
      if (this.currentVariant.sku === 'variety-pack') {
        variantSubscriptionPrice = 0
        this?.product?.variants?.length &&
          this.product.variants.forEach(v => {
            if (v.availableForSale) {
              const id = this.decodeBase64VariantId(v.id)
              if (this.discountVariantMap[id]) {
                variantSubscriptionPrice += Number(
                  this.discountVariantMap[id].discount_variant_price
                )
              }
            }
          })
      }

      if (this.currentVariant.sku !== 'variety-pack') {
        variantSubscriptionPrice =
          decodedId &&
          this.isSubscriptionOn &&
          this.discountVariantMap &&
          this.discountVariantMap[decodedId]
        return variantSubscriptionPrice && variantSubscriptionPrice.discount_variant_price
          ? variantSubscriptionPrice.discount_variant_price
          : this.currentVariant.price
      } else {
        return variantSubscriptionPrice || this.currentVariant.price
      }
    }
  },
  mounted() {
    this.setImageInterval()
    const stickyBar = document.querySelector('.sticky-product-select')
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          stickyBar.classList.add('sticky-product-select--shown')
        } else {
          stickyBar.classList.remove('sticky-product-select--shown')
        }
      },
      {
        rootMargin: `${this.$mq !== 'sm' ? this.thresholdDesktop : this.thresholdMobile}px`
      }
    )

    this.observer.observe(document.querySelector('.product__scroll-pin'))
  },
  onBeforeDestroy() {
    clearInterval(this.imageInterval)
    this.observer.disconnect()
  },
  watch: {
    variants() {
      this.setImageInterval()
    }
  },
  methods: {
    setImageInterval() {
      this.imageIndex = 0
      clearInterval(this.imageInterval)
      this.imageInterval = setInterval(() => {
        this.imageIndex++
        this.imageIndex = this.imageIndex % this.variants.length
        if (this.imageIndex === 0) {
          this.imageIndex++
        }
      }, 1000)
    },
    updateQuantity(qty) {
      this.$emit('update:quantity', qty)
    },
    decodeBase64VariantId(encodedId) {
      // This is wrapped in a try/catch because in some instances it's attempted to be run during
      // the nuxt build (somehow in advance of the browser), therefore the `window.atob` method
      // doesn't exist yet.
      let decodedId
      try {
        decodedId = atob(encodedId).split('gid://shopify/ProductVariant/')[1]
      } catch (e) {
        // console.warn(`Error decoding variant ID "${encodedId}"`)
      }
      return decodedId
    }
  }
}
</script>

<style lang="scss" scoped>
.sticky-product-select {
  background-color: $grayscale-white;
  display: flex;
  position: fixed;
  width: 100%;
  top: 100px;
  z-index: 12;
  padding: 1rem 45px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &--shown {
    opacity: 1;
    pointer-events: all;
  }

  @media (max-width: 768px) {
    top: unset;
    bottom: 0px;
  }

  @media (max-width: 400px) {
    padding-left: 15px;
    padding-right: 15px;
  }

  &__info-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 40%;
    padding-right: 2rem;
    flex-wrap: none;

    @media (max-width: 768px) {
      display: none;
    }

    .header-product-select__thumbnail {
      max-width: 75px;
    }
  }

  &__controls-container {
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    width: auto;

    @media (max-width: 768px) {
      flex-wrap: wrap;
    }
  }

  .add-to-cart {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .custom-row {
    display: flex;
    margin-left: -15px;
    margin-right: -15px;
  }

  .custom-col {
    padding-left: 15px;
    padding-right: 15px;

    @media (max-width: 768px) {
      flex-basis: 100%;
      + .custom-col {
        margin-top: 15px;
      }
    }
  }

  &__variant-select {
    @media (max-width: 768px) {
      flex: 1;
      flex-basis: 100%;
    }
  }

  &__add-to-cart {
    display: flex;

    > * + * {
      margin-left: 1rem;
    }
  }

  &__title-container {
    &__title {
      font-family: Medium;
      line-height: 1.33;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: $primary-purple;
      margin-bottom: 0.5rem;
    }

    &__price {
      font-size: $text-small;
      font-family: Bold;
      line-height: 1.17;
      letter-spacing: 1.75px;
      color: $primary-purple;
    }
  }
}
</style>
