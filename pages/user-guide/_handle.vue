<template>
  <div>
    <transition name="fade">
      <div class="user-guide-container">
        <div class="hero-banner">
          <div class="hero-banner__column-left">
            <div class="hero-banner__text-block">
              <div class="hero-banner__text-block__title">
                {{ page.fields.title }}
              </div>
              <p class="hero-banner__text-block__text">
                {{ page.fields.description }}
              </p>
            </div>
          </div>
          <div class="hero-banner__column-right">
            <div
              v-if="page.fields.heroImage"
              class="hero-banner__image-container"
            >
              <img
                class="hero-banner__image-container__img"
                :src="
                  optimizeSource({ url: page.fields.heroImage.fields.file.url })
                "
              />
            </div>
          </div>
        </div>
        <div class="content-container">
          <div class="content-main">
            <div class="safety-warning">
              <div class="safety-warning__text">
                <div class="safety-warning__info">
                  <Info />
                </div>
                {{ page.fields.alert }}
              </div>
            </div>

            <div
              class="safety-warning"
              style="border-color: #cccccc !important;"
            >
              <div class="safety-warning__text">
                <a href="https://shop.blendjet.com/pages/tutorials"
                  >Click here for the BlendJet One Guide.</a
                >
              </div>
            </div>

            <!-- <div class="table-of-contents">
            <div class="table-of-contents__row">
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#anatomy-of-awesome'}">Anatomy of Blendjet</n-link>
              </div>
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#first-blend'}">Getting Started</n-link>
              </div>
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#modes'}">Blending Modes</n-link>
              </div>
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#troubleshooting'}">Troubleshooting</n-link>
              </div>
            </div>
            <div class="table-of-contents__row">
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#charging'}">Charging</n-link>
              </div>
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#cleaning'}">Cleaning</n-link>
              </div>
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#safeguards-caution'}">Important Safeguards & <br class="desktop-break"/>
                Cautionary information</n-link>
              </div>
              <div class="table-of-contents__cell">
                <n-link :to="{ path: '/user-guide',hash:'#contact-us'}">Contact Us</n-link>
              </div>
            </div>
          </div> -->
            <div id="anatomy-of-awesome" class="aoa">
              <div class="aoa__container">
                <div class="aoa__heading">
                  Anatomy of Awesome
                </div>
                <client-only
                  v-if="
                    page.fields.componentsDesktop &&
                      page.fields.componentsMobile
                  "
                >
                  <img
                    v-if="$mq !== 'sm'"
                    class="aoa__img"
                    :src="
                      optimizeSource({
                        url: page.fields.componentsDesktop.fields.file.url
                      })
                    "
                  />
                  <img
                    v-else
                    class="aoa__img-mobile"
                    :src="
                      optimizeSource({
                        url: page.fields.componentsMobile.fields.file.url
                      })
                    "
                  />
                </client-only>
              </div>
            </div>
            <div
              v-for="section in page.fields.userGuideSections"
              :key="section.fields.title"
              class="guide-section"
            >
              <div class="section-heading">{{ section.fields.title }}</div>
              <div v-if="section.fields.media" class="section-split">
                <div class="section-split col col-left">
                  <RichTextRenderer :document="section.fields.body" />
                </div>
                <div class="section-split col col-right">
                  <video
                    autoplay="autoplay"
                    loop="loop"
                    muted=""
                    webkit-playsinline=""
                    playsinline=""
                  >
                    <source
                      :src="
                        section.fields.externalVideoUrl ||
                          section.fields.media.fields.file.url
                      "
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
              <div v-else>
                <div class="section-subheading">
                  <RichTextRenderer
                    v-if="section.fields.body"
                    :document="section.fields.body"
                  />
                </div>
              </div>
              <div v-if="section.fields.cards">
                <div
                  v-for="card in section.fields.cards"
                  :key="card.fields.title"
                  class="section-panel"
                >
                  <Collapse>
                    <template v-slot:collapsed>
                      <div class="c-svg">
                        <ModelIcon :type="card.fields.type" />
                      </div>
                      <div class="c-heading">{{ card.fields.title }}</div>
                    </template>

                    <template v-slot:expanded>
                      <div>
                        <div class="section-split">
                          <div class="section-split col col-left">
                            <RichTextRenderer :document="card.fields.body" />
                          </div>
                          <div class="section-split col col-right">
                            <div class="rounded-video-container-md">
                              <video
                                autoplay="autoplay"
                                loop="loop"
                                muted=""
                                webkit-playsinline=""
                                playsinline=""
                              >
                                <source
                                  :src="
                                    card.fields.externalVideoUrl ||
                                      card.fields.media.fields.file.url
                                  "
                                  type="video/mp4"
                                />
                              </video>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </Collapse>
                </div>
              </div>
              <hr class="user-guide-divider" />
            </div>
            <div id="safeguards-caution" class="guide-section">
              <div class="safeguards__dos">
                <div class="safeguards__section-heading">DOs</div>
                <div class="safeguards__section">
                  <RichTextRenderer
                    :document="page.fields.doList"
                    :nodeRenderers="doRenders"
                  />
                </div>
              </div>
              <hr class="user-guide-subdivider" />
              <div class="safeguards__donts">
                <div class="safeguards__section-heading">DO NOTs</div>
                <div class="safeguards__section">
                  <RichTextRenderer
                    :document="page.fields.doNotList"
                    :nodeRenderers="doNotRenders"
                  />
                </div>
              </div>
              <hr class="user-guide-subdivider" />
            </div>
            <div id="contact-us" class="guide-section">
              <div class="contact-heading">Contact Us</div>
              <div class="section-subheading">
                <a class="contact-email" href="mailto:support@blendjet.com"
                  >Support@blendjet.com</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Info from '~/components/svg/info'
import ImageOptimize from '~/mixins/imageOptimize'
import ListGrid from '~/components/ListGrid'
import DoItem from '~/components/DoItem'
import DoNotItem from '~/components/DoNotItem'
import ModelIcon from '~/components/ModelIcon'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { createClient } from '~/plugins/contentful.js'
const client = createClient()
const Collapse = () => import('~/components/collapse')

export default {
  data() {
    return {
      metaTitle: '',
      metaDescription: ''
    }
  },
  components: {
    Info,
    Collapse,
    ModelIcon,
    RichTextRenderer
  },
  mixins: [ImageOptimize],
  head() {
    const properties = {}
    const meta = []
    const mdescription = this.metaDescription
    const title = this.metaTitle
    if (title.length) {
      properties.title = title
    }

    if (mdescription.length) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: mdescription
      })
    }

    return { ...properties, meta }
  },
  async asyncData({ params }) {
    const userGuide = await client
      .getEntries({
        content_type: 'userGuide',
        'fields.handle': params.handle
      })
      .then(async res => {
        const data = res.items[0]

        if (data.fields.userGuideSections) {
          const userGuideSections = []
          for (const [, item] of data.fields.userGuideSections.entries()) {
            const section = await client.getEntry(item.sys.id)
            userGuideSections.push(section)
          }
          data.fields.userGuideSections = userGuideSections
        }

        return data
      })

    return { page: userGuide }
  },
  async mounted() {
    await client.getEntry('DtNqBDOvFbHUSxyOK3IMM').then(res => {
      if (res.fields.metaInfo) {
        this.metaTitle = res.fields.metaInfo.fields.metaTitle
        this.metaDescription = res.fields.metaInfo.fields.metaDescription
      }
    })
  },
  computed: {
    doRenders() {
      return {
        [BLOCKS.LIST_ITEM]: (node, key, h, next) =>
          h(DoItem, { key }, next(node.content, key, h, next)),
        [BLOCKS.UL_LIST]: (node, key, h, next) =>
          h(ListGrid, { key }, next(node.content, key, h, next))
      }
    },
    doNotRenders() {
      return {
        [BLOCKS.LIST_ITEM]: (node, key, h, next) =>
          h(DoNotItem, { key }, next(node.content, key, h, next)),
        [BLOCKS.UL_LIST]: (node, key, h, next) =>
          h(ListGrid, { key }, next(node.content, key, h, next))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.no-content {
  height: 100vh;
}

div {
  color: $grayscale-gray;
  font-family: Regular;
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 1.21;
}

ol {
  max-width: 600px;
  counter-reset: guide-counter;
  list-style: none;
  margin-left: 45px;
  // padding-left: 40px;
}
ol li {
  margin: 0.75rem 0;
  counter-increment: guide-counter;
  position: relative;
  // display: block;
  height: 3.5em;
  // line-height: 12px;
  display: flex;
  align-items: center;

  @include respond-to('small') {
    height: auto;
  }
}

ol li span {
  display: inline-block;
  vertical-align: middle;
}
ol li::before {
  content: counter(guide-counter);
  color: white;
  font-family: Bold;
  font-size: 1rem;
  position: absolute;
  --size: 32px;
  left: calc(-1 * var(--size) - 10px);
  line-height: var(--size);
  width: var(--size);
  height: var(--size);
  background: $primary-purple;
  border-radius: 50%;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
}

/* .user-guide-container {
  margin-top: 100px;
} */

.hero-banner {
  @include gradient-primary-purple-turquoise(to right);
  height: 560px;
  position: relative;
  display: flex;
  justify-content: space-around;
  flex-flow: row wrap;

  &__blendjet-one {
    position: absolute;
    top: 20px;
    right: 30px;
    border: 1px solid $grayscale-white;
    border-radius: 12px;
    height: 95px;
    width: 240px;
    font-family: Regular;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.29;
    // display: flex;
    text-align: center;
    padding: 12px 12px;
    color: $grayscale-white;

    @include respond-to('small') {
      position: relative;
      top: 0;
      right: 0;
    }

    &__link {
      text-transform: uppercase;
      margin-top: 15px;
      color: $grayscale-white;
    }
    // justify-content: center
  }

  &__column-left {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    @include respond-to('small') {
      width: 95%;
    }
  }

  &__column-right {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 50%;
    @include respond-to('small') {
      width: 95%;
      justify-content: center;
    }
  }

  &__text-block {
    color: $grayscale-white;
    max-width: 350px;

    &__title {
      font-size: 36px;
      font-family: Medium;
      letter-spacing: 6px;
      line-height: 1.17;
      text-align: center;
      color: $grayscale-white;
      text-transform: uppercase;
    }

    &__text {
      font-family: Regular;
      font-size: 14px;
      letter-spacing: 0.5px;
      line-height: 1.29;
      text-align: center;
    }
  }

  &__image-container {
    display: flex;
    justify-content: center;
    align-items: center;

    &__img {
      // height: 411px;
      width: auto;
    }
  }

  @include respond-to('small') {
    padding: 15px;
    height: auto;
  }
}

.desktop-break {
  @include respond-to('small') {
    display: none;
  }
}

.content-container {
  // width: 80%;
  display: flex;
  justify-content: center;
  padding: 0 10vw;
  @include respond-to('small') {
    padding: 0;
  }
}

.content-main {
  width: 100%;
}

.collapse-content {
  display: flex;
  align-items: center;
}

.collapse {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 26px;

  &__heading {
    font-family: Bold;
    font-size: 18px;
    letter-spacing: 3.5px;
    line-height: 1.33;
    text-transform: uppercase;
  }
}

.safety-warning {
  margin-top: 39px;
  margin-bottom: 35px;
  border: 1px solid red;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
  height: 44px;

  &__panel {
    height: 44px;
    justify-content: space-around;
  }

  &__info {
    margin-right: 16px;
  }

  &__text {
    font-family: Regular;
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: 0.5px;
    color: $primary-purple;
    display: flex;
    align-items: center;
    @include respond-to('small') {
      margin-bottom: 10px;
    }
  }

  &__link {
    margin-left: 12px;
    & > a {
      font-family: Bold;
      font-size: $text-small;
      line-height: 1.17;
      letter-spacing: 1.75px;
      color: $primary-purple;
      text-transform: uppercase;
      display: flex;
      align-items: center;
    }
  }

  @include respond-to('small') {
    height: auto;
    padding: 17px 44px;
    margin: 23px;
  }
}

.table-of-contents {
  background-color: $primary-purple-tint;
  display: flex;
  flex-flow: column nowrap;
  border-radius: 12px;
  margin-bottom: 35px;

  &__row {
    display: flex;
    flex-flow: row wrap;
  }

  &__cell {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75px;
    border: 1px solid $grayscale-white;
    width: 25%;
    text-align: center;
    padding: 7px;
    @include respond-to('small') {
      width: 50%;
    }
    & > a {
      color: $primary-purple;
      font-family: Bold;
      font-size: $text-small;
      letter-spacing: 1.75px;
      line-height: 1.17;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
}

.guide-section {
  @include respond-to('small') {
    padding: 0 23px;
  }
}

.aoa {
  height: 796px;
  background-color: $primary-purple-tint;
  position: relative;
  margin-bottom: 50px;

  &__heading {
    position: absolute;
    top: 30px;
    left: 30px;
    font-family: Medium;
    font-size: 28px;
    letter-spacing: 5px;
    line-height: 1.14;
    text-transform: uppercase;
    color: $primary-purple;
    @include respond-to('small') {
      display: none;
      font-size: 24px;
      line-height: 1.17;
      letter-spacing: 3.5px;
    }
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 30px;
  }
  @media screen and (min-width: 768px) {
    border-radius: 12px;
  }

  &__img {
    height: 785px;
  }

  @include respond-to('small') {
    height: auto;
  }
}

/* #first-blend {
} */

.section-heading {
  font-family: Medium;
  font-size: 28px;
  letter-spacing: 5px;
  line-height: 1.14;
  color: $primary-purple;
  margin-bottom: 30px;
}

.section-subheading {
  max-width: 910px;
  margin-bottom: 40px;
}

// Collapse panel slot
.c-svg {
  margin-right: 23px;
}

.c-heading {
  font-family: Bold;
  font-size: 18px;
  line-height: 1.33;
  letter-spacing: 3.5px;
  color: $primary-purple;
  text-transform: uppercase;

  @include respond-to('small') {
    font-size: $text-small;
    line-height: 2;
    letter-spacing: 1.75px;
  }
}

.section-split {
  display: flex;
  flex-flow: row wrap;

  &__subheading {
    margin-bottom: 20px;
  }
}

.col {
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  @include respond-to('small') {
    width: 100%;
  }
}

.col-left {
  display: flex;
}

.col-right {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.col-centered {
  align-items: center;
}

.charging-tabs {
  display: flex;
  justify-content: center;
  margin-top: 23px;
  @include respond-to('small') {
    display: none;
  }
}

.section-panel {
  margin-bottom: 15px;

  h4 {
    font-family: Bold;
    font-size: $text-small;
    text-transform: uppercase;
    line-height: 1.42;
    letter-spacing: 1.75px;
    color: $primary-purple;
    margin-top: 20px;
  }
}

.content-centered {
  display: flex;
  justify-content: center;
}

.bold {
  font-weight: bold;
}

.content-text {
  margin-bottom: 21px;
}

.safeguards {
  &__section {
    display: flex;
    flex-flow: row wrap;
  }

  &__section-heading {
    font-family: Medium;
    font-size: 24px;
    line-height: 1.33;
    letter-spacing: 4.29px;
    color: $primary-purple;
    margin-bottom: 23px;
  }

  &__col {
    width: 50%;
    display: flex;
    flex-flow: column nowrap;

    @include respond-to('small') {
      width: 100%;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 35px;

    &__text {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}

#contact-us {
  margin-bottom: 63px;
}

.contact-heading {
  font-family: Medium;
  font-size: 28px;
  letter-spacing: 5px;
  line-height: 1.14;
  color: $primary-purple;
  margin-bottom: 15px;
}

.contact-link {
  color: $primary-purple;
  text-decoration: underline;
}

.rounded-video-container-md {
  width: 350px;
  // height: 320px;
  border-radius: 12px;
  overflow: hidden;
  @include respond-to('small') {
    width: auto;
  }
}

.contact-email {
  font-family: Bold;
  font-size: $text-small;
  line-height: 2;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  color: $primary-purple;
}

/* .slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
} */

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
</style>
