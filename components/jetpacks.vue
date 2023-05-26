<template>
  <div class="home-jetpacks">
    <div class="title-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="197"
        height="49"
        viewBox="0 0 197 49"
      >
        <defs>
          <filter id="vp4rw77pva">
            <feColorMatrix
              in="SourceGraphic"
              values="0 0 0 0 0.215686 0 0 0 0 0.215686 0 0 0 0 0.584314 0 0 0 1.000000 0"
            />
          </filter>
          <path id="3nr89l9qzb" d="M1.155 0.38L21.663 0.38 21.663 37.079 1.155 37.079z" />
        </defs>
        <g fill="none" fill-rule="evenodd" transform="translate(-622 -47)">
          <g>
            <path
              fill="#373795"
              d="M178.313 48.62c2.26 0 4.318-1.951 4.318-4.265 0-2.105-1.593-3.753-3.802-3.753-2.315 0-4.268 2.16-4.268 4.217 0 2.054 1.594 3.801 3.752 3.801"
              transform="rotate(180 409.5 48)"
            />
            <g transform="rotate(180 409.5 48) translate(175 .287)">
              <path
                fill="#373795"
                d="M13.287 9.682c.255-1.593 1.13-2.518 2.568-2.518 1.132 0 1.643.412 2.003.822l3.805-5.242c-.618-.719-2.313-2.365-6.27-2.365-4.113 0-8.226 2.776-9.253 8.123L1.155 37.08h7.298l4.834-27.397z"
                mask="url(#o77xcsvq1c)"
              />
            </g>
            <path
              fill="#373795"
              d="M153.023 27.137h12.232c-.977 2.725-3.445 5.139-7.247 5.139-3.957 0-5.037-2.98-4.985-4.779v-.36zm4.319 10.947c8.991 0 15.52-8.017 15.52-16.242 0-6.785-4.986-11.101-11.359-11.101-6.425 0-10.278 3.238-12.695 7.556l5.757 1.799c.77-1.335 2.825-3.392 6.168-3.392 3.442 0 5.448 2.312 5.499 4.985 0 .153-.05.308-.05.463h-18.66l-.41 2.465c-.206 1.029-.257 2.004-.257 2.982 0 6.27 3.908 10.485 10.487 10.485zM131.068 30.991h-6.116l-1.13 6.376h6.115l-1.18 6.73h7.296l1.184-6.73h4.318l1.13-6.375h-4.317l2.107-11.874c.102-.615.153-1.131.153-1.696 0-3.959-2.465-6.68-6.68-6.68-3.855 0-6.116 1.336-7.145 2.26l2.159 5.398c.513-.413 1.283-.873 2.363-.873 1.182 0 1.747.614 1.747 1.694 0 .207 0 .514-.05.719l-1.954 11.051zM108.038 17.32c3.136 0 5.243 2.158 5.243 5.5 0 4.113-3.032 8.686-7.76 8.686-3.137 0-5.347-2.263-5.347-5.603 0-4.52 3.597-8.583 7.864-8.583m-4.472 20.765c4.163 0 6.732-2.16 8.12-3.545l.465 2.826h5.963l6.37-35.98h-7.296l-2.314 12.799c-.873-1.542-3.29-3.444-7.041-3.444-9.149 0-15.059 8.532-15.059 16.037 0 6.63 4.624 11.307 10.792 11.307M77.142 17.32c3.187 0 5.346 2.26 5.346 5.601 0 4.575-3.547 8.585-7.812 8.585-3.133 0-5.243-2.16-5.243-5.5 0-4.111 2.981-8.686 7.71-8.686zM67.79 34.643c.873 1.54 3.288 3.442 7.042 3.442 9.198 0 15.058-8.53 15.058-15.985 0-6.682-4.625-11.359-10.742-11.359-4.213 0-6.785 2.159-8.171 3.599l-.463-2.88h-5.964l-4.523 25.906h7.3l.463-2.723zM42.442 31.3c-2.518 0-4.165-1.387-4.522-3.753l-6.94 2.159c.615 4.781 4.884 8.378 10.589 8.378 9.816 0 15.776-7.915 15.776-15.778 0-6.785-4.933-11.565-11.666-11.565-5.6 0-10.074 2.982-12.592 7.865l6.218 2.21c1.234-2.108 3.187-3.29 5.604-3.29 3.188 0 5.191 2.107 5.191 5.343 0 3.96-2.828 8.43-7.658 8.43M9.026 37.367L18.124 29.194 14.887 47.44 22.184 47.44 28.557 11.46 21.261 11.46 19.821 19.683 17.302 21.947 11.856 11.46 3.682 11.46 11.597 27.085.186 37.367z"
              transform="rotate(180 409.5 48)"
            />
          </g>
        </g>
      </svg>
    </div>
    <div class="title-container__subheading">
      Ready-to-Blend Beverages
    </div>
    <div class="jetpack-tabs">
      <Tabs
        :tabItems="['lattes', 'protein smoothies', 'smoothies']"
        @activeTab="jetpackTabChange"
      />
    </div>
    <div class="blendjet-carousel">
      <b-carousel-list
        v-model="jetpackIndex"
        :data="jetpacks"
        :items-to-show="itemsToShow"
        :progress="false"
        :arrow="itemsToShow < jetpacks.length"
        :style="carouselStyle"
        :animated="'fade'"
        :repeat="true"
      >
        <template slot="item" slot-scope="props">
          <div class="card" :style="cardStyle">
            <div
              class="card-image"
              @click="$router.push(props.list.url)"
              :style="{
                'background-image': !props.isVarietyPack
                  ? getBGColor(props.title)
                  : getBGColor(jetpacksWithoutVarietyPack[imageIndex].title),
                height: '440px',
                cursor: 'pointer'
              }"
            >
              <figure class="image" :style="cardContentStyle">
                <img
                  v-if="!props.isVarietyPack"
                  class="jetpack-image"
                  :style="imageStyle"
                  :alt="props.featuredMedia.altText"
                  :src="optimizeSource({ url: props.featuredMedia.src, width: 500 })"
                />
                <template v-else>
                  <img
                    v-for="(variant, index) in jetpacksWithoutVarietyPack"
                    :key="index"
                    v-show="index === imageIndex"
                    class="jetpack-image"
                    :style="imageStyle"
                    :alt="variant.featuredMedia.altText"
                    :src="optimizeSource({ url: variant.featuredMedia.src, width: 500 })"
                  />
                </template>
              </figure>
            </div>
            <div class="card-content">
              <div class="content" style="text-align: center;">
                <nuxt-link
                  class="title is-6 jetpack-title"
                  :to="props.list.url"
                  :style="titleStyle"
                >
                  {{ props.displayName || props.title }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </template>
      </b-carousel-list>
    </div>
    <div class="carousel-indicator-container" v-if="indicatorVisible">
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
        <progress
          class="progress is-small"
          :value="itemsToShow + jetpackIndex"
          :max="jetpacks.length"
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
  </div>
</template>

<script>
import Tabs from './tabs'
import JetpackPDPModal from '~/components/jetpackPDPModal'
import imageOptimize from '~/mixins/imageOptimize'

export default {
  data() {
    return {
      jetpacks: [],
      jetpacksWithoutVarietyPack: [],
      screenWidth: null,
      jetpackIndex: 0,
      itemsToShow: 1,
      indicatorVisible: false,
      productPrice: 3.99,
      activeProductHandle: 'jetpack-latte',
      carouselStyle: {
        boxShadow: 'none'
      },
      cardStyle: {
        background: 'transparent',
        boxShadow: 'none',
        borderRadius: '0px'
      },
      cardContentStyle: {
        height: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      imageStyle: {
        height: '275px',
        width: 'auto'
      },
      titleStyle: {
        color: '#373795',
        fontSize: '12px',
        fontFamily: 'Bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1.17',
        textAlign: 'center',
        letterSpacing: '1.75px',
        textTransform: 'uppercase'
      },
      modalWidth: '100%',
      varietyPackIndex: 0,
      imageInterval: 1,
      imageIndex: null
    }
  },
  methods: {
    back() {
      this.jetpackIndex > 0 ? this.jetpackIndex-- : (this.jetpackIndex = 0)
    },
    forward() {
      this.jetpackIndex < this.jetpacks.length ? this.jetpackIndex++ : (this.jetpackIndex = 0)
    },
    openPDP(data) {
      this.$modal.show(
        JetpackPDPModal,
        { initialProduct: data, jetpackProps: this.jetpacks },
        {
          height: 'auto',
          width: this.modalWidth,
          scrollable: false,
          adaptive: true
        }
      )
    },
    formatVariantId(value) {
      const url = atob(value)
      return url.replace('gid://shopify/ProductVariant/', '')
    },
    showIndicator(arr) {
      if (this.screenWidth > 1024) {
        if (arr.length > 4) {
          this.indicatorVisible = true
        } else {
          this.indicatorVisible = false
        }
      } else {
        if (arr.length > 1) {
          this.indicatorVisible = true
        } else {
          this.indicatorVisible = false
        }
      }
    },

    setWidthData() {
      if (window.innerWidth < 1024) {
        this.itemsToShow = 1
        this.indicatorVisible = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        this.itemsToShow = 3
        this.indicatorVisible = true
      } else {
        this.itemsToShow = 4
        this.indicatorVisible = false
      }
    },

    // Needs update for additional colors
    getBGColor(item) {
      const title = item.toLowerCase()
      if (title.includes('strawberry banana')) {
        return 'linear-gradient(146deg, rgba(126,128,217,1) 0%, rgba(55,55,149,1) 100%)'
      } else if (title.includes('raspberry dragon fruit')) {
        return 'linear-gradient(146deg, #f098b3 8%, #f50e7d 88%)'
      } else if (title.includes('mango matcha')) {
        return 'linear-gradient(146deg, rgba(234,133,0,1) 0%, rgba(249,221,12,1) 100%)'
      } else if (title.includes('orange mango pineapple')) {
        return 'linear-gradient(146deg, rgba(234,133,0,1) 0%, rgba(249,221,12,1) 100%)'
      } else if (title.includes('banana blueberry')) {
        return 'linear-gradient(146deg, rgba(126,128,217,1) 0%, rgba(55,55,149,1) 100%)'
      } else if (title.includes('tropical blue')) {
        return 'linear-gradient(146deg, #9ad4e5 8%, #dcd372 88%)'
      } else if (title.includes('green peach ginger')) {
        return 'linear-gradient(146deg, rgba(249,214,97,1) 0%, rgba(255,243,202,1) 100%)'
      } else if (title.includes('mocha chia')) {
        return 'linear-gradient(147deg, #cab0b2 0%, #dbd3e8 100%)'
      } else if (title.includes('peanut butter power breakfast')) {
        return 'linear-gradient(146deg, #f89d4a 0%, #f1d7be 100%)'
      } else if (title.includes('chocolate peanut butter')) {
        return 'linear-gradient(146deg, rgba(126,128,217,1) 0%, rgba(55,55,149,1) 100%)'
      } else if (title.includes('blueberry acai')) {
        return 'linear-gradient(146deg, #3d3d78 0%, #8786c3 100%)'
      } else if (title.includes('very berry')) {
        return 'linear-gradient(146deg, rgba(229,128,140,1) 0%, rgba(219,30,53,1) 100%)'
      } else if (title.includes('vanilla')) {
        return 'linear-gradient(146deg, #e8ca99 8%, #cea262 88%)'
      } else if (title.includes('matcha green tea')) {
        return 'linear-gradient(146deg, #c2c486 8%, #8eaa1b 88%)'
      } else if (title.includes('caramel')) {
        return 'linear-gradient(146deg, #eddab6 8%, #d9a067 88%)'
      } else if (title.includes('chai')) {
        return 'linear-gradient(146deg, #db8f56 8%, #bc6a33 88%)'
      } else if (title.includes('cinnamon dolce')) {
        return 'linear-gradient(146deg, #dec698 8%, #c08429 88%)'
      } else if (title.includes('mocha')) {
        return 'linear-gradient(146deg, #ceb9ac 8%, #986c5b 88%)'
      } else {
        return 'none'
      }
    },
    async jetpackTabChange(value) {
      switch (value) {
        case 'lattes':
          this.activeProductHandle = 'jetpack-latte'
          await this.fetchProducts()
          break
        case 'smoothies':
          this.activeProductHandle = 'jetpack-smoothies'
          await this.fetchProducts()
          break
        case 'protein smoothies':
          this.activeProductHandle = 'jetpack-protein-smoothie'
          await this.fetchProducts()
          break
      }
    },
    async fetchProducts() {
      const product = await this.$nacelle.data.product({
        handle: this.activeProductHandle
      })

      if (product) {
        this.productPrice = product.priceRange.min
        if (product.availableForSale) {
          this.jetpacks = product.variants
            .filter(v => v.availableForSale)
            .map(variant => {
              const variantId = this.formatVariantId(variant.id)
              return {
                ...variant,
                formattedId: variantId,
                isVarietyPack: false,
                url: `/products/${product.handle}?variant=${variantId}`
              }
            })
          this.jetpacksWithoutVarietyPack = [...this.jetpacks]
          clearInterval(this.imageInterval)
          this.imageIndex = this.jetpacks.length - 1
          const varietyPackVariant = {
            displayName: `Variety Pack (${this.jetpacks.length})`,
            sku: 'variety-pack',
            isVarietyPack: true,
            featuredMedia: this.jetpacks[this.imageIndex].featuredMedia,
            title: this.jetpacks[this.imageIndex].title,
            url: `/products/${product.handle}?variant=varietypack`
          }

          this.jetpacks.unshift(varietyPackVariant)

          this.imageInterval = setInterval(() => {
            this.imageIndex++
            this.imageIndex = this.imageIndex % this.jetpacksWithoutVarietyPack.length
          }, 1000)
        }
      }
    }
  },

  components: {
    Tabs
  },
  mixins: [imageOptimize],
  async mounted() {
    this.screenWidth = window.innerWidth
    const vm = this

    // Get products by handle
    this.fetchProducts()

    this.setWidthData()
    window.addEventListener('resize', function () {
      if (window.innerWidth < 1024) {
        vm.itemsToShow = 1
        vm.indicatorVisible = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        vm.itemsToShow = 3
        vm.indicatorVisible = true
      } else {
        vm.itemsToShow = 4
        vm.indicatorVisible = false
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setWidthData)
    clearInterval(this.imageInterval)
  },
  beforeRouteLeave() {
    clearInterval(this.imageInterval)
  }
}
</script>

<style scoped lang="scss">
.item {
  height: 440px;
  width: 360px;
  @include gradient-primary-purple-turquoise(to bottom);
}

.carousel-list .carousel-slides .carousel-slide {
  border: none !important;
}

.jetpack-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 47px;
  padding-bottom: 14px;

  @include respond-to('small') {
    padding-top: 30px;
  }

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
    margin-bottom: 46px;
    text-transform: uppercase;

    @include respond-to('small') {
      margin-bottom: 25px;
    }
  }
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

.shop-all-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 135px;
}

.shop-all-button {
  @include button-primary('purple-ghost');
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
