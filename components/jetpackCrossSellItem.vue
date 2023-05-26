<template>
  <div class="card" :style="cardStyle">
    <div class="card-image">
      <figure class="image" :style="cardContentStyle">
        <img
          class="jetpack-image"
          :style="imageStyle"
          :src="optimizeSource({url: variant.featuredMedia.src, width: 400})"
          @click="
            $router.push(
              `/products/${product.handle}?variant=${variant.formatedId}`
            )
          "
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <div class="jetpack-purchase">
          <div
            class="is-6 jetpack-title"
            :style="titleStyle"
            @click="
              $router.push(
                `/products/${product.handle}?variant=${variant.formatedId}`
              )
            "
          >
            {{ variant.title }}
          </div>
          <div class="rating">
            <!-- TODO: RATINGS ARE FOR PRODUCTS NOT VARIANTS.
                    WE SHOULD FIND A WAY TO DO THIS -->
            <loox-product-rating :product="product" />
          </div>
<!--           <div class="category">
            <div class="category__tag">{{ category }}</div>
          </div> -->
          <div class="add-to-cart">
            <div class="add-to-cart__quantity">
              <quantity-selector :quantity.sync="quantity" />
            </div>

            <div class="add-to-cart__add-button">
              <SubscriptionAddToCartButton
                :product="product"
                :variant="variant"
                :is-subscription-on="isSubscriptionActive"
                :all-options-selected="true"
                :only-one-option="true"
                :quantity="quantity"
                :showPrice="true"
              />
            </div>
          </div>
<!--           <div class="subscribe-select">
            <SubscriptionToggle
              :product="product"
              :checkbox="true"
              :value.sync="isSubscriptionActive"
            />
            <div class="info" @click="openRechargeModal">
              <Info />
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Tabs from './tabs';
// import JetpackPDPModal from '~/components/jetpackPDPModal'
import imageOptimize from '~/mixins/imageOptimize'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'
import RechargeModal from '~/components/rechargeModal'
import Info from '~/components/svg/info'

export default {
  data() {
    return {
      cardStyle: {
        background: 'transparent',
        boxShadow: 'none'
      },
      cardContentStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      imageStyle: {
        height: '275px',
        width: 'auto'
      },
      titleStyle: {
        textAlign: 'center',
        color: '#373795',
        fontSize: '12px',
        fontFamily: 'Bold',
        lineHeight: '1.17',
        letterSpacing: '1.75px',
        textTransform: 'uppercase',
        marginBottom: '8px'
      },
      category: 'Smoothie',
      frequency: null,
      quantity: 1,
      showIndicator: false,
      isSubscriptionActive: true
    }
  },
  mixins: [imageOptimize],
  methods: {
    openRechargeModal() {
      this.$modal.show(RechargeModal, {
        height: 'auto',
        adaptive: true,
        scrollable: false
      })
    }
  },
  watch: {

  },
  components: {
    Info,
    SubscriptionToggle,
    QuantitySelector,
    SubscriptionAddToCartButton,
    RechargeModal
  },
  props: {
    variant: {
      type: Object,
      default: () => null
    },
    product: {
      type: Object,
      default: () => null
    }
  }
}
</script>

<style scoped lang="scss">
.jetpack-cross-sell-container {
  padding-top: 50px;
  padding-bottom: 70px;
}

.heading-container {
  display: flex;
  justify-content: center;
  align-items: center;

  &__heading {
    font-family: Bold;
    font-size: 24px;
    line-height: 1.17;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 42px;
    color: $primary-purple;
    text-align: center;
  }
}

.rating {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.carousel-list .carousel-slides .carousel-slide {
  border: none !important;
}

.quantity-select {
  height: 40px;
}

.info {
  margin-left: 7px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;

  &__subheading {
    display: flex;
    justify-content: center;
    font-family: Regular;
    font-size: 12px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: 1.75px;
    text-align: center;
    color: $primary-purple;
    margin-bottom: 1.5rem;
  }
}

.jetpack-image,
.jetpack-title {
  cursor: pointer;
}

progress.is-small {
  height: 0.3rem;
  margin-bottom: 6px;
}

progress {
  background-color: #8b8edf;
}

.progress::-moz-progress-bar {
  background-color: #373795;
}

.carousel-indicator-container {
  height: 40px;
  display: flex;
  justify-content: center;
}

.carousel-indicator {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  width: 75vw;

  &__left {
    padding-right: 15px;
  }

  &__right {
    padding-left: 15px;
  }
}

.category {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  &__tag {
    background-color: $secondary-purple-4;
    border-radius: $border-radius;
    text-transform: uppercase;
    color: $primary-purple;
    font-size: 12px;
    padding-right: 1rem;
    padding-left: 1rem;
    line-height: 2.2;
    letter-spacing: 1.5px;
    font-family: Regular;
  }
}

.add-to-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 23px;
  &__quantity {
    margin-right: 15px;
  }
}

.subscribe-select {
  display: flex;
  justify-content: center;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s;
}
.scale-enter,
.scale-leave-active {
  opacity: 0;
  transform: scale(0.3) translateY(24px);
}
</style>
