<template>
  <div class="jetpack-container" v-if="product && variant">
    <div class="text-block">
      <nuxt-link :to="`/products/${handle}`" style="color:white;">
        Try JetPack Protein Smoothies
      </nuxt-link>
      <br />
      <span style="font-size: 75%;color:gold;">6 Ready-to-Blend Smoothies</span>
      <br />
    </div>
    <div class="jetpack-image">
      <transition name="fade">
        <img class="jetpack-image__img" :src="optimizeSource({ url: variant.featuredMedia.src })" />
      </transition>
    </div>
    <div class="add-to-cart-controls">
      <div class="jetpack-dropdown">
        <CartDropdown
          :items="jetpacks"
          :product="variant"
          @update:jetpacks="updateJetpack"
          :label="'Flavor'"
          :productType="'jetpacks'"
        />
      </div>
      <div class="quantity-select">
        <div class="quantity-select__label">Quantity:</div>
        <div class="quantity-select__dropdown-container">
          <QuantityDropdown :quantity="quantity" @update:quantity="updateQuantity" />
        </div>
      </div>
      <div class="add-to-cart-container">
        <div class="variety-button" @click="addProduct">
          {{ buttonText }}
        </div>
      </div>
      <div class="subscribe-select">
        <Checkbox :color="'white'" :label="'Subscribe & Save 25%'" @checked="handleCheck" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import QuantityDropdown from '~/components/quantityDropdown'
import imageOptimize from '~/mixins/imageOptimize'
import CartDropdown from '~/components/cartDropdown'
import Checkbox from '~/components/checkbox'

import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'

export default {
  data() {
    return {
      jetpacks: null,
      product: null,
      quantity: 1,
      variant: null,
      subscriptionChecked: false,
      localizedPrice: null,
      symbol: '$',
      handle: 'jetpack-protein-smoothie',
      justAdded: false
    }
  },
  components: {
    Checkbox,
    CartDropdown,
    QuantityDropdown
  },
  mixins: [imageOptimize, productMetafields, rechargeProperties],
  async mounted() {
    this.product = await this.$nacelle.data.product({ handle: 'jetpack-protein-smoothie' })
    this.jetpacks = this.product.variants
    this.variant = this.jetpacks[0]

    this.initLocalizedPrice()
  },
  computed: {
    productPrice() {
      const discountPrice = this.localizedPrice?.discountPrice ?? this.discountPrice
      const price = this.localizedPrice?.price ?? Number(this.variant.price)

      return this.subscriptionChecked ? discountPrice : price
    },
    buttonText() {
      const price = `${this.symbol} ${(this.productPrice * this.quantity).toFixed(2)}`
      return this.justAdded ? 'Added!' : `Add to Cart${price ? ` - ${price}` : ''}`
    }
  },
  methods: {
    ...mapActions('cart', ['addLineItem']),
    updateJetpack(jetpack) {
      this.variant = jetpack
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    handleCheck(check) {
      this.subscriptionChecked = check
    },
    async initLocalizedPrice() {
      const variantId = atob(this.variant.id)
        .split('/')
        .pop()

      const price = encodeURIComponent(
        JSON.stringify([
          { Price: this.discountPrice, Tag: variantId },
          { Price: Number(this.variant.price), Tag: variantId }
        ])
      )

      let url = `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`

      // START OF RYAN MOD to override currency

      // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      if (document.cookie.includes('_rchcur')) {
        url =
          'https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=' +
          document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
          `&MerchantPrices=${price}`
      }
      // END OF RYAN MOD

      try {
        const res = await fetch(url)
        const data = await res.json()

        if (data.ConsumerPrices.length) {
          const [discountPrice, price] = data.ConsumerPrices
          this.symbol = data.Symbol ?? data.Currency
          this.localizedPrice = { discountPrice, price }
        }
      } catch (error) {
        console.error('Currency Request Failed', error)
      }
    },
    addProduct() {
      const { handle, vendor, tags } = this.product
      const { featuredMedia, title, id, metafields } = this.variant
      const price = this.subscriptionChecked ? this.discountPrice : Number(this.variant.price)

      const rechargeFields = [
        { key: 'charge_interval_frequency', value: '30' },
        { key: 'order_interval_frequency', value: '30' },
        { key: 'order_interval_unit', value: 'day' }
      ]

      this.addLineItem({
        image: featuredMedia,
        title,
        quantity: this.quantity,
        productId: id,
        handle,
        vendor,
        tags,
        variant: { ...this.variant, price },
        metafields: [...metafields, ...(this.subscriptionChecked ? rechargeFields : [])]
      })

      this.justAdded = true
      setTimeout(() => {
        this.justAdded = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  font-family: Bold;
  font-size: 22px;
  line-height: 1.17;
  letter-spacing: 0.67px;
  text-align: center;
  color: $grayscale-white;
  padding-top: 80px;
  margin-bottom: 80px;
  padding-right: 55px;
  padding-left: 55px;

  @include respond-to('small') {
    font-size: 16px;
    margin-bottom: 15px;
    padding-top: 15px;
    padding-left: 37px;
    padding-right: 37px;
  }
}

.jetpack-container {
  padding: 15px 0 40px;
}

.variety-button {
  @include button-primary('white');
}

.jetpack-image {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  &__img {
    height: 300px;
    object-fit: contain;
    @include respond-to('small') {
      height: 250px;
    }
  }
  @include respond-to('small') {
    margin-bottom: 15px;
  }
}

.jetpack-dropdown {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  @include respond-to('small') {
    margin-bottom: 11px;
  }
}

.add-to-cart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  ::v-deep .add-to-cart-button {
    @include button-primary('white');
    width: 287px;
  }
}

.quantity-select {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  &__label {
    font-family: Regular;
    font-size: $text-small;
    letter-spacing: 0.5px;
    line-height: 1.17;
    margin-right: 14px;
    color: $grayscale-white;
    display: flex;
    align-items: center;
    @include respond-to('small') {
      // align-items: normal;
    }
  }

  &__dropdown-container {
    width: 50px;
  }

  @include respond-to('small') {
    margin-bottom: 20px;
  }
}

.subscribe-select {
  display: flex;
  justify-content: center;
}
</style>
