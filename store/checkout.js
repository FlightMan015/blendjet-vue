import localforage from 'localforage'
import { cloneDeep } from 'lodash'

const isFunc = func => typeof func === 'function'
export const state = () => ({
  id: null,
  url: null
})

export const mutations = {
  setId(state, payload) {
    localforage.setItem('checkout-id', payload)
    state.id = payload
  },

  setUrl(state, payload) {
    localforage.setItem('checkout-url', payload)
    state.url = payload
  },

  setCheckout(state, { id, url }) {
    localforage.setItem('checkout-id', id)
    localforage.setItem('checkout-url', url)
    state.id = id
    state.url = url
  }
}

export const actions = {
  async initializeCheckout({ commit, dispatch }) {
    const id = await localforage.getItem('checkout-id')
    const url = await localforage.getItem('checkout-url')
    if (id && url) {
      try {
        const { completed } = await this.$nacelle.checkout.get({ id, url })
        if (completed) {
          await dispatch('resetCheckout')
        } else {
          commit('setCheckout', { id, url })
        }
      } catch (err) {
        // nacelle checkout failed, try shopify checkout instead
        console.log('nacelle checkout failed at initializeCheckout')
        try {
          const { completed } = await this.$shopifyCheckout.get({ id })
          if (completed) {
            await dispatch('resetCheckout')
          } else {
            commit('setCheckout', { id, url })
          }
        } catch (err) {
          await dispatch('resetCheckout')
          throw new Error('Error during checkout')
        }
      }
    }
  },

  async resetCheckout({ commit, dispatch }) {
    commit('setCheckout', { id: null, url: null })
    await dispatch('cart/resetLineItems', null, { root: true })
  },

  async processCheckout({ dispatch }, { beforeCreate, beforeRedirect }) {
    if (isFunc(beforeCreate)) {
      await beforeCreate()
    }
    await dispatch('checkoutCreate')
    await dispatch('addCheckoutParams')
    if (isFunc(beforeRedirect)) {
      await beforeRedirect()
    }
    dispatch('checkoutRedirect')
  },

  async checkoutCreate({ commit, dispatch, state, rootState, rootGetters }) {
    const cartItems = rootGetters['cart/checkoutLineItems']
    const checkoutId = state.id || ''

    if (cartItems.length === 0) {
      throw new Error('Cannot checkout with an empty cart')
    }

    // fix for uBlock breaking checkout recommended by CJ from Nacelle
    const recartMetafields = this.$recart.getMetafieldsForCheckout() || []

    // __capi__.metafields are provided by Outsmartly for first-party tracking
    const outsmartlyMetafields = // eslint-disable-next-line no-undef
      typeof window !== 'undefined' && window.__capi__ && Array.isArray(__capi__.metafields) // eslint-disable-next-line no-undef
        ? __capi__.metafields
        : []

    let checkoutStatus = ''
    let checkout = {}
    let hasSubscriptionProduct = false
    cartItems.forEach(item => {
      item.metafields.forEach(metaField => {
        if (
          metaField.key === 'order_interval_unit' ||
          metaField.key === 'order_interval_frequency' ||
          metaField.key === 'charge_interval_frequency'
        ) {
          hasSubscriptionProduct = true
        }
      })
    })
    console.log('has subscription Product', hasSubscriptionProduct)
    try {
      if (hasSubscriptionProduct) {
        checkout = await this.$nacelle.checkout.process({
          cartItems,
          checkoutId,
          metafields: [...recartMetafields, ...outsmartlyMetafields]
        })
        if (checkout && checkout.completed) {
          checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId: '' })
        }

        if (!checkout || !checkout.id || !checkout.url) {
          checkoutStatus = 'failed'
        }
      } else {
        checkout = await this.$shopifyCheckout.process({
          cartItems,
          checkoutId,
          metafields: [...recartMetafields, ...outsmartlyMetafields]
        })
        if (checkout && checkout.completed) {
          checkout = await this.$shopifyCheckout.process({ cartItems, checkoutId: '' })
        }

        if (!checkout || !checkout.id || !checkout.url) {
          checkoutStatus = 'failed'
        }
      }
    } catch (err) {
      checkoutStatus = 'failed'
    }

    if (checkoutStatus === 'failed') {
      try {
        if (hasSubscriptionProduct) {
          console.log(
            'Nacelle Normal checkout failed for cart with subscription, Issue would be with Nacelle API or Recharge'
          )
          console.log('Try Nacelle shopify checkout instead')
          checkout = await this.$shopifyCheckout.process({
            cartItems,
            checkoutId,
            metafields: [...recartMetafields, ...outsmartlyMetafields]
          })
          if (checkout && checkout.completed) {
            checkout = await this.$shopifyCheckout.process({ cartItems, checkoutId: '' })
          }

          if (!checkout || !checkout.id || !checkout.url) {
            console.log('Checkout Failed at Nacelle/Shopify')
            throw new Error('Checkout Failure')
          }
        } else {
          console.log('Nacelle Shopify checkout failed, Shopify might be down')
          console.log('Try recharge checkout instead')
          // Add 'order_interval_unit' recharge field to metafields of products to make it recharge compatible
          const cartItemsModified = cloneDeep(cartItems)
          cartItemsModified.forEach(item => {
            item.metafields.push({ key: 'order_interval_unit' })
          })
          checkout = await this.$nacelle.checkout.process({
            cartItems: cartItemsModified,
            checkoutId,
            metafields: [...recartMetafields, ...outsmartlyMetafields]
          })
          if (checkout && checkout.completed) {
            checkout = await this.$nacelle.checkout.process({
              cartItems: cartItemsModified,
              checkoutId: ''
            })
          }
          if (!checkout || !checkout.id || !checkout.url) {
            console.log('Checkout Failed at Nacelle/Recharge')
            throw new Error('Checkout Failure')
          }
        }
      } catch (err) {
        console.log('err', err, err?.response)
        throw new Error('Checkout Failure')
      }
    }

    // Intercept ReCharge checkout hostname URL to 'checkout.blendjet.com'
    // if(checkout.url.includes('rechargeapps.com')){
    //   const url = new URL(checkout.url)
    //   url.hostname = 'checkout.blendjet.com'
    //   checkout.url = url.toString()
    // }

    if (rootState.events) {
      dispatch('events/checkoutInit', { cart: rootState.cart.lineItems }, { root: true })
    }

    commit('setCheckout', checkout)
  },

  async addCheckoutParams({ commit, dispatch, state, rootState }) {
    const queryOperator = state.url.includes('?') ? '&' : '?'
    const linkerParam = await dispatch('getLinkerParam')
    await commit(
      'setUrl',
      `${state.url}${queryOperator}c=${JSON.stringify(rootState.user.userData)}&${linkerParam}`
    )
  },

  async getLinkerParam() {
    return new Promise((resolve, reject) => {
      const gaClient = process.browser ? window.ga : undefined

      if (typeof gaClient !== 'undefined') {
        gaClient(tracker => resolve(tracker.get('linkerParam')))
      }

      // if no ga resolve with empty string
      resolve('')
    })
  },

  async checkoutRedirect({ state }) {
    if (process.browser) {
      const discountCode = await localforage.getItem('discount')
      const url = new URL(state.url)
      if (url.host.includes('rechargeapps.com')) {
        url.host = 'checkout.blendjet.com'
      }
      window.location.href = discountCode ? url.href + '&discount=' + discountCode : url.href
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
