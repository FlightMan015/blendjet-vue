<template>
  <div class="product-grid columns is-multiline is-paddingless nacelle">
    <div v-for="(item, index) in products" :key="item.id" class="search-results__grid__item" :class="columnClasses" @click="elevarSearchClick(item, index)">
      <router-link :to="`${pathFragment}${item.handle}`" >
        <div>
          <img class="search-results__grid__item__img" :src=" item.featuredMedia.src" />
        </div>
        <div class="search-results__grid__item__container">
          <div class="search-results__grid__item__title"> 
            {{item.title}}
          </div>
          <div class="search-results__grid__item__rating">
            <loox-product-rating :product="item" />
         </div>
          <div class="search-results__grid__item__category">
          </div>
          <div class="search-results__grid__item__price">
            <product-price :price="item.priceRange.min" />                                  
          </div>
        </div>
      </router-link>
      <!-- <product-card
        :product="product"
        :showQuantityUpdate="showQuantityUpdate"
        :showAddToCart="showAddToCart"
      /> -->
    </div>
  </div>
</template>

<script>
import ProductCard from '~/components/nacelle/ProductCard'
import imageOptimize from '~/mixins/imageOptimize'
import ProductPrice from '~/components/nacelle/ProductPrice'

export default {
  data() {
    return {
    }
  },
  components: {
    ProductCard,
     ProductPrice,
  },
  mixins: [imageOptimize],
  props: {
    products: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Number,
      default: 4
    },
    showQuantityUpdate: {
      type: Boolean,
      default: true
    },
    showAddToCart: {
      type: Boolean,
      default: true
    },
    pathFragment: {
      type: String,
      default: '/products/'
    }
  },
  computed: {
    columnClasses() {
      let classes = 'column'

      if (this.columns === 4) {
        classes = `${classes} is-one-quarter-desktop`
      }

      if (this.columns === 3) {
        classes = `${classes} is-one-third-desktop`
      }

      if (this.columns === 2) {
        classes = `${classes} is-half-desktop`
      }

      classes = `${classes} is-half-tablet`

      return classes
    }
  },
  methods: {
    createUUID() {
        var result = ''
        var length = 16
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
        return result
    },
    elevarProductsView() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var visibleProducts = this.products.map(function(product, idx) {
        var variant = product.variants[0]
        
        return {
          name: product.title.replace("'", ''),
          id: ((variant && variant.sku) || ""),
          product_id: product.id,
          variant_id: variant.id,
          price: variant.price,
          brand: product.vendor.replace("'", ''),
          position: idx,
          category: product.productType,
          list: location.pathname
        };
      })
      window.dataLayer.push({
        "event": "dl_search_results",
        "event_id": uuid,
        "ecommerce": {
          "currencyCode": 'USD',
          "actionField": { "list": 'search results' },
          "impressions": visibleProducts
        }
      })
      // console.log('wdl_search-grid:', window.dataLayer)
    },
    createUUID() {
        var result = ''
        var length = 16
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
        return result
    },
    elevarSearchClick(product, idx) {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var variant = product.variants[0]
      var clickedProduct =  {
        name: product.title.replace("'", ''),
        id: ((variant && variant.sku) || ""),
        product_id: product.id,
        variant_id: ((variant && variant.id) || ""),
        price: variant.price,
        brand: product.vendor.replace("'", ''),
        position: idx,
        category: product.productType,
        list: location.pathname
      }

      window.dataLayer.push({
        "event": "dl_select_item",
        "event_id": uuid,
        "ecommerce": {
          "currencyCode": 'USD',
          "click": {
            "actionField": { "list": location.pathname },
            "products": clickedProduct 
          }
        }
      })
      // console.log('wdl_search-click:', window.dataLayer)
    }
  },
  
  async mounted() {
    this.elevarProductsView()
  }
}
</script>

<style lang="scss" scoped>
.product-grid {
  margin-top: 20px;
}

.column {
  padding-bottom: 3rem;
}

.search-results {
  width: 90%;

  &__grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;

    &__item {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      &__container {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
      }

      &__img {
        height: 350px;
        width: auto;
        object-fit: contain;
        object-position: center;
      }

      &__title {
        font-family: Bold;
        font-size: 14px;
        line-height: 1.57;
        letter-spacing: 0.5px;
        color: $primary-purple;
      }

      &__price {
        color: $primary-purple;
      }
    }
  }
}
</style>
