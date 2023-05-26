<template>
  <div class="checkout-button" role="button" :class="{ 'is-loading': loading }" @click="checkout">
    <div v-if="loading" class="loader"></div>
    <span class="checkout-text" :class="{ hidden: loading && isMobile }">{{ checkoutText }}</span>
    <span class="subtotal" v-if="cartSubtotal > 0 && showPrice && displayPrice">
      &nbsp;—&nbsp;{{ displayPrice }}
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Axios from 'axios'
export default {
  props: {
    checkoutText: {
      type: String,
      default: 'Checkout'
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    // Can be toggled on to prevent the normal checkout redirection behavior
    preventCheckout: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      displayPrice: 0
    }
  },
  watch: {
    cartSubtotal() {
      this.getDisplayPrice()
    }
  },
  async mounted() {
    this.getDisplayPrice()
  },
  computed: {
    ...mapGetters('cart', ['cartSubtotal']),
    ...mapState('cart', ['lineItems']),
    isMobile() {
      return typeof window && window.innerWidth <= 768
    }
  },
  methods: {
    ...mapMutations('cart', ['setCartError']),
    ...mapActions('checkout', ['processCheckout']),
    async getDisplayPrice() {
      const _price = this.cartSubtotal

      const priceData = []
      this.lineItems.forEach(item => {
        priceData.push({
          Price: parseFloat(item.variant.price),
          Tag: atob(item.variant.id)
            .split('/')
            .pop()
        })
      })

      const price = encodeURIComponent(JSON.stringify(priceData))

      // START OF RYAN MOD to override currency

      // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      if (document.cookie.includes('_rchcur')) {
        var config = {
          method: 'get',
          url:
            'https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=' +
            document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
            `&MerchantPrices=${price}`
        }
      } else {
        var config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`
        }
      }
      // END OF RYAN MOD

      await Axios(config)
        .then(res => {
          const consumerPrices = res.data?.ConsumerPrices
          if (!Array.isArray(consumerPrices) || !consumerPrices.length || !consumerPrices[0]) {
            // Currently the API returns an array of `null` values,
            // so we also are checking the first index to make sure
            // the value isn't null.
            this.displayPrice = `${res.data.Symbol}${_price.toFixed(2)}`
          } else {
            const localSubtotal = res.data.ConsumerPrices.reduce((acc, item, i) => {
              const quantTotal = Number(item * this.lineItems[i].quantity)
              return acc + quantTotal
            }, 0)
            if (res.data.Symbol == null) {
              this.displayPrice = `${localSubtotal.toFixed(2)} ${res.data.Currency}`
            } else {
              this.displayPrice = `${res.data.Symbol}${localSubtotal.toFixed(2)}`
            }
          }
          // Emit the country + display price events back up to the parent cart
          this.$emit('Country', res.data.Country)
          this.$emit('DisplayPrice', this.displayPrice)
        })
        .catch(res => {
          console.error('Currency Request Failed', res)
          this.displayPrice = `$${this._price}`
        })
    },
    async checkout() {
      // If prevent flag is enabled, bail
      if (this.preventCheckout) return

      this.loading = true

      try {
        await this.processCheckout({
          async beforeCreate() {
            // Allows processing of cart before checkout creation.
          },
          async beforeRedirect() {
            // Allows processing after checkout create and before redirecting.
          }
        })
      } catch (err) {
        console.log(err)
        this.setCartError(err)
        this.loading = false
      }
      finally {
        setTimeout(() => {
          this.loading = false
        },5000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-button {
  @include button-primary('purple');
  height: 50px;
  position: relative;
  min-width: 260px;
  .loader {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 40px;
    @include respond-to('small') {
      right: calc(50% - 10px);
    }
  }
  .checkout-text {
    visibility: visible;
    transition: all 0.5s ease;
    &.hidden {
      visibility: hidden;
    }
  }
}

// .subtotal {
//   // margin-left: 7px;
// }
</style>
