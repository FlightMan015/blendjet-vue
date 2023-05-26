<template>
  <div>
    <!-- <hr class="item-divider"/> -->
    <div class="columns is-marginless is-mobile flyout-cart-item">
      <router-link
        :to="`${pathFragment}${item.handle}`"
        class="column is-3 product-image"
        :class="[item.vendor === 'Extend' ? 'disabled' : null]"
        @click.native="hideCart"
      >
        <product-image
          v-if="productThumbnail && productThumbnail.length > 0"
          :source="productThumbnail"
          :alt="item.title"
        />
      </router-link>

      <div class="product-details">
        <div class="product-row">
          <div class="product-title-container">
            <router-link
              :to="`${pathFragment}${item.handle}`"
              :class="[item.vendor === 'Extend' ? 'disabled' : null]"
              @click.native="hideCart"
            >
              <div class="product-details__title">
                {{ formatTitle(item.title) }}
              </div>
            </router-link>
          </div>

          <div class="product-details__price">
            <product-price
              class="flyout-item-price"
              :price="item.variant.price"
              :variantId="item.variant.id"
            />
          </div>
        </div>

        <div class="product-row">
          <div v-if="item.vendor !== 'Extend'" class="product-details__variant">
            {{ formatVariantTitle(variant.title) }}
          </div>
          <div v-else class="product-details__variant">{{ warrantyVariant(item) }}</div>
        </div>
        <div class="product-row">
          <div class="product-details__quanity">
            <quantity-selector
              :item="item"
              :quantity="item.quantity"
              :isCheckout="true"
              :styleObj="quanitySelectorStyle"
              @itemremoved="elevarRemoveFromCart"
            />
          </div>
        </div>
        <div class="product-row">
          <SubscriptionCartLineItemDetails :line-item="item">
            <template v-slot:default="{ subscription }">
              <div v-if="variant.discountPercentage" class="subscription-pill">
                {{ variant.discountPercentage }}% off w/ auto delivery
              </div>
               <div v-else class="subscription-pill">
                Auto delivery
              </div>
            </template>
          </SubscriptionCartLineItemDetails>
        </div>
      </div>
    </div>
    <!-- <hr class="item-divider"/> -->
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ProductImage from '~/components/nacelle/ProductImage'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
import ProductVariantTitle from '~/components/nacelle/ProductVariantTitle'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import CartFlyoutItemRemoveButton from '~/components/nacelle/CartFlyoutItemRemoveButton'
import SubscriptionCartLineItemDetails from '~/components/nacelle/SubscriptionCartLineItemDetails'
export default {
  components: {
    ProductImage,
    ProductTitle,
    ProductPrice,
    ProductVariantTitle,
    QuantitySelector,
    CartFlyoutItemRemoveButton,
    SubscriptionCartLineItemDetails
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    pathFragment: {
      type: String,
      default: '/products/'
    }
  },
  data() {
    return {
      quanitySelectorStyle: {
        height: '24px'
      },
      cartBalanceMessage: ''
    }
  },
  computed: {
    productThumbnail() {
      if (this.item && this.item.variant && this.item.variant.featuredMedia) {
        return this.item.variant.featuredMedia.thumbnailSrc
      }

      return ''
    },
    variant() {
      const defaultVariant = {
        id: '',
        title: '',
        price: 0
      }

      if (this.item && this.item.variant) {
        return {
          ...defaultVariant,
          ...this.item.variant
        }
      }
      return defaultVariant
    },
    ...mapState('cart', ['lineItems', 'cartVisible'])
  },
  methods: {
    ...mapMutations('cart', ['hideCart']),

    formatTitle(title) {
      if (title.includes('JetPack')) {
        return title.split('-')[0].trim()
      }
      if (title.includes('Book')) {
        return title.split('- Recipe Book')[0].trim()
      }
      if (title.includes('Extend')) {
        return 'Extend Protection Plan'
      }
      return title
    },
    jetpackVariant(variant) {},
    formatVariantTitle(title) {
      if (title === 'Default Title') {
        if (this.item.title.includes('50 EASY')) {
          return 'Recipe Book'
        } else {
          return ' '
        }
      }
      return title
    },
    warrantyVariant(item) {
      let variantId = btoa(`gid://shopify/ProductVariant/${item.metafields[0].value}`)
      let warrantyProduct = this.lineItems.filter(item => {
        return item.variant.id === variantId
      })
      try {
        return `${warrantyProduct[0].title} - ${warrantyProduct[0].variant.title}`
      } catch (e) {}
    },
    createUUID() {
        var result = ''
        var length = 16
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
        return result
    },
    async elevarRemoveFromCart() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var product  = await this.$nacelle.data.product({
        handle: this.item.handle
      })
      
      var variant = this.variant
      var referrer = document.referrer.includes('marketplace') ? document.referrer : '';
      var variantId = Buffer.from(variant.id, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      var productId = Buffer.from(product.pimSyncSourceProductId, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      window.dataLayer.push({
        "event": "dl_remove_from_cart",
        "event_id": uuid,
        "ecommerce": {
          "currencyCode": variant.priceCurrency,
          "remove": {
            "actionField": {'list': referrer}, 
            "products": [{
              "name": variant.title.replace("'", ''),
              "id": ((variant && variant.sku) || ""),
              "product_id": productId,
              "variant_id": ((variant && variantId) || ""),
              "image": this.item.image.src,
              "price": variant.price,
              "brand": this.item.vendor.replace("'", ''),
              "variant": (variant && variant.title && (variant.title.replace("'", '')) || ""),
              "category": 'NA',
              "quantity": [],
              "list": referrer 
            }]
          }
        }
      })
      // console.log('wdl_rfc:', window.dataLayer)
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.product-image {
  display: flex;
  align-items: center;
}
.product-title-container {
  width: 70%;
}

.product-row {
  // width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.disabled {
  pointer-events: none;
}

.item-divider {
  background-color: #343a40;
  width: 100%;
  display: block;
  height: 1px;
  opacity: 0.5;
}

.product-details {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  justify-content: flex-start;
  margin-top: 10px;
  margin-right: 10px;

  &__title {
    font-family: Bold;
    font-size: 14px;
    line-height: 1.57;
    letter-spacing: 0.5px;
    color: $primary-purple;
  }

  &__price {
    font-family: Bold;
    font-size: $text-small;
    line-height: 1.83;
    letter-spacing: 1.75px;
    color: $primary-purple;
    width: 30%;
    text-align: right;
  }

  &__variant {
    font-family: Regular;
    font-size: 14px;
    color: $grayscale-gray;
    letter-spacing: 0.5px;
  }
}

.subscription-pill {
  border-radius: 25px;
  color: $primary-purple;
  background-color: $secondary-purple-4;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: BoldItalic;
  font-size: 10px;
  letter-spacing: 1.5px;
  line-height: 1.4;
  padding: 5px 15px;
  text-transform: uppercase;
  width: 220px;
}
</style>
