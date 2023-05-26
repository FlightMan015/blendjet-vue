import path from 'path'
import fs from 'fs-extra'
const contentful = require('contentful')

require('dotenv').config()

function getContentfulRoutes() {
  // Get routes we care about from Contentful -test
  const client = contentful.createClient({
    space: process.env.CTF_SPACE_ID,
    accessToken: process.env.CTF_CDA_ACCESS_TOKEN
  })

  return Promise.all([
    client.getEntries({ content_type: 'recipe' }),
    client.getEntries({ content_type: 'userGuide' })
  ]).then(([recipes, userGuide]) => [
    ...recipes.items.map(r => ({ route: `recipes/${r.fields.handle}` })),
    ...userGuide.items.map(r => ({ route: `user-guide/${r.fields.handle}` }))
  ])
}

export default {
  mode: process.env.BUILD_MODE,
  pwa: {
    manifest: {
      name: 'BlendJet',
      short_name: 'BlendJet',
      display: 'standalone',
      theme_color: '#373975',
      description: 'Meet BlendJet® - The Next-Gen Blender'
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:title', hid: 'og:title', content: 'Meet BlendJet® - The Next-Gen Blender' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-32.png',
        sizes: '32x32'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-57.png',
        sizes: '57x57'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-76.png',
        sizes: '76x76'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-96.png',
        sizes: '96x96'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-128.png',
        sizes: '128x128'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-192.png',
        sizes: '192x192'
      },

      {
        rel: 'shortcut icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-196.png'
      },

      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-152.png',
        sizes: '152x152'
      },
      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: 'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-Fav-180.png',
        sizes: '180x180'
      },

      {
        rel: 'preconnect',
        href: 'static.klaviyo.com'
      },
      {
        rel: 'preconnect',
        href: 'fast.a.klaviyo.com'
      },
      {
        rel: 'preload',
        href: 'https://use.typekit.net/rtu8fed.css',
        as: 'style'
      }
      // {
      //   rel: 'stylesheet',
      //   type: 'text/css',
      //   href: `//dmf8x4ovgacxs.cloudfront.net/${process.env.NACELLE_SPACE_ID}/styles.css`
      // },
      // {
      //   reL: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
      // }
    ],
    script: [
      { src: '/scripts/optimonk.js', body: true, defer: true },
      // Disabled for Nuxt version of GTM
      // { src: '/scripts/gtm.js'},
      { src: '/scripts/currencycookie.js' },
      // { src: 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=NhVDeY', async: true},
      { src: 'https://cdn.weglot.com/weglot.min.js', async: true },
      { src: 'https://js.afterpay.com/afterpay-1.x.js', defer: true }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['@/assets/global.scss', 'vue-glide-js/dist/vue-glide.css', 'animate.css'],

  styleResources: {
    scss: ['@/assets/_variables.scss', '@/assets/_mixins.scss']
  },

  env: {
    nacelleSpaceID: process.env.NACELLE_SPACE_ID,
    nacelleToken: process.env.NACELLE_GRAPHQL_TOKEN,
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    buildMode: process.env.BUILD_MODE,
    PINTEREST_ID: process.env.PINTEREST_ID,
    SNAP_ID: process.env.SNAP_ID,
    SIGNIFIED_ID: process.env.SIGNIFIED_ID,
    KLAVIYO_COMPANY_ID: process.env.KLAVIYO_COMPANY_ID,
    KLAVIYO_DEFAULT_EMBED_CODE: process.env.KLAVIYO_DEFAULT_EMBED_CODE
  },

  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nacelle/nacelle-nuxt-module',
    // '@nacelle/nacelle-recharge-nuxt-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    'nuxt-polyfill',
    'vue-currency-filter/nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
    '@nacelle/nacelle-loox-nuxt-module',
    'vue-social-sharing/nuxt',
    '@nuxtjs/gtm',
    '@nuxtjs/google-gtag',
    '@nacelle/nacelle-klaviyo-nuxt-module',
    'nuxt-robots-module',
    // ['nuxt-buefy', { css: false, materialDesignIcons: false }],

    ['@recart/nacelle-nuxt-module', { recartSiteId: '5b18bf7940348200075173e6' }],
    [
      'nuxt-lazy-load',
      {
        // These are the default values
        images: true,
        videos: true,
        audios: true,
        iframes: true,
        native: false,
        directiveOnly: true,

        // To remove class set value to false
        loadingClass: 'isLoading',
        loadedClass: 'isLoaded',
        appendClass: 'lazyLoad',

        observerConfig: {
          threshold: 0
          // See IntersectionObserver documentation
        }
      }
    ]
  ],

  plugins: [
    { src: '~plugins/buefy' },
    '~plugins/vue-modal.js',
    '~plugins/contentful.js',
    '~plugins/timeAgo.js',
    // removing gtag plugin below to use nuxt gtag module
    // "~/plugins/gtag.js",
    '~/plugins/pinterest-pixel.client.js',
    '~/plugins/snap-pixel.client.js',
    '~/plugins/vue-mq.js',
    '~/plugins/nuxt-jsonld',
    '~/plugins/vueTouchEvents',
    { src: '~/plugins/shopifyCheckout.js', mode: 'client' },
    { src: '~/plugins/flashTitle.js', mode: 'client' }
  ],

  router: {
    middleware: ['cart', 'cartRedirect'],
    /**
     * Override the vue-router's scroll behavior
     * This allows relative hash links to smooth scroll to the relevant content
     * Docs: https://next.router.vuejs.org/guide/advanced/scroll-behavior.html
     *
     * Note: There's a Vue Router issue where clicking on the same relative hash
     * consecutively will not trigger an update (since the router ignores it)
     * See https://github.com/vuejs/vue-router/issues/1668 for more details
     *
     * @param {Object} to - where the vue-router is navigating to
     * @param {Object} from - where the vue-router is navigation from
     * @param {} savedPosition - previous state (only present on popState resolutions, i.e. browser forward/back buttons)
     * @returns {Promise} a promise (async function) that returns the intended scroll x/y
     */
    scrollBehavior(to, from, savedPosition) {
      return (async () => {
        const offset = 140
        if (savedPosition) {
          return savedPosition
        }

        const findEl = async (hash, x) => {
          return (
            document.querySelector(hash) ||
            new Promise((resolve, reject) => {
              if (x > 50) {
                return resolve()
              }
              setTimeout(() => {
                resolve(findEl(hash, ++x || 1))
              }, 100)
            })
          )
        }

        if (to.hash) {
          const el = await findEl(to.hash)
          // Pass 'noScroll' param to prevent the smooth scrolling
          if (to.params.noScroll) {
            return false
          } else if ('scrollBehavior' in document.documentElement.style) {
            return window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' })
          } else {
            return window.scrollTo(0, el.offsetTop - offset)
          }
        }
        return { x: 0, y: 0 }
      })()
    }
  },

  gtm: {
    id: 'GTM-NLRSLWR',
    respectDoNotTrack: false

    // uncomment these for debugging on localhost
    // enabled: true,
    // debug: true
  },

  // Replaces gtag plugin and makes gtag available to nuxt for additional methods
  // see: https://github.com/nuxt-community/google-gtag-module
  'google-gtag': {
    id: 'UA-111004875-4',
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
      linker: {
        domains: ['blendjet.com']
      }
    },
    debug: false, // enable to track in dev mode
    disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
    additionalAccounts: [
      {
        id: 'AW-758185293'
      },
      {
        id: 'AW-800828740'
      },
      {
        id: 'AW-707656444'
      },
      {
        id: 'DC-9973664'
      }
    ]
  },

  publicRuntimeConfig: {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID
    },
    myshopifyDomain: process.env.SHOPIFY_DOMAIN,
    shopifyCheckoutGraphQLEndpoint: process.env.SHOPIFY_CHECKOUT_GRAPHQL_ENDPOINT,
    shopifyStorefrontCheckoutToken: process.env.STOREFRONT_CHECKOUT_TOKEN,
    shopifyStorefrontApiVersion: '2021-07'
  },

  polyfill: {
    features: [
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      }
    ]
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
  //   }
  // },

  sitemap: {
    gzip: true,
    hostname: 'https://blendjet.com', // When deploying, change this to your production URL
    routes: async () => {
      try {
        const staticDir = path.resolve(__dirname, './static/data')
        const routes = fs.readJsonSync(`${staticDir}/routes.json`)
        const contentfulRoutes = await getContentfulRoutes()

        return [...routes, ...contentfulRoutes].map(r => r.route)
      } catch (err) {
        console.error(err)
      }
    }
  },
  robots: {
    UserAgent: '*',
    Disallow: [
      '/cart*',
      '/account/login',
      '/account/register',
      '/privacy-policy',
      '/terms-of-service',
      '/collections/frontpage',
      '/search-results',
      '/multi-model'
    ]
  },
  markdownit: {
    preset: 'default',
    html: true,
    linkify: true,
    breaks: true
  },
  /*
   ** Nacelle Configuration
   * https://docs.getnacelle.com/nuxt/nuxt-config.html
   */
  nacelle: {
    /* Required Parameters */
    spaceID: process.env.NACELLE_SPACE_ID,
    token: process.env.NACELLE_GRAPHQL_TOKEN,

    /* Optional */

    // Google Analytics ID
    gaID: process.env.NACELLE_GA_ID,

    // Facebook Pixel Tracking ID
    // we don't want Nacelle also loading this - it happens through gtag
    // fbID: process.env.NACELLE_FB_ID,

    // Set the default internationalization locale string for Nacelle to use
    // locale: 'en-us',

    shopifyDomain: process.env.SHOPIFY_DOMAIN,

    // Customize the route base paths used by Nacelle and Nuxt during generate
    // Learn more in our docs: https://docs.getnacelle.com/nuxt/nuxt-config.html#routeconfig
    // routeConfig: null,
    routeConfig: {
      products: '/products',
      collections: '/collections',
      page: ''
      // article: '',
      // blog: '',
      // content: ''
    },
    klaviyo: {
      companyId: process.env.KLAVIYO_COMPANY_ID,
      defaultEmbedCode: process.env.KLAVIYO_DEFAULT_EMBED_CODE
    },

    // Function that can be used for modifying the route array for adding or customizing
    // routes during generate.
    // Learn more in our docs: https://docs.getnacelle.com/nuxt/nuxt-config.html#extendroutes
    // extendRoutes: null,
    extendRoutes: routes => routes.filter(r => r.route !== '/shop'),

    // Optional array of data type strings to direct Nacelle to include other data types
    // besides products in search data.
    // searchDataTypes: ['article', 'page', 'blog'],

    // Set to true to bypass fetching data from your space and generating
    // static JSON files.
    // Only set to true if you have previously performed this step at least once.
    // skipPrefetch: process.env.SKIP_PREFETCH === 'true',

    // If you wish to set the Nacelle GraphQL endpoint to something other than the
    // default.
    // customEndpoint: process.env.NACELLE_CUSTOM_ENDPOINT,

    // Set the event tracking endpoint to a URL other than the default
    // tem: process.env.NACELLE_TEM,

    // Customize the build process by creating a new NacelleClient class
    // object.
    // buildClient: null,

    // Enables attempting to fetch data from a user's preferred locale and falling back
    // fetching default locale data.
    isMultiLocale: true
  },

  generate: {
    concurrency: 5,
    fallback: true,
    async routes() {
      try {
        return getContentfulRoutes()
      } catch (err) {
        console.error(err)
      }
    },
    done({ errors }, nuxt) {
      nuxt.callHook('generate:done', { nuxt, errors })
    }
  },

  vue: {
    config: {
      devtools: true
    }
  },

  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    terser: {
      terserOptions: {
        compress: {
          pure_funcs: ['console.info', 'console.debug', 'console.warn', 'console.error']
        }
        // format: {
        //   comments: false
        // }
      }
      // extractComments: false
    },
    extractCSS: true,
    analyze: true,
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    transpile: ['@nacelle/nacelle-nuxt-module', '@nacelle/nacelle-tools', 'fuse.js', 'uuidv4']
  }
}
