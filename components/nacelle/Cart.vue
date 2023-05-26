<template>
  <div class="cart-container">
    <CartUpsells
      :closeUpsellModal="closeUpsellModal"
      :checkoutDisabled="checkoutDisabled"
      :showUpsell="showUpsell"
      :isMobile="isMobile"
    />

    <div class="flyout">
      <cart-flyout-header @close="handleClose" />

      <div class="cart-items">
        <cart-item
          v-for="item in lineItems"
          :key="item.variant.id"
          :item="item"
          @checkoutDisabled="handleCheckoutDisable"
        />
      </div>
      <div class="cart-message">{{ cartMessage }}</div>
      <!-- <div class="free-shipping" v-if="country === 'US'"> -->
      <div class="free-shipping">
        <div class="free-shipping__svg">
          <svg
            width="356px"
            height="26px"
            viewBox="0 0 356 26"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <title>FREE SHIPPING</title>
            <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="D-BlendJet-Cart_Picker" transform="translate(-1065.000000, -532.000000)">
                <g id="Cart" transform="translate(1046.000000, 0.000000)">
                  <g id="FREE-SHIPPING" transform="translate(20.000000, 533.000000)">
                    <rect
                      id="Rectangle"
                      stroke="#373795"
                      fill="#FFFFFF"
                      x="0"
                      y="0"
                      width="354"
                      height="24"
                      rx="6"
                    ></rect>
                    <g id="Group-4" transform="translate(110.000000, 8.000000)"></g>
                    <g id="Group" transform="translate(80.000000, 5.000000)">
                      <text
                        id="FREE-2-DAY-SHIPPING"
                        font-family="Helvetica"
                        font-size="10"
                        font-weight="normal"
                        line-spacing="14"
                        letter-spacing="1.45833333"
                        fill="#373795"
                      >
                        <tspan x="39.5" y="10">FREE EXPRESS SHIPPING</tspan>
                      </text>
                      <g>
                        <path
                          d="M31.7462908,6.80922432 L30.5059347,2.90566038 C30.3931751,2.55345912 30.0548961,2.28930818 29.6884273,2.28930818 L25.8545994,2.28930818 L25.8545994,0.410901468 C25.8545994,0.176100629 25.6854599,0 25.4881306,0 L13.3664688,0 C13.1691395,0 13,0.176100629 13,0.410901468 L13,11.0943396 C13,11.2997904 13.1691395,11.475891 13.3664688,11.475891 L15.227003,11.475891 C15.227003,11.475891 15.227003,11.475891 15.227003,11.475891 C15.227003,12.884696 16.3264095,14 17.6513353,14 C18.9762611,14 20.0756677,12.8553459 20.0756677,11.475891 C20.0756677,11.475891 20.0756677,11.475891 20.0756677,11.475891 L24.8961424,11.475891 C24.8961424,11.475891 24.8961424,11.475891 24.8961424,11.475891 C24.8961424,12.884696 25.995549,14 27.3204748,14 C28.6454006,14 29.7448071,12.8553459 29.7448071,11.475891 C29.7448071,11.475891 29.7448071,11.475891 29.7448071,11.475891 L31.5771513,11.475891 C31.8026706,11.475891 32,11.2704403 32,11.0356394 L32,8.5115304 C32,7.9245283 31.9154303,7.36687631 31.7462908,6.80922432 Z M17.6513353,12.6792453 C17.0311573,12.6792453 16.495549,12.1509434 16.495549,11.475891 C16.495549,10.8301887 17.0029674,10.2725367 17.6513353,10.2725367 C18.2715134,10.2725367 18.8071217,10.8008386 18.8071217,11.475891 C18.8071217,12.1509434 18.2997033,12.6792453 17.6513353,12.6792453 Z M27.3486647,12.6792453 C26.7284866,12.6792453 26.1928783,12.1509434 26.1928783,11.475891 C26.1928783,10.8301887 26.7002967,10.2725367 27.3486647,10.2725367 C27.9970326,10.2725367 28.4762611,10.8301887 28.4762611,11.475891 C28.4762611,12.1509434 27.9688427,12.6792453 27.3486647,12.6792453 Z M29.9985163,6.31027254 L26.2210682,6.31027254 C26.0237389,6.31027254 25.8827893,6.16352201 25.8827893,5.95807128 L25.8827893,3.99161426 C25.8827893,3.78616352 26.0237389,3.639413 26.2210682,3.639413 L29.1246291,3.639413 C29.2655786,3.639413 29.4065282,3.72746331 29.462908,3.87421384 L30.1676558,6.0754717 C30.1958457,6.19287212 30.111276,6.31027254 29.9985163,6.31027254 Z"
                          id="Shape"
                          fill="#373795"
                          fill-rule="nonzero"
                        ></path>
                        <line
                          x1="10"
                          y1="9.5"
                          x2="-1.06858966e-14"
                          y2="9.5"
                          id="Line-2"
                          stroke="#373795"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></line>
                        <line
                          x1="10"
                          y1="3.5"
                          x2="5.5"
                          y2="3.5"
                          id="Line-2-Copy"
                          stroke="#373795"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></line>
                        <line
                          x1="10"
                          y1="6.5"
                          x2="3.5"
                          y2="6.5"
                          id="Line-2-Copy-2"
                          stroke="#373795"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></line>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div class="cart-checkout">
        <cart-flyout-checkout-button
          @Country="setCountry"
          @DisplayPrice="setDisplayPrice"
          @click.native="handleCheckoutClick"
          :preventCheckout="isMobile"
          :class="[checkoutDisabled ? 'checkout-disabled' : null]"
          :key="2"
        />
      </div>

      <div class="value-props">
        <div class="value-props__badges">
          <div class="value-props__badges__img">
            <a
              href="https://www.trustedsite.com/verify?host=blendjet.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <img
                :src="optimizeSource({ url: '/images/blendjetPDP/TrustedSite.svg' })"
                alt="TrustedSite Seal"
                style="border: 1px solid #ccc;border-radius: 3px;"
              />
            </a>
          </div>
          <div class="value-props__badges__img">
            <a
              href="https://seal.digicert.com/seals/popup/?tag=6CDZP5Ti&url=blendjet.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <img :src="optimizeSource({ url: '/images/blendjetPDP/nortonsiteseal.svg' })" />
            </a>
          </div>
          <div class="value-props__badges__img">
            <a
              href="https://www.bbb.org/us/ca/concord/profile/online-shopping/blendjet-1116-882016/#sealclick"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <img :src="optimizeSource({ url: '/images/blendjetPDP/BBB-Seal.svg' })" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import CartFlyoutHeader from '~/components/nacelle/CartFlyoutHeader'
import CartFlyoutCheckoutButton from '~/components/nacelle/CartFlyoutCheckoutButton'
import CartItem from '~/components/nacelle/CartItem'

import CartUpsells from '~/components/CartUpsells'

import imageOptimize from '~/mixins/imageOptimize'
import customerChat from '~/mixins/customerChat'
import optimonk from '~/mixins/optimonk'

export default {
  components: {
    CartUpsells,
    CartFlyoutHeader,
    CartFlyoutCheckoutButton,
    CartItem
  },
  mixins: [imageOptimize, customerChat, optimonk],
  data() {
    return {
      showUpsell: false,
      isMobile: false,
      checkoutDisabled: false,
      country: 'US',
      displayPrice: null,
      cartMessage: ''
    }
  },
  computed: {
    ...mapState('cart', ['lineItems', 'cartVisible']),
    ...mapGetters('cart', ['cartSubtotal', 'cartBalance']),
    ...mapActions('cart', ['incrementLineItem', 'decrementLineItem'])
  },
  methods: {
    ...mapMutations('cart', ['showCart', 'hideCart', 'setFreeShippingThreshold']),
    handleClose() {
      this.hideCart()
    },
    handleCheckoutDisable(value) {
      this.checkoutDisabled = value
    },
    openUpsellModal() {
      this.showUpsell = true
    },
    closeUpsellModal() {
      this.showUpsell = false
    },
    setCountry(data) {
      this.country = data
    },
    setDisplayPrice(data) {
      this.displayPrice = data
    },
    handleCheckoutClick(e) {
      // If this is mobile, open the upsell.
      // Note the actual checkout redirection logic is handled in CartFlyoutCheckoutButton.vue
      this.isMobile && this.openUpsellModal()
    },
    async getProduct(handle) {
      var product = await this.$nacelle.data.product({
        handle: handle
      })

      return product
    },
    createUUID() {
      var result = ''
      var length = 16
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
      return result
    },
    async elevarViewCart() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var self = this
      var cartItems = []

      await this.lineItems.map(function (item, idx) {
        self.$nacelle.data
          .product({
            handle: item.handle
          })
          .then(function (p) {
            var productId = Buffer.from(p.pimSyncSourceProductId, 'base64')
              .toString('binary')
              .split('/')
              .pop()
            var variantId = Buffer.from(item.variant.id, 'base64')
              .toString('binary')
              .split('/')
              .pop()
            var object = {
              position: idx,
              id: item.variant.sku,
              product_id: productId,
              variant_id: variantId,
              name: item.title.replace("'", ''),
              category: 'NA',
              quantity: item.quantity,
              price: item.variant.price,
              brand: item.vendor.replace("'", ''),
              variant: item.variant.title
            }
            cartItems.push(object)
          })
      })
      window.dataLayer.push({
        event: 'dl_view_cart',
        event_id: uuid,
        cart_total: this.cartSubtotal,
        ecommerce: {
          currencyCode: 'USD',
          actionField: { list: 'Shopping Cart' },
          impressions: cartItems
        }
      })
      // console.log('wdl_vc:', window.dataLayer)
    }
  },
  watch: {
    lineItems(newValue) {
      // console.log('cart', newValue)
      if (newValue.length === 0) {
        // this.hideCart()
        this.checkoutDisabled = true
        if (this.isMobile) {
          this.hideCart()
        }
      } else {
        this.checkoutDisabled = false
      }
    },
    cartVisible(newValue) {
      if (this.cartVisible) {
        this.elevarViewCart()
      }

      this.toggleCustomerChat('cart')
      this.toggleOptimonkPopup('cart')
    },
    cartSubtotal() {
      // console.log('cart balance getter', this.cartBalance)
      if (!this.cartBalance) {
        this.checkoutDisabled = true
        this.cartMessage = 'Please Adjust the Number of Extend Plans'
      } else {
        this.checkoutDisabled = false
        this.cartMessage = ''
      }
    }
  },
  async mounted() {
    if (window.innerWidth <= 768) {
      this.isMobile = true
    }
    this.intl = localStorage.getItem('ww')
    if (!this.lineItems.length) {
      this.checkoutDisabled = true
    } else {
      this.checkoutDisabled = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 20px 0px 20px 20px #e6e6e6c4;
  display: flex;
}

.jetpack-upsell {
  @include gradient-primary-purple-turquoise(to bottom right);
  // background-image: linear-gradient(to bottom, #373795, #1e90bb 99%);
  width: 394px;
  display: flex;
  align-items: center;
  @include respond-to('small') {
    display: none;
  }
}

.blendjet-upsell {
  // @include gradient-secondary-turquoise(to bottom);
  @include gradient-primary-purple-turquoise(to bottom);
  width: 384px;
  display: flex;
  align-items: center;
  @include respond-to('small') {
    display: none;
  }
}

.checkout-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.cart-message {
  text-align: center;
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.17;
  text-transform: uppercase;
  margin-bottom: 5px;
  color: #dd0000;
}

.flyout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // position: fixed;

  width: 394px;
  background-color: #ffffff;
  border-left: 1px solid #dedede7a;
  @include gradient-primary-light-purple(to bottom);

  @media screen and (max-width: 768px) {
    width: 100%;
  }

  .cart-items {
    flex-grow: 5;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 20px;
  }
}

.value-props {
  &__payment-options {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    &__amazon {
      @include button-primary('white');
      background-color: #fbd676;
      height: 40px;
      width: 112px;
      margin-right: 10px;
      padding: 20px 20px 13px 20px;
      // padding-right: 20px;
      // padding-

      // margin-bottom: 15px;
    }

    &__apple {
      @include button-primary('white');
      background-color: black;
      height: 40px;
      width: 112px;
      // margin-bottom: 15px;
    }

    &__paypal {
      @include button-primary('white');
      background-color: #ffc51f;
      height: 40px;
      width: 112px;
      margin-left: 10px;

      &__logo {
        height: 19px;
      }
    }
  }
  // display: flex;
  // justify-content: center;
  &__badges {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;

    &__img {
      &:first-child {
        margin-right: 13px;
        margin-left: 12px;
      }
      &:last-child {
        margin-left: 13px;
        margin-right: 12px;
      }
    }
  }
}

.mobile-upsell {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  &__container {
    display: flex;
    flex-flow: column nowrap;
  }

  &__jetpacks {
    @include gradient-primary-purple-turquoise(to bottom);
  }

  &__blendjet {
    @include gradient-primary-purple-turquoise(to bottom right);
  }

  &__checkout {
    height: 80px;
    background-color: $primary-turquoise;
    padding: 15px;
    position: sticky;
    bottom: 0;
  }
}

.open-upsell-button {
  @include button-primary('purple');
  height: 50px;
}

.cart-checkout {
  padding: 10px 20px;
  @include respond-to('small') {
    padding: 10px;
  }
}

.shipping-time {
  height: 15px;
}
.free-shipping {
  display: flex;
  justify-content: center;
  @include respond-to('small') {
    padding: 0 10px;
  }
}

.mobile-divider-container {
  padding: 0 10px;
}

.mobile-divider {
  background-color: #343a40;
  width: 100%;
  display: block;
  height: 1px;
  margin: 15px 0;
  opacity: 0.5;
  @media screen and (min-width: 768px) {
    display: none;
  }
}

// .slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   transform: translateX(100%);
// }
.slide-enter-active {
  animation: slideInRight;
  animation-duration: 0.6s;
}

.slide-leave-active {
  animation: slideOutRight;
  animation-duration: 0.6s;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}

.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}

// 2147483644 fb z-index
</style>
