<!--
/****
/* Individual products are loaded with the getProduct mixin.
/* For instructions related to connecting your inventory to
/* Nacelle, please refer to:
/*
/* https://docs.getnacelle.com/getting-started.html#_2-product-settings
/****
-->
<template>
  <div class="product" v-if="product">
    <!-- INELIGIBLE COUNTRY WARNING -->
    <ShippingIneligibilityWarning v-if="!isShippableToUser" />

    <!--
      Temporarily removing as part of release 1.1.0
      <div v-if="page && page.fields.productAnnouncement" class="">
        <div v-html="productAnnouncement" class="product-productAnnouncement"></div>
      </div>
    -->
    <!-- START BFCM - TEMP SALE HARDCODED -->

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
    <!-- END BFCM - TEMP SALE HARDCODED -->

    <!-- PDP Conditional -->
    <div class="product__scroll-pin" />
    <BlendjetPDP
      v-cloak
      :productType="product.productType"
      v-if="product.productType === 'BlendJet' || product.productType === 'Jetsetter'"
      :product="product"
      :page="page"
      :bundles="bundles"
      :variant-specific-bundles="variantSpecificBundles"
      :bundle-variety-pack="bundleVarietyPack"
      :variant-bundle-variety-pack="variantBundleVarietyPack"
    />
    <!-- <JetpackVariantPDP
      v-cloak
      v-else-if="
        ['jetpack smoothies'].includes(product.productType && product.productType.toLowerCase())
      "
      :product="product"
      :page="page"
    /> -->
    <ProductDetail
      v-cloak
      v-else
      :product="product"
      :page="page"
      :bundles="bundles"
      :variant-specific-bundles="variantSpecificBundles"
      :bundle-variety-pack="bundleVarietyPack"
      :variant-bundle-variety-pack="variantBundleVarietyPack"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import atob from 'atob'
import striptags from 'striptags'
// Mixins
import getProduct from '~/mixins/getProduct'
import viewEvent from '~/mixins/viewEvent'
import productMetafields from '~/mixins/productMetafields'
import productShippingEligibility from '~/mixins/productShippingEligibility'
// Components
import ProductDetail from '~/components/ProductDetail'
import BlendjetPDP from '~/components/blendJetPDP'
// import JetpackVariantPDP from '~/components/jetpackVariantPDP'
import ShippingIneligibilityWarning from '~/components/ProductShippingIneligibilityWarning'

export default {
  components: {
    ProductDetail,
    BlendjetPDP,
    // JetpackVariantPDP,
    ShippingIneligibilityWarning
  },
  jsonld() {
    const structuredDataList = []
    this.product &&
      this.product.variants.forEach(productVariant => {
        let structuredData = null
        const images = []
        let pageVariant = {}
        // fetch exact variant from contentful if available

        if (this?.page?.fields?.variants?.length) {
          this.page.fields.variants.forEach(contentfulVariant => {
            if (
              contentfulVariant.fields.title.toLowerCase() ===
              productVariant?.title?.toLowerCase()?.replace(/\s/g, '')
            ) {
              pageVariant = contentfulVariant.fields
            }
          })
        }

        // fetch main image (give preference to Contentful)

        if (pageVariant?.productImage?.fields?.file?.url) {
          images.push(pageVariant.productImage.fields.file.url)
        } else if (productVariant.featuredMedia?.src) {
          images.push(this.product.featuredMedia.src)
        }

        // fetch remaining media (give preference to Contentful)

        if (pageVariant?.heroImages?.length) {
          pageVariant.heroImages.forEach(item => {
            if (item?.fields?.file?.url && item.fields.file.url !== images[0]) {
              images.push(item.fields.file.url)
            }
          })
        } else if (this.product?.media?.length > 1) {
          this.product.media.forEach(media => {
            if (media.src !== images[0]) {
              images.push(media.src)
            }
          })
        }

        let price = productVariant.price
        if (this?.product?.metafields?.length) {
          this.product.metafields.forEach(item => {
            if (item.namespace === 'subscriptions' && item.key === 'discount_percentage') {
              price =
                Number(productVariant.price) -
                (Number(productVariant.price) * Number(item.value)) / 100
              price = price.toFixed(2)
            }
          })
        }

        let url = `https://blendjet.com${this.$route.path}`
        if (this.product?.variants?.length > 1) {
          url += `?variant=${this.formatVariantId(productVariant.id)}`
        }

        let description = this?.page?.metaDescription
          ? this?.page?.metaDescription
          : this?.product?.description
        description = striptags(description)
        if (description.length > 160) {
          description = description.slice(0, 160)
        }

        let ratingValue = this?.getMetafield('loox', 'avg_rating')
        if (!ratingValue) {
          ratingValue = '5'
        }
        let ratingCount = this?.getMetafield('loox', 'num_reviews')
        if (!ratingCount) {
          ratingCount = (Math.floor(Math.random() * 10) + 1) * 1000
        }

        structuredData = {
          '@context': 'http://www.schema.org',
          '@type': 'Product',
          brand: {
            '@type': 'Brand',
            name: 'BlendJet',
            logo:
              'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-2-logo.png?v=1616611844'
          },
          description: description,
          image: images,
          id: productVariant.sku,
          sku: productVariant.sku,
          name:
            this.product?.variants?.length === 1
              ? this.product.title
              : this.product.title + ' - ' + productVariant.title,
          category: this.product.productType,
          model: productVariant.title,
          offers: {
            '@type': 'Offer',
            availability: productVariant.availableForSale
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            price: price.toString(),
            priceCurrency: productVariant.priceCurrency,
            url: url
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: productVariant.priceCurrency
            }
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ratingValue,
            worstRating: '0',
            bestRating: '5',
            ratingCount: ratingCount
          }
        }

        // "review": {
        //     "@type": "Review",
        //     "reviewRating": {
        //       "@type": "Rating",
        //       "ratingValue": "4",
        //       "bestRating": "5"
        //     },
        //     "author": {
        //       "@type": "Person",
        //       "name": "Fred Benson"
        //     }
        //   },

        if (this.product?.variants?.length > 1) {
          structuredData.inProductGroupWithID = this.product.handle
        }
        if (productVariant?.availableForSale) {
          structuredDataList.push(structuredData)
        }
      })
    if (structuredDataList.length === 1) {
      return structuredDataList[0]
    }
    return structuredDataList
  },
  mixins: [getProduct(), productMetafields, viewEvent('product'), productShippingEligibility],
  computed: {
    ...mapGetters('space', ['getMetatag']),
    productAnnouncement() {
      return this.page?.fields.productAnnouncement?.content?.[0]?.content?.[0]
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView']),
    formatVariantId(value) {
      let url = ''
      if (atob) {
        url = atob(value)
      } else if (window && window.atob) {
        url = window.atob(value)
      }
      return url.replace('gid://shopify/ProductVariant/', '')
    }
  },

  mounted() {
    if (this.product) {
      console.log('product:', this.product)
      //  window.dataLayer = window.dataLayer || []
      //   var uuid = '!QAZxsw22143edfRf'
      //   var variant = this.product.variants[0]
      //   window.dataLayer.push({
      //     "event": "dl_view_item",
      //     "event_id": uuid,
      //     "ecommerce": {
      //       "currencyCode": this.product.priceRange.currencyCode,
      //       "detail": {
      //         "actionField": {'list': 'location.pathname'},
      //         "products": [{
      //           "name": this.product.title.replace("'", ''),
      //           "id": ((variant && variant.sku) || ""),
      //           "product_id": this.product.id,
      //           "variant_id": ((variant && variant.id) || ""),
      //           "image": this.product.featuredMedia.src,
      //           "price": this.product.priceRange.min,
      //           "brand": this.product.vendor.replace("'", ''),
      //           "variant": (variant && variant.title && (variant.title.replace("'", '')) || ""),
      //           "category": this.product.productType,
      //           "inventory": "NA",
      //           "list": 'location.pathname',
      //         }]
      //       }
      //     }
      //   })
      //   console.log('wdl:', window.dataLayer)
      this.productView(this.product)
      console.log('Page', this.page)
    }
  },
  head() {
    if (this.product) {
      let image = ''
      let pageVariant = {}
      let productVariant = []
      const variantId = this?.$route?.query?.variant

      // fetch exact variant from contentful if available
      productVariant = this.product?.variants?.filter(item => {
        if (Number(this.formatVariantId(item.id)) === Number(variantId)) {
          return item
        }
      })

      if (productVariant.length >= 1) {
        productVariant = productVariant[0]
      } else {
        productVariant = {}
      }

      if (this?.page?.fields?.variants?.length) {
        let matched = false
        this.page.fields.variants.forEach(contentfulVariant => {
          if (
            contentfulVariant.fields.title.toLowerCase() ===
            productVariant?.title?.toLowerCase()?.replace(/\s/g, '')
          ) {
            matched = true
            pageVariant = contentfulVariant.fields
          }
        })
        if (!matched) {
          pageVariant = this?.page?.fields?.variants[0]
        }
      }

      if (pageVariant?.productImage?.fields?.file?.url) {
        image = pageVariant.productImage.fields.file.url
      } else if (this.page?.fields?.metaImage) {
        image = this.page.fields.metaImage
      } else if (productVariant.featuredMedia?.src) {
        image = this.product.featuredMedia.src
      } else if (this.product?.featuredMedia?.src) {
        image = this.product.featuredMedia.src
      }
      let description = this.page?.fields?.metaDescription
        ? this.page?.fields?.metaDescription
        : this.product?.description
      description = striptags(description)
      if (description.length > 160) {
        description = description.slice(0, 160)
      }
      const title = this.page?.fields?.metaTitle ? this.page.fields.metaTitle : this.product.title

      let url = `https://blendjet.com${this.$route.path}`
      if (this.product?.variants?.length > 1 && productVariant?.id) {
        url += `?variant=${this.formatVariantId(productVariant.id)}`
      }

      const meta = [
        { hid: 'description', name: 'description', content: description },
        { hid: 'image', name: 'image', content: image },
        { hid: 'og:type', name: 'og:type', content: 'og:product' },
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:image', name: 'og:image', content: image },
        { hid: 'og:url', name: 'og:url', content: url },
        { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { hid: 'twitter:description', name: 'twitter:description', content: description },
        { hid: 'twitter:url', name: 'twitter:url', content: url }
      ]

      // if (!this.product.handle.includes('blendjet')) {
      //   meta.push({
      //     hid: 'og:title',
      //     property: 'og:title',
      //     content: fullTitle
      //   })
      // }

      if (
        this.product.handle === 'blendjet-2-influencer-kit' ||
        this.product.handle === 'blendjet-2-press-kit' ||
        this.product.handle === 'youtube-blendjet-2'
      ) {
        meta.push({
          name: 'robots',
          content: 'noindex'
        })
      }

      return {
        title,
        meta
      }
    }
  }
}
</script>

<style lang="scss" scoped>
[v-cloak] > * {
  display: none;
}
[v-cloak]::before {
  content: 'loading...';
}
.price {
  margin-bottom: 1rem;
}

.product__scroll-pin {
  width: 1px;
  height: 1px;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.product-meta .column {
  padding-bottom: 2rem;

  @media screen and (min-width: 769px) {
    padding-top: 3rem;
    padding-bottom: 0;
  }
}

.column.highlight {
  background-color: #f5f5f5;

  @media screen and (min-width: 769px) {
    padding: 3rem;
  }
}
</style>
