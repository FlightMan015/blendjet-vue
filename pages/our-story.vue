<template>
  <div>
    <div class="page-container">
     <div style="position:relative;width:100%;height:0;padding-bottom:56.27198%;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" width='500' height='294' src="https://www.youtube.com/embed/Eo4MMePM4R0?&theme=dark&color=white&autohide=1&modestbranding=1&showinfo=0&rel=0"frameborder="0"></iframe></div>
    </div>
      <!-- <content-hero-banner
        id="hero-banner"
        :imageUrl="optimizeSource({ url: page.fields.heroImage.fields.file.url, width: 2000 })"
        backgroundAltTag="A girl with her BlendJet"
        :title="page.fields.title"
        :subtitle="page.fields.subhead"
        :location="'about-us'"
        :textColor="'white'"
      /> -->
      <div class="title-banner">
        <div class="title-banner__text-block">
          <RichTextRenderer :document="page.fields.missionText" />
        </div>
      </div>
      <div class="about-us-video">
        <img
          class="about-us-video__img"
          :src="optimizeSource({ url: page.fields.missionHero.fields.file.url, width: 2000 })"
          :alt="page.fields.missionHero.fields.description"
        />
      </div>

      <div class="what-drives-us">
        <div class="what-drives-us__banner">
          <div class="what-drives-us__banner__text-block">
            <RichTextRenderer :document="page.fields.pillarsText" />
          </div>
        </div>
        <div class="what-drives-us__image-grid">
          <div
            v-for="(pillar, index) in page.fields.pillars"
            :key="index"
            class="what-drives-us__image-grid__section"
            @click="openDriveModal(index)"
          >
            <div class="what-drives-us__image-grid__section__text">
              {{ pillar.fields.title }}
            </div>
            <img
              class="what-drives-us__image-grid__section__img darken-image"
              :src="optimizeSource({ url: pillar.fields.image.fields.file.url, width: 700 })"
              :alt="pillar.fields.image.fields.description"
            />
          </div>
        </div>
        <modal name="drive-modal" :width="'100%'" height="auto">
          <div class="drive__container">
            <div slot="top-right" @click="$modal.hide('drive-modal')">
              <Close :color="'purple'" />
            </div>
            <div class="drive__image-container">
              <div class="drive__decrement" @click="decrementDrive">
                <PrevSlide />
              </div>
              <img
                :src="
                  optimizeSource({
                    url: page.fields.pillars[openDrive].fields.image.fields.file.url
                  })
                "
              />
              <div class="drive__increment" @click="incrementDrive">
                <NextSlide />
              </div>
            </div>
            <div class="drive__text-container">
              <div class="drive__text-container__heading">
                {{ page.fields.pillars[openDrive].fields.title }}
              </div>
              <div class="drive__text-container__main">
                <RichTextRenderer :document="page.fields.pillars[openDrive].fields.text" />
              </div>
            </div>
          </div>
        </modal>
      </div>

      <div class="our-journey">
        <div class="our-journey__title">
          Our Journey
        </div>
        <div class="our-journey__container">
          <div
            v-for="(journey, index) in page.fields.journey"
            :key="index"
            class="our-journey__container-inner"
          >
            <ImageTextSet :content="journey" :color="index === 0 ? 'dark' : 'white'" />
          </div>

          <div class="our-journey__cheers">
            <div class="our-journey__cheers__svg">
              <Cheers />
            </div>
            <div class="text-centered text-purple our-journey__blendjet-team">
              The Blendjet Team
            </div>
          </div>
        </div>
      </div>

      <div class="leadership">
        <div class="leadership__heading">
          Our Leadership
        </div>
        <div class="leadership__grid">
          <div
            class="leadership__grid__entry"
            v-for="(leadership, i) in page.fields.leadership"
            :key="i"
            @click="openBioModal(i)"
          >
            <img
              class="leadership__grid__entry__img"
              :src="optimizeSource({ url: leadership.fields.image.fields.file.url })"
              :alt="leadership.fields.image.fields.description"
            />
            <div class="leadership__grid__entry__name">
              {{ leadership.fields.name }}
            </div>
            <div class="leadership__grid__entry__title">
              {{ leadership.fields.title }}
            </div>
            <div v-if="leadership.fields.tag" class="leadership__grid__entry__tag">
              {{ leadership.fields.tag }}
            </div>
          </div>
        </div>
      </div>

      <modal name="bio-modal" :adaptive="true" height="auto" width="810px">
        <div class="bio__container">
          <div slot="top-right" @click="$modal.hide('bio-modal')">
            <Close />
          </div>
          <div class="bio__content">
            <div class="bio__content__image-container">
              <img
                :src="
                  optimizeSource({
                    url: page.fields.leadership[openBio].fields.image.fields.file.url
                  })
                "
                class="bio__content__image-container__img"
              />
            </div>
            <div class="bio__content__text-container">
              <div class="bio__content__text-container__name">
                {{ page.fields.leadership[openBio].fields.name }}
              </div>
              <div class="bio__content__text-container__title">
                {{ page.fields.leadership[openBio].fields.title }}
              </div>
              <div
                v-if="page.fields.leadership[openBio].fields.tag"
                class="bio__content__text-container__tag leadership__grid__entry__tag"
              >
                {{ page.fields.leadership[openBio].fields.tag }}
              </div>
              <div class="bio__content__text-container__text-block">
                <RichTextRenderer :document="page.fields.leadership[openBio].fields.body" />
              </div>
            </div>
          </div>

          <div class="bio__favorites">
            <div class="bio__favorites__item">
              <div class="bio__favorites__item__category">
                Favorite BlendJet:
              </div>
              <n-link
                :to="page.fields.leadership[openBio].fields.favoriteBlendJet.fields.path"
                class="bio__favorites__item__image-container"
              >
                <img
                  class="bio__favorites__item__image-container__img"
                  :src="
                    optimizeSource({
                      url:
                        page.fields.leadership[openBio].fields.favoriteBlendJet.fields.image.fields
                          .file.url + '?w=250'
                    })
                  "
                />
              </n-link>
              <div class="bio__favories__item__name">
                {{ page.fields.leadership[openBio].fields.favoriteBlendJet.fields.title }}
              </div>
            </div>

            <div class="bio__favorites__item">
              <div class="bio__favorites__item__category">
                Favorite JetPack:
              </div>
              <n-link
                :to="page.fields.leadership[openBio].fields.favoriteJetPack.fields.path"
                class="bio__favorites__item__image-container"
              >
                <img
                  class="bio__favorites__item__image-container__img"
                  :src="
                    optimizeSource({
                      url:
                        page.fields.leadership[openBio].fields.favoriteJetPack.fields.image.fields
                          .file.url + '?w=250'
                    })
                  "
                />
              </n-link>
              <div class="bio__favories__item__name">
                {{ page.fields.leadership[openBio].fields.favoriteJetPack.fields.title }}
              </div>
            </div>

            <div class="bio__favorites__item">
              <div class="bio__favorites__item__category">
                Favorite Recipe:
              </div>
              <n-link
                :to="
                  `/recipes/${page.fields.leadership[openBio].fields.favoriteRecipe.fields.handle}`
                "
                class="bio__favorites__item__image-container"
              >
                <img
                  class="bio__favorites__item__image-container__img"
                  :src="
                    optimizeSource({
                      url:
                        page.fields.leadership[openBio].fields.favoriteRecipe.fields.teaserImage
                          .fields.file.url + '?w=250'
                    })
                  "
                />
              </n-link>
              <div class="bio__favories__item__name">
                {{ page.fields.leadership[openBio].fields.favoriteRecipe.fields.title }}
              </div>
            </div>
          </div>
        </div>
      </modal>

      <modal
        name="bio-modal-mobile"
        height="auto"
        width="100%"
        :adaptive="false"
        :scrollable="true"
        transition="fade"
      >
        <div class="bio__container">
          <div slot="top-right" @click="$modal.hide('bio-modal-mobile')">
            <Close :color="'purple'" />
          </div>
          <div class="bio__content">
            <div class="bio__content__image-container">
              <img
                :src="
                  optimizeSource({
                    url: page.fields.leadership[openBio].fields.image.fields.file.url
                  })
                "
                class="bio__content__image-container__img-mobile"
              />
            </div>
            <div class="bio__content__text-container">
              <div class="bio__content__text-container__name">
                {{ page.fields.leadership[openBio].fields.name }}
              </div>
              <div class="bio__content__text-container__title">
                {{ page.fields.leadership[openBio].fields.title }}
              </div>
              <div
                v-if="page.fields.leadership[openBio].fields.tag"
                class="bio__content__text-container__tag leadership__grid__entry__tag"
              >
                {{ page.fields.leadership[openBio].fields.tag }}
              </div>
              <div class="bio__content__text-container__text-block">
                <RichTextRenderer :document="page.fields.leadership[openBio].fields.body" />
              </div>
            </div>
          </div>
          <div class="bio__favorites">
            <div class="bio__favorites__mobile__top-row">
              <div class="bio__favorites__item bio__favorites__mobile__blendjet-margin">
                <div class="bio__favorites__item__category">
                  Favorite BlendJet:
                </div>
                <n-link
                  :to="page.fields.leadership[openBio].fields.favoriteBlendJet.fields.path"
                  class="bio__favorites__item__image-container"
                >
                  <img
                    class="bio__favorites__item__image-container__img"
                    :src="
                      optimizeSource({
                        url:
                          page.fields.leadership[openBio].fields.favoriteBlendJet.fields.image
                            .fields.file.url + '?w=250'
                      })
                    "
                  />
                </n-link>
                <div class="bio__favories__item__name">
                  {{ page.fields.leadership[openBio].fields.favoriteBlendJet.fields.title }}
                </div>
              </div>

              <div class="bio__favorites__item">
                <div class="bio__favorites__item__category">
                  Favorite JetPack:
                </div>
                <n-link
                  :to="page.fields.leadership[openBio].fields.favoriteJetPack.fields.path"
                  class="bio__favorites__item__image-container"
                >
                  <img
                    class="bio__favorites__item__image-container__img"
                    :src="
                      optimizeSource({
                        url:
                          page.fields.leadership[openBio].fields.favoriteJetPack.fields.image.fields
                            .file.url + '?w=250'
                      })
                    "
                  />
                </n-link>
                <div class="bio__favories__item__name">
                  {{ page.fields.leadership[openBio].fields.favoriteJetPack.fields.title }}
                </div>
              </div>
            </div>
            <div class="bio__favorites__mobile__bottom-row">
              <div class="bio__favorites__item">
                <div class="bio__favorites__item__category">
                  Favorite Recipe:
                </div>
                <n-link
                  :to="
                    `/recipes/${page.fields.leadership[openBio].fields.favoriteRecipe.fields.handle}`
                  "
                  class="bio__favorites__item__image-container"
                >
                  <img
                    class="bio__favorites__item__image-container__img"
                    :src="
                      optimizeSource({
                        url:
                          page.fields.leadership[openBio].fields.favoriteRecipe.fields.teaserImage
                            .fields.file.url + '?w=250'
                      })
                    "
                  />
                </n-link>
                <div class="bio__favories__item__name">
                  {{ page.fields.leadership[openBio].fields.favoriteRecipe.fields.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </modal>

      <!-- <div class="press-contact">
      <div class="press-contact__press-container">
        <div class="press-contact__svg-container">
          <svg width="62px" height="62px" viewBox="0 0 62 62" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>Group 12</title>
              <g id="About-Us" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="D-BlendJet-About-Us-1" transform="translate(-344.000000, -6745.000000)">
                      <g id="Press-&amp;-Contact" transform="translate(0.000000, 6666.000000)">
                          <g id="1" transform="translate(45.000000, 30.000000)">
                              <g id="Group-12" transform="translate(300.000000, 50.000000)">
                                  <circle id="Oval" stroke="#FFFFFF" cx="30" cy="30" r="30"></circle>
                                  <circle id="Oval" fill="#FFFFFF" cx="30" cy="30" r="26"></circle>
                                  <g id="Group-10" transform="translate(9.988250, 18.940931)">
                                      <g id="Group" transform="translate(15.237770, 13.604152) rotate(-15.000000) translate(-15.237770, -13.604152) translate(2.737770, 3.604152)" fill="#25B1D5" fill-rule="nonzero">
                                          <path d="M24.2331018,0.162155172 C24.0301152,0.0430137931 23.7788638,0.0399413793 23.5727965,0.154303448 C19.2090992,2.57263448 13.8489537,3.83334828 6.7036905,4.12249655 C6.34700925,4.13683448 6.06597729,4.42939655 6.06597729,4.78477241 L6.06597729,11.6529828 C6.06597729,12.0087 6.34700925,12.3005793 6.7036905,12.3152586 C13.8489537,12.6044069 19.2090992,13.8651207 23.5727965,16.2834517 C23.673434,16.3387552 23.7846829,16.3667483 23.8955896,16.3667483 C24.0123154,16.3667483 24.1290412,16.3363655 24.2327595,16.2752586 C24.435746,16.1557759 24.5603455,15.9386586 24.5603455,15.7037897 L24.5603455,0.733624138 C24.5606871,0.498755172 24.4360883,0.281296552 24.2331018,0.162155172 Z" id="Path"></path>
                                          <path d="M4.14256854,4.15492759 C1.89568209,4.15492759 0.0674339781,5.9778931 0.0674339781,8.21904828 C0.0674339781,10.4598621 1.89533978,12.2828276 4.14256854,12.2828276 C4.50986123,12.2828276 4.8073238,11.986169 4.8073238,11.6202103 L4.8073238,4.81788621 C4.8073238,4.45158621 4.50986123,4.15492759 4.14256854,4.15492759 Z" id="Path"></path>
                                          <path d="M9.25728175,14.0945276 C9.1460328,13.7685103 8.84720101,13.5438828 8.50215812,13.5264724 L6.94809588,13.4503448 C6.6732254,13.4380552 6.40657023,13.5592448 6.23849874,13.7787517 C6.07042725,13.9975759 6.02113541,14.2850172 6.10671152,14.5468552 L7.5022868,19.0964172 C7.61490496,19.4422345 7.93769807,19.6764207 8.30225231,19.6764207 L9.91519092,19.6764207 C9.91587553,19.6760793 9.91656013,19.6760793 9.91724474,19.6764207 C10.3820942,19.6764207 10.7586291,19.3002207 10.7586291,18.8376517 C10.7586291,18.7209 10.7346678,18.6099517 10.6918797,18.5092448 L9.25728175,14.0945276 Z" id="Path"></path>
                                      </g>
                                      <line x1="30.0117497" y1="7.05906938" x2="37.0117497" y2="6.05906938" id="Line" stroke="#26B3D6" stroke-width="2" stroke-linecap="round"></line>
                                      <line x1="29.0117497" y1="3.05906938" x2="32.0117497" y2="0.0590693794" id="Line" stroke="#26B3D6" stroke-width="2" stroke-linecap="round"></line>
                                      <line x1="31.5979142" y1="14.0085062" x2="35.0733498" y2="10.7946563" id="Line" stroke="#26B3D6" stroke-width="2" stroke-linecap="round" transform="translate(33.335632, 12.401581) rotate(62.710795) translate(-33.335632, -12.401581) "></line>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
        <div class="press-contact__heading">
          BLENDJET IN THE NEWS
        </div>
        <div class="press-contact__main">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus ipsum quam, a vulputate urna vestibulum sit amet.
        </div>
        <div class="press-contact__heading">
          Press
        </div>
      </div>

      <div class="press-contact__contact-container">
        <div class="press-contact__svg-container">
          <svg width="62px" height="62px" viewBox="0 0 62 62" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>Group 11</title>
              <g id="About-Us" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="D-BlendJet-About-Us-1" transform="translate(-1034.000000, -6745.000000)">
                      <g id="Press-&amp;-Contact" transform="translate(0.000000, 6666.000000)">
                          <g id="1-copy" transform="translate(735.000000, 30.000000)">
                              <g id="Group-11" transform="translate(300.000000, 50.000000)">
                                  <circle id="Oval" stroke="#FFFFFF" cx="30" cy="30" r="30"></circle>
                                  <circle id="Oval" fill="#FFFFFF" cx="30" cy="30" r="26"></circle>
                                  <rect id="Rectangle" fill="#6D6DC7" x="21" y="15" width="17" height="29" rx="3"></rect>
                                  <rect id="Rectangle-Copy" fill="#FFFFFF" x="23" y="17" width="13" height="25" rx="2"></rect>
                                  <rect id="Rectangle-Copy" fill="#6F70CA" x="25" y="16" width="9" height="3" rx="1.5"></rect>
                                  <rect id="Rectangle-Copy" fill="#6A6BC5" x="26" y="39" width="7" height="1" rx="0.5"></rect>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
        <div class="press-contact__heading">
          GET IN TOUCH
        </div>
        <div class="press-contact__main">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus ipsum quam, a vulputate urna vestibulum sit amet.
        </div>
        <div class="press-contact__heading">
          Contact Us
        </div>
      </div>
    </div> -->
    </div>
  </div>
</template>

<script>
import ContentHeroBanner from '~/components/nacelle/ContentHeroBanner'
import ContentSideBySide from '~/components/nacelle/ContentSideBySide'
import imageOptimize from '~/mixins/imageOptimize'
import Close from '~/components/svg/modalClose'
import PrevSlide from '~/components/svg/PrevSlide'
import NextSlide from '~/components/svg/NextSlide'
import Cheers from '~/components/svg/Cheers'
import ImageTextSet from '~/components/ImageTextSet'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import { createClient } from '~/plugins/contentful.js'
const client = createClient()

export default {
  data() {
    return {
      openBio: 0,
      openDrive: 0,
      screenWidth: 0,
      images: {},
      driveContent: [
        {
          imageUrl: '/images/about-us/quality-innovation.jpg',
          heading: 'Quality & Innovation',
          main:
            'We invented the original portable blender so that you can make your favorite recipes beyond the confines of your kitchen. The ability to go anywhere and make anything without a cord has defined a new category and shaken up the industry. Our patented technologies deliver big blender performance on the go, along with unique, must-have features.'
        },
        {
          imageUrl: '/images/about-us/nutrition.jpg',
          heading: 'Nutrition',
          main:
            'Enjoy delicious and nutritious smoothies on the fly and make more homemade. BlendJet can kick-start a weight loss journey or simply help you sneak more fruits and veggies into your daily diet. And it will keep you fueled with protein and healthy nutrients even when you don’t have access to a fridge or grocery store thanks to our innovative JetPack Ready-to-Blend smoothies.'
        },
        {
          imageUrl: '/images/about-us/drive-quality.jpg',
          heading: 'Service & Support',
          main:
            'We take great pride in handling product development, fulfillment and customer service in-house because we care about being directly connected to our customers. We built BlendJet by listening to our customers, and we strive to exceed your expectations.'
        },
        {
          imageUrl: '/images/about-us/health-and-wellness.jpg',
          heading: 'Health & Wellness',
          main:
            'BlendJet is a lifestyle and it promises to make your life sweeter in so many ways. Whether your idea of wellness is chilling with a frozen margarita on a beach, an ice cream milkshake on the couch or a protein smoothie at the gym, we’re excited to serve up a product that helps you be the healthiest and happiest version of yourself. Whatever that means to you.'
        }
      ],

      metaTitle: '',
      metaDescription: ''
    }
  },
  components: {
    ContentHeroBanner,
    ContentSideBySide,
    Close,
    PrevSlide,
    NextSlide,
    Cheers,
    ImageTextSet,
    RichTextRenderer
  },
  mixins: [imageOptimize],
  methods: {
    openBioModal(i) {
      this.openBio = i
      if (this.screenWidth > 768) {
        this.$modal.show('bio-modal')
      } else {
        this.$modal.show('bio-modal-mobile')
      }
    },
    openDriveModal(i) {
      this.openDrive = i
      this.$modal.show('drive-modal')
    },

    decrementDrive() {
      if (this.openDrive === 0) {
        this.openDrive = this.driveContent.length - 1
      } else {
        this.openDrive--
      }
    },

    incrementDrive() {
      if (this.openDrive === this.driveContent.length - 1) {
        this.openDrive = 0
      } else {
        this.openDrive++
      }
    },

    handleResize() {
      this.screenWidth = window.innerWidth
    }
  },
  head() {
    let properties = {}
    let meta = []
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
  async asyncData() {
    let ourStory = await client.getEntry('4RIljQvzSmaaa8i2QyfgTY').then(async res => {
      let leadershipList = []
      for (const leadership of res.fields.leadership) {
        await client.getEntry(leadership.sys.id).then(async res => {
          leadershipList.push(res)
        })
      }
      res.fields.leadership = leadershipList
      return res
    })

    return { page: ourStory }
  },
  async mounted() {
    const vm = this
    await client.getEntry('4RIljQvzSmaaa8i2QyfgTY').then(res => {
      if (res.fields.metaInfo) {
        this.metaTitle = res.fields.metaInfo.fields.metaTitle
        this.metaDescription = res.fields.metaInfo.fields.metaDescription
      }
    })
    this.handleResize()
    window.onresize = () => {
      this.handleResize()
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  /*Organization schema*/
  jsonld() {
    return {
      '@context': 'http://www.schema.org',
      '@type': 'Organization',
      name: 'BlendJet',
      url: 'https://blendjet.com/',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          telephone: '+1 844-588-1555',
          email: 'support@blendjet.com'
        }
      ],
      sameAs: [
        'https://www.facebook.com/blendjet/',
        'https://www.instagram.com/BlendJet/',
        'https://twitter.com/BlendJet',
        'https://www.pinterest.com/blendjet/',
        'https://www.youtube.com/channel/UCYCxpRsXpNh2REeyATMo_8w'
      ],
      logo:
        'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-2-logo.png?v=1616611844',
      image:
        'https://images.ctfassets.net/strhx3d94c40/1YTbF5tGizsjmmGtmDf7tx/c3593da25daef024771437dac2589dfb/BLENDJET-2-HERO-LANDSCAPE-CROP-BLACK.jpeg?w=2100',
      description:
        "The BlendJet 2 portable blender packs big blender power on the go. It crushes ice or almost anything. It even cleans itself. It's USB-C rechargeable and water-resistant too. Get your BlendJet 2 today!"
    }
  }
}
</script>

<style lang="scss" scoped>
.no-content {
  height: 100vh;
}
.page-container {
  top: 100px;
}

.title-banner {
  @include gradient-secondary-purple(to left);
  height: 330px;
  display: flex;
  justify-content: center;
  align-items: center;

  @include respond-to('small') {
    height: 298px;
  }

  h1 {
    font-family: Medium;
    font-size: 36px;
    line-height: 1.17;
    letter-spacing: 6px;
    text-align: center;
    text-transform: uppercase;

    @include respond-to('small') {
      line-height: 1.14;
      letter-spacing: 3.5px;
    }
  }

  h6 {
    font-family: Bold;
    font-size: $text-small;
    line-height: 1.17;
    letter-spacing: 1.75px;
    text-align: center;
    margin-bottom: 35px;
    text-align: center;

    @include respond-to('small') {
      margin-top: 50px;
      margin-bottom: 25px;
    }
  }

  &__text-block {
    max-width: 745px;
    min-width: 324px;
    color: $grayscale-white;

    @include respond-to('small') {
      margin-bottom: 48px;
    }
  }
}

.about-us-video {
  &__img {
    object-fit: cover;
    object-position: center;
    height: 660px;
    width: 100%;
  }
}

.what-drives-us {
  h1 {
    font-family: Medium;
    font-size: 37px;
    line-height: 0.65;
    letter-spacing: 5.4px;
    text-align: center;
    color: $primary-purple;
    margin-bottom: 26px;
    text-transform: uppercase;

    @include respond-to('small') {
      line-height: 1.14;
      letter-spacing: 3.5px;
      margin-top: 51px;
      margin-bottom: 15px;
    }
  }

  p {
    font-family: Regular;
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: 0.5px;
    color: $grayscale-gray;
    text-align: center;
  }

  &__banner {
    height: 257px;
    display: flex;
    justify-content: center;
    align-items: center;

    @include respond-to('small') {
      height: auto;
    }

    &__text-block {
      max-width: 641px;
      min-width: 351px;

      @include respond-to('small') {
        margin-bottom: 52px;
      }
    }
  }

  &__image-grid {
    display: flex;
    flex-flow: row wrap;

    &__section {
      width: 25%;
      position: relative;
      cursor: pointer;

      @include respond-to('small') {
        width: 100%;
        padding: 0 10px 10px 10px;
      }

      &__img {
        object-fit: cover;
        object-position: center;
        height: 100%;
        min-height: 580px;
        width: 100%;

        @include respond-to('small') {
          height: 349px;
        }
      }

      &__text {
        position: absolute;
        bottom: 31px;
        left: 21px;
        font-family: Medium;
        font-size: 32px;
        line-height: 1.09;
        letter-spacing: 5.33px;
        color: $grayscale-white;
        max-width: 309px;
        text-transform: uppercase;
        cursor: pointer;
        z-index: 20;
        @include respond-to('small') {
          font-size: 24px;
          line-height: 1;
          letter-spacing: 3px;
          bottom: 16px;
          left: 18px;
        }
      }
    }
  }
}

.drive {
  &__container {
    background: $primary-purple-tint;

    @media screen and (min-width: 1024px) {
      display: flex;
      flex-flow: row wrap;
    }

    img {
      width: 100%;
    }
  }

  &__image-container {
    width: 50%;
    position: relative;
    max-height: 100vh;
    @include respond-to('small') {
      width: 100%;
    }
  }

  &__decrement {
    position: absolute;
    top: 50%;
    left: 20px;
    cursor: pointer;
  }

  &__increment {
    position: absolute;
    top: 50%;
    right: calc(-100% + 20px);
    cursor: pointer;

    @include respond-to('small') {
      right: 0;
    }
  }

  &__text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    @media screen and (min-width: 1024px) {
      width: 50%;
    }

    &__heading {
      font-family: Medium;
      font-size: 32px;
      line-height: 1.09;
      letter-spacing: 5.33px;
      color: $primary-purple;
      margin-bottom: 20px;
      max-width: 300px;

      @include respond-to('small') {
        font-size: 28px;
        line-height: 1.14;
        letter-spacing: 3.5px;
      }
    }

    &__main {
      font-family: Regular;
      font-size: 14px;
      line-height: 1.29;
      letter-spacing: 0.5px;
      color: $grayscale-gray;
      max-width: 400px;
    }
  }
}

.our-journey {
  background-image: linear-gradient(
    to bottom,
    #eeeeee,
    #6f6fc9 24%,
    #363996 53%,
    #1e90bb 77%,
    #c2e3f0 98%
  );
  display: flex;
  align-items: center;
  flex-flow: column nowrap;

  &__container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }
  &__container-inner {
    width: 100%;
    max-width: 7300px;
    margin: 30px 0;
  }

  &__title {
    font-family: Medium;
    font-size: 37px;
    line-height: 0.65;
    letter-spacing: 5.4px;
    color: $primary-purple;
    text-align: center;
    margin-top: 94px;
    margin-bottom: 102px;
    text-transform: uppercase;

    @include respond-to('small') {
      font-size: 24px;
      line-height: 0.86;
      letter-spacing: 4.08px;
      margin-top: 88px;
      margin-bottom: 61px;
    }
  }

  &__section {
    display: flex;
    flex-flow: row wrap;
    margin: 33px 50px;
    @include respond-to('small') {
      margin: 0;
      padding: 23px 15px 23px 15px;
    }

    &__side {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;

      @include respond-to('small') {
        width: 100%;
      }

      &--life {
        text-align: right;
      }
    }

    &__img {
      object-fit: cover;
      object-position: center;
      border-radius: 12px;
    }

    &__text-block {
      min-width: 460px;

      @include respond-to('small') {
        min-width: auto;
        width: 343px;
        margin-bottom: 30px;
      }

      &__heading {
        font-family: Bold;
        font-size: 24px;
        line-height: 1.1;
        letter-spacing: 3.75px;
        margin-bottom: 20px;
        text-transform: uppercase;

        @include respond-to('small') {
          font-size: 18px;
          line-height: 1.22;
          letter-spacing: 2.5px;
          text-align: center;
        }
      }

      &__main {
        font-family: Regular;
        font-size: 14px;
        line-height: 1.29;
        letter-spacing: 0.5px;

        @include respond-to('small') {
          text-align: center;
        }
      }
    }
  }

  &__dream {
    position: relative;
    margin-bottom: 92px;
    margin-top: 112px;

    @include respond-to('small') {
      margin-top: 55px;
      margin-bottom: 0px;
    }

    &__img {
      object-fit: cover;
      object-position: center;
      @include respond-to('small') {
        height: 693px;
        max-width: 100vw;
        border-radius: 0px;
      }
    }

    &__text-block {
      position: absolute;
      top: 65px;
      left: 72px;
      max-width: 375px;
      min-width: 343px;
      color: $grayscale-white;

      @include respond-to('small') {
        top: 135px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
      }

      &__heading {
        font-family: Medium;
        font-size: 36px;
        line-height: 1.08;
        letter-spacing: 6px;
        margin-bottom: 16px;
        text-transform: uppercase;

        @include respond-to('small') {
          font-size: 24px;
          line-height: 1.17;
          letter-spacing: 3.85px;
        }
      }

      &__subheading {
        font-family: Regular;
        font-size: 18px;
        line-height: 1.28;
        letter-spacing: 0.75px;

        @include respond-to('small') {
          line-height: 1.19;
          letter-spacing: 0.6px;
        }
      }

      &__main {
        font-family: Regular;
        font-size: 14px;
        line-height: 1.29;
        letter-spacing: 0.5px;
      }

      & p {
        margin-bottom: 23px;
        @include respond-to('small') {
          margin-bottom: 30px;
        }
      }
    }
  }

  &__cheers {
    margin-bottom: 53px;
    margin-top: 15px;
    &__svg {
      margin-bottom: 29px;
    }
  }

  &__blendjet-team {
    font-family: Bold;
    font-size: 14px;
    line-height: 2;
    letter-spacing: 1.75px;
    text-transform: uppercase;
  }
}

.renewed {
  height: 455px;
  width: 468px;
  border-radius: 12px;
}

.dream {
  border-radius: 12px;
}

.leadership {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  &__heading {
    font-family: Medium;
    font-size: 24px;
    line-height: 1;
    letter-spacing: 3.5px;
    color: $primary-purple;
    text-transform: uppercase;
    text-align: center;
    margin-top: 80px;
    margin-bottom: 60px;
  }

  &__grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    width: 1550px;

    @include respond-to('small') {
      width: 100vw;
    }

    &__entry {
      display: flex;
      align-items: center;
      flex-flow: column nowrap;
      max-width: 220px;
      height: 325px;
      margin: 0 65px 32px 65px;
      cursor: pointer;

      @include respond-to('small') {
        margin: 0 25px 21px 25px;
        max-width: 260px;
      }

      &__img {
        margin-bottom: 20px;
        height: 220px;
        width: 220px;
        object-fit: contain;
        object-position: center;
        border-radius: 12px;
        @include respond-to('small') {
          height: 260px;
          width: 260px;
        }
      }

      &__name {
        font-family: Bold;
        font-size: $text-small;
        line-height: 1.17;
        letter-spacing: 1.75px;
        color: $primary-purple;
        margin-bottom: 6px;
        text-transform: uppercase;
        text-align: center;
      }

      &__title {
        font-family: Regular;
        font-size: $text-small;
        line-height: 1.33;
        letter-spacing: 0.5px;
        color: $grayscale-gray;
        text-align: center;
        margin-bottom: 11px;
      }

      &__tag {
        background-color: $primary-purple-tint;
        border-radius: 25px;
        padding: 2px 19px;
        color: $primary-purple;
        font-family: Medium;
        text-transform: uppercase;
        text-align: center;
        font-size: 10px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.bio {
  &__content {
    display: flex;
    flex-flow: row wrap;

    &__image-container {
      padding: 35px;
      position: relative;

      @include respond-to('small') {
        width: 100%;
        padding: 0;
        display: flex;
        justify-content: center;
      }

      &__img {
        height: 200px;
        width: 169px;
        object-fit: cover;
        object-position: center bottom;
      }

      &__img-mobile {
        height: 373px;
        object-fit: cover;
        object-position: center;
      }
    }

    &__decrement {
      position: absolute;

      @include respond-to('small') {
        top: 170px;
        left: 0;
      }
    }

    &__increment {
      position: absolute;

      @include respond-to('small') {
        top: 170px;
        right: 0;
      }
    }

    &__text-container {
      margin-top: 35px;
      width: 500px;
      margin-bottom: 39px;
      // text-align: left;
      @include respond-to('small') {
        text-align: center;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
      }

      &__name {
        font-family: Medium;
        font-size: 24px;
        line-height: 1.17;
        letter-spacing: 3.5px;
        color: $primary-purple;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      &__title {
        font-family: Regular;
        font-size: 14px;
        line-height: 1.14;
        letter-spacing: 0.55px;
        color: $grayscale-gray;
        margin-bottom: 11px;
      }

      &__tag {
        max-width: 125px;
        margin-bottom: 21px;
      }

      &__text-block {
        font-family: Regular;
        font-size: 14px;
        line-height: 1.29;
        letter-spacing: 0.5px;
        color: $grayscale-gray;
        text-align: left;

        @include respond-to('small') {
          padding: 0 20px;
        }

        & p {
          margin-bottom: 15px;
        }
      }
    }
  }

  &__favorites {
    background-image: linear-gradient(to bottom, #32b3d6, #1e90bb);
    height: 288px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    @include respond-to('small') {
      flex-flow: column nowrap;
      height: 550px;
    }

    &__item {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      color: $grayscale-white;

      &__category {
        font-family: Medium;
        font-size: 14px;
        line-height: 1.14;
        letter-spacing: 0.58px;
        text-align: center;

        margin-bottom: 20px;
      }

      &__image-container {
        width: 156px;
        height: 156px;

        &__img {
          width: 134px;
          height: 134px;
          object-fit: cover;
          margin: 0 auto;
          display: block;
          border-radius: 12px;
        }
      }

      &__name {
        font-family: Bold;
        font-size: $text-small;
        line-height: 1.17;
        letter-spacing: 1.75px;
        text-align: center;
        text-transform: uppercase;
      }
    }

    &__mobile {
      &__top-row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }
      &__bottom-row {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &__blendjet-margin {
        margin-right: 60px;
      }
    }
  }
}

.press-contact {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  color: $grayscale-white;
  text-align: center;
  padding: 10px;

  &__press-container {
    background-image: linear-gradient(to bottom, #26bfde, #228ab9 99%);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding: 0 37px 55px 37px;

    margin: 15px;
    width: 660px;

    border-radius: 12px;
    @include respond-to('small') {
      padding-bottom: 20px;
      width: 100%;
    }
  }

  &__contact-container {
    background-image: linear-gradient(to bottom, #7e7fd8 1%, #373795 99%);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding: 0 37px 55px 37px;
    margin: 15px;
    width: 660px;
    border-radius: 12px;
    @include respond-to('small') {
      padding-bottom: 20px;
      width: 100%;
    }
  }

  &__svg-container {
    margin-top: 54px;
    margin-bottom: 24px;
  }

  &__heading {
    font-family: Bold;
    font-size: $text-small;
    line-height: 1.17;
    letter-spacing: 1.75px;

    text-transform: uppercase;
    margin-bottom: 10px;
  }

  &__main {
    font-family: Regular;
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: 0.5px;
    max-width: 481px;
    margin-bottom: 48px;
    @include respond-to('small') {
      margin-bottom: 30px;
    }
  }

  &__link {
  }
}

.text-purple {
  color: $primary-purple;
}

.text-white {
  color: $grayscale-white;
}

.text-centered {
  text-align: center;
  max-width: 743px;
}

.reverse-wrap {
  flex-wrap: wrap-reverse;
}

.renewed-purpose-heading {
  @include respond-to('small') {
    margin-top: 37px;
  }
}

.darken-image {
  // box-shadow: inset 0 0 0 1000px rgba(0,0,0,.4);
  filter: brightness(70%);
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
</style>
