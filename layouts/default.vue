<template>
  <div
    class="app nacelle"
    :style="
      `padding-top: ${headerHeight}px; ${
        cartVisible && ($mq === 'md' || $mq === 'sm') ? 'max-height: 100vh; overflow: hidden' : ''
      }`
    "
  >
    <global-header ref="header" />
    <!-- <nuxt :style="{ 'margin-top': `${headerHeight}px` }" /> -->
    <nuxt :style="{ 'min-height': '100vh' }" />

    <!-- <site-footer /> -->
    <Footer v-if="showFooter" />
    <cookie-banner />
    <event-dispatcher />
    <error-modal />
    <cart-watch />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import localforage from 'localforage'
import GlobalHeader from '~/components/nacelle/GlobalHeader'
import EventDispatcher from '~/components/nacelle/EventDispatcher'
import CookieBanner from '~/components/nacelle/CookieBanner'
import ErrorModal from '~/components/nacelle/ErrorModal'
import CartWatch from '~/components/nacelle/CartWatch'
import Footer from '~/components/footer'

import { createClient } from '~/plugins/contentful.js'

// import '~/assets/bootstrap-imports.scss'

export default {
  components: {
    GlobalHeader,
    EventDispatcher,
    CookieBanner,
    ErrorModal,
    CartWatch,
    Footer
  },
  methods: {
    ...mapActions('cart', ['initializeCart']),
    ...mapActions('checkout', ['initializeCheckout']),
    ...mapActions('user', ['readSession', 'initUserCountry']),
    setHeader(indexPage = true) {
      if (this.$refs.header) {
        if (indexPage === 'index') {
          this.headerHeight = 40
        } else {
          // this.headerHeight = this.$refs.header.$el.clientHeight
          this.headerHeight = 100
        }
      }
    }
  },
  data() {
    return {
      routeName: '',
      headerHeight: 40,
      previewUrl: ''
    }
  },
  computed: {
    ...mapGetters('space', ['getMetatag']),
    ...mapState('cart', ['cartVisible']),
    showFooter() {
      const hideFooterPages = ['/recipes']
      if (hideFooterPages.includes(this.$route.fullPath)) {
        return false
      }
      return true
    }
  },
  created() {
    // Discounts
    if (process.client || process.browser) {
      if (this.$route.query && this.$route.query.discount) {
        localforage.setItem('discount', this.$route.query.discount)
      }
    }

    // Geolocation + Country blacklisting
    if (process.client || process.browser) {
      // This method hits the gointerpay API, which adds the user's location to the user store
      this.initUserCountry()
    }
  },
  async mounted() {
    this.setHeader(this.$nuxt.$route.name)
    await this.initializeCheckout()
    await this.initializeCart()

    if (process.env.DEV_MODE === 'true') {
      console.log('dev mode active!')
      localforage.clear()
    }
    this.readSession()
    Weglot.initialize({
      api_key: 'wg_2a912f6180e1cf676bb2149a31de8a0a9'
    })

    const client = createClient()

    client
      .getAsset('6GbAkBDBztUgEO6mC6Eabg')
      .then(asset => {
        // console.log('asset', asset)
        this.previewUrl = asset.fields.file.url
      })
      .catch(error => {
        console.log(error)
      })
  },
  watch: {
    '$nuxt.$route.name'(value) {
      this.setHeader(value)
      // track(value)
      // this.routeName = value;
      // if(value !== 'index') {
      //   this.setHeader();
      // }
      // console.log('value', value, this.routeName)
    }
  },
  head() {
    const properties = {}
    const meta = []
    // Nacelle MetaTags
    const title = this.getMetatag('title')
    // const description = this.getMetatag('description')
    // const image = this.getMetatag('og:image')

    if (title) {
      // properties.title = 'Meet BlendJet® - The Next-Gen Blender'
      // properties.title = title.value
      meta.push({
        hid: 'og:title',
        property: 'og:title',
        content: 'Meet BlendJet® - The Next-Gen Blender'
      })
      meta.push({
        hid: 'og:site_name',
        property: 'og:site_name',
        content: title.value
      })
    }

    // if (description) {
    // meta.push({
    //   hid: 'description',
    //   name: 'description',
    //   content: "The BlendJet 2 portable blender packs big blender power on the go. It crushes ice or almost anything. It even cleans itself. It's USB-C rechargeable and water-resistant too. Get your BlendJet 2 today!"
    // })
    meta.push({
      hid: 'og:description',
      property: 'og:description',
      content:
        "The BlendJet 2 portable blender packs big blender power on the go. It crushes ice or almost anything. It even cleans itself. It's USB-C rechargeable and water-resistant too. Get your BlendJet 2 today!"
    })
    // }

    // if (image) {
    meta.push({
      hid: 'og:image',
      property: 'og:image',
      content:
        'https://images.ctfassets.net/strhx3d94c40/6GbAkBDBztUgEO6mC6Eabg/72dd482c9a3c3a2177565efdca57616b/BlendJet-Social-Share-Thumbnail.png'
    })
    // }

    meta.push({
      hid: 'og:type',
      property: 'og:type',
      content: 'website'
    })

    meta.push({
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image'
    })

    meta.push({
      hid: 'twitter:url',
      name: 'twitter:url',
      content: 'https://blendjet.com'
    })

    meta.push({
      hid: 'twitter:title',
      name: 'twitter:title',
      content: 'Meet BlendJet® - The Next-Gen Blender'
    })

    meta.push({
      hid: 'twitter:description',
      name: 'twitter:description',
      content:
        "The BlendJet 2 portable blender packs big blender power on the go. It crushes ice or almost anything. It even cleans itself. It's USB-C rechargeable and water-resistant too. Get your BlendJet 2 today!"
    })

    meta.push({
      hid: 'twitter:image',
      property: 'twitter:image',
      content:
        'https://images.ctfassets.net/strhx3d94c40/6GbAkBDBztUgEO6mC6Eabg/72dd482c9a3c3a2177565efdca57616b/BlendJet-Social-Share-Thumbnail.png'
    })

    return {
      ...properties,
      meta,
      link: [
        {
          rel: 'canonical',
          href: `https://blendjet.com${this.$route.path}`
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.cart {
  z-index: 9999;
  background: white;
}

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.page-enter-active {
  animation: fadeIn;
  animation-duration: 0.3s;
}
.page-leave-active {
  animation: fadeOut;
  animation-duration: 0.3s;
  // transition: opacity 0.1s;
}

.page-enter,
.page-leave-active {
  // opacity: 0;
}
</style>
