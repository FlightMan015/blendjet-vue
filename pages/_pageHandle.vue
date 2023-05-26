<template>
  <div class="page" v-if="page">
    <template v-if="page.sections">
      <template v-for="s in page.sections">
        <template v-if="isVisibleToUserCountry(s)" v-cloak>
          <div :key="s.fields.title">
            <TextRibbon v-if="isOfType(s, 'textRibbon')" :section="s.fields" />
            <ScrollingMarquee v-if="isOfType(s, 'scrollingMarquee')" :section="s.fields" />
            <SubNavMenu v-if="isOfType(s, 'subNavMenu')" :section="s.fields" />
            <LinkTileGrid v-if="isOfType(s, 'linkTileGrid')" :section="s.fields" />
            <ProductGrid v-if="isOfType(s, 'productGrid')" :section="s.fields" />
          </div>
        </template>
      </template>
    </template>
    <div class="page__container" v-else>
      <h1 class="page__title">{{ page.title }}</h1>
      <div class="page__body" v-if="hasRichText">
        <RichTextRenderer :document="page.fields.body" />
      </div>
    </div>
  </div>
</template>

<script>
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import debounce from 'lodash.debounce'

// Components
import TextRibbon from '~/components/TextRibbon'
import ScrollingMarquee from '~/components/ScrollingMarquee'
import SubNavMenu from '~/components/SubNavMenu'
import LinkTileGrid from '~/components/LinkTileGrid'
import ProductGrid from '~/components/ProductGrid'

// Mixins
import locationBasedRendering from '~/mixins/locationBasedRendering'
import getPage from '~/mixins/getPage'

export default {
  components: {
    TextRibbon,
    ScrollingMarquee,
    SubNavMenu,
    LinkTileGrid,
    ProductGrid,
    RichTextRenderer
  },
  mixins: [getPage(), locationBasedRendering],
  head() {
    const properties = {}
    const meta = []
    const { metaTitle, metaDescription } = this.page?.fields?.metaInfo?.fields ?? {}

    if (metaTitle) {
      properties.title = metaTitle
    }

    if (metaDescription) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: metaDescription
      })
    }

    return { ...properties, meta }
  },
  mounted() {
    this.handleDebouncedScroll = debounce(this.handleScroll, 200)
    window.addEventListener('scroll', this.handleDebouncedScroll, {
      passive: true
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleDebouncedScroll)
  },
  methods: {
    isOfType(section, type) {
      return section.sys.contentType.sys.id === type
    },
    /**
     * Scroll Handler - updates the page hash as the user scrolls through sections.
     */
    handleScroll(event) {
      const viewportHeight = window.innerHeight
      const anchorableSelectors = '.text-ribbon'
      // On scroll, find the most recently visible anchorable (in terms of vertical placement)
      const anchorSections = document.querySelectorAll(anchorableSelectors)
      const enhancedAnchorSections = anchorSections
        ? Array.from(anchorSections).map(node => ({
          node: node,
          rect: node.getBoundingClientRect()
        }))
        : []

      // If any anchor sections are present...
      if (enhancedAnchorSections.length) {
        // Find the last one that was visible...
        const visibleSection = enhancedAnchorSections.reduce((closest, curr) => {
          if (curr && curr.rect.top > viewportHeight) {
            return closest // if this element is below the viewport, bail
          } else if (curr.rect.top < 0 && closest && curr.rect.top > closest.rect.top) {
            return curr // if this element is above the viewport, but closer than the current closest, set it
          } else if (curr.rect.top > 0 && curr.rect.top < 0.5 * viewportHeight) {
            return curr // otherwise, if the top of this element is in the first 50% of the viewport
          } else {
            return closest
          }
        })

        // Bail if the current hash matches this sections to prevent redundant updates.
        if (this.$route.hash && this.$route.hash === `#${visibleSection.node.id}`) {
          return
        }

        this.$router.replace({
          name: this.$route.name,
          hash: `#${visibleSection.node.id}`,
          params: { noScroll: true }
        })
      }
    }
  },
  computed: {
    /**
     * The contentful vue richtext renderer causes build errors if the page's `content` isn't
     * in the shape of actual Contentful richtext. Adding this check to make sure it is...
     */
    hasRichText() {
      return (
        this.page &&
        this.page.fields &&
        this.page.fields.body &&
        this.page.fields.body.content &&
        Array.isArray(this.page.fields.body.content)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
  > * {
    display: none;
  }
}
.page {
  @include gradient-primary-light-purple(to bottom);

  &__container {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 50px;
    min-height: 100vh;
  }

  &__title {
    font-family: Medium;
    font-size: 38px;
    text-transform: uppercase;
    color: $grayscale-gray;
    line-height: 1.29;
    letter-spacing: 6px;
    padding-top: 60px;
    margin-bottom: 60px;
    text-align: center;

    @include respond-to('small') {
      font-size: 28px;
      letter-spacing: 3.5px;
      margin-top: 35px;
      margin-bottom: 35px;
    }
  }

  &__body {
    color: $grayscale-gray;
  }

  p {
    font-family: Regular;
    font-size: 16px;
    letter-spacing: 0.5px;
    line-height: 1.21;
    margin-bottom: 20px;
  }

  li {
    list-style-type: disc;
    margin-left: 20px;
  }

  h2 {
    font-family: Bold;
    font-size: 24px;
    line-height: 1.33;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    margin-bottom: 15px;
  }
}
</style>
