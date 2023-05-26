<template>
  <div class="jetpack-pdp-container" v-if="productData && jetpacks.length">
    <div class="close" @click="$modal.hideAll">X</div>
    <div class="jetpack-title">
      {{ formatTitle(productData.title) }}
    </div>
    <div class="rating">
      <loox-product-rating :product="productData" />
    </div>
    <div class="category">
      <div class="category__tag">{{ category }}</div>
    </div>
    <div class="price-container">
      <product-price :price="productData.variants[0].price" />
    </div>
    <div class="image-carousel">
      <b-carousel
        :arrow="true"
        :arrow-hover="false"
        :repeat="true"
        :autoplay="false"
        :indicator-inside="false"
        :has-drag="true"
      >
        <b-carousel-item v-for="(image, i) in productData.media" :key="i">
          <figure class="is-image image-carousel__slide">
            <picture>
              <img
                :style="imageStyle"
                :src="optimizeSource({ url: image.src })"
                :alt="`${image.altText}`"
              />
            </picture>
          </figure>
        </b-carousel-item>
      </b-carousel>
    </div>
    <div class="jetpack-dropdown-container">
      <JetpackDropdown
        v-if="jetpacks"
        :items="jetpacks"
        :product="productData"
        @update="updateJetpack"
      />
    </div>
    <div class="subscribe-select">
      <div class="subscribe-select__selector">
        <SubscriptionToggle
          :product="productData"
          :variant="productData.variants[0]"
          :metafields.sync="productData.metafields"
          :frequency.sync="frequency"
        />
      </div>
      <div class="subscribe-select__info">
        <div>How do subscriptions work?</div>
        <div class="subscribe-select__info__icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              fill="#373975"
              d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="add-to-cart-container">
      <div class="add-to-cart-container__quantity">
        <quantity-selector :quantity.sync="quantity" />
      </div>

      <div class="add-to-cart-container__add-button" @click="$modal.hideAll">
        <SubscriptionAddToCartButton
          :product="productData"
          :variant="productData.variants[0]"
          :metafields="productData.metafields"
          :all-options-selected="true"
          :only-one-option="true"
          :quantity="quantity"
        />
      </div>
    </div>
    <div class="shipping-notification">
      <div class="shipping-notification__label">Want it by {{ shippingTime }}?</div>
      <div class="shipping-notification__countdown">Order within {{ shippingCountdown }}</div>
    </div>
    <div class="learn-more">
      <a>Learn More </a>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton'
import JetpackDropdown from '~/components/jetpackDropdown'

export default {
  props: {
    initialProduct: {
      type: Object,
      required: true
    },
    jetpackProps: {
      type: Array,
      required: true
    }
  },
  mixins: [imageOptimize],
  components: {
    QuantitySelector,
    SubscriptionAddToCartButton,
    JetpackDropdown,
    SubscriptionToggle
  },
  data() {
    return {
      imageStyle: {
        height: '252px',
        width: 'auto'
      },
      currency: '$',
      currentIndex: 0,
      productData: { ...this.initialProduct },
      jetpackMenuVisible: false,
      shippingTime: 'saturday, October 23rd',
      shippingCountdown: '1 hr, 23 minutes',
      quantity: 1,
      category: ' Jetpack Smoothies',
      jetpacks: [...this.jetpackProps],
      rating: 5,
      frequency: null,
      isSubscription: true
    }
  },
  methods: {
    formatList() {
      for (let i = 0; i < this.jetpacks.length; i++) {
        if (this.jetpacks[i].title === this.initialProduct.title) {
          this.jetpacks.splice(i, 1)
          this.jetpacks.unshift(this.initialProduct)
        }
      }
    },
    updateJetpack(jetpack) {
      this.productData = this.jetpacks.filter(item => {
        return item.title === jetpack.title
      })[0]
    },
    toggleJetpackMenu() {
      this.jetpackMenuVisible = !this.jetpackMenuVisible
    },
    formatTitle(title) {
      return title.split('-')[0].trim()
    },
    handleJetpackMenu() {
      if (this.jetpackMenuVisible) {
        this.jetpackMenuVisible = !this.jetpackMenuVisible
      }
    }
  },
  mounted() {
    this.formatList()
    if (screen.width < 768) {
      this.imageStyle.height = '232px'
    }
  }
}
</script>

<style lang="scss" scoped>
.jetpack-pdp-container {
  padding: 0.5rem 1rem 1rem 1rem;
}
.close {
  text-align: right;
  font-size: 18px;
  font-family: Bold;
  color: $primary-purple;
  cursor: pointer;
}

.jetpack-title {
  color: $primary-purple;
  font-family: Regular;
  font-size: 24px;
  letter-spacing: 3.5px;
  text-align: center;
  line-height: 1.17;
  margin-bottom: 5px;
}

.rating {
  display: flex;
  justify-content: center;
  margin-bottom: 11px;
}

.category {
  display: flex;
  justify-content: center;
  margin-bottom: 11px;
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

.price-container {
  display: flex;
  justify-content: center;
  text-align: center;
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.25;
  letter-spacing: 1.75px;
  margin-bottom: 30px;

  &__price {
    color: $primary-purple;
  }

  &__compare-at {
    text-decoration: line-through;
    color: $secondary-purple-2;
  }
}

.carousel {
  width: 410px;
}

.carousel-items {
  justify-content: center;
}

.product-media {
  height: 360px;
  width: auto;
}

.image-carousel {
  display: flex;
  justify-content: center;

  &__slide {
    display: flex;
    justify-content: center;
  }
}

.jetpack-dropdown-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.subscribe-select {
  margin-top: 15px;
  margin-bottom: 20px;

  &__selector {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  &__info {
    display: flex;
    justify-content: center;
    line-height: 1.38;
    letter-spacing: 0.46px;
    font-family: Regular;
    font-size: 13px;
    color: $primary-purple;

    &__icon {
      padding-left: 10px;
    }
  }
}

.shipping-notification {
  font-family: Bold;
  letter-spacing: 1.75px;
  text-align: center;
  line-height: 1.33;
  font-size: $text-small;
  margin-bottom: 20px;
  margin-top: 20px;
  text-transform: uppercase;

  &__label {
    color: $primary-purple;
  }

  &__countdown {
    color: $secondary-purple-2;
  }
}

.add-to-cart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  &__quantity {
    margin-right: 15px;
  }
}

.learn-more {
  text-align: center;
  justify-content: center;
  align-items: center;
  & > a {
    text-transform: uppercase;
    line-height: 1.17;
    letter-spacing: 1.75px;
    font-family: Bold;
    text-decoration: none;
    font-size: $text-small;
    color: $primary-purple;
  }
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}

.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
</style>
