import createShopifyCheckoutClient from '@nacelle/shopify-checkout'

export default function (context, inject) {
  const checkoutClient = createShopifyCheckoutClient({
    customEndpoint: context.$config.shopifyCheckoutGraphQLEndpoint,
    storefrontCheckoutToken: context.$config.shopifyStorefrontCheckoutToken
  })

  inject('shopifyCheckout', checkoutClient)
}
