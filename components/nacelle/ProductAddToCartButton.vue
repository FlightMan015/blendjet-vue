<template>
  <div
    :class="{
      'has-bundle-add': bundles.length || (bundleVarietyPack && bundleVarietyPack.variants)
    }"
  >
    <button
      v-if="isProductVariantSelectChild"
      :disabled="disableAtcButton"
      :style="styleObj"
      @click="addToCart('nacelle')"
      class="add-to-cart-button button nacelle"
    >
      <span v-if="!variantInLineItems && !allOptionsSelected && product.availableForSale"
        >Select Options</span
      >
      <span
        v-if="
          (!variantInLineItems && allOptionsSelected && variant == undefined) ||
            (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
            !product.availableForSale
        "
        >Out of Stock
      </span>
      <span
        v-if="
          !variantInLineItems && allOptionsSelected && variant && variant.availableForSale == true
        "
        >{{ buttonText }}</span
      >
      <span v-if="variantInLineItems">Added!</span>
    </button>
    <button
      class="add-to-cart-button cart-upsell"
      :style="styleObj"
      @click="addToCart('cart btn')"
      v-else-if="onlyBundle"
      :class="buttonClass"
    >
      <slot>
        <span class="inner-text" v-if="justAdded"> Added! </span>
        <span class="inner-text" v-else-if="displayPrice">{{ buttonText }}</span>
      </slot>
    </button>
    <button
      class="add-to-cart-button"
      :style="styleObj"
      @click="addToCart('cart btn')"
      v-else
      :disabled="disableAtcButton"
      :class="buttonClass"
    >
      <slot>
        <span v-if="!onlyOneOption && product.availableForSale">Select Options</span>
        <span class="inner-text" v-if="displayPrice && variant.availableForSale === true">{{
          buttonText
        }}</span>
        <span
          v-if="
            (!variantInLineItems && allOptionsSelected && variant == undefined) ||
              (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
              !product.availableForSale
          "
          >Out of Stock</span
        >
        <!-- <span v-if=""></span> -->
      </slot>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import rechargeMixin from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'
import Axios from 'axios'

export default {
  mixins: [rechargeMixin, productMetafields],

  props: {
    product: {
      type: Object
    },
    variant: {
      type: Object
    },
    variants: {
      type: Array
    },
    discount: {
      type: Boolean
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    },
    styleObj: {
      type: Object,
      default: () => {}
    },

    warranty: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSubscriptionOn: {
      type: Boolean
    },
    quantity: { type: Number, default: 1 },
    allOptionsSelected: { type: Boolean, default: true },
    confirmedSelection: { type: Boolean, default: true },
    onlyOneOption: { type: Boolean, default: true },
    bundles: {
      type: Array,
      default: () => []
    },
    bundleVarietyPack: {
      type: Object,
      default: () => {}
    },
    onlyBundle: {
      type: Boolean,
      default: false
    },
    bundleQuantity: {
      type: Number
    }
  },

  data() {
    return {
      justAdded: false,
      warrantyPrice: 0,
      displayPrice: 0,
      defaultText: `Add to Cart - ${this.displayPrice}`,
      buttonText: `Add to Cart - ${this.displayPrice}`,
      buttonClass: '',
      priceSaved: {},
      bundleVariants: []
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),

    allVariants() {
      return this.variants?.length ? this.variants : this.product.variants
    },
    /**
     * Get the subscription price for the current variant.
     */
    subscriptionPrice() {
      if (!this.variant) {
        return undefined
      }
      const decodedId = this.decodeBase64VariantId(this.variant.id)
      const variantSubscriptionPrice =
        decodedId &&
        this.isSubscriptionOn &&
        this.discountVariantMap &&
        this.discountVariantMap[decodedId]
      return variantSubscriptionPrice && variantSubscriptionPrice.discount_variant_price
        ? variantSubscriptionPrice.discount_variant_price
        : this.variant.price
    },
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
        (this.allOptionsSelected && this.variant === undefined) ||
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          this.variant.availableForSale !== true)
      )
    }
  },
  mounted() {
    this.getDisplayBundlePrice()
  },
  watch: {
    confirmedSelection() {
      this.addToCart()
    },

    variant() {
      this.$emit('cartVariant', this.variant)
      this.getDisplayBundlePrice()
    },

    quantity() {
      this.getDisplayBundlePrice()
    },
    isSubscriptionOn() {
      this.getDisplayBundlePrice()
    },
    bundles: {
      handler() {
        this.getDisplayBundlePrice()
      },
      deep: true
    },
    bundleVarietyPack: {
      handler() {
        this.getDisplayBundlePrice()
      },
      deep: true
    }
  },

  methods: {
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),
    ...mapMutations('cart', ['showCart']),
    hasWarranty() {
      return !!Object.keys(this.warranty).length
    },
    // async getDisplayPrice() {
    //   if (!this.variant || !this.variant.id) {
    //     return undefined
    //   }

    //   const _price = this.isSubscriptionOn ? this.subscriptionPrice : this.variant.price

    //   const decodedId = atob(this.variant.id)
    //     .split('/')
    //     .pop()
    //   const price = encodeURIComponent(
    //     JSON.stringify([
    //       {
    //         Price: _price,
    //         Tag: decodedId
    //       }
    //     ])
    //   )

    //   // START OF RYAN MOD to override currency

    //   // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
    //   if (document.cookie.includes('_rchcur')) {
    //     var config = {
    //       method: 'get',
    //       url:
    //         'https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=' +
    //         document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
    //         `&MerchantPrices=${price}`
    //     }
    //   } else {
    //     var config = {
    //       method: 'get',
    //       url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`
    //     }
    //   }
    //   // END OF RYAN MOD

    //   const localPrice = await Axios(config)
    //     .then(res => {
    //       if (!res.data.ConsumerPrices[0]) {
    //         this.displayPrice = `${res.data.Symbol}${(Number(_price) * this.quantity).toFixed(2)}`
    //       } else {
    //         // Ryan's fix with Michael's help for UAE and some currency symbols
    //         if (res.data.Symbol == null) {
    //           this.displayPrice = `${(Number(res.data.ConsumerPrices[0]) * this.quantity).toFixed(
    //             2
    //           )} ${res.data.Currency}`
    //         } else {
    //           this.displayPrice = `${res.data.Symbol}${(
    //             Number(res.data.ConsumerPrices[0]) * this.quantity
    //           ).toFixed(2)}`
    //         }
    //       }
    //       ;(this.defaultText = `Add to Cart - ${this.displayPrice}`),
    //       (this.buttonText = `Add to Cart - ${this.displayPrice}`)
    //     })
    //     .catch(res => {
    //       console.error('Currency Request Failed', res)
    //       this.displayPrice = `$${Number(this.variant.price * this.quantity).toFixed(2)}`
    //       ;(this.defaultText = `Add to Cart - ${this.displayPrice}`),
    //       (this.buttonText = `Add to Cart - ${this.displayPrice}`)
    //     })
    // },
    async getVarietyPackDisplayPrice() {
      let config = ''
      let totalPrice = 0
      let symbol = null
      let currency = null

      for (let i = 0; i < this.allVariants.length; i++) {
        const variant = this.allVariants[i]
        if (variant.availableForSale && variant.sku !== 'variety-pack') {
          const _price = this.isSubscriptionOn ? this.getSubscriptionPrice(variant) : variant.price

          const decodedId = atob(variant.id)
            .split('/')
            .pop()
          const price = encodeURIComponent(
            JSON.stringify([
              {
                Price: _price,
                Tag: decodedId
              }
            ])
          )

          config = this.getConfigURL(price)
          let response = {}
          let foundPrice = false
          if (this.priceSaved[_price]) {
            foundPrice = true
            response = this.priceSaved[_price]
          } else {
            try {
              response = await Axios(config)
              this.priceSaved[_price] = response
              foundPrice = true
            } catch (err) {
              symbol = '$'
              totalPrice += Number(variant.price * this.quantity)
            }
          }

          if (foundPrice) {
            if (response.data.Symbol) {
              symbol = response.data.Symbol
            }
            if (response.data.currency) {
              currency = response.data.currency
            }
            if (!response.data.ConsumerPrices[0]) {
              totalPrice += Number(_price) * this.quantity
            } else {
              totalPrice += Number(response.data.ConsumerPrices[0] * this.quantity)
            }
          }
        }
      }
      return Promise.resolve({
        totalPrice,
        symbol,
        currency
      })
    },
    async getDisplayBundlePrice() {
      let config = ''
      let totalPrice = 0
      let symbol = null
      let currency = null
      let bundleVariantCount = 0

      if (!this.onlyBundle) {
        if (!this.variant || !this.variant.id) {
          return undefined
        }

        if (this.variant.sku === 'variety-pack') {
          const fetchedValue = await this.getVarietyPackDisplayPrice()
          totalPrice = fetchedValue.totalPrice
          symbol = fetchedValue.symbol
          currency = fetchedValue.currency
        } else {
          const _price = this.isSubscriptionOn
            ? this.getSubscriptionPrice(this.variant)
            : this.variant.price

          const decodedId = atob(this.variant.id)
            .split('/')
            .pop()
          const price = encodeURIComponent(
            JSON.stringify([
              {
                Price: _price,
                Tag: decodedId
              }
            ])
          )

          config = this.getConfigURL(price)
          let response = {}
          let foundPrice = false
          if (this.priceSaved[_price]) {
            foundPrice = true
            response = this.priceSaved[_price]
          } else {
            try {
              response = await Axios(config)
              this.priceSaved[_price] = response
              foundPrice = true
            } catch (err) {
              symbol = '$'
              totalPrice = Number(this.variant.price * this.quantity)
            }
          }

          if (foundPrice) {
            if (response.data.Symbol) {
              symbol = response.data.Symbol
            }
            if (response.data.currency) {
              currency = response.data.currency
            }
            if (!response.data.ConsumerPrices[0]) {
              totalPrice = Number(_price) * this.quantity
            } else {
              totalPrice = Number(response.data.ConsumerPrices[0] * this.quantity)
            }
          }
        }
      }
      if (this.bundles && this.bundles.length) {
        for (let i = 0; i < this.bundles.length; i++) {
          // Using forloop isntead of forEach since we have to wait for the prices of each product in bundle before displaying
          const bundle = this.bundles[i]
          bundleVariantCount++
          let variantPrice = null
          let foundPriceVariant = false
          let response = {}
          if (bundle?.variant?.price) {
            variantPrice = bundle.variant.price
          } else {
            variantPrice = bundle.product.price
          }
          const priceEncoded = encodeURIComponent(
            JSON.stringify([
              {
                Price: variantPrice,
                Tag: atob(bundle.variant.id)
                  .split('/')
                  .pop()
              }
            ])
          )
          config = this.getConfigURL(priceEncoded)
          if (!this.priceSaved[variantPrice]) {
            try {
              this.priceSaved[variantPrice] = await Axios(config)
              response = this.priceSaved[variantPrice]
              foundPriceVariant = true
            } catch (err) {
              totalPrice += Number(variantPrice * (this.bundleQuantity || this.quantity))
            }
          } else {
            foundPriceVariant = true
            response = this.priceSaved[variantPrice]
          }
          if (foundPriceVariant) {
            if (!response.data.ConsumerPrices[0]) {
              symbol = '$'
              totalPrice += Number(variantPrice * (this.bundleQuantity || this.quantity))
            } else {
              symbol = response.data.Symbol
              totalPrice += Number(
                response.data.ConsumerPrices[0] * (this.bundleQuantity || this.quantity)
              )
            }
          }
        }
      }

      if (this.bundleVarietyPack?.variants) {
        const varietyPack = this.bundleVarietyPack
        if (varietyPack?.variants?.length) {
          for (let i = 0; i < varietyPack?.variants?.length; i++) {
            const variant = varietyPack.variants[i]
            bundleVariantCount++
            const variantPrice = variant.price
            let foundPriceVariant = false
            let response = {}
            const priceEncoded = encodeURIComponent(
              JSON.stringify([
                {
                  Price: variantPrice,
                  Tag: atob(varietyPack.variants[i].id)
                    .split('/')
                    .pop()
                }
              ])
            )
            config = this.getConfigURL(priceEncoded)
            if (!this.priceSaved[variantPrice]) {
              try {
                this.priceSaved[variantPrice] = await Axios(config)
                response = this.priceSaved[variantPrice]
                foundPriceVariant = true
              } catch (err) {
                symbol = '$'
                totalPrice += Number(variantPrice * (this.bundleQuantity || this.quantity))
              }
            } else {
              foundPriceVariant = true
              response = this.priceSaved[variantPrice]
            }
            if (foundPriceVariant) {
              if (!response.data.ConsumerPrices[0]) {
                symbol = '$'
                totalPrice += Number(variantPrice * (this.bundleQuantity || this.quantity))
              } else {
                symbol = response.data.Symbol
                totalPrice += Number(
                  response.data.ConsumerPrices[0] * (this.bundleQuantity || this.quantity)
                )
              }
            }
          }
        }
      }
      if (symbol) {
        this.displayPrice = `${symbol}${totalPrice.toFixed(2)}`
      } else {
        this.displayPrice = `${totalPrice.toFixed(2)} ${currency}`
      }

      if (bundleVariantCount) {
        this.defaultText = `Add Bundle to Cart - ${this.displayPrice}`
        this.buttonText = `Add Bundle to Cart - ${this.displayPrice}`
      } else {
        this.defaultText = `Add to Cart - ${this.displayPrice}`
        this.buttonText = `Add to Cart - ${this.displayPrice}`
      }
    },

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

    setButtonText() {
      if (
        this.onlyOneOption &&
        !this.variantInLineItems &&
        this?.variant?.availableForSale === true
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
    addToCart(calledfrom = '') {
      let lineItem = {}
      console.log('called', calledfrom)
      if (this.discount) {
        const _dvar = JSON.parse(JSON.stringify(this.variant))
        _dvar.price = 0.0
      } else {
      }
      const subscribed = this.isSubscriptionOn && this.hasSubscription
      let rechargeFields = []
      if (!this.onlyBundle) {
        rechargeFields = [
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
      }
      if (this.allOptionsSelected && this?.product?.availableForSale) {
        if (this.variant.sku === 'variety-pack') {
          this.allVariants &&
            this.allVariants.forEach(v => {
              if (v.availableForSale && v.sku !== 'variety-pack') {
                lineItem = {
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
          lineItem = {
            image: this.product.featuredMedia,
            title: this.product.title,
            variant: subscribed
              ? { ...this.variant, price: this.getSubscriptionPrice(this.variant) }
              : this.variant,
            quantity: this.quantity || 1,
            productId: this.product.id,
            handle: this.product.handle,
            vendor: this.product.vendor,
            tags: this.product.tags,
            metafields: subscribed ? [...rechargeFields] : []
          }

          this.addLineItem(lineItem)
        }
        if (this.hasWarranty()) {
          const warrantyItem = {
            image: this.warranty.featuredMedia,
            title: this.warranty.title,
            variant: this.warranty.variants[0],
            quantity: this.quantity || 1,
            productId: this.warranty.id,
            handle: this.warranty.handle,
            vendor: this.warranty.vendor,
            tags: this.warranty.tags,
            metafields: [
              {
                key: 'Ref',
                value: atob(this.variant.id)
                  .split('/')
                  .pop()
              }
            ]
          }
          this.addLineItem(warrantyItem)
        }
        if (this.bundles.length) {
          this.bundles.forEach(bundle => {
            const variant = bundle?.variant
            const product = bundle?.product
            const variantsList = bundle?.product?.variants
            if (variant.sku === 'variety-pack') {
              variantsList &&
                variantsList.forEach(v => {
                  if (v.availableForSale && v.sku !== 'variety-pack') {
                    lineItem = {
                      image: product?.featuredMedia,
                      title: product?.title,
                      variant: variant,
                      quantity: this.bundleQuantity || this.quantity || 1,
                      productId: product?.id,
                      handle: product?.handle,
                      vendor: product?.vendor,
                      tags: product?.tags,
                      metafields: []
                    }
                    this.addLineItem(lineItem)
                  }
                })
            } else {
              const lineItem = {
                image: product?.featuredMedia,
                title: product?.title,
                variant: variant,
                quantity: this.bundleQuantity || this.quantity || 1,
                productId: product?.id,
                handle: product?.handle,
                vendor: product?.vendor,
                tags: product?.tags,
                metafields: []
              }
              this.addLineItem(lineItem)
            }
          })
        }
        if (this.bundleVarietyPack?.variants) {
          const varietyPack = this.bundleVarietyPack
          varietyPack?.variants?.length &&
            varietyPack.variants.forEach(variant => {
              const product = varietyPack?.product
              const lineItem = {
                image: product?.featuredMedia,
                title: product?.title,
                variant: variant,
                quantity: this.bundleQuantity || this.quantity || 1,
                productId: product?.id,
                handle: product?.handle,
                vendor: product?.vendor,
                tags: product?.tags,
                metafields: []
              }
              this.addLineItem(lineItem)
            })
        }
        this.setButtonText()
        this.showCart()
        this.$emit('addedToCart')

        this.elevarAddToCart()
      } else if (this.onlyBundle) {
        if (this.bundles.length) {
          this.bundles.forEach(bundle => {
            const variant = bundle?.variant
            const product = bundle?.product
            const lineItem = {
              image: product?.featuredMedia,
              title: product?.title,
              variant: variant,
              quantity: this.quantity || 1,
              productId: product?.id,
              handle: product?.handle,
              vendor: product?.vendor,
              tags: product?.tags,
              metafields: []
            }
            this.addLineItem(lineItem)
          })
        }
        if (this.bundleVarietyPack?.variants) {
          const varietyPack = this.bundleVarietyPack
          varietyPack?.variants?.length &&
            varietyPack.variants.forEach(variant => {
              const product = varietyPack?.product
              const lineItem = {
                image: product?.featuredMedia,
                title: product?.title,
                variant: variant,
                quantity: this.quantity || 1,
                productId: product?.id,
                handle: product?.handle,
                vendor: product?.vendor,
                tags: product?.tags,
                metafields: []
              }
              this.addLineItem(lineItem)
            })
        }
        this.setButtonText()
        this.showCart()
        this.$emit('addedToCart')

        this.elevarAddToCart()
      }
      this.justAdded = true
      setTimeout(() => {
        this.justAdded = false
      }, 2000)
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
      let productList = []
      let currencyCode = this?.product?.priceRange?.currencyCode
      var uuid = this.createUUID()
      var referrer = document.referrer.includes('marketplace') ? document.referrer : ''
      var source = this.getSource()
      if (!this.onlyBundle) {
        if (this.variant.sku !== 'variery-pack') {
          var variant = this.variant
          var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
            .toString('binary')
            .split('/')
            .pop()
          var variantId = Buffer.from(variant.id, 'base64')
            .toString('binary')
            .split('/')
            .pop()
          productList = [
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
        } else {
          this.allVariants &&
            this.allVariants.forEach(v => {
              if (v.sku !== 'variety-pack') {
                var variant = v
                var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
                  .toString('binary')
                  .split('/')
                  .pop()
                var variantId = Buffer.from(variant.id, 'base64')
                  .toString('binary')
                  .split('/')
                  .pop()
                const product = [
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
                productList.push(product)
              }
            })
        }
      }

      if (this.bundles && this.bundles.length) {
        this.bundles.forEach(bundle => {
          const variant = bundle?.variant
          const product = bundle?.product
          if (product?.priceRange?.currencyCode) {
            currencyCode = product?.priceRange?.currencyCode
          }
          const item = {
            name: product?.title?.replace("'", ''),
            id: (variant && variant.sku) || '',
            product_id: Buffer.from(product?.pimSyncSourceProductId, 'base64'),
            variant_id: Buffer.from(variant?.id, 'base64')
              .toString('binary')
              .split('/')
              .pop(),
            image: product?.featuredMedia?.src,
            price: variant.price,
            brand: product?.vendor.replace("'", ''),
            variant: (variant && variant.title && variant.title.replace("'", '')) || '',
            category: product?.productType,
            inventory: this.bundleQuantity || this.quantity || 1,
            list: referrer,
            source: source
          }
          productList.push(item)
        })
      }

      if (this.bundleVarietyPack?.variants) {
        const varietyPack = this.bundleVarietyPack
        varietyPack?.variants?.length &&
          varietyPack.variants.forEach(variant => {
            const product = varietyPack?.product
            if (product?.priceRange?.currencyCode) {
              currencyCode = product?.priceRange?.currencyCode
            }
            const item = {
              name: product?.title?.replace("'", ''),
              id: (variant && variant.sku) || '',
              product_id: Buffer.from(product?.pimSyncSourceProductId, 'base64'),
              variant_id: Buffer.from(variant?.id, 'base64')
                .toString('binary')
                .split('/')
                .pop(),
              image: product?.featuredMedia?.src,
              price: variant.price,
              brand: product?.vendor.replace("'", ''),
              variant: (variant && variant.title && variant.title.replace("'", '')) || '',
              category: product?.productType,
              inventory: this.bundleQuantity || this.quantity || 1,
              list: referrer,
              source: source
            }
            productList.push(item)
          })
      }

      window.dataLayer.push({
        event: 'dl_add_to_cart',
        event_id: uuid,
        ecommerce: {
          currencyCode: currencyCode,
          add: {
            actionField: { list: referrer },
            products: productList
          }
        }
      })
      // console.log('wdl_atc:', window.dataLayer)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-to-cart-button {
  @include button-primary('purple');
  height: 50px;
  width: 264px;
  flex-flow: row nowrap;
  min-width: 202.08px;
  &:disabled {
    opacity: 0.5;
  }
  &.cart-upsell {
    border-radius: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 1.75px;
    line-height: 14px;
    padding: 0 2rem;
    font-family: 'Bold';
    text-transform: uppercase;
    cursor: pointer;
    background-color: #ffffff;
    color: $primary-purple;
    border: none;
  }

  @include respond-to('small') {
    width: auto;
    &:hover {
      opacity: 1;
    }
  }
}

.has-bundle-add {
  .add-to-cart-button {
    width: 370px;
    &.cart-upsell {
      margin: auto;
      width: auto;
      min-width: 305px;
      max-width: 360px;
    }
  }
  &.other-products {
    .add-to-cart-button {
      width: 356px;
    }
  }
}

.clicked {
  @include hover-transition;
}

.inner-text {
  transition: all ease 1s;
}
</style>
