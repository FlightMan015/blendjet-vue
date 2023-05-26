<template>
  <div @click="elevarSearchClick(item)">
    <!-- <router-link :to="`${pathFragment}${item.handle}`"> -->
    <div v-if="list" class="autocomplete-item" @click="emitQuery(item)">
      {{ item.title }} {{ position}}
    </div>
    <router-link v-if="!list" :to="`${pathFragment}${item.handle}`">
      <div class="autocomplete-item nacelle">
        <div class="item__image">
          <product-image
            v-if="productThumbnail && productThumbnail.length > 0"
            :source="item.featuredMedia.thumbnailSrc"
            :alt="item.title"
          />
        </div>
        <div class="item__details">
          <div class="item__details__title">
            {{ item.title }}
          </div>
          <div class="item__details__category"></div>
          <div class="item__details__price">
            <product-price :price="productPrice" />
          </div>
        </div>
        <!-- <h3 class="column is-5">{{item.title}}</h3> -->
        <!-- <product-price class="column is-3 is-marginless" :price="productPrice" /> -->
      </div>
    </router-link>
  </div>
</template>

<script>
import ProductImage from '~/components/nacelle/ProductImage'
import ProductPrice from '~/components/nacelle/ProductPrice'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    ProductImage,
    ProductPrice
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    pathFragment: {
      type: String,
      default: '/products/'
    },
    position: {
      type: String,
      default: 'NA'
    },
    list: {
      type: Boolean,
      defatult: false
    }
  },
  methods: {
    ...mapMutations('search', ['setQuery']),
    ...mapMutations('search', ['setAutocompleteNotVisible']),
    emitQuery(item) {
      // this.setQuery(item)
      this.setQuery({ value: this.item.title, origin: 'global' })
      // this.setAutocompleteNotVisible()
      // console.log('item selecte', item)
      this.$emit('selectedQuery', item.title)
    },
    
    createUUID() {
        var result = ''
        var length = 16
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
        return result
    },
    
    elevarSearchClick(product) {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var variant = product.variants[0]
      var idx = this.position
      // console.log('clicked product:', product)
      // alert(product.title)
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

    //  ...mapMutations('search', ['setQuery']),
    // setQuery(term) {
    //   t
    // }
  },
  computed: {
    productThumbnail() {
      if (this.item && this.item.featuredMedia && this.item.featuredMedia.thumbnailSrc) {
        return this.item.featuredMedia.thumbnailSrc
      }

      return ''
    },
    productPrice() {
      if (
        this.item &&
        this.item.variants &&
        this.item.variants.length > 0 &&
        this.item.variants[0] &&
        this.item.variants[0].price
      ) {
        return this.item.variants[0].price
      }

      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.autocomplete-item {
  // margin-top: 10px;
  // margin-bottom: 10px;
  color: $primary-purple;
  font-family: Medium;
  font-size: 16px;
  line-height: 2.5;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.item {
  &__image {
    margin-right: 16px;
    img {
      height: 112px;
      width: 112px;
      display: block;
    }
  }

  &__details {
    &__title {
      font-family: Bold;
      font-size: 14px;
      line-height: 1.57;
      letter-spacing: 0.5px;
      color: $primary-purple;
    }

    &__price {
      font-family: Regular;
      font-size: 14px;
      line-height: 1.57;
      letter-spacing: 0.5px;
      color: $grayscale-gray;
    }
  }
}
</style>
