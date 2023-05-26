<template>
  <transition name="fade">
    <div
      v-if="ready && (!isMobile || showUpsell)"
      :class="['cart-upsells', { 'cart-upsells--mobile': isMobile }]"
    >
      <!-- UPSELL HEADER -->
      <div>
        <div class="cart-upsells__header" v-if="title">
          {{ title }}
          <Close v-if="isMobile" color="white" :onClick="closeUpsellModal" />
        </div>
      </div>

      <!-- UPSELL CONTENT -->
      <div class="cart-upsells__products">
        <template v-for="upsell in items">
          <UpsellItem
            v-if="!upsell.withBundle"
            :key="upsell.shopifyProductHandle"
            :title="upsell.title"
            :subtitle="upsell.subtitle"
            :selected-product="upsell.product"
            :page="upsell.page"
            :additional-products="upsell.additionalProductsList"
            :with-variety-pack="upsell.withVarietyPack"
            :product-contentful="upsell.productContentful"
          />
          <UpsellBundle
            v-if="upsell.withBundle"
            :key="upsell.title"
            :title="upsell.title"
            :subtitle="upsell.subtitle"
            :with-bundle="upsell.withBundle"
            :bundles="upsell.bundles || []"
            :bundle-variety-pack="upsell.bundleVarietyPack || []"
            :bundle-collection-click-action="upsell.bundleCollectionClickAction"
          />
        </template>
      </div>

      <!-- UPSELL FOOTER -->
      <div class="cart-upsells__footer">
        <!-- CHECKOUT CTA (Mobile Only) -->
        <div class="cart-upsells__scroll-indicator">
          <BiChevron color="#fff" :size="16" />
          SCROLL FOR MORE
          <BiChevron color="#fff" :size="16" />
        </div>

        <!-- CHECKOUT CTA (Mobile Only) -->
        <CartFlyoutCheckoutButton
          v-if="isMobile"
          :checkoutText="'Continue to Checkout'"
          :showPrice="false"
          :class="[checkoutDisabled ? 'checkout-disabled' : null]"
          :key="1"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import UpsellItem from '~/components/CartUpsellsItem'
import UpsellBundle from '~/components/CartUpsellsBundle'
import BiChevron from '~/components/svg/BiChevron'
import CartFlyoutCheckoutButton from '~/components/nacelle/CartFlyoutCheckoutButton'
import Close from '~/components/svg/modalClose'

// Mixins
import productShippingEligibility from '~/mixins/productShippingEligibility'

import { getbundledProductsFromNacelle } from '~/mixins/getProduct'

export default {
  components: { UpsellItem, UpsellBundle, BiChevron, Close, CartFlyoutCheckoutButton },
  data() {
    return {
      observer: null,
      ready: false,
      title: '',
      items: [],
      bundleItems: [],
      bundleItemsResolved: [],
      additionalProducts: [],
      additionalProductsResolved: []
    }
  },
  mixins: [productShippingEligibility],
  props: {
    closeUpsellModal: {
      type: Function,
      required: true
    },
    checkoutDisabled: {
      type: Boolean,
      required: true
    },
    showUpsell: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    }
  },
  async mounted() {
    const handle = this.getNacelleMetafield('cart_upsells', 'queue_handle_bundle')
    if (handle) {
      const queue = await this.$nacelle.data
        .content({
          type: 'queue',
          handle: handle
        })
        .catch(err => {
          console.warn(`Error fetching upsells with handle: ${handle}`, err)
        })

      if (queue) {
        this.title = queue.title
        // get bundles
        this.bundleItems = queue?.fields?.items?.map(item => {
          if (item?.fields?.bundleCollection?.length || item?.fields?.bundleGroup?.length) {
            return item
          } else {
            return null
          }
        })

        this.bundleItems.forEach(async (bundle, index) => {
          let resolvedBundle = {}
          if (bundle) {
            resolvedBundle = await this.getBundleProducts(bundle)
          }
          this.$set(this.bundleItemsResolved, index, resolvedBundle)
        })

        // get additional products
        this.additionalProducts = queue?.fields?.items?.map(item => {
          if (item?.fields?.hasMultipleProducts && item?.fields?.additionalProducts?.length) {
            return item
          } else {
            return null
          }
        })

        for (let i = 0; i < this.additionalProducts.length; i++) {
          const item = this.additionalProducts[i]
          let resolvedAdditionalProducts = []
          if (item) {
            resolvedAdditionalProducts = await this.getAdditionalProducts(item)
          }
          this.$set(this.additionalProductsResolved, i, resolvedAdditionalProducts)
        }

        // Get the queue's `items` array, filtering for just those with a shopifyProductHandle configured
        const items = Array.isArray(queue?.fields?.items) // if `items` is an array...
          ? queue.fields.items.filter(
            p =>
                p?.fields?.shopifyProductHandle ||
                p?.fields?.bundleCollection?.length ||
                p?.fields?.bundleGroup?.length
          ) // filter for only the product references
          : [] // otherwise set it equal to an empty array

        // Fetch the products for those handles.
        const products = await this.$nacelle.data.products({
          handles: items.map(itm => itm.fields.shopifyProductHandle).filter(item => item)
        })

        // Assemble a complete `items` array, with product data attached.
        this.items = items.reduce((acc, curr, index) => {
          const product = products.find(
            product => product.handle && product.handle === curr.fields.shopifyProductHandle
          )
          let hasValidProduct = null
          hasValidProduct = // product is valid if...
            product && // product exists
            product.id && // product id isn't null (aka empty nacelle object)
            product.availableForSale && // product isn't sold out
            this.checkProductShippingEligibility(product) && // product is available for the user's locale
            !(curr?.fields?.bundleCollection?.length || curr?.fields?.bundleGroup?.length) // Should not be a bundle
          if (hasValidProduct) {
            console.log(
              this.additionalProductsResolved,
              this.additionalProductsResolved[index],
              index
            )
            return [
              ...acc,
              {
                ...curr.fields,
                product: product,
                productContentful: curr?.fields?.product?.fields,
                page: curr?.fields,
                additionalProductsList: this.additionalProductsResolved[index] || []
              }
            ]
          } else if (curr?.fields?.bundleCollection?.length || curr?.fields?.bundleGroup?.length) {
            return [
              ...acc,
              {
                ...this.bundleItemsResolved[index]
              }
            ]
          } else {
            return acc
          }
        }, [])
      }

      this.observeScroll()
      this.ready = true
    }
  },
  beforeDestroy() {
    this.observer && this.observer.disconnect()
  },
  watch: {
    showUpsell(value) {
      if (value) {
        this.observeScroll()
      } else {
        this.observer && this.observer.disconnect()
      }
    }
  },
  computed: {
    ...mapGetters('space', { getNacelleMetafield: 'getMetafield' })
  },
  methods: {
    // On scroll, determine if the last element is still below the fold
    async getBundleProducts(bundleItem) {
      const productHandles = []
      const productObj = {
        bundles: [],
        bundleVarietyPack: [],
        withBundle: true,
        bundleCollectionClickAction: bundleItem?.fields?.bundleCollectionClickAction,
        title: bundleItem?.fields?.title,
        subtitle: bundleItem?.fields?.subtitle
      }
      const bundles = bundleItem?.fields?.bundleGroup
      const bundleCollection = bundleItem?.fields?.bundleCollection
      bundles &&
        bundles.forEach(bundle => {
          // Get productIds of the main product bundle
          if (bundle?.fields?.product?.fields?.handle) {
            productHandles.push(bundle?.fields?.product?.fields?.handle)
          }
        })
      bundleCollection &&
        bundleCollection.forEach(product => {
          // Get productIds of the main product bundle variety pack
          const handle = product?.fields?.handle
          if (handle && productHandles.indexOf(handle) === -1) {
            productHandles.push(handle)
          }
        })

      const allBundledProductList = await this.$nacelle.data.products({
        handles: productHandles
      })

      if (bundles) {
        productObj.bundles = getbundledProductsFromNacelle(
          bundles,
          allBundledProductList,
          bundleItem?.fields?.title
        )
      }
      if (bundleCollection) {
        productObj.bundleVarietyPack = getbundledProductsFromNacelle(
          bundleCollection,
          allBundledProductList,
          bundleItem?.fields?.title,
          true
        )
        productObj?.bundleVarietyPack?.length &&
          productObj.bundleVarietyPack.forEach(item => {
            item.isVarietyPack = true
          })
      }
      return productObj
    },
    async getAdditionalProducts(item) {
      return new Promise(resolve => {
        const productHandles = []
        const products = item?.fields?.additionalProducts
        products &&
          products.forEach(product => {
            // Get productIds of the main product bundle
            if (product?.fields?.handle) {
              productHandles.push(product?.fields?.handle)
            }
          })
        return this.$nacelle.data
          .products({
            handles: productHandles
          })
          .then(res => {
            return resolve(res)
          })
      })
    },
    observeScroll() {
      setTimeout(() => {
        this.observer = new IntersectionObserver(([entry]) => {
          const scrollIndicator = document.querySelector('.cart-upsells__footer')

          if (!scrollIndicator) return

          scrollIndicator.classList.toggle(
            'cart-upsells__footer--scroll-complete',
            entry.isIntersecting
          )
        })

        this.observer.observe(document.querySelector('.cart-upsells-item:last-child'))
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-upsells {
  max-width: 440px;
  position: relative;
  z-index: 99;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    max-width: none;
    width: 100%;
    height: 100%; // Don't change this height prop to VH units — causes an iOS bug where the footer (and checkout CTA) goes below the iOS hardware layer menu!  Prevents users from being able to checkout!
  }
}

.cart-upsells__products {
  overflow-y: auto;
  height: 100%;
  padding-top: 60px;
}

.cart-upsells__header {
  position: absolute;
  width: 100%;
  top: 0;
  text-transform: uppercase;
  text-align: center;
  height: 60px;
  font-size: 24px;
  font-family: 'Bold';
  line-height: 60px;
  background-color: rgb(30, 144, 187);
  color: white;
  z-index: -10; // negative to hide it behind the scrollbar

  @media (max-width: 768px) {
    background-color: #000;
    z-index: 10; // positive, bc close button in the header must remain clickable.
  }
}

.cart-upsells__footer {
  position: absolute;
  width: 100%;
  text-align: center;
  color: #fff;
  height: auto;
  height: 120px;
  z-index: 10000000;
  font-size: 18px;
  font-family: 'Medium';
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
  pointer-events: none;

  // The checkout CTA is present in the upsells on mobile, so reset the pointer events
  .cart-upsells--mobile & {
    pointer-events: initial;
  }

  // Gradient
  &:after {
    content: '';
    bottom: 0;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(30, 144, 187, 0), rgb(30, 144, 187) 75%);
    pointer-events: none;
  }
}

.cart-upsells__scroll-indicator {
  transition: opacity 1s ease;
  opacity: 1;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
  .cart-upsells__footer--scroll-complete & {
    opacity: 0;
    pointer-events: none;
  }
}

::v-deep {
  .close-container {
    top: 0;
    right: 16px;
  }

  .dropdown-container {
    display: flex;
    justify-content: center;
  }
}
</style>
