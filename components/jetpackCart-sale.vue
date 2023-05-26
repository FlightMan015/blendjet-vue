<template>
  <div class="jetpack-container" v-if="product && jetpacks">
    <div class="text-block">
      <a href="/products/jetpack-smoothies" style="color:white;"
        >Add FREE JetPacks to Cart</a
      ><br />
      <span style="font-size: 75%;color:gold;">With Each BlendJet</span>
      <br />
      <span style="font-size: 75%;color:white;"
        >Discount Applied at Checkout</span
      >
    </div>
    <div class="jetpack-image">
      <transition name="fade" v-if="varietyPack.media">
        <img
          class="jetpack-image__img"
          :src="optimizeSource({ url: varietyPack.media[0].src })"
        />
      </transition>
    </div>
    <div class="add-to-cart-controls">
      <div class="jetpack-dropdown">
        <!-- <CartDropdown 
          :items="jetpacks"
          :product="product"
          @update:jetpacks="updateJetpack"
          :label="'Flavor'"
          :productType="'jetpacks'"
        /> -->
      </div>
      <!--
      <div class="quantity-select">
        <div class="quantity-select__label">Quantity:</div> 
        <div class="quantity-select__dropdown-container">
          <QuantityDropdown 
            :quantity="quantity"
            @update:quantity="updateQuantity"
          />
        </div>
      </div>
-->
      <div class="add-to-cart-container" :class="buttonClass">
        <div
          v-if="variety"
          class="variety-button"
          @click="addVarietyPackToCart"
        >
          <span v-if="this.subscriptionChecked" class="inner--text">
            {{ buttonSubscriptionText }}
          </span>
          <span v-else class="inner--text">
            {{ buttonText }}
          </span>
        </div>
        <!-- <SubscriptionAddToCartButton
          :product="product"
          :bundle="jetpacksCol"
          :variant="product.variants[0]"
          :metafields="product.metafields"
          :all-options-selected="true"
          :only-one-option="true"
          :quantity="quantity"
          :showPrice="true"
        /> -->
      </div>
      <div class="subscribe-select">
        <Checkbox
          v-if="variety"
          :color="'white'"
          :initialCheck="false"
          :label="'Subscribe to Get All 6 Flavors for FREE'"
          @checked="handleCheck"
        />
        <!-- <SubscriptionSelect 
            v-if="jetpacks.length"
            :products="jetpacks"
            :_product="jetpacks[0]"
            :metafields="product.metafields"
            :checkbox="true"
        /> -->
      </div>
      <div
        style="text-align: center;color:white;padding-bottom:10px;font-size:75%;padding-top:5px;"
      >
        You can cancel anytime.
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CartDropdown from '~/components/cartDropdown'
import QuantityDropdown from '~/components/quantityDropdown'
import imageOptimize from '~/mixins/imageOptimize'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionSelect from '~/components/subscriptionSelect'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'
import ProductPrice from '~/components/nacelle/ProductPrice'

import Axios from 'axios'

// import rechargeProperties from '~/mixins/rechargeMixin'
// import productMetafields from '~/mixins/productMetafields'

import Checkbox from '~/components/checkbox'
export default {
  data() {
    return {
      jetpacks: null,
      product: null,
      quantity: 1,
      frequency: null,
      variety: true,
      subUnitDisplayPrice: 2.99,
      unitDisplayPrice: 3.99,
      subscriptionChecked: true,
      displayPrice: 17.94,
      localizedUnitPrice: '2.99',
      symbol: '$',
      defaultButtonText: 'Add 3 FREE JetPacks to Cart',
      defaultButtonSubscriptionText: 'Add 6 FREE JetPacks to Cart',
      buttonText: 'Add 3 FREE JetPacks to Cart',
      buttonSubscriptionText: 'Add 6 FREE JetPacks to Cart',
      buttonClass: '',
      varietyPack: {},
    }
  },
  components: {
    CartDropdown,
    ProductPrice,
    QuantityDropdown,
    SubscriptionToggle,
    SubscriptionSelect,
    SubscriptionAddToCartButton,
    Checkbox
  },
  mixins: [imageOptimize],
  async mounted() {
    if (this.product) {
      this.jetpacks = this.product.variants.filter(variant => {
        return variant.availableForSale
      })
    } else {
      this.product = await this.$nacelle.data.product({
        handle: 'jetpack-smoothies'
      })

      if (this.product && this.product.availableForSale) {
        this.jetpacks = this.product.variants.filter(variant => {
          return variant.availableForSale
        })
      }
    }

    this.varietyPack = await this.$nacelle.data.product({
      handle: 'variety-jetpack-ready-to-blend-smoothie'
    })

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
    formatTitle(title) {
      return title.split('-')[0].trim()
    },
    updateJetpack(jetpack) {
      this.product = jetpack
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    handleCheck(check) {
      if (check) {
        this.subscriptionChecked = true
        this.displayPrice = this.subUnitDisplayPrice * 6
        this.toggleSubscriptions(this.subscriptionChecked)
        
      } else {
        this.subscriptionChecked = false
        this.displayPrice = this.unitDisplayPrice * 6
        this.toggleSubscriptions(this.subscriptionChecked)
        
      }
    },
    toggleSubscriptions(sub) {
      if (sub) {
             const rechargeFields = [
            {
              key: 'charge_interval_frequency',
              value: '30'
            },
            {
              key: 'order_interval_frequency',
              value: '30'
            },
            {
              key: 'order_interval_unit',
              value: 'day'
            }
          ]
          let metafields = this.product.metafields
          let newMeta = metafields.concat(rechargeFields)
          this.product.metafields = newMeta
      } else {
         const updatedMeta = this.product.metafields.filter(
            metafield => metafield.id === null
          )
          this.product.metafields = [...updatedMeta]
      }
    },
    decodeBase64VariantId(encodedId) {
      console.log('encodedId', encodedId)
      const decodedId = atob(encodedId)
      return decodedId.split('gid://shopify/ProductVariant/')[1]
    },
    isSubscription(item) {
      return !!item.metafields.find(
        meta => meta.key === 'charge_interval_frequency'
      )
    },
    subscriptionVariant(item) {
      // Deep clone object without references to state.
      const _variant = JSON.parse(JSON.stringify(item))
      _variant.price = '2.99'

      return _variant
    },
    discountVariantMap(item) {
      const metafieldsObj = item.metafields.reduce((obj, metafield) => {
        const { namespace, key, value } = metafield

        if (obj[namespace]) {
          obj[namespace][key] = value
        } else {
          obj[namespace] = {}
          obj[namespace][key] = value
        }
        return obj
      }, {})
      return JSON.parse(
        metafieldsObj.subscriptions.original_to_hidden_variant_map
      )
    },

    async getDisplayPrice() {
      let variantId = atob(this.jetpacks[0].id)
        .split('/')
        .pop()
      const price = encodeURIComponent(
        JSON.stringify([
          {
            Price: 2.99,
            Tag: variantId
          },
          {
            Price: 3.99,
            Tag: variantId
          }
        ])
      )

      /*
        const config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
        }
*/

      //START OF RYAN MOD to override currency

      //if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      if (document.cookie.includes('_rchcur')) {
        var config = {
          method: 'get',
          url:
            `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=` +
            document.cookie
              .match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)')
              .pop() +
            `&MerchantPrices=${price}`
        }
      } else {
        var config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`
        }
      }
      //END OF RYAN MOD

      const localPrice = await Axios(config)
        .then(res => {
          if (!res.data.ConsumerPrices[0]) {
          } else {
            this.symbol = res.data.Symbol
            this.symbolDefault = res.data.Symbol
            if (this.symbol == null) {
              this.symbol = res.data.Currency
            }
            this.subUnitDisplayPrice = res.data.ConsumerPrices[0]
            this.unitDisplayPrice = res.data.ConsumerPrices[1]
            this.subscriptionChecked
              ? (this.displayPrice = this.subUnitDisplayPrice * 6)
              : (this.displayPrice = this.unitDisplayPrice * 6)
          }
        })
        .catch(res => {
          console.error('Currency Request Failed', res)
          this.displayPrice = `$${this.variant.price}`
        })
    },
    addVarietyPackToCart() {
      if (!this.subscriptionChecked) {
        this.jetpacks.slice(-3).forEach(jetpack => {
          const variant = this.isSubscription(this.product)
            ? this.subscriptionVariant(jetpack)
            : jetpack
          const cartMeta = this.product.metafields.filter(field => {
            return !field.id && field.id !== null
          })

          const lineItem = {
            image: jetpack.featuredMedia,
            title: this.product.title,
            variant,
            quantity: 1 * this.quantity,
            productId: this.product.id,
            handle: this.product.handle,
            vendor: this.product.vendor,
            tags: this.product.tags,
            metafields: cartMeta
          }
          this.addLineItem(lineItem)
          this.buttonClass = 'clicked'
          this.buttonText = 'Added!'
          setTimeout(() => {
            this.buttonText = this.defaultButtonText
            this.buttonClass = ''
          }, 2000)
        })
      }

      if (this.subscriptionChecked) {
        this.jetpacks.forEach(jetpack => {
          const variant = this.isSubscription(this.product)
            ? this.subscriptionVariant(jetpack)
            : jetpack
          const cartMeta = this.product.metafields.filter(field => {
            return !field.id && field.id !== null
          })

          const lineItem = {
            image: jetpack.featuredMedia,
            title: this.product.title,
            variant,
            quantity: 1 * this.quantity,
            productId: this.product.id,
            handle: this.product.handle,
            vendor: this.product.vendor,
            tags: this.product.tags,
            metafields: cartMeta
          }
          this.addLineItem(lineItem)
          this.buttonSubscriptionText = 'Added!'
          this.buttonClass = 'clicked'
          setTimeout(() => {
            this.buttonSubscriptionText = this.defaultButtonSubscriptionText
            this.buttonClass = ''
          }, 2000)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  font-family: Bold;
  font-size: 24px;
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
    // margin-top: 0;
  }
}

.jetpack-container {
  padding-top: 15px;
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
  // align-items: center;
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
  // ::v-deep .b-checkbox.checkbox input[type=checkbox]:checked + .check {
  //   border-color: $grayscale-white;
  // };
  @include respond-to('small') {
    padding-bottom: 17px;
  }
}

.clicked {
  opacity: 0.7;
  transition: 0.5s ease;
}
</style>
