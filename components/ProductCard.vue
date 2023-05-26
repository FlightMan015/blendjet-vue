<template>
  <div class="product-card" v-if="isShippableToUser">
    <nuxt-link :to="productUrl">
      <figure class="product-card__picture">
        <img
          @click="elevarProductClick(product, variant)"
          class="product-card__image"
          :src="optimizeSource({ url: featuredImage.src, width: 800 })"
          :alt="featuredImage.alt"
        />
      </figure>
    </nuxt-link>
    <div class="product-card__info">
      <div v-if="vendorLogo && vendorLogo.src" class="product-card__vendor">
        <img :src="optimizeSource({ url: vendorLogo.src, width: 200 })" :alt="vendorLogo.alt" />
      </div>
      <nuxt-link :to="`/products/${product.handle}`">
        <h3 class="product-card__title" @click="elevarProductClick(product, variant)">
          {{ product.title }}

          <span class="product-card__variant-title" v-if="!isRolledUp && variant && variant.title">
            {{ variant.title }}
          </span>
        </h3>
      </nuxt-link>
      <div v-if="!product.title.includes('Replacement')" class="product-card__rating">
        <loox-product-rating :product="product" />
      </div>
      <div class="product-card__subscription" v-if="!isRolledUp && hasSubscription">
        <SubscriptionToggle :value.sync="isSubscriptionActive" :product="product" />
      </div>
      <div class="product-card__buy">
        <nuxt-link :to="productUrl" class="product-card__browse" v-if="isRolledUp">
          View All
        </nuxt-link>
        <template v-else>
          <QuantitySelector :quantity.sync="quantity" />
          <SubscriptionAddToCartButton
            :product="product"
            :variant="variant || product.variants[0]"
            :is-subscription-on="isSubscriptionActive"
            :all-options-selected="true"
            :only-one-option="true"
            :quantity="quantity"
            :showPrice="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'

// Mixins
import imageOptimize from '~/mixins/imageOptimize'
import productMetafields from '~/mixins/productMetafields'
import rechargeMixin from '~/mixins/rechargeMixin'
import productShippingEligibility from '~/mixins/productShippingEligibility'

export default {
  components: {
    QuantitySelector,
    SubscriptionAddToCartButton,
    SubscriptionToggle
  },
  mixins: [imageOptimize, productMetafields, rechargeMixin, productShippingEligibility],
  props: {
    product: Object,
    variant: Object,
    isRolledUp: Boolean,
    variantBased: Boolean
  },
  data() {
    return {
      quantity: 1,
      isSubscriptionActive: false
    }
  },
  computed: {
    featuredImage() {
      // This may fail since some variants does not have an image in shopify
      // I will move this and prioritize the product image
      return this.variantBased
        ? this.variant?.featuredMedia || this.product?.featuredMedia
        : this.product?.featuredMedia || this.variant?.featuredMedia
    },
    productUrl() {
      if (this.product.handle.toLowerCase().includes('jetpack')) {
        return `/products/${this.product.handle}?variant=variety-pack`
      }
      const variantId = this.variant && this.decodeBase64VariantId(this.variant.id)
      return `/products/${this.product.handle}${variantId ? `?variant=${variantId}` : ''}`
    },
    vendorLogo() {
      const logo = JSON.parse(this.metafieldsObj.vendor_details?.logo_image ?? false)
      return logo?.[0] ?? null
    }
  },
  methods: {
    decodeBase64VariantId(encodedId) {
      const decodedId = atob(encodedId)
      return decodedId.split('gid://shopify/ProductVariant/')[1]
    },
    createUUID() {
      var result = ''
      var length = 16
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
      return result
    },
    elevarProductClick(product, variant) {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var idx = 'NA'
      var clickedProduct = {
        name: product.title.replace("'", ''),
        id: (variant && variant.sku) || '',
        product_id: product.id,
        variant_id: (variant && variant.id) || '',
        price: variant.price,
        brand: product.vendor.replace("'", ''),
        position: idx,
        category: product.productType,
        list: location.pathname
      }

      window.dataLayer.push({
        event: 'dl_select_item',
        event_id: uuid,
        ecommerce: {
          currencyCode: 'USD',
          click: {
            actionField: { list: location.pathname },
            products: clickedProduct
          }
        }
      })
      // console.log('wdl_collection-click:', window.dataLayer)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  padding: 0;

  &__picture {
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }

  &__image {
    height: 275px;
  }

  &__info {
    padding: 1.5rem;
    display: grid;
    grid-gap: 12px;

    @include respond-to('small') {
      padding: 1.15rem 0;
    }
  }

  &__title {
    text-align: center;
    color: #373795;
    font-size: 12px;
    font-family: Bold;
    line-height: 1.17;
    letter-spacing: 1.75px;
    text-transform: uppercase;
  }

  &__variant-title {
    display: block;
  }

  &__rating {
    display: flex;
    justify-content: center;
  }

  &__subscription {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
  }

  &__vendor {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  &__buy {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 1rem;
    place-content: center;
  }

  &__browse {
    @include button-primary('purple');

    &:hover {
      @include button-primary('purple');
    }
  }
}

.toggle-container,
.quantity-select {
  height: 40px;
}

@include respond-to('small') {
  .text-container__option {
    padding-top: 0;
  }
}
</style>
