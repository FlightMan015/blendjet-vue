<template>
  <div class="home-jetsetter">
    <div class="title-container">
      <h1 class="jetsetter-title">Accessories</h1>
    </div>
    <!--
    <div class="title-container__subheading">
      READY, SET, JETSET!
    </div>
-->
    <!-- <div class="jetpack-tabs">
      <Tabs :tabItems="['smoothies', 'protein smoothies', 'lattes']" @activeTab="jetpackTabChange"/>
    </div> -->
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
              @click="$router.push(`/products/${props.list.handle}`)"
              :style="{
                'background-image': getBGColor(props.list.title),
                height: '440px',
                cursor: 'pointer'
              }"
            >
              <figure class="image" :style="cardContentStyle">
                <img
                  class="jetpack-image"
                  :style="imageStyle"
                  :src="optimizeSource({ url: props.list.featuredMedia.src, width: 500 })"
                  :alt="props.list.featuredMedia.altText"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="content">
                <p
                  class="title is-6 jetpack-title"
                  :style="titleStyle"
                  @click="$router.push(`/products/${props.list.handle}`)"
                >
                  {{ props.list.title }}
                </p>
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
import imageOptimize from '~/mixins/imageOptimize'

import JetpackPDPModal from '~/components/jetpackPDPModal'
export default {
  data() {
    return {
      jetpacks: [],
      screenWidth: null,
      jetpackIndex: 0,
      itemsToShow: 1,
      indicatorVisible: false,
      carouselStyle: {
        boxShadow: 'none'
      },
      cardStyle: {
        background: 'transparent',
        boxShadow: 'none'
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
        textAlign: 'center',
        color: '#373795',
        fontSize: '12px',
        fontFamily: 'Bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1.17',
        letterSpacing: '1.75px',
        textTransform: 'uppercase',
        cursor: 'pointer'
      },
      modalWidth: '100%'
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
        { height: 'auto', width: this.modalWidth, scrollable: false, adaptive: true }
      )
    },
    showIndicator(arr) {
      if (this.screenWidth > 1024) {
        if (arr.length > 2) {
          this.indicatorVisible = false
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
        this.indicatorVisible = false
      } else {
        this.itemsToShow = 3
        this.indicatorVisible = false
      }
    },

    // Needs update for additional colors
    getBGColor(item) {
      const title = item.toLowerCase()
      if (title.includes('book')) {
        return 'linear-gradient(146deg, #7f7fd1 100%, #7f7fd1 100%)'
      } else {
        return 'linear-gradient(146deg, #E0E0FF 100%, #E0E0FF 100%)'
      }
    },
    jetpackTabChange(value) {}
  },
  mixins: [imageOptimize],
  async mounted() {
    this.screenWidth = window.innerWidth
    const vm = this
    this.jetpacks = await this.$nacelle.data
      .collectionPage({
        handle: 'accessories',
        paginate: false
      })
      .then(results => {
        const arr = results.filter(item => {
          return item.availableForSale
        })
        vm.showIndicator(arr)
        return arr
      })

    this.setWidthData()
    window.addEventListener('resize', function () {
      if (window.innerWidth < 1024) {
        vm.itemsToShow = 1
        vm.indicatorVisible = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        vm.itemsToShow = 3
        vm.indicatorVisible = false
      } else {
        vm.itemsToShow = 3
        vm.indicatorVisible = false
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setWidthData)
  }
}
</script>

<style scoped lang="scss">
.item {
  height: 440px;
  width: 360px;
  @include gradient-primary-purple-turquoise(to bottom);
}

.card {
  border-radius: 0;
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
.jetsetter-title {
  line-height: 32px;
  letter-spacing: 3.5px;
  font-size: 28px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: Bold;
  text-align: center;
  margin-bottom: 20px;
  color: #373975;
}
</style>
