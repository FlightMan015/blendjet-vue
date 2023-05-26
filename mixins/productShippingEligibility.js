import { mapState } from 'vuex'
import productMetafields from '~/mixins/productMetafields'

const getShippingMetafield = product => {
  // Bail if metafields not found
  if (!Array.isArray(product?.metafields)) return

  // Get shipping eligibility metafield
  const metafield = product.metafields.find(
    field => field.namespace === 'shipping' && field.key === 'eligible_countries'
  )

  return metafield?.value
}

export function checkProductShippingEligibility(product) {
  /**
   * Provided a product, checks the shipping eligibility of the product in
   * relation to the user's detected country.
   * @param {Object} product - a product object from the Nacelle SDK
   * @returns {Boolean}
   */
  const eligCountriesStr = getShippingMetafield(product)
  const eligCountriesArr = eligCountriesStr ? eligCountriesStr.split('|') : []
  return eligCountriesArr.length ? eligCountriesArr.indexOf(this.userCountry) !== -1 : true
}

/**
 * This mixin exposes a computed prop indicating whether a given product is shippable to the user
 */
export default {
  mixins: [productMetafields],
  computed: {
    ...mapState('user', {
      userCountry: 'country'
    }),
    isShippableToUser() {
      // If no product exists, bail (return true, assume it is)
      if (!this.product) {
        return true
      }
      // Cross-reference the product's shipping eligibility metafields
      // with the user's country state to determine if this product
      // can be shipped to them.
      const userCountryISO = this.userCountry
      const eligCountriesStr = this.getMetafield('shipping', 'eligible_countries')
      const eligCountriesArr = eligCountriesStr ? eligCountriesStr.split('|') : []
      return eligCountriesArr.length ? eligCountriesArr.indexOf(userCountryISO) !== -1 : true
    }
  },
  methods: {
    checkProductShippingEligibility
  }
}
