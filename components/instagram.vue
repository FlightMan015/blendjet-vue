<template>
  <div class="instagram-container">
    <div class="instagram-text-block">
      <div class="instagram-text-block__title">
        <span @click="openInstagramURL('https://instagram.com/blendjet/')" class="title-click">
          @blendjet
          <div class="instagram-text-block__icon-container">
            <img
              src="https://cdn.shopify.com/s/files/1/0066/4433/4658/files/fb_verified_icon_6d38bcd0-60bf-4a6e-9271-e453e8b002ae.jpg?v=1645532318"
              class="instagram-text-block__icon"
            />
          </div>
        </span>
      </div>
      <div class="instagram-text-block__on-instagram">{{ followers }} Followers on instagram</div>
      <div class="instagram-text-block__content">
        Get inspired with recipes, tips, and tricks from fellow BlendJetters.
        <div class="instagram-text-block__hastag">
          #blendeverywhere
        </div>
      </div>
      <div class="instagram-text-block__follow">
        <a rel="nofollow" target="_blank" href="https://www.instagram.com/blendjet">
          <button role="button" class="instagram-text-block__follow__button">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16">
              <path
                fill="#373795"
                d="M10.509 15.01c1.192-.057 2.248-.33 3.118-1.203.87-.87 1.142-1.925 1.201-3.117.07-1.229.07-4.908 0-6.136-.056-1.192-.328-2.248-1.201-3.118C12.757.566 11.7.294 10.509.234c-1.229-.07-4.911-.07-6.14 0C3.182.29 2.126.563 1.253 1.433.379 2.303.11 3.358.05 4.55c-.07 1.229-.07 4.911 0 6.14.056 1.192.329 2.248 1.202 3.117.873.87 1.926 1.143 3.118 1.202 1.228.07 4.91.07 6.139 0zm-2.851-1.288H7.44c-1.083 0-3.41.085-4.386-.3-.651-.259-1.152-.76-1.415-1.414-.388-.98-.299-3.304-.299-4.386 0-1.083-.086-3.41.3-4.386.258-.651.76-1.153 1.414-1.415.98-.388 3.303-.299 4.386-.299 1.082 0 3.41-.086 4.386.3.65.258 1.152.76 1.414 1.414.389.98.3 3.303.3 4.386 0 1.082.089 3.41-.3 4.386-.259.65-.76 1.152-1.414 1.414-.918.364-3.018.308-4.17.3zm3.754-9.182c.491 0 .89-.395.89-.89 0-.49-.399-.89-.89-.89-.492 0-.89.4-.89.89 0 .492.395.89.89.89zM7.44 11.437c2.112 0 3.815-1.704 3.815-3.815 0-2.112-1.703-3.815-3.815-3.815S3.626 5.51 3.626 7.622c0 2.111 1.703 3.815 3.815 3.815zm0-1.335c-1.365 0-2.48-1.112-2.48-2.48 0-1.368 1.112-2.48 2.48-2.48 1.368 0 2.48 1.112 2.48 2.48 0 1.368-1.116 2.48-2.48 2.48z"
              />
            </svg>
            <div class="instagram-text-block__follow__button__text">Follow Us</div>
          </button>
        </a>
      </div>
    </div>
    <transition name="fade">
      <div class="instagram-carousel" v-if="items.length">
        <b-carousel-list
          v-model="instagramPos"
          :data="items"
          :items-to-show="itemsToShow"
          :arrows="true"
          :repeat="true"
          :progress="false"
          :overlay="true"
          :has-drag="true"
          style="box-shadow:none"
        >
          <template slot="item" slot-scope="props">
            <div :style="cardStyle">
              <div class="card-image" @click="openInstagramURL(props.list.permalink)">
                <img :data-src="props.list.media_url" :alt="props.list.caption" v-lazy-load />
              </div>
            </div>
          </template>
        </b-carousel-list>
      </div>
    </transition>
    <div class="testimonials-subheading">
      What Our Customers Think of Our Portable Blender
    </div>
    <div class="testimonials-carousel-container">
      <b-carousel
        class="testimonials-carousel"
        :arrow="true"
        :repeat="true"
        :indicator="true"
        :autoplay="true"
        :pause-info="false"
        :progress="false"
        :animated="'fade'"
        :arrow-hover="false"
        :interval="4000"
      >
        <b-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
          <section class="`hero is-medium`">
            <div class="has-text-centered testimonial-card">
              <div class="text">{{ testimonial.text }}</div>
              <div class="author">-{{ testimonial.author }}</div>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import followCountFormatter from '~/mixins/followCountFormatter'
export default {
  mixins: [followCountFormatter],
  data() {
    return {
      cardStyle: {
        backgroundColor: 'transparent',
        boxShadow: 'none'
      },
      imageStyle: {
        width: '100%'
      },
      cardContentStyle: {},
      itemsToShow: 1,
      instagramPos: 0,
      arrow: true,
      arrowHover: true,
      drag: true,
      gray: false,
      opacity: false,
      values: 1,
      perList: 1,
      repeat: false,
      items: [],
      followers: null,

      testimonials: [
        {
          text: '"BEST PORTABLE BLENDER BAR NONE!"',
          author: 'T3.com'
        },
        {
          text:
            '"I loved the original, but this new, improved BlendJet 2 is AMAZING! So powerful and blends so smoothly for my on-the-go lifestyle!"',
          author: 'Astrid Swan'
        },
        {
          text:
            '"Loving my new BlendJet 2! It’s super convenient, quiet, and easy to clean. I have a powerful full size blender and this little blender is just as strong with about a quarter of the noise."',
          author: 'Jenn C.S. Rubin'
        },
        {
          text:
            '"As a proud owner of the original BlendJet, I couldn’t wait for the release of the BlendJet 2. More power, longer battery life, and better blends. Every home should have at least one BlendJet 2!"',
          author: 'Kyle Zukowski'
        },
        {
          text:
            '"With two little ones, increased workload, and trying to keep a healthy diet the BlendJet is an amazing solution for me. I love being able to throw in all the ingredients, blend, and go when needed!"',
          author: 'Steven Spencer Elliott'
        },
        {
          text: '"This thing is so amazing. Powerful and really fun to use. Highly recommend it!"',
          author: 'Kenny Lauer'
        },
        {
          text:
            '"Love my Blendjet!! It is quiet enough for me to use at work and so easy to clean and travel with. Not only that, but customer service was AMAZING!!"',
          author: 'Cheyenne L.'
        },
        {
          text:
            '"Purchased this for my daughter as a gift and I love the convenience it offers her! She’s an athlete so she’s always blending some magical concoction and this makes it so easy!"',
          author: 'Michele C.'
        },
        {
          text:
            '"I hate the big obnoxious blenders so I bought this hoping it would make me want to make meal replacement smoothies more often. And... it did! Literally a life changer!"',
          author: 'Jasmine W.'
        },
        {
          text:
            '"Very impressed! I use my BlendJet for my morning smoothies and it is fantastic. It performs better than my plug-in blender. Light and portable, very powerful, and the battery lasts a long time. 5 stars!"',
          author: 'Chris E.'
        },
        {
          text:
            '"We love our BlendJet 2. It is very quiet and mixes all ingredients til completely smooth. We use it for mixed drinks such as margaritas, daiquiris, and smoothies. Can not wait to use it on the river!"',
          author: 'Darlene K.'
        },
        {
          text:
            '"This thing is amazing! The BlendJet One was great but this little beast takes it to the next level! Keep it coming BlendJet, can not wait to see what you come up with next!"',
          author: 'Chris H.'
        },
        {
          text:
            '"The BlendJet 2 is incredible. Insanely powerful. Blends my morning protein powder + banana + pb + ice no problem!"',
          author: 'Matt B.'
        }
      ]
    }
  },
  methods: {
    openInstagramURL(url) {
      window.open(url, '_blank')
    },
    async instagramData() {
      const res = []
      try {
        const instaImages = await Axios.get('https://x.blendjet.com/ig-media/index.php')
        const instaFollowers = await Axios.get(
          'https://x.blendjet.com/ig-media/index.php?key=followers'
        )

        const media = instaImages?.data
        const followers = instaFollowers?.data
        this.followers = this.formatFollowCount(followers)
        if (!media) {
          return []
        } else {
          return media
        }
      } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
      }
      return res
    },

    setWidthData() {
      if (window.innerWidth < 1024) {
        this.itemsToShow = 1
        this.indicatorVisible = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        this.itemsToShow = 3
        this.indicatorVisible = true
      } else {
        this.itemsToShow = 4
        this.indicatorVisible = false
      }
    }
  },
  mounted() {
    this.instagramData().then(res => {
      this.items = res.filter((item, i) => {
        return item.media_type === 'IMAGE'
      })
    })

    this.setWidthData()
    const vm = this
    window.addEventListener('resize', function () {
      if (window.innerWidth < 1024) {
        vm.itemsToShow = 1
        vm.indicatorVisible = true
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1400) {
        vm.itemsToShow = 3
        vm.indicatorVisible = true
      } else {
        vm.itemsToShow = 4
        vm.indicatorVisible = false
      }
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.setWidthData)
  }
}
</script>

<style scoped lang="scss">
.instagram-text-block {
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
  color: $primary-purple;
  text-align: center;
  margin-bottom: 65px;

  &__title {
    font-size: 54px;
    font-family: BoldItalic;
    line-height: 1;
    letter-spacing: 1px;
    text-align: center;
    margin-top: 60px;
    margin-bottom: 10px;
    display: inline-flex;
    justify-content: center;
    .title-click {
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
  }

  &__icon {
    height: 40px;
    position: relative;
    top: 3px;
    left: 8px;
  }

  &__on-instagram {
    text-transform: uppercase;
    font-family: Bold;
    letter-spacing: 1.75px;
    font-size: 12px;
    line-height: 1.17;
    margin-top: 5px;
  }

  &__content {
    margin-top: 20px;
    margin-bottom: 35px;
    size: 14px;
    letter-spacing: 0.5px;
  }

  &__hastag {
    font-family: Bold;
  }

  &__follow {
    display: flex;
    justify-content: center;

    &__button {
      @include button-primary('purple-ghost');
      width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      &__text {
        margin-left: 1rem;
      }
    }
  }
}
.testimonials-subheading {
  text-align: center;
  font-family: Bold;
  font-size: $text-small;
  color: $primary-purple;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  margin-top: 60px;
}
.testimonials-carousel-container {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
}

.testimonials-carousel {
  width: 55vw;
  @media screen and (max-width: 768px) {
    width: auto;
  }
}

.testimonial-card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  color: $primary-purple;
  font-family: BoldItalic;
  font-size: 29px;
  line-height: 1.14;
  letter-spacing: 1px;
  padding: 4rem;
  min-height: 670px;
  @media (min-width: 980px) {
    min-height: 460px;
  }
}

.text {
  color: $primary-purple;
  text-align: center;
}

.author {
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  margin-top: 50px;
}

.quote {
  margin: 36px;
}

.card-image {
  cursor: pointer;
}
</style>
