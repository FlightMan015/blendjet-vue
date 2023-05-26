<template>
  <span v-if="symbol === null" :class="priceStyle">{{ displayPrice + ' ' + currency }}</span>
  <span v-else :class="priceStyle">{{ symbol + displayPrice }}</span>
</template>

<script>
// import Vue from 'vue'
// import VueCurrencyFilter from 'vue-currency-filter'
import axios from 'axios'
import productMetafields from '~/mixins/productMetafields'
import rechargeMixin from '~/mixins/rechargeMixin'
// Vue.use(VueCurrencyFilter)
export default {
  props: {
    price: [String, Number],
    currencyCode: {
      type: String,
      default: 'USD'
    },
    showCurrencyCode: {
      type: Boolean,
      default: false
    },
    strikethrough: {
      type: Boolean,
      default: false
    },
    variantId: {
      type: String,
      default: ''
    },
    product: {
      type: Object,
      default: null
    },
    isVarietyPack: {
      type: Boolean,
      default: false
    },
    isSubscriptionOn: {
      type: Boolean,
      default: false
    },
    styleClass: {}
  },
  mixins: [productMetafields, rechargeMixin],
  data() {
    return {
      displayPrice: 0,
      symbol: '',
      priceSaved: {}
    }
  },
  watch: {
    price() {
      if (!this.isVarietyPack) {
        this.getPrice()
      } else {
        this.getVarieryPackPrice()
      }
    }
  },
  computed: {
    priceStyle() {
      return {
        productPrice: true,
        nacelle: true,
        'strikethrough-price': this.strikethrough
      }
    }
  },
  async mounted() {
    if (!this.isVarietyPack) {
      this.getPrice()
    } else {
      this.getVarieryPackPrice()
    }
  },

  methods: {
    async getPrice() {
      const vm = this

      // If no variant provided, and price is non-numerical, bail
      if (!vm.variantId.length && isNaN(vm.price)) {
        return
      }

      const priceData = [
        {
          Price: vm.price
        }
      ]

      if (vm.variantId.length) {
        let decodedVariantId = atob(this.variantId)
          .split('/')
          .pop()
        if (this.strikethrough) {
          decodedVariantId += ':compare'
        }
        priceData[0].Tag = decodedVariantId
      }
      const price = encodeURIComponent(JSON.stringify(priceData))

      // START OF RYAN MOD to override currency

      // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      const config = this.getConfigURL(price)
      let foundPriceVariant
      let res

      // END OF RYAN MOD
      if (!this.priceSaved[this.price]) {
        try {
          this.priceSaved[this.price] = await axios(config)
          res = this.priceSaved[this.price]
          foundPriceVariant = true
        } catch (err) {
          console.error('Currency Request Failed')
          console.error(err)
          vm.displayPrice = vm.price
          vm.symbol = '$'
        }
      } else {
        foundPriceVariant = true
        res = this.priceSaved[this.price]
      }
      if (foundPriceVariant) {
        if (!res.data.ConsumerPrices[0]) {
          vm.displayPrice = Number(vm.price).toFixed(2)
        } else {
          vm.displayPrice = res.data.ConsumerPrices[0]
        }
        vm.symbol = res.data.Symbol
        vm.currency = res.data.Currency
        vm.$emit('Country', res.data.Country)
        vm.$emit('DisplayPrice', vm.displayPrice)
        vm.$emit('Currency', res.data.Currency)
        if (vm.strikethrough) {
          vm.$emit('CompareAtLocal', vm.displayPrice)
        }
      }
    },
    async getVarieryPackPrice() {
      const vm = this
      let country
      let displayPrice = 0
      // If no variant provided, and price is non-numerical, bail
      if (!vm.variantId.length && isNaN(vm.price)) {
        return
      }
      for (let i = 0; i < this.product.variants.length; i++) {
        const variant = this.product.variants[i]
        const variantPrice = this.isSubscriptionOn
          ? this.getSubscriptionPrice(variant)
          : variant.price
        if (variant?.availableForSale && variant?.sky !== 'variety-pack') {
          const priceData = [
            {
              Price: variantPrice
            }
          ]

          if (variant.id.length) {
            let decodedVariantId = atob(variant.id)
              .split('/')
              .pop()
            if (this.strikethrough) {
              decodedVariantId += ':compare'
            }
            priceData[0].Tag = decodedVariantId
          }
          const price = encodeURIComponent(JSON.stringify(priceData))

          // START OF RYAN MOD to override currency

          // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
          const config = this.getConfigURL(price)
          let foundPriceVariant
          let res

          // END OF RYAN MOD
          if (!this.priceSaved[variantPrice]) {
            try {
              this.priceSaved[variantPrice] = await axios(config)
              res = this.priceSaved[variantPrice]
              foundPriceVariant = true
            } catch (err) {
              console.error('Currency Request Failed')
              console.error(err)
              displayPrice += Number(variantPrice)
              vm.symbol = '$'
            }
          } else {
            foundPriceVariant = true
            res = this.priceSaved[variantPrice]
          }
          if (foundPriceVariant) {
            if (!res.data.ConsumerPrices[0]) {
              displayPrice += Number(variantPrice)
            } else {
              displayPrice += Number(res.data.ConsumerPrices[0])
            }
            vm.symbol = res.data.Symbol
            vm.currency = res.data.Currency
            country = res.data.Country
          }
        }

        vm.displayPrice = displayPrice.toFixed(2)
        vm.$emit('Country', country)
        vm.$emit('DisplayPrice', vm.displayPrice)
        vm.$emit('Currency', vm.currency)
        if (vm.strikethrough) {
          vm.$emit('CompareAtLocal', vm.displayPrice)
        }
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
      const decodedId = atob(encodedId)
      return decodedId.split('gid://shopify/ProductVariant/')[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.product-price {
  margin-bottom: 1rem;
}

.strikethrough-price {
  text-decoration: line-through;
  opacity: 0.3;
}
</style>
