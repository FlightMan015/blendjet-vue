import { mapMutations } from 'vuex'
import { createClient } from '~/plugins/contentful.js'
import { checkProductShippingEligibility } from '~/mixins/productShippingEligibility'
const client = createClient()

export function getBundledProductsFromFile(
  bundles,
  productObj,
  fs,
  title,
  isVarietyPack = false,
  bundleCollectionMedia = []
) {
  const bundlesPromise = []
  bundles &&
    bundles.forEach((bundle, index) => {
      let productHandle = bundle?.fields?.product?.fields?.handle
      if (isVarietyPack) {
        productHandle = bundle?.fields?.handle
      }
      const variantId = bundle?.fields?.variant?.fields?.title
      bundlesPromise.push(
        new Promise((resolve, reject) => {
          try {
            const file = fs.readFileSync(
              `./static/data/products/${productHandle}--${productObj.locale}/static.json`,
              'utf-8'
            )
            const bundledProduct = JSON.parse(file)
            let variantsAvailableForSale = 0
            if (bundledProduct?.variants?.length) {
              bundledProduct.variants = bundledProduct.variants.filter(variant => {
                if (variant.availableForSale) {
                  variantsAvailableForSale++
                  return variant
                }
              })
            }
            let bundledVariant = bundledProduct?.variants?.filter(variant => {
              if (
                variant &&
                variant?.title?.toLowerCase()?.replace(/\s/g, '') === variantId?.toLowerCase() &&
                variant?.availableForSale
              ) {
                return variant
              }
            })
            if (!bundledVariant?.length) {
              // Either variant is not available for sale or the product has Single variant.
              // Get the first variant that is available for sale
              bundledVariant = bundledProduct?.variants?.filter(variant => {
                if (variant && variant?.availableForSale) {
                  return variant
                }
              })
            }
            if (
              bundledProduct?.availableForSale &&
              bundledVariant?.length &&
              bundledVariant[0]?.availableForSale &&
              checkProductShippingEligibility(bundledProduct)
            ) {
              if (!isVarietyPack) {
                // push selected variant or first available variant for sale if no variant was selected from contentful
                return resolve({
                  product: bundledProduct,
                  variant: bundledVariant.length ? bundledVariant[0] : {},
                  title: title,
                  clickAction: bundle?.fields?.clickAction,
                  media: bundle?.fields?.media,
                  variantsAvailableForSale: variantsAvailableForSale
                })
              } else {
                // push all varients available for sale
                return resolve({
                  product: bundledProduct,
                  variants: bundledVariant,
                  title: title,
                  media: bundleCollectionMedia?.[index]
                })
              }
            } else {
              return resolve({})
            }
          } catch (err) {
            reject(err)
          }
        })
      )
    })
  return bundlesPromise
}

export function getbundledProductsFromNacelle(
  bundles,
  allBundledProductList,
  title,
  isVarietyPack = false,
  bundleCollectionMedia = []
) {
  const bundledProducts = []
  if (bundles?.length) {
    bundles.forEach(async (bundle, index) => {
      let productHandle = bundle?.fields?.product?.fields?.handle
      if (isVarietyPack) {
        productHandle = bundle?.fields?.handle
      }
      const variantId = bundle?.fields?.variant?.fields?.title
      let bundledProduct = allBundledProductList.filter(item => {
        return productHandle === item.handle
      })
      bundledProduct = bundledProduct.length ? bundledProduct[0] : {}
      let variantsAvailableForSale = 0
      if (bundledProduct?.variants?.length) {
        bundledProduct.variants = bundledProduct.variants.filter(variant => {
          if (variant.availableForSale) {
            variantsAvailableForSale++
            return variant
          }
        })
      }
      let bundledVariant = bundledProduct?.variants?.filter(variant => {
        if (
          variant &&
          variant?.title?.toLowerCase()?.replace(/\s/g, '') === variantId?.toLowerCase() &&
          variant?.availableForSale
        ) {
          return variant
        }
      })
      if (!bundledVariant?.length) {
        // Either variant is not available for sale or the product has Single variant.
        // Get the variants that is available for sale
        bundledVariant = bundledProduct?.variants?.filter(variant => {
          if (variant && variant?.availableForSale) {
            return variant
          }
        })
      }
      if (
        bundledProduct?.availableForSale &&
        bundledVariant?.length &&
        bundledVariant[0]?.availableForSale &&
        checkProductShippingEligibility(bundledProduct)
      ) {
        if (!isVarietyPack) {
          // push selected variant or first available variant for sale if no variant was selected from contentful
          bundledProducts.push({
            product: bundledProduct,
            variant: bundledVariant.length ? bundledVariant[0] : {},
            title: title,
            clickAction: bundle?.fields?.clickAction,
            media: bundle?.fields?.media,
            variantsAvailableForSale: variantsAvailableForSale
          })
        } else {
          // push all varients available for sale
          bundledProducts.push({
            product: bundledProduct,
            variants: bundledVariant,
            title: title,
            media: bundleCollectionMedia?.[index]
          })
        }
      }
    })
  }
  return bundledProducts
}

export default (config = {}) => {
  return {
    data() {
      return {
        handle: null,
        product: null,
        bundles: [],
        allBundledProductList: [],
        variantSpecificBundles: {},
        noProductData: false,
        bundleProductMissing: false,
        bundleVarietyPack: [],
        variantBundleVarietyPack: {}
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { productHandle } = params

      // TODO: This should be using nacelle content
      const page = await client
        .getEntries({
          content_type: 'product',
          'fields.handle': params.productHandle,
          include: 4
        })
        .then(async res => {
          const data = res.items[0]
          if (data && data.fields.features) {
            await client.getEntry(data.fields.features.sys.id).then(async res => {
              data.fields.features = res
            })
          }
          return data
        })

      const productObj = {
        productHandle: config.productHandle || productHandle,
        product: null,
        locale: config.locale || $nacelle.locale,
        bundles: [],
        allBundledProductList: [],
        variantSpecificBundles: {},
        bundleVarietyPack: [],
        variantBundleVarietyPack: {}
      }

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

        if (page?.fields?.bundles?.fields?.bundleGroup?.length) {
          // get product data for bundled products
          const bundles = page?.fields?.bundles?.fields?.bundleGroup
          try {
            let resolvedBundles
            if (bundles?.length) {
              resolvedBundles = await Promise.all(
                getBundledProductsFromFile(
                  bundles,
                  productObj,
                  fs,
                  page?.fields?.bundles?.fields?.title
                )
              )
            } else {
              resolvedBundles = []
            }
            resolvedBundles = resolvedBundles.filter(
              bundleItem => bundleItem.title && bundleItem.product
            )
            productObj.bundles = resolvedBundles
          } catch (err) {
            productObj.bundleProductMissing = true
          }
        }

        if (page?.fields?.bundles?.fields?.bundleCollection?.length) {
          // get product data for bundled products
          const bundles = page?.fields?.bundles?.fields?.bundleCollection
          const bundleCollectionMedia = page?.fields?.bundles?.fields?.bundleCollectionMedia
          try {
            let resolvedBundles
            if (bundles?.length) {
              resolvedBundles = await Promise.all(
                getBundledProductsFromFile(
                  bundles,
                  productObj,
                  fs,
                  page?.fields?.bundles?.fields?.title,
                  true,
                  bundleCollectionMedia
                )
              )
            } else {
              resolvedBundles = []
            }
            resolvedBundles = resolvedBundles.filter(
              bundleItem => bundleItem.title && bundleItem.product
            )
            productObj.bundleVarietyPack = resolvedBundles
          } catch (err) {
            productObj.bundleProductMissing = true
          }
        }

        if (page?.fields?.variants?.length) {
          // get product data for bundled products per variant
          page.fields.variants.forEach(async variant => {
            const bundles = variant?.fields?.bundles?.fields?.bundleGroup
            const bundleCollection = variant?.fields?.bundles?.fields?.bundleCollection
            const bundleCollectionMedia = page?.fields?.bundles?.fields?.bundleCollectionMedia
            if (bundles?.length) {
              await Promise.all(
                getBundledProductsFromFile(
                  bundles,
                  productObj,
                  fs,
                  variant?.fields?.bundles?.fields?.title
                )
              ).then(res => {
                const resolvedBundles = res.filter(
                  bundleItem => bundleItem.title && bundleItem.product
                )
                productObj.variantSpecificBundles[
                  variant.fields.title.toLowerCase()
                ] = resolvedBundles
              })
            }
            if (bundleCollection?.length) {
              await Promise.all(
                getBundledProductsFromFile(
                  bundleCollection,
                  productObj,
                  fs,
                  variant?.fields?.bundles?.fields?.title,
                  true,
                  bundleCollectionMedia
                )
              ).then(res => {
                const resolvedBundles = res.filter(
                  bundleItem => bundleItem.title && bundleItem.product
                )
                productObj.variantBundleVarietyPack[
                  variant.fields.title.toLowerCase()
                ] = resolvedBundles
              })
            }
          })
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

        if (
          page?.fields?.bundles?.fields?.bundleGroup?.length ||
          page?.fields?.bundles?.fields?.bundleCollection?.length
        ) {
          // get product data for bundled products
          const productHandles = []
          const bundles = page?.fields?.bundles?.fields?.bundleGroup
          const bundleCollection = page?.fields?.bundles?.fields?.bundleCollection
          const bundleCollectionMedia = page?.fields?.bundles?.fields?.bundleCollectionMedia
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
          // get productIds of variant specific bundles
          if (page?.fields?.variants?.length) {
            page.fields.variants.forEach(variant => {
              const bundles = variant?.fields?.bundles?.fields?.bundleGroup
              const bundleCollection = variant?.fields?.bundles?.fields?.bundleCollection
              // Get productIds of the main product bundle and bundle collection (variery packs)
              if (bundles?.length) {
                bundles.forEach(product => {
                  const handle = product?.fields?.product?.fields?.handle
                  if (handle) {
                    if (productHandles.indexOf(handle) === -1) {
                      productHandles.push(handle)
                    }
                  }
                })
              }
              if (bundleCollection?.length) {
                bundleCollection.forEach(product => {
                  const handle = product?.fields?.handle
                  if (handle) {
                    if (productHandles.indexOf(handle) === -1) {
                      productHandles.push(handle)
                    }
                  }
                })
              }
            })
          }

          productObj.allBundledProductList = await $nacelle.data
            .products({
              handles: productHandles,
              locale: productObj.locale
            })
            .catch(() => {
              productObj.bundleProductMissing = true
            })
          productObj.bundles = getbundledProductsFromNacelle(
            bundles,
            productObj.allBundledProductList,
            page?.fields?.bundles?.fields?.title
          )
          productObj.bundleVarietyPack = getbundledProductsFromNacelle(
            bundleCollection,
            productObj.allBundledProductList,
            page?.fields?.bundles?.fields?.title,
            true,
            bundleCollectionMedia
          )

          if (page?.fields?.variants?.length) {
            // Form variant specific bundles data
            page.fields.variants.forEach(variant => {
              const bundles = variant?.fields?.bundles?.fields?.bundleGroup
              const bundleCollection = variant?.fields?.bundles?.fields?.bundleCollection
              const bundleCollectionMedia = variant?.fields?.bundles?.fields?.bundleCollectionMedia

              if (bundles?.length) {
                productObj.variantSpecificBundles[
                  variant.fields.title.toLowerCase()
                ] = getbundledProductsFromNacelle(
                  bundles,
                  productObj.allBundledProductList,
                  variant?.fields?.bundles?.fields?.title
                )
              }

              if (bundleCollection?.length) {
                productObj.variantBundleVarietyPack[
                  variant.fields.title.toLowerCase()
                ] = getbundledProductsFromNacelle(
                  bundleCollection,
                  productObj.allBundledProductList,
                  variant?.fields?.bundles?.fields?.title,
                  true,
                  bundleCollectionMedia
                )
              }
            })
          }
        }
      }

      return {
        ...productObj,
        page
      }
    },
    async created() {
      if (this.product) {
        this.setProduct(this.product)
      }

      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.product = await this.$nacelle.data
            .product({
              handle: this.productHandle,
              locale: this.$nacelle.locale
            })
            .catch(() => {
              this.noProductData = true
            })
        }
      })
    },
    methods: {
      ...mapMutations('product', ['setProduct'])
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
}
