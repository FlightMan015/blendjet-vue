<template>
  <transition name="slide">
    <div class="flyout nacelle" v-if="cartVisible">
      <cart-flyout-header @close="handleClose" />
      <!-- <cart-flyout-messaging>
        <messaging-free-shipping-counter />
      </cart-flyout-messaging> -->
      <div class="cart-items">
        <div v-for="item in lineItems" :key="item.variant.id" :item="item">
          <slot v-bind="item"></slot>
        </div>
      </div>
      <cart-flyout-subtotal />
      <cart-flyout-checkout-button />
    </div>
  </transition>
</template>

<script>
import CartFlyoutHeader from '~/components/nacelle/CartFlyoutHeader'
import CartFlyoutMessaging from '~/components/nacelle/CartFlyoutMessaging'
import MessagingFreeShippingCounter from '~/components/nacelle/MessagingFreeShippingCounter'
import CartFlyoutItem from '~/components/nacelle/CartFlyoutItem'
import CartFlyoutSubtotal from '~/components/nacelle/CartFlyoutSubtotal'
import CartFlyoutCheckoutButton from '~/components/nacelle/CartFlyoutCheckoutButton'
import { mapState, mapMutations, mapActions } from 'vuex'

import customerChat from '~/mixins/customerChat'
import optimonk from '~/mixins/optimonk'

export default {
  components: {
    CartFlyoutHeader,
    CartFlyoutMessaging,
    MessagingFreeShippingCounter,
    CartFlyoutItem,
    CartFlyoutSubtotal,
    CartFlyoutCheckoutButton
  },
  mixins: [customerChat, optimonk],
  computed: {
    ...mapState('cart', ['lineItems', 'cartVisible'])
  },
  methods: {
    ...mapMutations('cart', [
      'showCart',
      'hideCart',
      'setFreeShippingThreshold'
    ]),
    handleClose() {
      this.hideCart()
      this.showCustomerChat('cartflyout')
      this.showOptimonkPopup('cartflyout')
    }
  },
  watch: {
    lineItems(newValue) {
      if (newValue.length == 0) {
        this.hideCart()
        this.showCustomerChat('cartflyout')
        this.showOptimonkPopup('cartflyout')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flyout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 28rem;
  background-color: #ffffff;
  border-left: 1px solid #dedede7a;
  box-shadow: 20px 0px 20px 20px #e6e6e6c4;
  z-index: 999;

  

  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

.cart-items {
  flex-grow: 5;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 10px 20px;
}

.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(100%);
}
</style>
