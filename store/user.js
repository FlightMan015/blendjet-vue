import { uuid } from 'uuidv4'
import localforage from 'localforage'
import * as Cookies from 'es-cookie'
import Axios from 'axios'

// Note on locales - BlendJet does not use Nacelle's base locale structure.
export const state = () => ({
  anonymousID: null,
  userID: null,
  customerEmail: null,
  customerPhone: null,
  sessionID: null,
  locale: {
    country: 'US',
    currency: 'USD',
    displayCountry: 'United States of America',
    displayCountryLocalized: 'United States',
    displayLanguage: 'English',
    language: 'en',
    locale: 'en-US',
    symbol: '$'
  },
  acceptCookies: false,
  // BlendJet doesn't seem to use `user.locale`, but we needed a `country`
  // prop to reference for country-specific modules + product blacklisting,
  // so this root-level country property was created.
  country: 'US'
})

export const mutations = {
  setUserData(state, payload) {
    const { userID, customerEmail, customerPhone } = payload
    state.userID = userID
    state.customerEmail = customerEmail
    state.customerPhone = customerPhone
  },

  setAnonymousID(state, id) {
    state.anonymousID = id
  },

  setSessionID(state, id) {
    state.sessionID = id
  },

  setLocale(state, locale) {
    state.locale = locale
  },

  setCountry(state, countryCode) {
    state.country = countryCode
  },

  setAcceptCookies(state, payload) {
    state.acceptCookies = payload
  }
}

export const actions = {
  async initUserData(context) {
    await context.dispatch('readAnonymousID')
    await context.dispatch('readSession')

    if (process.browser) {
      const userData = Cookies.get('user-data')
      if (userData) {
        context.commit('setUserData', JSON.parse(userData))
      }
    }
  },

  async initUserCountry(context) {
    if (process.browser) {
      // Get country by pinging the gointerpay API
      // Note: The call will defer to the `_rchcountry` cookie (if it's set)
      const fakePrice = encodeURIComponent(
        JSON.stringify([
          {
            Price: 10.99
          }
        ])
      )
      const baseUrl = 'https://checkout.gointerpay.net/v2.21/localize'
      const params = {
        MerchantId: '3af65681-4f06-46e4-805a-f2cb8bdaf1d4',
        Country:
          document.cookie.includes('_rchcountry') &&
          document.cookie.match('(^|;)\\s*' + '_rchcountry' + '\\s*=\\s*([^;]+)').pop(),
        MerchantPrices: fakePrice
      }
      await Axios({
        method: 'get',
        url: `${baseUrl}?${Object.keys(params)
          .filter(k => params[k])
          .map(k => `${k}=${params[k]}`)
          .join('&')}`
      })
        .then(res => {
          if (res.data.Country) {
            context.commit('setCountry', res.data.Country)
          }
        })
        .catch(res => {
          console.error('Country Detection Failed')
        })
    }
  },

  // ANONYMOUS ID ACTIONS //////////////////////////////////////////
  async createAnonymousID(context) {
    const anonymousID = uuid()
    await localforage.setItem('anonymousID', anonymousID)
    context.commit('setAnonymousID', anonymousID)
  },
  async readAnonymousID(context) {
    const anonymousID = await localforage.getItem('anonymousID')
    if (anonymousID != null) {
      context.commit('setAnonymousID', anonymousID)
    } else {
      context.dispatch('createAnonymousID')
    }
  },

  // SESSION ACTIONS //////////////////////////////////////////
  async createSession(context) {
    const sessionID = uuid()
    context.commit('setSessionID', sessionID)
    if (process.browser) {
      Cookies.set('session-id', sessionID, {
        expires: new Date().setMinutes(30)
      })
    }
  },

  readSession(context) {
    if (process.browser) {
      const sessionCookie = Cookies.get('session-id')
      if (sessionCookie === undefined) {
        context.dispatch('createSession')
      } else {
        context.commit('setSessionID', sessionCookie)
        context.dispatch('refreshSession')
      }
    }
  },

  refreshSession(context) {
    if (process.browser) {
      Cookies.set('session-id', context.state.sessionID, {
        expires: new Date().setMinutes(30)
      })
    }
  },

  createCookieAccept({ commit }) {
    if (process.browser) {
      Cookies.set('nacelle-accept', true, {
        expires: 7
      })
      commit('setAcceptCookies', true)
    }
  },

  readCookieAccept({ commit }) {
    if (process.browser) {
      const accept = Cookies.get('nacelle-accept')

      if (accept) {
        commit('setAcceptCookies', accept)

        return accept
      }
    }

    return false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
