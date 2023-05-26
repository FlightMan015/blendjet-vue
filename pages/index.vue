<template>
  <div class="page">
    <div v-if="this.noPageData">
      <div class="section section__hero-banner">
        <div class="section__hero-banner__cta">
          <div class="section__hero-banner__cta__text">
            <transition name="slideRight">
              <div v-if="loaded" class="section__hero-banner__cta__text__line1">
                The Original
              </div>
            </transition>
            <transition name="slideLeft">
              <div v-if="loaded" class="section__hero-banner__cta__text__line2">
                Portable Blender
              </div>
            </transition>
          </div>
          <transition name="slideUp">
            <a href="/products/blendjet-2">
              <div v-if="loaded" class="section__hero-banner__cta__button" role="button">
                Get Yours Today
              </div>
            </a>
          </transition>
        </div>
        <div class="section__hero-banner__media">
          <div class="section__hero-banner__media__desktop">
            <video
              class="section__hero-banner__media__desktop__video"
              v-if="loaded"
              autoplay="autoplay"
              loop="loop"
              muted=""
              webkit-playsinline=""
              playsinline=""
            >
              <source :src="externalDesktopVideoUrl" type="video/mp4" />
            </video>
          </div>
          <div class="section__hero-banner__media__mobile">
            <video
              class="section__hero-banner__media__mobile__video"
              v-if="loaded"
              autoplay="autoplay"
              loop="loop"
              muted=""
              webkit-playsinline=""
              playsinline=""
            >
              <source :src="externalMobileVideoUrl" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <!-- START BFCM -->

<div class="outer-canvas-bfcm" style="margin-bottom:unset" data-v-1b05d426="">
  <div class="canvas-bfcm" data-v-1b05d426="">
    <div class="col-bfcm" data-v-1b05d426="">
      <span class="entry-title-bfcm" data-v-1b05d426="">Spring Sale</span>
      <span class="content-split-element-bfcm" data-v-1b05d426="">Free Next-Gen Recipe Book</span>
      <span class="simple-text-bfcm" data-v-1b05d426=""
        >With Each BlendJet <b class="b-hide-bfcm" data-v-1b05d426="">|</b>
        <span data-v-1b05d426="">Discount Applied at Checkout</span>
      </span>
    </div>
  </div>
</div>

      <!-- END BFCM -->

      <div class="section section__as-seen-on">
        <Ticker type="asSeenOn" :img-list="imgList" />
      </div>
      <div class="section section__blendjet-demo">
        <BlendJetDemo :demo="demoImg" />
      </div>
      <div class="section section__free-shipping">
        <FreeShippingMarquee />
      </div>

      <div class="section section__jetpacks">
        <Jetpacks />
      </div>

      <div
        class="section section__jetsetter"
        :class="{ sm: isVisibleToUserCountry(homeMarketPlaceSection) }"
      >
        <Jetsetter />
      </div>

      <div
        v-if="isVisibleToUserCountry(homeMarketPlaceSection) && homeProducts.length"
        class="section section__jetsetter"
      >
        <HomeMarketplace :page="homeMarketPlaceSection" :product-list="homeProducts" />
      </div>
      <div class="section section__about-video">
        <div class="title-container">
          <h1 class="jetsetter-title">Our Story</h1>
        </div>
        <div style="position:relative;width:100%;height:0;padding-bottom:56.27198%;">
          <iframe
            style="position:absolute;top:0;left:0;width:100%;height:100%;"
            width="500"
            height="294"
            src="https://www.youtube.com/embed/Eo4MMePM4R0?&theme=dark&color=white&autohide=1&modestbranding=1&showinfo=0&rel=0"
            frameborder="0"
          ></iframe>
        </div>
      </div>
      <div class="section section__recipes">
        <div class="section__recipes__list">
          <RecipesList />
        </div>
        <div class="section__recipes__explore">
          <div class="section__recipes__explore__container">
            <video
              class="section__recipes__explore__image"
              v-if="loaded"
              autoplay="autoplay"
              loop="loop"
              muted=""
              webkit-playsinline=""
              playsinline=""
            >
              <source :src="videos.externalBlendEndlesslyVideoUrl" type="video/mp4" />
            </video>
            <div class="section__recipes__explore__content">
              <div class="section__recipes__explore__content__text">
                Blend
                <div class="section__recipes__explore__content__text__line2">Endlessly</div>
              </div>
              <n-link to="/recipes" class="section__recipes__explore__content__cta-button">
                Explore Recipes
              </n-link>
            </div>
          </div>
        </div>
      </div>

      <div class="section section__instagram">
        <Instagram />
      </div>
    </div>
  </div>
</template>

<script>
import atob from 'atob'
import nmerge from 'nuxt-merge-asyncdata'
import getPage from '~/mixins/getPage'
import { mapMutations } from 'vuex'
import getCollection from '~/mixins/getCollection'
import PageContent from '~/components/nacelle/PageContent'
import Ticker from '~/components/ticker'
import debounce from 'lodash.debounce'
import JetpacksProtein from '~/components/jetpacksProtein'
import Jetpacks from '~/components/jetpacks'
import Jetsetter from '~/components/jetsetter'
import HomeMarketplace from '~/components/HomeMarketplace'
import RecipesList from '~/components/recipes-list'
import BlendJetDemo from '~/components/blendjetDemo'
import imageOptimize from '~/mixins/imageOptimize'
import FreeShippingMarquee from '~/components/freeShippingMarquee'
import locationBasedRendering from '~/mixins/locationBasedRendering'

import { createClient } from '~/plugins/contentful.js'
const Instagram = () => import('~/components/instagram')
const client = createClient()

export async function getProductDetails($nacelle, productItem) {
  const productObj = {
    productHandle: productItem?.fields?.product?.fields?.handle,
    product: null,
    locale: $nacelle.locale,
    variant: null
  }
  const selectedVariant = productItem?.fields?.variant?.fields

  if (process.server) {
    const fs = require('fs')
    try {
      const file = fs.readFileSync(
        `./static/data/products/${productObj.productHandle}--${productObj.locale}/static.json`,
        'utf-8'
      )
      productObj.product = JSON.parse(file)
    } catch (err) {
      productObj.noProductData = true
    }
  } else {
    productObj.product = await $nacelle.data
      .product({
        handle: productObj.productHandle,
        locale: productObj.locale
      })
      .catch(() => {
        productObj.noProductData = true
      })
  }

  if (!productObj?.product?.availableForSale) {
    return null
  }

  // If a specific variant is selected, fetch that variant if available for sale or find the next available variant for sale
  if (productObj.product && selectedVariant) {
    productObj.product.variants.forEach(variant => {
      if (
        variant?.title?.toLowerCase()?.replace(/\s/g, '') === selectedVariant.title.toLowerCase() &&
        variant.availableForSale
      ) {
        productObj.variant = variant
      }
    })
  }

  if (productObj.product && !productObj.variant) {
    // get the first available variant eligible for sale
    productObj.product.variants.forEach(variant => {
      if (variant.availableForSale && !productObj.variant) {
        productObj.variant = variant
      }
    })
  }
  return productObj
}

export function formatVariantId(value) {
  const url = atob(value)
  return url.replace('gid://shopify/ProductVariant/', '')
}

export default nmerge({
  data() {
    return {
      blendJetPDPData: {},
      loaded: false,
      screenWidth: null,
      scrollY: null,
      jetpackLoaded: false,
      client: null,
      blendEndlesslyUrl: null,
      images: {},
      videos: {},
      metaTitle: '',
      metaDescription: ''
    }
  },
  components: {
    PageContent,
    Ticker,
    RecipesList,
    Jetpacks,
    JetpacksProtein,
    Jetsetter,
    Instagram,
    BlendJetDemo,
    FreeShippingMarquee,
    HomeMarketplace
  },
  computed: {
    name() {
      return this.$store.state.space.name
    }
  },

  head() {
    const properties = {}
    const meta = []
    const mdescription = this.metaDescription
    const title = this.metaTitle
    if (title.length) {
      properties.title = title
    }

    if (mdescription.length) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: mdescription
      })
    }

    return { ...properties, meta }
  },

  async asyncData(context) {
    const $nacelle = context.app.$nacelle
    // hard reference hero image for now
    const demoImg = await client
      .getAsset('2826IGPC4SeJ3ZxguhTAZ4')
      .then(val => val.fields?.file.url)

    const asSeenOn = await client.getEntry('4v2ivlGIfJKH4R36emO0jo').then(async res => {
      return res
    })
    const imgList = []
    if (asSeenOn?.fields?.externalImages?.length) {
      asSeenOn.fields.externalImages.forEach(item => {
        imgList.push(item?.fields)
      })
    }

    const homeMarketPlaceSection = await client
      .getEntries({
        content_type: 'homepageMarketplace',
        include: 2
      })
      .then(async res => {
        return res
      })

    const homeProducts = []
    const products = homeMarketPlaceSection?.items?.[0]?.fields?.products
    if (products?.length) {
      for (let i = 0; i < products.length; i++) {
        const productItem = products[i]
        const fetched = await getProductDetails($nacelle, productItem)
        if (!fetched) {
          continue
        }
        fetched.gradiantColor1 = productItem?.fields?.gradiantColor1
        fetched.gradiantColor2 = productItem?.fields?.gradiantColor2
        const variantId = formatVariantId(fetched?.variant?.id)
        fetched.url = `/products/${fetched?.product?.handle}?variant=${variantId}`
        homeProducts.push(fetched)
      }
    }

    return {
      demoImg,
      imgList,
      homeMarketPlaceSection: homeMarketPlaceSection?.items?.[0] || {},
      homeProducts
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    test() {
      console.log('click')
    },

    setWindowSize() {
      this.screenWidth = window.innerWidth
    },

    scrollLoad() {
      this.scrollY = window.scrollY
    },
    handleScroll(event) {
      this.scrollY = window.scrollY
      if (this.screenWidth <= 768) {
        if (this.scrollY >= 911) {
          this.jetpackLoaded = true
        }
      }

      if (this.screenWidth > 768) {
        if (this.scrollY >= 1281) {
          this.jetpackLoaded = true
        }
      }
    },
    mountScrollWatch() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 0)
      window.addEventListener('scroll', this.handleDebouncedScroll, {
        passive: true
      })
    },
    removeScrollWatch() {
      window.removeEventListener('scroll', this.handleDebouncedScroll)
    }
  },
  async mounted() {
    if (process.client) {
      this.setWindowSize()
      this.handleScroll()
      this.mountScrollWatch()
      this.client = createClient()

      await this.client.getEntry('YvRGvKeTPPzBNES6g7Hle').then(entry => {
        this.metaTitle = entry.fields.metaTitle
        this.metaDescription = entry.fields.metaDescription
        this.externalDesktopVideoUrl = entry.fields.externalDesktopVideoUrl
        this.externalMobileVideoUrl = entry.fields.externalMobileVideoUrl
        this.videos.externalBlendEndlesslyVideoUrl = entry.fields.externalBlendEndlesslyVideoUrl
        entry.fields.blnPageImages.forEach(node => {
          this.images[node.fields.title] = `${node.fields.file.url}`
        })

        entry.fields.blnPageVideos.forEach(node => {
          this.videos[node.fields.title] = `${node.fields.file.url}`
        })

        this.loaded = true
      })

      window.onresize = this.setWindowSize()

      if (this.$route.query && this.$route.query.cart) {
        this.showCart()
      }
    }
  },

  beforeDestory() {
    window.onresize = null
    this.removeScrollWatch()
  },
  jsonld() {
    return {
      '@context': 'http://www.schema.org',
      '@type': 'Organization',
      name: 'BlendJet',
      url: 'https://blendjet.com/',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          telephone: '+1 844-588-1555',
          email: 'support@blendjet.com'
        }
      ],
      sameAs: [
        'https://www.facebook.com/blendjet/',
        'https://www.instagram.com/BlendJet/',
        'https://twitter.com/BlendJet',
        'https://www.pinterest.com/blendjet/',
        'https://www.youtube.com/channel/UCYCxpRsXpNh2REeyATMo_8w'
      ],
      logo:
        'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-2-logo.png?v=1616611844',
      image:
        'https://images.ctfassets.net/strhx3d94c40/1YTbF5tGizsjmmGtmDf7tx/c3593da25daef024771437dac2589dfb/BLENDJET-2-HERO-LANDSCAPE-CROP-BLACK.jpeg?w=2100',
      description:
        "The BlendJet 2 portable blender packs big blender power on the go. It crushes ice or almost anything. It even cleans itself. It's USB-C rechargeable and water-resistant too. Get your BlendJet 2 today!"
    }
  },
  mixins: [
    getPage({ pageHandle: 'homepage' }),
    getCollection({ collectionHandle: 'homepage' }),
    imageOptimize,
    locationBasedRendering
  ]
})
</script>

<style scoped lang="scss">
.page {
  overflow-x: hidden;
}
.section {
  width: 100%;
  padding: 0;

  &__hero-banner {
    position: relative;
    @include gradient-primary-purple-turquoise('to bottom');
    @include respond-to('small') {
      height: auto;
    }
    &__cta {
      position: absolute;
      width: 100%;
      margin: 0 auto;
      top: 47%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      z-index: 100;

      &__text {
        color: $grayscale-white;
        text-align: center;
        text-shadow: 0px 0px 10px #7a7a7a;

        &__line1 {
          font-family: Medium;
          font-size: 54px;
          line-height: 1;
          letter-spacing: 10px;
          margin-bottom: 10px;

          @include respond-to('small') {
            font-size: 28px;
            line-height: 1.14;
            letter-spacing: 3.5px;
          }
        }

        &__line2 {
          font-family: BoldItalic;
          font-size: 54px;
          line-height: 1;
          letter-spacing: 10px;
          margin-bottom: 21px;

          @include respond-to('small') {
            font-size: 28px;
            line-height: 1.14;
            letter-spacing: 3.5px;
          }
        }
      }

      &__button {
        @include button-primary('white');
        height: 40px;
        width: 240px;
        box-shadow: 0px 0px 10px #7a7a7a;
      }
    }

    &__media {
      transition: all 1s ease;
      @include respond-to('small') {
        min-height: 400px;
      }

      &__desktop {
        // video format 1920x748
        // height: 38.95%
        min-height: 38.95vw;
        @include respond-to('small') {
          display: none;
        }
        &__video {
          min-height: 38.95vw;
          width: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }
      }

      &__mobile {
        min-height: 400px;
        @media screen and (min-width: 1024px) {
          display: none;
        }
        &__video {
          height: 400px;
          display: block;
          object-fit: cover;
          object-position: center;
          width: 100%;
        }
      }
    }
  }

  &__as-seen-on {
    position: relative;
    height: 135px;
    background-color: $primary-purple;
    padding-top: 25px;
  }

  &__jetpacks {
    background-color: $primary-purple-tint;
    min-height: 730px;
    @include respond-to('small') {
      height: auto;
    }
  }

  &__jetsetter {
    background-color: $primary-purple-tint;
    min-height: 640px;
    &.sm {
      min-height: 640px;
    }
    @include respond-to('small') {
      height: auto;
    }
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

  &__recipes {
    height: 680px;
    display: flex;
    flex-flow: row wrap;
    @media screen and (max-width: 768px) {
      height: auto;
    }

    &__list {
      width: 50%;
      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }

    &__explore {
      width: 50%;
      @media screen and (max-width: 768px) {
        width: 100%;
      }

      &__container {
        position: relative;
        width: 100%;
        height: 680px;
      }

      &__image {
        object-fit: cover;
        object-position: center;
        width: 100%;
        height: 680px;
      }

      &__content {
        position: absolute;
        width: 100%;
        margin: 0 auto;
        top: 47%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        z-index: 100;

        @include respond-to('small') {
        }

        &__text {
          color: $grayscale-white;
          font-size: 54px;
          line-height: 54px;
          letter-spacing: 10px;
          text-transform: uppercase;
          text-align: center;
          font-family: Medium;
          @include respond-to('small') {
            font-size: 28px;
            line-height: 1.14;
            letter-spacing: 3.5px;
            display: flex;
          }

          &__line2 {
            font-family: BoldItalic;
            @include respond-to('small') {
              margin-left: 9px;
            }
          }
        }

        &__cta-button {
          margin-top: 1.5rem;
          text-align: center;
          @include button-primary('white-ghost');
        }
      }
    }
  }

  &__instagram {
    @include gradient-primary-light-purple(to top);
    @media screen and (max-width: 768px) {
      height: auto;
    }
  }

  &__free-shipping {
    @include gradient-primary-purple-turquoise(to left);
    height: 80px;
    display: flex;
    align-items: center;
    @include respond-to('small') {
      height: 55px;
    }
  }
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 1.2s;
}

.fade-leave-active {
  animation: fadeOut;
  animation-duration: 1.2s;
}

.slideRight-enter-active {
  animation: slideInRight;
  animation-duration: 1.2s;
}

.slideLeft-enter-active {
  animation: slideInLeft;
  animation-duration: 1.2s;
}

.slideUp-enter-active {
  animation: slideInUp;
  animation-duration: 1.2s;
}
</style>
