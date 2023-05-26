import { mount, createLocalVue } from '@vue/test-utils'
import ImageOptimize from '@/mixins/imageOptimize'
import createStoreConfig from '../storeConfig'
import Vuex from 'vuex'
import { parseUrl } from 'query-string'

const localVue = createLocalVue()
localVue.use(Vuex)
const storeConfig = createStoreConfig()
const store = new Vuex.Store({ ...storeConfig })
const shopifyHeroImage =
  'https://cdn.shopify.com/s/files/1/0094/4098/5124/articles/iStock-476157466_1_f5c16680-57e9-43e9-9a9e-ea3017e1bda9.jpg?v=1575587194'
const contentfulImg = 'https://images.ctfassets.net/strhx3d94c40/4ZzhhpXumHNFGnJBKlpOEQ/47fe9af9ca73d23e2c15f73a20182e16/hero_image.jpg'

const ComponentReformat = {
  template: `
    <div>
      <source
        :srcset="optimizeSource({ url: source, format: 'webp' })"
        type="image/webp"
      />
      <img :src="source" />
    </div>
  `,
  data() {
    return {
      source: shopifyHeroImage
    }
  },
  mixins: [ImageOptimize]
}

const ComponentResize = {
  // Note that the image width (810px) will be rounded up to the nearest 50px (850px)
  template: `
    <img :src="optimizeSource({ url: source, width: 810 })" />
  `,
  data() {
    return {
      source: shopifyHeroImage
    }
  },
  mixins: [ImageOptimize]
}

const ContentfulComponent = {
  // Note that the image width (810px) will be rounded up to the nearest 50px (850px)
  template: `
    <img :src="optimizeSource({ url: source, width: 810 })" />
  `,
  data() {
    return {
      source: contentfulImg
    }
  },
  mixins: [ImageOptimize]
}

describe('ImageOptimize.vue', () => {
  it('changes the image format to webp', async () => {
    const wrapper = mount(ComponentReformat, { localVue, store })
    const { query } = parseUrl(wrapper.find('source').attributes('srcset'))

    expect(query.format).toBe('webp')
  })

  it('changes the image size to the maximum screen width (using Shopify CDN)', async () => {
    const wrapper = mount(ComponentResize, {
      localVue,
      store,
      propsData: {
        reformat: false
      },
      computed: {
        cdn: () => 'shopify'
      }
    })

    expect(wrapper.find('img').attributes('src')).toBe(
      'https://cdn.shopify.com/s/files/1/0094/4098/5124/articles/iStock-476157466_1_f5c16680-57e9-43e9-9a9e-ea3017e1bda9_850x.jpg?v=1575587194'
    )
  })

  it('changes the image size to the maximum screen width (using Cloudinary CDN)', async () => {
    const wrapper = mount(ComponentResize, {
      localVue,
      store,
      propsData: {
        reformat: false
      },
      computed: {
        cdn: () => 'cloudinary',
        cloudinaryCloudName: () => 'nacelle'
      }
    })

    expect(wrapper.find('img').attributes('src')).toBe(
      `https://res.cloudinary.com/nacelle/image/fetch/w_850/${shopifyHeroImage}`
    )
  })

  it('changes the image size to the maximum screen width (using Contentful CDN)', async () => {
    const wrapper = mount(ContentfulComponent, {
      localVue,
      store,
      propsData: {
        reformat: false
      }
    })

    expect(wrapper.find('img').attributes('src')).toBe(
      'https://images.ctfassets.net/strhx3d94c40/4ZzhhpXumHNFGnJBKlpOEQ/47fe9af9ca73d23e2c15f73a20182e16/hero_image.jpg?w=850'
    )
  })
})
