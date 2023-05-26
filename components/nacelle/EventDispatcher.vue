<template>
  <div></div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import decodeBase64 from "~/mixins/decodeBase64"
export default {
  mixins: [decodeBase64],
  computed: {
    ...mapState('events', ['log']),
    ...mapState(['facebookCatalogID']),
    ...mapGetters('cart', ['quantityTotal']),
    ...mapState('cart', ['lineItems']),
    productIDs() {
      const vm = this
      const productIDs = vm.lineItems.map(item => {
        return vm.decodeBase64VariantId(item.id)
      })
      return productIDs
    },
    logEntry() {
      // console.log('log entry', JSON.parse(JSON.stringify(this.log)).pop())
      return JSON.parse(JSON.stringify(this.log)).pop()
    },
    ga() {
      return process.browser ? window.ga : undefined
    },
    gtag() {
      return process.client ? window.gtag : undefined
    },
    pintrk() {
      return process.browser ? window.pintrk : undefined
    },
    snaptr() {
      return process.browser ? window.snaptr : undefined
    }
  },
  watch: {
    log(log) {
      const vm = this
      switch (vm.logEntry.eventType) {
        case 'PAGE_VIEW':
          vm.elevarPageView()
          vm.pinterestPageView()
          vm.snapPageView()
          vm.googleAnalyticsPageView()
          vm.googleTagPageView()
          break
        case 'PRODUCT_VIEW':
          vm.snapProductView()
          vm.googleAnalyticsProductView()
          vm.googleTagProductView()
          vm.klaviyoProductView()
          break
        case 'ADD_TO_CART':
          vm.pinterestAddToCart()
          vm.snapAddToCart()
          vm.googleAnalyticsAddToCart()
          vm.googleTagAddToCart()
          vm.klaviyoAddToCart()
          break
        case 'REMOVE_FROM_CART':
          vm.googleAnalyticsRemoveFromCart()
          break
        case 'CHECKOUT_INIT':
          break
      }
    }
  },
  methods: {
    decodeBase64ProductId(encodedId) {
      const variantIdBase64 = encodedId.split('::')[0]
      const variantIdString = Buffer.from(variantIdBase64, 'base64').toString(
        'ascii'
      )
      const variantId = variantIdString.split('gid://shopify/Product/')[1]

      return variantId
    },
    decodeBase64VariantId(encodedId) {
      const variantIdBase64 = encodedId.split('::')[0]
      const variantIdString = Buffer.from(variantIdBase64, 'base64').toString(
        'ascii'
      )
      const variantId = variantIdString.split(
        'gid://shopify/ProductVariant/'
      )[1]

      return variantId
    },
    createUUID() {
      var result = ''
      var length = 16
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
      return result
    },
    // firing this allows for more granular control of Facebook's PageView events in gtag
    elevarPageView() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
     
      window.dataLayer.push({
        event: 'dl_page_view',
        event_id: uuid
      })
    },
    /// / PAGE VIEW METHODS /////////////////////////////////
    pinterestPageView() {
      if (typeof this.pintrk !== 'undefined') {
        this.pintrk('load', process.env.PINTEREST_ID)
        this.pintrk('page')
        this.pintrk('track', 'pagevisit')
      }
    },
    snapPageView() {
      if (typeof this.snaptr !== 'undefined') {
        this.snaptr('init', process.env.SNAP_ID)
//        this.snaptr('init', 'e52aa5a4-67c5-48ab-8bf6-418523957576') //Added for BEN
        this.snaptr('track', 'PAGE_VIEW')
      }
    },
    googleAnalyticsPageView() {
      if (typeof this.ga !== 'undefined') {
        const vm = this
        this.ga('send', 'pageview', vm.logEntry.payload.url)
      }
    },
    googleTagPageView() {
      if (typeof this.gtag !== "undefined") {
        const vm = this
        this.gtag("event", "page_view", {
          send_to: "AW-758185293",
          items: [
            {
              id: vm.logEntry.payload.path,
              google_business_vertical: "retail"
            }
          ]
        })
      }
    },

    /// / PRODUCT VIEW METHODS //////////////////////////////
    snapProductView() {
      if (typeof this.snaptr !== 'undefined') {
        this.snaptr('track', 'VIEW_CONTENT')
      }
    },
    klaviyoProductView() {
      if ((process.client || process.browser) && window && window._learnq) {
        var _learnq = _learnq || []
        const vm = this
        // console.log('klaviyo', vm.logEntry)
        var item = {
          Name: vm.logEntry.payload.product.title,
          ProductID: vm.decodeBase64Id(
            vm.logEntry.payload.product.pimSyncSourceProductId
          ),
          // Categories: vm.logEntry.payload.product.productType,
          ImageURL: vm.logEntry.payload.product.featuredMedia.src,
          URL:
            "https://www.blendjet.com/products" +
            vm.logEntry.payload.product.handle,
          // Brand: vm.logEntry.payload.product.vendor,
          Price: vm.logEntry.payload.product.priceRange.min,
          CompareAtPrice: vm.logEntry.payload.product.priceRange.max
        }
        _learnq.push(["track", "Viewed Product", item])
        _learnq.push([
          "trackViewedItem",
          {
            Title: item.Name,
            ItemId: item.ProductID,
            Categories: item.Categories,
            ImageUrl: item.ImageURL,
            Url: item.URL,
            Metadata: {
              Price: item.Price,
              CompareAtPrice: item.CompareAtPrice
            }
          }
        ])
      }
    },
    googleAnalyticsProductView() {
      if (typeof this.ga !== 'undefined') {
        const vm = this
        this.ga('ec:addProduct', {
          id: vm.decodeBase64ProductId(vm.logEntry.payload.product.id),
          name: vm.logEntry.payload.product.title
        })
        this.ga('ec:setAction', 'detail')
        this.ga('send', 'pageview')
      }
    },

    googleTagProductView() {
      if (typeof this.gtag !== "undefined"
            // &&this.logEntry
            // &&this.logEntry.product
            // &&this.logEntry.product.variants.length
          ) {
        const vm = this
        // console.log('gtag product', vm.logEntry)
        this.gtag("event", "view_item", {
          send_to: "AW-758185293",
          value: vm.logEntry.payload.product.variants[0].price,
          items: [
            {
              id: vm.decodeBase64Id(
                vm.logEntry.payload.product.pimSyncSourceProductId
              ),
              google_business_vertical: "retail"
            }
          ]
        })
      }
    },

    /// / ADD TO CART METHODS ///////////////////////////////
    pinterestAddToCart() {
      if (typeof this.pintrk !== 'undefined') {
        const vm = this
        pintrk('track', 'AddToCart', {
          value: vm.logEntry.payload.product.variant.price,
          product_price: vm.logEntry.payload.product.variant.price,
          product_name: vm.logEntry.payload.product.title,
          product_id: vm.decodeBase64VariantId(
            vm.logEntry.payload.product.variant.id
          ),
          currency: 'USD'
        });
      }
    },
    snapAddToCart() {
      if (typeof this.snaptr !== 'undefined') {
        this.snaptr('track', 'ADD_CART')
      }
    },
    googleAnalyticsAddToCart() {
      if (typeof this.ga !== 'undefined') {
        const vm = this
        this.ga('ec:addProduct', {
          id: vm.decodeBase64ProductId(vm.logEntry.payload.product.variant.id),
          name: vm.logEntry.payload.product.title
        })
        this.ga('ec:setAction', 'add')
        this.ga('send', 'event', 'UX', 'click', 'add to cart')
      }
    },

    googleTagAddToCart() {
      if (typeof this.gtag !== "undefined") {
        const vm = this

        this.gtag("event", "add_to_cart", {
          send_to: "AW-758185293",
          value: vm.logEntry.payload.product.variant.price,
          items: [
            {
              id: vm.decodeBase64VariantId(vm.logEntry.payload.product.variant.id),
              google_business_vertical: "retail"
            }
          ]
        })
      }
    },

    klaviyoAddToCart() {
      if ((process.client || process.browser) && window && window._learnq) {
        const vm = this
        var _learnq = _learnq || []
        var item = {
          Name: vm.logEntry.payload.product.title,
          ProductID: vm.decodeBase64Id(
            vm.logEntry.payload.product.pimSyncSourceProductId
          ),
          Categories: vm.logEntry.payload.product.productType,
          ImageURL: vm.logEntry.payload.product.image.src,
          URL:
            "https://www.blendjet.com/products" +
            vm.logEntry.payload.product.handle,
          Brand: vm.logEntry.payload.product.vendor,
          Price: vm.logEntry.payload.product.variant.price,
          CompareAtPrice: vm.logEntry.payload.product.variant.compareAtPrice
        }
        console.log('Klaviyo Test')
        _learnq.push(["track", "Added to Cart", item])
      }
    },


    /// / REMOVE FROM CART METHODS ///////////////////////////////
    googleAnalyticsRemoveFromCart() {
      if (typeof this.ga !== 'undefined') {
        const vm = this
        this.ga('ec:addProduct', {
          id: vm.logEntry.payload.product.variant.id,
          name: vm.logEntry.payload.product.variant.title
        })
        this.ga('ec:setAction', 'remove')
        this.ga('send', 'event', 'UX', 'click', 'remove from cart')
      }
    },

    /// / CHECKOUT INITIATION METHODS ///////////////////////////////

  }
}
</script>
