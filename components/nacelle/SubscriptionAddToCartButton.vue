<template>
  <div>
    <button
      v-if="isProductVariantSelectChild"
      :disabled="disableAtcButton"
      :style="styleObj"
      class="add-to-cart-button button nacelle"
      @click="addToCart"
    >
      <span v-if="!variantInLineItems && !allOptionsSelected && product.availableForSale">
        Select Options
      </span>
      <span
        v-else-if="
          (!variantInLineItems && allOptionsSelected && variant == undefined) ||
            (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
            !product.availableForSale
        "
      >
        Out of Stock
      </span>
      <span
        v-else-if="
          !variantInLineItems && allOptionsSelected && variant && variant.availableForSale == true
        "
      >
        Add to Cart
      </span>
      <span v-if="variantInLineItems">Added!</span>
    </button>
    <button
      class="add-to-cart-button"
      :style="styleObj"
      @click="addToCart"
      v-else
      :disabled="disableAtcButton"
      :class="buttonClass"
    >
      <slot>
        <span v-if="!onlyOneOption && product.availableForSale">
          Select Options
        </span>
        <span class="inner-text" v-else-if="subPrice && product.availableForSale">
          {{ buttonText }}
        </span>
        <span
          v-else-if="
            (!variantInLineItems && allOptionsSelected && variant == undefined) ||
              (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
              !product.availableForSale
          "
        >
          Out of Stock
        </span>
      </slot>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import productMetafields from '~/mixins/productMetafields'
import rechargeMixin from '~/mixins/rechargeMixin'
import Axios from 'axios'
// import ProductPrice from '~/components/nacelle/Pric'

export default {
  mixins: [productMetafields, rechargeMixin],
  props: {
    product: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bundle: {
      type: Array,
      default: () => []
    },
    variant: {
      type: Object,
      default: () => {
        return {}
      }
    },
    variants: {
      type: Array,
      default: () => []
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    },
    showPrice: {
      type: Boolean,
      default: false
    },
    styleObj: {
      type: Object,
      default: () => {}
    },
    isSubscriptionOn: { type: Boolean, default: true },
    quantity: { type: Number, default: 1 },
    allOptionsSelected: { type: Boolean, default: false },
    confirmedSelection: { type: Boolean, default: false },
    onlyOneOption: { type: Boolean, default: false },
    bundles: {
      type: Array,
      default: () => []
    },
    bundleVarietyPack: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      subPrice: 0,
      defaultText: `Add to Cart - ${this.displayPrice}`,
      buttonText: `Add to Cart - ${this.displayPrice}`,
      buttonClass: '',
      priceSaved: {},
      allVariants: this.variants.length ? this.variants : this.product.variants
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),
    ...mapGetters('cart', ['checkoutLineItems']),
    variantInLineItems() {
      const vm = this
      if (vm.variant != null) {
        const lineItem = vm.lineItems.findIndex(lineItem => {
          return lineItem.variant.id === vm.variant.id
        })
        if (lineItem !== -1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isProductVariantSelectChild() {
      return this.$parent.$options._componentTag === 'product-variant-select'
    },
    disableAtcButton() {
      return (
        !this.allOptionsSelected ||
        this.variant === undefined ||
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          this.variant.availableForSale !== true)
      )
    },
    /**
     * Get the subscription price for the current variant.
     */
    subscriptionPrice() {
      if (!this.variant) {
        return undefined
      }
      const decodedId = this.decodeBase64VariantId(this.variant.id)
      let variantSubscriptionPrice =
        decodedId &&
        this.hasSubscription &&
        this.discountVariantMap &&
        this.discountVariantMap[decodedId]

      if (this.variant.sku === 'variety-pack') {
        variantSubscriptionPrice = 0
        this.allVariants.forEach(v => {
          if (v.availableForSale) {
            const id = this.decodeBase64VariantId(v.id)
            if (this.discountVariantMap[id]) {
              variantSubscriptionPrice += Number(this.discountVariantMap[id].discount_variant_price)
            }
          }
        })
      }
      if (this.variant.sku !== 'variety-pack') {
        return variantSubscriptionPrice && variantSubscriptionPrice.discount_variant_price
          ? variantSubscriptionPrice.discount_variant_price
          : this.variant.price
      } else {
        return variantSubscriptionPrice || this.variant.price
      }
    }
  },
  watch: {
    confirmedSelection() {
      this.addToCart()
    },
    variant(newValue, oldValue) {
      if (newValue.id && newValue.id !== oldValue.id) {
        this.getDisplayPrice()
      }
    },
    variants() {
      this.allVariants = this.variants.length ? this.variants : this.product.variants
    },
    subscriptionPrice(newValue, oldValue) {
      this.getDisplayPrice()
    },
    isSubscriptionOn(newValue, oldValue) {
      this.getDisplayPrice()
    },
    quantity(newValue, oldValue) {
      this.getDisplayPrice()
    }
  },
  mounted() {
    this.getDisplayPrice()
  },
  methods: {
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem',
      'getLineItems'
    ]),
    ...mapMutations('cart', ['showCart']),

    getConfigURL(price) {
      let config = null
      if (document.cookie.includes('_rchcur')) {
        config = {
          method: 'get',
          url:
            'https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=' +
            document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
            `&MerchantPrices=${price}`
        }
      } else {
        config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`
        }
      }
      return config
    },
    getSubscriptionPrice(variant) {
      if (!variant) {
        return undefined
      }
      const decodedId = this.decodeBase64VariantId(variant.id)
      const variantSubscriptionPrice =
        decodedId &&
        this.hasSubscription &&
        this.discountVariantMap &&
        this.discountVariantMap[decodedId]

      if (variant.sku !== 'variety-pack') {
        return variantSubscriptionPrice && variantSubscriptionPrice.discount_variant_price
          ? variantSubscriptionPrice.discount_variant_price
          : variant.price
      } else {
        return variantSubscriptionPrice || variant.price
      }
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
    },

    async getVarietyPackDisplayPrice() {
      if (!this.product.availableForSale) {
        return
      }
      let currency = '$'
      let currencyPosition = 'left'
      let fetchedPrice = false
      let totalPrice = 0
      for (let i = 0; i < this.allVariants.length; i++) {
        const variant = this.allVariants[i]
        if (variant.availableForSale && variant.sku !== 'variety-pack') {
          const _vprice =
            this.hasSubscription && this.isSubscriptionOn && this.getSubscriptionPrice(variant)
              ? this.getSubscriptionPrice(variant)
              : variant.price
          const price = encodeURIComponent(
            JSON.stringify([
              {
                Price: _vprice,
                Tag: this.decodeBase64VariantId(variant.id)
              }
            ])
          )
          const config = this.getConfigURL(price)
          let response = {}
          let foundPrice = false
          if (this.priceSaved[_vprice]) {
            response = this.priceSaved[_vprice]
            foundPrice = true
          } else {
            await Axios(config)
              .then(res => {
                foundPrice = true
                response = res
                this.priceSaved[_vprice] = res
              })
              .catch(res => {
                console.error('Currency Request Failed', res)
                totalPrice += Number(variant.price) * this.quantity
              })
          }
          if (foundPrice) {
            if (!response.data.ConsumerPrices[0]) {
              currency = response.data.Symbol
              totalPrice += Number(_vprice) * this.quantity
            } else {
              if (response.data.Symbol == null) {
                currency = response.data.Currency
                currencyPosition = 'right'
                totalPrice += Number(response.data.ConsumerPrices[0]) * this.quantity
              } else {
                currency = response.data.Symbol
                totalPrice += Number(response.data.ConsumerPrices[0]) * this.quantity
              }
            }
          }
          fetchedPrice = true
        }
      }

      if (fetchedPrice) {
        if (currencyPosition === 'left') {
          this.subPrice = currency + Number(totalPrice).toFixed(2)
          this.defaultText = `Add to Cart - ${this.subPrice}`
          this.buttonText = `Add to Cart - ${this.subPrice}`
        } else {
          this.subPrice = totalPrice + currency
          this.defaultText = `Add to Cart - ${this.subPrice}`
          this.buttonText = `Add to Cart - ${this.subPrice}`
        }
      }
    },
    async getDisplayPrice() {
      // Bail if no variant is specified
      if (!this.variant || !this.variant.id) return undefined

      if (this.variant.sku === 'variety-pack') {
        this.getVarietyPackDisplayPrice()
        return
      }
      const _vprice =
        this.hasSubscription && this.isSubscriptionOn && this.subscriptionPrice
          ? this.subscriptionPrice
          : this.variant.price

      const vm = this

      const price = encodeURIComponent(
        JSON.stringify([
          {
            Price: _vprice,
            Tag: this.decodeBase64VariantId(this.variant.id)
          }
        ])
      )
      // START OF RYAN MOD to override currency
      // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      // in getConfigURL() function

      const config = this.getConfigURL(price)
      let response = {}
      let foundPrice = false
      if (this.priceSaved[_vprice]) {
        response = this.priceSaved[_vprice]
        foundPrice = true
      } else {
        await Axios(config)
          .then(res => {
            foundPrice = true
            response = res
            this.priceSaved[_vprice] = res
          })
          .catch(res => {
            console.error('Currency Request Failed', res)
            this.subPrice = `$${Number(this.variant.price) * this.quantity}`
          })
      }
      if (foundPrice) {
        if (!response.data.ConsumerPrices[0]) {
          vm.subPrice = `${response.data.Symbol}${(Number(_vprice) * this.quantity).toFixed(2)}`
        } else {
          if (response.data.Symbol == null) {
            vm.subPrice = `${(Number(response.data.ConsumerPrices[0]) * vm.quantity).toFixed(2)} ${
              response.data.Currency
            }`
          } else {
            vm.subPrice = `${response.data.Symbol}${(
              Number(response.data.ConsumerPrices[0]) * vm.quantity
            ).toFixed(2)}`
          }
        }
      }
      this.defaultText = `Add to Cart - ${vm.subPrice}`
      this.buttonText = `Add to Cart - ${vm.subPrice}`
    },
    setButtonText() {
      if (
        this.onlyOneOption &&
        !this.variantInLineItems &&
        this.variant.availableForSale === true
      ) {
        this.butttonText = this.defaultText
      } else if (this.onlyOneOption && this.variantInLineItems) {
        this.buttonText = 'Added!'
        this.buttonClass = 'clicked'
        setTimeout(() => {
          this.buttonText = this.defaultText
          this.buttonClass = 'unclicked'
        }, 2000)
      }
    },
    encodeBase64VariantId(decodedId) {
      return btoa(`gid://shopify/ProductVariant/${decodedId}`)
    },
    addToCart() {
      if (this.allOptionsSelected && this.product.availableForSale) {
        const subscribed = this.isSubscriptionOn && this.hasSubscription

        const rechargeFields = [
          {
            key: 'charge_interval_frequency',
            value: this.getMetafield('subscriptions', 'shipping_interval_frequency')
          },
          {
            key: 'order_interval_frequency',
            value: this.getMetafield('subscriptions', 'shipping_interval_frequency')
          },
          {
            key: 'order_interval_unit',
            value: 'day'
          }
        ]
        if (this.variant.sku === 'variety-pack') {
          this.allVariants &&
            this.allVariants.forEach(v => {
              if (v.availableForSale && v.sku !== 'variety-pack') {
                const lineItem = {
                  image: this.product.featuredMedia,
                  title: this.product.title,
                  variant: subscribed ? { ...v, price: this.getSubscriptionPrice(v) } : v,
                  quantity: this.quantity || 1,
                  productId: this.product.id,
                  handle: this.product.handle,
                  vendor: this.product.vendor,
                  tags: this.product.tags,
                  metafields: subscribed ? [...rechargeFields] : []
                }

                this.addLineItem(lineItem)
              }
            })
        } else {
          const lineItem = {
            image: this.product.featuredMedia,
            title: this.product.title,
            variant: subscribed ? { ...this.variant, price: this.subscriptionPrice } : this.variant,
            quantity: this.quantity || 1,
            productId: this.product.id,
            handle: this.product.handle,
            vendor: this.product.vendor,
            tags: this.product.tags,
            metafields: subscribed ? [...rechargeFields] : []
          }

          this.addLineItem(lineItem)
        }

        this.setButtonText()
        this.showCart()

        this.elevarAddToCart()
      }
    },
    getSource() {
      var location = window.location

      if (location.pathname.includes('products')) {
        return 'productpage'
      } else if (location.pathname.includes('marketplace')) {
        return 'marketplace'
      } else {
        return location.pathname
      }
    },
    createUUID() {
      var result = ''
      var length = 16
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
      return result
    },
    elevarAddToCart() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var variant = this.variant
      var referrer = document.referrer.includes('marketplace') ? document.referrer : ''
      var source = this.getSource()
      var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      var variantId = Buffer.from(variant.id, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      if (variant.sku !== 'variety-pack') {
        window.dataLayer.push({
          event: 'dl_add_to_cart',
          event_id: uuid,
          ecommerce: {
            currencyCode: this.product.priceRange.currencyCode,
            add: {
              actionField: { list: referrer },
              products: [
                {
                  name: this.product.title.replace("'", ''),
                  id: (variant && variant.sku) || '',
                  product_id: productId,
                  variant_id: (variant && variantId) || '',
                  image: this.product.featuredMedia.src,
                  price: variant.price,
                  brand: this.product.vendor.replace("'", ''),
                  variant: (variant && variant.title && variant.title.replace("'", '')) || '',
                  category: this.product.productType,
                  inventory: this.quantity,
                  list: referrer,
                  source: source
                }
              ]
            }
          }
        })
      } else {
        this.allVariants.forEach(v => {
          if (v.availableForSale && v.sku !== 'variety-pack') {
            variantId = Buffer.from(v.id, 'base64')
              .toString('binary')
              .split('/')
              .pop()
            window.dataLayer.push({
              event: 'dl_add_to_cart',
              event_id: uuid,
              ecommerce: {
                currencyCode: this.product.priceRange.currencyCode,
                add: {
                  actionField: { list: referrer },
                  products: [
                    {
                      name: this.product.title.replace("'", ''),
                      id: (v && v.sku) || '',
                      product_id: productId,
                      variant_id: (v && variantId) || '',
                      image: this.product.featuredMedia.src,
                      price: v.price,
                      brand: this.product.vendor.replace("'", ''),
                      variant: (v && v.title && v.title.replace("'", '')) || '',
                      category: this.product.productType,
                      inventory: this.quantity,
                      list: referrer,
                      source: source
                    }
                  ]
                }
              }
            })
          }
        })
      }
      // console.log('wdl_atc:', window.dataLayer)
    }
  }
}
</script>

<style scoped lang="scss">
.button {
  &:disabled {
    @include button-primary('purple');
    opacity: 0.5;
  }
}

.add-to-cart-button {
  @include button-primary('purple');

  &:hover {
    @include button-primary('purple');
  }
}

.clicked {
  @include hover-transition;
  width: 217.58px;
}
</style>
