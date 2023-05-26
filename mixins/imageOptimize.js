import { parse, stringify } from 'query-string'
import { mapGetters } from 'vuex'

export default {
  props: {
    containerRef: {
      type: String,
      default: ''
    },
    reformat: {
      type: Boolean,
      default: true
    },
    cropDirection: {
      type: String,
      default: 'center'
    }
  },
  data() {
    return {
      blankImage:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 5'%3E%3C/svg%3E",
      containerWidth: null,
      containerHeight: null,
      containerPosition: null,
      loaded: false,
      validImage: true
    }
  },
  computed: {
    // Alias `getMetafield` because it can compete with the productMetafields mixin method of the same name...
    ...mapGetters('space', {
      getNacelleMetafield: 'getMetafield'
    }),
    cdn() {
      const supportedCDNs = ['shopify', 'cloudinary']
      const metafieldCDN = this.getNacelleMetafield('cdn', 'provider')?.toLowerCase() || ''

      return supportedCDNs.includes(metafieldCDN) ? metafieldCDN : 'shopify'
    },
    cloudinaryCanAutoFormat() {
      return Boolean(this.reformat && this.isCloudinary && this.cloudinaryCloudName)
    },
    cloudinaryCloudName() {
      return this.getNacelleMetafield('cdn', 'cloudinary-cloud-name')
    },
    cloudinaryUrlBase() {
      return `https://res.cloudinary.com/${this.cloudinaryCloudName}/image/fetch/`
    },
    fallbackImage() {
      return this.blankImage
    },
    loading() {
      return !this.loaded
    },
    shopifyPathPrefix() {
      const path =
        this.getNacelleMetafield('cdn', 'shopify-path-prefix') || 'https://cdn.shopify.com/s/files/'
      return path.split('').reverse()[0] !== '/' ? path.concat('/') : path
    },
    isShopify() {
      return /shopify/i.test(this.cdn)
    },
    isCloudinary() {
      return /cloudinary/i.test(this.cdn)
    }
  },
  methods: {
    isValidHttpUrl(str) {
      let src

      try {
        src = new URL(str.startsWith('//') ? 'https:' + str : str).href
      } catch (_) {
        return { valid: false }
      }

      return { src, valid: true }
    },
    calculateContainer() {
      if ((process.client || process.browser) && this.containerRef) {
        this.containerHeight = this.$refs[this.containerRef].clientHeight
        this.containerWidth = this.$refs[this.containerRef].clientWidth
        this.containerPosition = window.getComputedStyle(this.$refs[this.containerRef]).position
      }
    },
    onLoaded() {
      this.loaded = true
    },
    fallback() {
      this.validImage = false
    },
    roundedUpToNearest50px(x) {
      if (x >= 50) {
        return +x + 49 - ((+x + 49) % 50)
      }
    },
    optimizeSource({ url, width, height, crop = false, format } = {}) {
      const { src, valid } = this.isValidHttpUrl(url)

      if (!valid) return url

      const options = {
        src,
        width: this.roundedUpToNearest50px(width),
        height: this.roundedUpToNearest50px(height),
        crop,
        format
      }

      if (/ctfassets/i.test(src)) {
        return this.contentfulOptimize(options)
      }

      if (/shopify/i.test(src)) {
        return this.isCloudinary
          ? this.cloudinaryOptimize({ ...options, src: this.shopifyToCloudinary({ src }) })
          : this.shopifyOptimize(options)
      }

      if (/cloudinary/i.test(src)) {
        return this.cloudinaryOptimize(options)
      }

      return src
    },
    shopifyOptimize({ src, width, height, crop, format = 'webp' }) {
      const getSizeString = () => {
        if (!width && !height) return ''

        return ['_', width, 'x', crop ? this.roundedUpToNearest50px((width / 3) * 4) : height]
          .filter(Boolean)
          .join('')
      }

      const { origin, pathname, search } = new URL(src)
      const segments = pathname.split('/').filter(Boolean)
      const file = segments.pop()
      const [filename, ext] = file.split('.')
      const newFilename =
        filename + getSizeString() + (crop ? `_crop_${this.cropDirection}` : '') + `.${ext}`
      const newSearch = stringify(Object.assign(parse(search), this.reformat && { format }))

      return `${origin}/${[...segments, newFilename].join('/')}?${newSearch}`
    },
    cloudinaryOptimize({ src, width, height, crop, format = 'auto', api = 'fetch' }) {
      const paramsPath = [
        !!width && `w_${width}`,
        !!(height || crop) && `h_${crop ? this.roundedUpToNearest50px((width / 3) * 4) : height}`,
        crop && 'c_lfill,g_center',
        this.reformat && (format === 'pjpg' ? 'f_jpg,fl_progressive' : `f_${format}`)
      ]
        .filter(Boolean)
        .join(',')

      return src
        .split(`${api}/`)
        .reduce((acc, next, i) => (i === 0 ? `${next}${api}/${paramsPath}/` : acc + next), '')
    },
    contentfulOptimize({ src, width, height, crop, format = 'webp' }) {
      const { origin, pathname, search } = new URL(src)
      const newSearch = stringify(
        Object.assign(
          parse(search),
          !!width && { w: width },
          !!(height || crop) && { h: crop ? this.roundedUpToNearest50px((width / 3) * 4) : height },
          crop && { fit: 'crop' },
          this.reformat && (format === 'pjpg' ? { fm: 'jpg', fl: 'progressive' } : { fm: format })
        )
      )

      return `${origin}${pathname}?${newSearch}`
    },
    shopifyToCloudinary({ src, api = 'fetch' }) {
      if (api === 'upload') {
        return this.cloudinaryUrlBase + src.split(this.shopifyPathPrefix)[1].split('&')[0]
      }

      return this.cloudinaryUrlBase + src.split('&')[0]
    }
  }
}
