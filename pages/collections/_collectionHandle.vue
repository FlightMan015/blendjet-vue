<!--
/****
/* Product collections are loaded with the getCollection mixin.
/* For information about creating collections, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/collections.html#adding-content-to-collections-pages
/****
-->
<template>
  <div>
    <div class="no-content" v-if="!loaded">
    </div>
  <!-- <transition name="fade"> -->
  <div class="page page-shop" v-if="collection && loaded">
    <div class="jp__container">
      <div class="jp__hero">
        <div class="jp__hero__text-block">
          <div class="jp__hero__text-block__logo">
            <svg width="140px" height="35px" viewBox="0 0 140 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>JetPackLogo</title>
                <defs>
                    <filter id="filter-1">
                        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"></feColorMatrix>
                    </filter>
                    <polygon id="path-2" points="0.292578297 0.272900256 14.9976099 0.272900256 14.9976099 26.6284818 0.292578297 26.6284818"></polygon>
                </defs>
                <g id="Collections" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="D-BlendJet-Collections-3" transform="translate(-650.000000, -246.000000)">
                        <g id="JetPackLogo" transform="translate(0.000000, 150.000000)" filter="url(#filter-1)">
                            <g transform="translate(720.000000, 113.500000) rotate(180.000000) translate(-720.000000, -113.500000) translate(650.000000, 96.000000)">
                                <path d="M127.789343,35 C129.469641,35 131,33.5395968 131,31.8085637 C131,30.2334234 129.815366,29 128.173482,29 C126.452292,29 125,30.616296 125,32.1552692 C125,33.6929952 126.184634,35 127.789343,35" id="Fill-1" fill="#030100"></path>
                                <g id="Group-5" transform="translate(125.000000, 0.000000)">
                                    <mask id="mask-3" fill="white">
                                        <use xlink:href="#path-2"></use>
                                    </mask>
                                    <g id="Clip-4"></g>
                                    <path d="M8.99138324,6.95333095 C9.17422665,5.80906496 9.80163049,5.14476829 10.8329629,5.14476829 C11.6444052,5.14476829 12.0112871,5.44041023 12.269419,5.73485524 L14.9977294,1.97050742 C14.554364,1.45463018 13.3389931,0.272062404 10.5019327,0.272062404 C7.55253709,0.272062404 4.60314148,2.26614936 3.86698764,6.10590384 L0.292578297,26.6284818 L5.5257239,26.6284818 L8.99138324,6.95333095 Z" id="Fill-3" fill="#030100" mask="url(#mask-3)"></path>
                                </g>
                                <path d="M109.506473,19.3935146 L118.442707,19.3935146 C117.729172,21.2870291 115.925852,22.9639766 113.148423,22.9639766 C110.257754,22.9639766 109.468726,20.8932708 109.506473,19.643667 L109.506473,19.3935146 Z M112.661369,27 C119.230518,27 124,21.429477 124,15.7141899 C124,10.9995124 120.358049,8 115.701807,8 C111.007819,8 108.192643,10.2502133 106.42707,13.2508838 L110.632786,14.5004876 C111.195335,13.5728392 112.69668,12.1437279 115.139259,12.1437279 C117.653679,12.1437279 119.119713,13.7500305 119.156242,15.6076435 C119.156242,15.7141899 119.119713,15.8218944 119.119713,15.9295989 L105.487055,15.9295989 L105.187516,17.6424479 C105.037747,18.3570035 105,19.0344996 105,19.7143118 C105,24.0711325 107.855358,27 112.661369,27 L112.661369,27 Z" id="Fill-6" fill="#030100"></path>
                                <path d="M93.9941686,21.5705292 L89.7787595,21.5705292 L89,26.1575476 L93.2142605,26.1575476 L92.4010426,31 L97.4296696,31 L98.2451847,26.1575476 L101.221241,26.1575476 L102,21.5705292 L99.0250928,21.5705292 L100.476939,13.0272823 C100.547005,12.5847699 100.582612,12.2130115 100.582612,11.8064758 C100.582612,8.95832709 98.8838134,7 95.9789715,7 C93.3222301,7 91.7635625,7.96177485 91.0548684,8.62614301 L92.542322,12.5104182 C92.8960947,12.2130115 93.4267538,11.8820267 94.171055,11.8820267 C94.9854215,11.8820267 95.3748012,12.324539 95.3748012,13.1016339 C95.3748012,13.2503373 95.3748012,13.4709939 95.3403428,13.618498 L93.9941686,21.5705292 Z" id="Fill-8" fill="#030100"></path>
                                <path d="M77.0708504,12.2884327 C79.3459477,12.2884327 80.8739619,13.8175666 80.8739619,16.1850674 C80.8739619,19.0992779 78.6750237,22.3393887 75.2454536,22.3393887 C72.9703564,22.3393887 71.367392,20.7358645 71.367392,18.3695445 C71.367392,15.1672192 73.9761379,12.2884327 77.0708504,12.2884327 M73.8274467,27 C76.8472091,27 78.7100809,25.4696853 79.7170714,24.4884418 L80.0543467,26.4910759 L84.3796909,26.4910759 L89,1 L83.7075581,1 L82.0296436,10.0673509 C81.3961947,8.9751124 79.6433302,7.62782143 76.9221592,7.62782143 C70.2866604,7.62782143 66,13.6723284 66,18.9894636 C66,23.6866797 69.3534111,27 73.8274467,27" id="Fill-10" fill="#030100"></path>
                                <path d="M55.0364996,12.5710716 C57.2773747,12.5710716 58.7951222,14.1414726 58.7951222,16.463489 C58.7951222,19.6425088 56.3010939,22.4289284 53.301931,22.4289284 C51.0985601,22.4289284 49.6148008,20.9280141 49.6148008,18.6071559 C49.6148008,15.7500914 51.7115191,12.5710716 55.0364996,12.5710716 L55.0364996,12.5710716 Z M48.459203,24.6084969 C49.0733341,25.6785932 50.7715705,27 53.4109276,27 C59.8792276,27 64,21.0727783 64,15.8925393 C64,11.2496648 60.7476839,8 56.4464226,8 C53.4835919,8 51.675187,9.49975619 50.7000781,10.5003657 L50.3742605,8.49914665 L46.1808238,8.49914665 L43,26.5008533 L48.1333854,26.5008533 L48.459203,24.6084969 Z" id="Fill-12" fill="#030100"></path>
                                <path d="M30.2598774,22.2853224 C28.4450345,22.2853224 27.2583602,21.3217725 27.0013275,19.6784103 L22,21.1781665 C22.4432012,24.5007924 25.5191858,27 29.6305076,27 C36.7049118,27 41,21.5001219 41,16.0361453 C41,11.3214678 37.4447816,8 32.5923889,8 C28.5567356,8 25.3330173,10.071864 23.5181743,13.4651347 L27.9994311,15.0007924 C28.8882357,13.5357796 30.29591,12.7146776 32.0374866,12.7146776 C34.3351666,12.7146776 35.7788735,14.1785322 35.7788735,16.4275875 C35.7788735,19.1792637 33.7406284,22.2853224 30.2598774,22.2853224" id="Fill-14" fill="#030100"></path>
                                <polygon id="Fill-16" fill="#030100" points="6.23156905 26.7207708 12.6452447 20.8145266 10.3636257 34 15.5072549 34 20 8 14.8563708 8 13.8412736 13.9423754 12.0660283 15.5779137 8.22651707 8 2.46490043 8 8.0444105 19.290995 0 26.7207708"></polygon>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
          </div>
          <div class="jp__hero__text-block__title">
            Smoothies
          </div>
        </div>
        <div class="jp__hero__media" v-if="media.jpHero">
          <picture>
            <img class="jp__hero__media__img" :src="optimizeSource({url: media.jpHero})" />
          </picture>
        </div>
      </div>

      <div class="variety-bundle">
        <!-- <div class="variety-bundle__heading">
          Jetpack Smoothie Variety Pack
        </div>
        <div class="variety-bundle__cta" role="button" @click="addVariety">
          Add to cart


        </div> -->
        <div class="variety-bundle__media">
          <picture>
            <img class="variety-bundle__media__img" :src="optimizeSource({url: media.varietyPack})" />
          </picture>
        </div>
      </div>

      <div class="jetpack-grid">
        <JetpackCrossSell />
      </div>/
    </div>
  </div>
  </div>
  <!-- </transition> -->
</template>

<script>
import getCollection from '~/mixins/getCollection'
import viewEvent from '~/mixins/viewEvent'
import ContentHeroBanner from '~/components/nacelle/ContentHeroBanner'
import ProductGrid from '~/components/ProductGrid'
import ObserveEmitter from '~/components/nacelle/ObserveEmitter'
// import JetpackFeatures from '~/components/jetpackFeatures'
import JetpackCrossSell from '~/components/jetpackCrossSellVariants'
import Ticker from '~/components/ticker'
import Testimonials from '~/components/testimonials'

import QuantitySelector from '~/components/nacelle/QuantitySelector'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton';
import { createClient } from '~/plugins/contentful.js'

import imageOptimize from '~/mixins/imageOptimize'

import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'collection',
  components: {
    ContentHeroBanner,
    ProductGrid,
    ObserveEmitter,
    // JetpackFeatures,
    JetpackCrossSell,
    Ticker,
    Testimonials
  },
  mixins: [
    getCollection(),
    viewEvent('collection'),
    imageOptimize
  ],
  data() {
    return {
      media: {}
    }
  },
  computed: {
    productData() {
      if (this.products) {
        return this.products
          .filter((item)=>{
            item.pimSyncSource === 'shopify'
          })
          .map(product => {
          const { tags, variants, ...rest } = product

          /// //////////////////////////
          /// //////////////////////////
          // Get product filter facets from variant data
          const variantOptions = variants.map(variant => {
            return variant.selectedOptions
          })

          const variantFacets = variantOptions
            .reduce((acc, item) => {
              return acc.concat(item)
            }, [])
            .map(option => JSON.stringify(option))

          const facets = Array.from(new Set(variantFacets))
            .map(option => JSON.parse(option))
            .map(option => {
              return { name: option.name.toLowerCase(), value: option.value }
            })

          /// //////////////////////////
          /// //////////////////////////
          // Get product filter facets from tags. Tags should be formatted "filter_property-name_value"
          const rootFacets = tags.filter(tag => tag.includes('filter'))

          rootFacets.forEach(facet => {
            const facetFragments = facet.split('_')
            const facetName = facetFragments[1]
            const facetValue = () => {
              const fragments = facetFragments[2].split('-')
              return fragments
                .map(fragment => {
                  return `${fragment
                    .charAt(0)
                    .toUpperCase()}${fragment.substring(1)}`
                })
                .join(' ')
            }

            rest[facetName] = facetValue()
            facets.push({ name: facetName, value: facetValue() })
          })

          if (product.productType) {
            facets.push({ name: 'productType', value: product.productType })
          }

          rest.minPrice = rest.priceRange.min

          return { ...rest, tags, variantOptions, variants, facets }
        })
      }

      return []
    },
    ...mapGetters('space', ['getMetatag']),
    featuredImage() {
      if (
        this.collection &&
        this.collection.featuredMedia &&
        this.collection.featuredMedia.src
      ) {
        // console.log
        return this.collection.featuredMedia.src
      }

      return null
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),
    addVariety() {

      
      // console.log('this.products', this.products)

      
    },
    expressAdd() {
      const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant: this.currentVariant,
          quantity: this.quantity || 1,
          productId: this.product.id,
          handle: this.product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          metafields: []
        }

        if(Object.keys(this.warrantySelected).length) {
          
          const warrantyItem = {
            image: this.warrantySelected.featuredMedia,
            title: this.warrantySelected.title,
            variant: this.warrantySelected.variants[0],
            quantity: this.quantity || 1,
            productId: this.warrantySelected.id,
            handle: this.warrantySelected.handle,
            vendor: this.warrantySelected.vendor,
            tags: this.warrantySelected.tags,
            metafields: []
          }
          this.addLineItem(warrantyItem)
        }
        this.addLineItem(lineItem) 
      
    },
  },
   async mounted() {
    this.screenWidth = window.innerWidth
    this.client = createClient()

     const pageEntry = await this.client.getEntry('1N3yJxKW3L604gWZFPQpKx')

      .then((entry) =>  {
          console.log('ctn entry', entry)
          entry.fields.blnPageImages.forEach((node) => {
            this.media[node.fields.title] = `https:${node.fields.file.url}`;
          })
          // entry.fields.sectionsCopy.forEach((node) => {
          //   this.pageCopy[node.fields.sectionName] = node.fields.sectionText
          // })
          this.loaded = true;
        }
      )
      .catch(err => console.log(err));
      // console.log('media', this.media)
  },
  head() {
    if (this.collection) {
      const properties = {}
      const meta = []
      const title = this.getMetatag('title')

      if (this.collection.title) {
        let fullTitle = this.collection.title

        if (title) {
          fullTitle = `${fullTitle} | ${title.value}`
        }

        properties.title = fullTitle
        meta.push({
          hid: 'og:title',
          property: 'og:title',
          content: fullTitle
        })
      }

      if (this.collection.description) {
        meta.push({
          hid: 'description',
          name: 'description',
          content: this.collection.description
        })
        meta.push({
          hid: 'og:description',
          property: 'og:description',
          content: this.collection.description
        })
      }

      if (this.featuredImage) {
        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: this.featuredImage
        })
      }

      return {
        ...properties,
        meta
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.no-content {
  height: 100vh;
}
.product {
  .title {
    font-weight: bold;
  }
  img {
    width: 250px;
  }
}

.jp {
  &__hero {
    position: relative;
    height: 280px;

    &__text-block {
      position: absolute;
      width: 100%;
      // width: 800px;
      margin: 0 auto;
      top: 47%;
      left: 50%;
      transform: translate(-50%,-50%);
      // width: 600px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      z-index: 100;

      &__title {
        font-family: Bold;
        font-size: 36px;
        line-height: 1.17;
        letter-spacing: 6.67px;
        text-transform: uppercase;
        color: $grayscale-white;
        text-align: center;
      }


    }

    &__media {

      &__img {
        display: block;
        height: 280px;
        object-fit: cover;
        object-position: center;
        width: 100%;
      }
    }
  }
}

.variety-bundle {
  // height: 586px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-image: linear-gradient(to top, #474699, #ffffff);
  // padding: 40px;

  &__heading {
    max-width: 320px;
    font-family: Bold;
    font-size: 24px;
    line-height: 1.17;
    letter-spacing: 3.5px;
    color: $primary-purple;
    text-align: center;
    text-transform: uppercase;
    margin-top: 40px;
    margin-bottom: 25px;

    @include respond-to('small') {
      font-size: 18px;
      line-height: 1.33;
      letter-spacing: 2.5px;

    }
  }

  &__media {
    margin-top: 70px;
    @include respond-to('small') {
      margin-top: 30px;
    }
    &__img {
      height: 455px;

      @include respond-to('small') {
        height: 170px;
      }
    }
  }

  &__cta {
    @include button-primary('purple');
    height: 40px;
    width: 320px;
    margin-bottom: 30px;
  }

}

// .jetpack-features {
//   @include gradient-primary-purple-turquoise(to bottom);
//   padding-top: 50px;
// }

// .jetpack-section {
//   // padding: 45px;

//   &__navigation {
//     // background-color: $primary-purple-tint;
//     // height: 253px;
//     // display: flex;
//     // flex-flow: column nowrap;
//     // justify-content: center;
//     // align-items: center;
//     // padding: 15px;

//     // @include respond-to('small') {

//     // }

//     &__heading {
//       font-family: Medium;
//       font-size: 28px;
//       letter-spacing: 3.5px;
//       line-height: 1;
//       text-transform: uppercase;
//       color: $primary-purple;
//       text-align: center;
//       margin-bottom: 15px;
//     }

//     &__thumb-container {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     }

//     &__thumbnail {
//       margin-left: 40px;
//       margin-right: 40px;

//       @include respond-to('small') {
//         margin-left: 0;
//         margin-right: 0;
//       }
//       &__img-container {
//         width: 107px;
//         display: flex;
//         justify-content: center;
//       }

//       &__img {
//         height: 100px;
//         width: auto;
//       }

//       &__text {
//         text-align: center;
//         font-family: Bold;
//         font-size: $text-small;
//         color: $primary-purple;
//         line-height: 1.17;
//         letter-spacing: 1.75px;
//         text-transform: uppercase;
//       }
//     }
//   }

//   &__category {
//     padding-left: 45px;
//     padding-right: 45px;
//     padding-bottom: 15px;

//     @include respond-to('small') {
//       padding-left: 10px;
//       padding-right: 10px;
//     }

//     &__hero {
//       display: flex;
//       flex-flow: column nowrap;
//       justify-content: center;
//       align-items: center;
//       height: 400px;
//       background-position: center;
//       background-size: cover;
//       border-radius: 15px;
//       margin-bottom: 20px;

//       @include respond-to('small') {
//         height: 240px;
//       }

//       &__text {
//         font-family: Bold;
//         font-size: 36px;
//         line-height: 1.17;
//         letter-spacing: 6.67px;
//         text-transform: uppercase;
//         color: $grayscale-white;
//         margin-bottom: 15px;
//         text-align: center;
//       }

//       &__button {
//         @include button-primary('purple')

//       }
//     }
//   }
// }

.as-seen-on-ticker {
  padding-top: 25px;
  height: 135px;
  background-color: $primary-purple;
}

.testimonials {

}

.hero-smoothie {
  background-image: url('/images/collection/col-smoothies-bg.jpg');
}

.hero-protein {
  background-image: url('/images/collection/col-protein-bg.jpg');
}

.hero-latte {
  background-image: url('/images/collection/col-latte-bg.jpg');
}

.cta-button {
  @include button-primary('purple')
}


</style>
