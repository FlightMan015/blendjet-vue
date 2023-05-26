<template>
  <div class="jetpack-cross-sell-container" v-if="jetpacks">
    <div class="heading-container" v-if="heading">
      <div class="heading-container__heading">
        {{ heading }}
      </div>
    </div>

    <div class="blendjet-carousel">
      <b-carousel-list
        v-model="jetpackIndex"
        :data="jetpacks"
        :items-to-show="itemsToShow"
        :progress="false"
        :arrow="false"
        :style="carouselStyle"
        :repeat="true"
      >
        <template slot="item" slot-scope="props">
          <JetpackCrossSellItem :product="currentProduct" :variant="props" />
        </template>
      </b-carousel-list>
    </div>
    <div class="carousel-indicator-container" v-if="showIndicator">
      <div class="carousel-indicator">
        <div class="carousel-indicator__left" @click="back">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">
            <g fill="none" fill-rule="evenodd" transform="matrix(-1 0 0 1 28 1)">
              <circle cx="13.5" cy="13.5" r="13.5" stroke="#373795" stroke-width="1.5" />
              <g fill="#373795">
                <path
                  d="M0 3.6L9 3.6 9 5.4 0 5.4z"
                  transform="matrix(-1 0 0 1 19 6) rotate(-45 4.5 4.5)"
                />
                <path
                  d="M0 8.678L9 8.678 9 10.478 0 10.478z"
                  transform="matrix(-1 0 0 1 19 6) scale(1 -1) rotate(-45 -18.624 0)"
                />
              </g>
            </g>
          </svg>
        </div>
        <progress class="progress is-small" :value="jetpackIndex + 1" :max="jetpacks.length"
          >15%</progress
        >
        <div class="carousel-indicator__right" @click="forward">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">
            <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
              <circle cx="13.5" cy="13.5" r="13.5" stroke="#373795" stroke-width="1.5" />
              <g fill="#373795">
                <path
                  d="M0 3.6L9 3.6 9 5.4 0 5.4z"
                  transform="matrix(-1 0 0 1 19 6) rotate(-45 4.5 4.5)"
                />
                <path
                  d="M0 8.678L9 8.678 9 10.478 0 10.478z"
                  transform="matrix(-1 0 0 1 19 6) scale(1 -1) rotate(-45 -18.624 0)"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <!-- <div class="shop-all-container">
      <button class="shop-all-button">Shop all jetpacks</button>
    </div> -->
  </div>
</template>

<script>
import JetpackCrossSellItem from '~/components/jetpackCrossSellItem'

export default {
  data() {
    return {
      currentProduct: null,
      jetpacks: null,
      screenWidth: 0,
      jetpackIndex: 0,
      itemsToShow: 1,
      rating: 4.8,
      carouselStyle: {
        boxShadow: 'none'
      },
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
      category: '',
      frequency: null,
      quantity: 1,
      showIndicator: false
    }
  },

  methods: {
    back() {
      this.jetpackIndex > 0 ? this.jetpackIndex-- : (this.jetpackIndex = 0)
    },
    forward() {
      this.jetpackIndex < this.jetpacks.length ? this.jetpackIndex++ : (this.jetpackIndex = 0)
    },
    formatTitle(title) {
      return title.split('-')[0].trim()
    },
    setWidthData() {
      console.log('size', window.innerWidth)
      if (window.innerWidth < 1024) {
        this.itemsToShow = 1
        this.showIndicator = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        this.itemsToShow = 3
        this.showIndicator = true
      } else {
        this.itemsToShow = 4
        this.showIndicator = false
      }
    },
    async fetchProduct(productHandle) {
      //TODO: Add default handle as a prop?
      const product = await this.$nacelle.data.product({
        handle: productHandle
      })

      return product
    },
    addVariantIds(product) {
      return product.variants.map(variant => {
        if (variant.availableForSale) {
          variant['formatedId'] = this.formatVariantId(variant.id)
          return variant
        }
      })
    },
    formatVariantId(value) {
      const url = atob(value)
      return url.replace('gid://shopify/ProductVariant/', '')
    }
  },

  components: {
    JetpackCrossSellItem
  },
  props: {
    heading: {
      type: String,
      default: ''
    },
    product: {
      type: Object,
      default: () => null
    }
  },
  async mounted() {
    if (this.product) {
      this.currentProduct = this.product
      this.jetpacks = this.currentProduct.variants.filter(variant => {
        return variant.availableForSale
      })
    } else {
      this.currentProduct = await this.fetchProduct('jetpack-smoothies')

      if (this.currentProduct && this.currentProduct.availableForSale) {
        this.jetpacks = this.addVariantIds(this.currentProduct)
      }
    }

    this.setWidthData()
    const vm = this
    window.addEventListener('resize', function() {
      if (window.innerWidth < 1024) {
        vm.itemsToShow = 1
        vm.showIndicator = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        vm.itemsToShow = 3
        vm.showIndicator = true
      } else {
        vm.itemsToShow = 4
        vm.showIndicator = false
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setWidthData)
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
