<template>
  <div class="recipe">
    <div v-if="page.fields.heroYouTube" class="embed-container">
      <iframe :src="`${page.fields.heroYouTube}`" frameborder="0"></iframe>
    </div>
    <div
      v-else-if="page.fields.hero"
      class="recipe__hero"
      :style="`background-image: url('${page.fields.hero.fields.file.url}')`"
    ></div>
    <div class="recipe__meta meta">
      <div class="meta__inner">
        <h1 class="meta__title">{{ page.fields.title }}</h1>
        <div class="meta__share">
          <client-only>
            <ShareNetwork
              network="pinterest"
              class="meta__share-item"
              :url="path"
              :title="page.fields.title"
              :media="page.fields.teaserImage.fields.file.url"
            >
              <Pinterest />
            </ShareNetwork>
            <ShareNetwork
              network="facebook"
              class="meta__share-item"
              :url="path"
              :title="page.fields.title"
              :description="page.fields.description"
              quote="Checkout this amazing BlendJet Recipe!"
              hashtags="blendjet"
            >
              <Facebook />
            </ShareNetwork>
            <ShareNetwork
              network="twitter"
              class="meta__share-item"
              :url="path"
              :title="page.fields.title"
              :description="page.fields.description"
              twitter-user="BlendJet"
              hashtags="blendjet"
            >
              <Twitter />
            </ShareNetwork>
          </client-only>
        </div>
        <!-- <div class="meta__stats">
          <span class="meta__views">450 Views</span><span class="meta__published-at">| <timeago :datetime="page.sys.createdAt" :auto-update="60"></timeago></span>
        </div> -->
        <div class="meta__description" v-html="$md.render(productMetaDescription)"></div>
      </div>
    </div>
    <div v-if="page.fields.ingredients" class="recipe__ingredients ingredients">
      <ul class="ingredients__labels">
        <li class="ingredients__labels-label">Ingredients</li>
        <li class="ingredients__labels-label">Ingredients</li>
        <li class="ingredients__labels-label">Ingredients</li>
        <li class="ingredients__labels-label">Ingredients</li>
        <li class="ingredients__labels-label">Ingredients</li>
        <li class="ingredients__labels-label">Ingredients</li>
        <li class="ingredients__labels-label">Ingredients</li>
      </ul>
      <div class="ingredients__list-wrapper">
        <ul class="ingredients__list">
          <li
            v-for="ingredient in page.fields.ingredients"
            class="ingredients__list-item"
            :key="ingredient.sys.id"
          >
            {{ ingredient.fields.serving }}
            <em class="ingredients__list-item-em">{{
              ingredient.fields.ingredient.fields.title
            }}</em>
          </li>
        </ul>
        <button
          role="btn"
          class="ingredients__nutrition-btn btn btn--outline-purple"
          @click="$modal.show('nutrition-modal')"
        >
          Nutrition Facts
        </button>
      </div>
    </div>
    <div v-if="page.fields.media" class="recipe__media recipe-images">
      <client-only>
        <div v-for="media in page.fields.media" :key="media.sys.id">
          <ShareNetwork
            network="pinterest"
            class="recipe-images__item recipe-images__item--left"
            :style="`background-image: url('${media.fields.file.url}');`"
            :url="path"
            :title="page.fields.title"
            :media="media.fields.file.url"
          >
            <PinterestFilled class="recipe-images__pinterest" />
          </ShareNetwork>
        </div>
        <!-- <ShareNetwork
          v-if="page.fields.media[1].fields.file.url"
          network="pinterest"
          class="recipe-images__item recipe-images__item--right"
          :style="`background-image: url('${page.fields.media[1].fields.file.url}');`"
          :url="path"
          :title="page.fields.title"
          :media="page.fields.media[1].fields.file.url"
        >
          <PinterestFilled class="recipe-images__pinterest"/>
        </ShareNetwork> -->
      </client-only>
    </div>
    <div class="recipe__instructions instructions">
      <ol class="instructions__list">
        <li
          v-for="(instruction, index) in page.fields.instructions"
          class="instructions__item"
          :key="index"
          v-html="instruction"
        >
          {{ instruction }}
        </li>
      </ol>
      <ul class="instructions__labels">
        <li class="instructions__label">Instructions</li>
        <li class="instructions__label">Instructions</li>
        <li class="instructions__label">Instructions</li>
        <li class="instructions__label">Instructions</li>
        <li class="instructions__label">Instructions</li>
        <li class="instructions__label">Instructions</li>
        <li class="instructions__label">Instructions</li>
      </ul>
    </div>
    <div class="recipe__facebook facebook">
      <div class="facebook__icon"><FacebookFilled /></div>
      <h3 class="facebook__title">
        JOIN {{ formatFollowCount(memberCount) }} MEMBERS ON THE BLENDJET RECIPES GROUP
      </h3>
      <div class="facebook__text">
        For more
        <span class="blendjet-receipes-facebook"><a href="/recipes">BlendJet recipes</a></span> like
        this, and to share your own, join our BlendJet Recipes Facebook Group!
      </div>
      <a
        rel="nofollow"
        href="https://www.facebook.com/groups/blendjetrecipes"
        target="__blank"
        class="facebook__join btn btn--outline"
        >Join Now</a
      >
    </div>
    <!--
    <div class="recipe__jetpacks jetpacks">
      <h3 class="jetpacks__text">Save Time With</h3>
      <h2 class="jetpacks__title">jetpack</h2>
      <JetpackCrossSell />
    </div>
-->
    <NutritionModal :content="nutritionfacts" />
  </div>
</template>

<script>
import FacebookFilled from '~/components/svg/FacebookFilled'
import Facebook from '~/components/svg/Facebook'
import PinterestFilled from '~/components/svg/PinterestFilled'
import Pinterest from '~/components/svg/Pinterest'
import Twitter from '~/components/svg/Twitter'
import NutritionModal from '~/components/modals/NutritionModal'
import { createClient } from '~/plugins/contentful'
import Axios from 'axios'
import followCountFormatter from '~/mixins/followCountFormatter'
const client = createClient()

export default {
  components: {
    FacebookFilled,
    Facebook,
    PinterestFilled,
    Pinterest,
    Twitter,
    NutritionModal
  },
  mixins: [followCountFormatter],
  data() {
    return {
      path: undefined,
      metaTitle: '',
      metaDescription: ''
    }
  },
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
  async mounted() {
    this.path = window.location.href
    await client
      .getEntries({
        content_type: 'recipe',
        'fields.handle': this.$route.params.handle
      })
      .then(res => {
        console.log(res)
        if (res.items[0].fields.metaInfo) {
          this.metaTitle = res.items[0].fields.metaInfo.fields.metaTitle
          this.metaDescription = res.items[0].fields.metaInfo.fields.metaDescription
        }
      })
    this.loadFacebookSDK()
  },
  async asyncData({ params }) {
    const recipe = await client
      .getEntries({
        content_type: 'recipe',
        'fields.handle': params.handle
      })
      .then(async res => {
        const data = res.items[0]
        const ingredients = []
        for (const ingredientSet of data.fields.ingredients) {
          await client.getEntry(ingredientSet.sys.id).then(async res => {
            ingredients.push(res)
          })
        }
        data.fields.ingredients = ingredients
        return data
      })

    const fbMemberResponse = await Axios('https://x.blendjet.com/fb-member-count/index.php')
    const memberCount = fbMemberResponse.data.member_count

    return { page: recipe, memberCount }
  },
  jsonld() {
    // console.log(this.page);
    const recipeIngredients = this.page.fields.ingredients.map(item => {
      return item.fields.title
    })

    const recipeIns = this.page.fields.instructions.map(ins => {
      return {
        '@type': 'HowToStep',
        text: ins
      }
    })
    return {
      '@context': 'https://schema.org/',
      '@type': 'Recipe',
      name: this.page.fields.title,
      image: this.page.fields.teaserImage.fields.file.url,
      description: this.page.fields.teaserText,
      author: {
        '@type': 'Organization',
        name: 'BlendJet',
        url: 'https://blendjet.com/',
        logo:
          'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-logo-gradient-2020.png?v=1579518683',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            telephone: '1-844-588-1555',
            email: 'support@blendjet.com'
          }
        ],
        sameAs: [
          'https://www.instagram.com/BlendJet/',
          'https://www.facebook.com/blendjet/',
          'https://twitter.com/BlendJet',
          'https://www.pinterest.com/blendjet/',
          'https://www.youtube.com/channel/UCYCxpRsXpNh2REeyATMo_8w',
          'https://www.youtube.com/blendjet'
        ]
      },
      datePublished: this.page.sys.createdAt,
      recipeCategory: this.page.fields.category.fields.title,
      nutrition: {
        '@type': 'NutritionInformation',
        servingSize: this.page.fields.servingSize,
        calories: this.page.fields.calories,
        fatContent: this.page.fields.fatContent
      },
      recipeIngredient: recipeIngredients,
      recipeInstructions: recipeIns,
      video: {
        '@type': 'VideoObject',
        name: this.page.fields.title,
        description: this.page.fields.teaserText,
        thumbnailUrl: this.page.fields.teaserImage.fields.file.url,
        uploadDate: this.page.sys.createdAt,
        contentUrl: `https://blendjet.com/recipes/${this.page.fields.handle}`,
        embedUrl: this.page.fields.heroYouTube
      }
    }
  },
  computed: {
    nutritionfacts() {
      // This will for sure break
      if (
        this.page.fields.nutritionFacts &&
        this.page.fields.nutritionFacts.content[0] &&
        this.page.fields.nutritionFacts.content[0].content[0]
      ) {
        return this.page.fields.nutritionFacts.content[0].content[0].value
      }
      return {}
    },
    productMetaDescription() {
      if (this.page.fields.description) {
        return this.page.fields.description
      }
      return {}
    }
  },
  methods: {
    async loadFacebookSDK() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.onload = () => {
          console.log('script loaded')
          resolve(true)
        }
        script.setAttribute('async', true)
        script.setAttribute('defer', true)
        script.setAttribute('src', 'https://connect.facebook.net/en_US/sdk.js')
        document.head.appendChild(script)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

// .video-container {
//   position: relative;
//   padding-bottom: 56.25%;
//   padding-top: 30px;
//   height: 0;
//   overflow: hidden;
// }
//
// .video-container iframe,
// .video-container object,
// .video-container embed {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
// }

.recipe {
  &__hero {
    width: 100%;
    height: 230px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    @media screen and (min-width: 768px) {
      height: 80vh;
    }
  }

  &__ingredients {
    width: 100%;
  }

  &__facebook {
    padding: 50px 0;
  }
}
.meta {
  padding: 40px 20px;
  text-align: center;
  @include gradient-primary-light-purple(to bottom);

  @media screen and (min-width: 768px) {
    padding: 80px 50px;
  }

  &__inner {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
  }

  &__title {
    font-family: $primary-font;
    color: $primary-purple;
    font-size: 28px;
    font-weight: 900;
    line-height: 1.5em;
    text-transform: uppercase;
    margin-bottom: 25px;

    @media screen and (min-width: 768px) {
      font-size: 60px;
      line-height: 1.1em;
      font-weight: 900;
    }
  }

  &__share {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  &__share-item {
    margin-right: 20px;
  }

  &__description {
    font-size: 18px;
    line-height: 28px;
    color: $primary-purple;
    padding: 0 30px;
  }

  &__stats {
    margin-bottom: 20px;
  }

  &__views {
    color: $secondary-purple-2;
    font-family: $primary-font;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-right: 10px;
    font-size: 12px;

    @media screen and (min-width: 768px) {
      font-size: inherit;
    }
  }

  &__published-at {
    color: $grayscale-gray;
    font-family: $primary-font;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 12px;

    @media screen and (min-width: 768px) {
      font-size: inherit;
    }
  }
}
.ingredients {
  min-height: 50vh;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    flex: 1 1 auto;
  }

  &__labels {
    @include gradient-primary-purple-turquoise(to bottom);
    flex: 1 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;

    @media screen and (min-width: 768px) {
      padding: 0;
    }
  }

  &__labels-label {
    font-family: $primary-font;
    font-weight: 700;
    font-size: 28px;
    line-height: 1.3em;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ffffff;

    @media screen and (min-width: 768px) {
      font-size: 35px;
      letter-spacing: 7px;
    }

    &:nth-child(1),
    &:nth-child(7) {
      opacity: 0.3;
    }
    &:nth-child(2),
    &:nth-child(6) {
      opacity: 0.5;
    }
    &:nth-child(3),
    &:nth-child(5) {
      opacity: 0.7;
    }
  }

  &__list-wrapper {
    flex: 1 0 50%;
    background: $grayscale-offwhite;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 0 30px 0;

    @media screen and (min-width: 768px) {
      padding: 80px 0;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  &__list-item {
    font-family: $primary-font;
    color: $primary-purple;
    font-size: 20px;
    line-height: 1.3em;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 30px;

    @media screen and (min-width: 768px) {
      font-size: 24px;
      margin-bottom: 20px;
    }

    &-em {
      font-style: normal;
      font-weight: 700;
    }
  }

  &__nutrition-btn {
    margin-top: 30px;
  }
}
.recipe-images {
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    flex: 1 1 auto;
  }

  &__item {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    min-height: 50vh;

    &--left {
      @media screen and (min-width: 768px) {
        flex: 1 0 60%;
      }
    }

    &--right {
      @media screen and (min-width: 768px) {
        flex: 1 0 40%;
      }
    }
  }

  &__pinterest {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
}
.instructions {
  min-height: 50vh;
  display: flex;
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    flex: 1 1 auto;
  }

  &__list {
    flex: 1 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10%;
    list-style: none;
    counter-reset: my-awesome-counter;
    background: $grayscale-offwhite;
    padding: 50px 20px 30px 20px;

    @media screen and (min-width: 768px) {
      padding: 50px 10%;
    }
  }

  &__item {
    font-family: $primary-font;
    color: $primary-purple;
    font-size: 18px;
    line-height: 1.3em;
    letter-spacing: 1px;
    margin-bottom: 30px;
    counter-increment: my-awesome-counter;
    display: flex;

    &:before {
      content: counter(my-awesome-counter) '. ';
      font-size: 1.1em;
      font-weight: bold;
      width: 0;
      margin-right: 3rem;

      @media screen and (min-width: 768px) {
        font-size: 1.5em;
      }
    }
  }

  &__labels {
    @include gradient-primary-purple-turquoise(to bottom);
    flex: 1 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;

    @media screen and (min-width: 768px) {
      padding: 0;
    }
  }

  &__label {
    font-family: $primary-font;
    font-weight: 700;
    font-size: 28px;
    line-height: 1.3em;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ffffff;

    @media screen and (min-width: 768px) {
      font-size: 35px;
      letter-spacing: 7px;
    }

    &:nth-child(1),
    &:nth-child(7) {
      opacity: 0.3;
    }
    &:nth-child(2),
    &:nth-child(6) {
      opacity: 0.5;
    }
    &:nth-child(3),
    &:nth-child(5) {
      opacity: 0.7;
    }
  }
}
.facebook {
  @include gradient-primary-purple-turquoise(to bottom);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px 30px;
  text-align: center;

  @media screen and (min-width: 768px) {
    @include gradient-primary-purple-turquoise(to bottom left);
    padding: 30px;
  }

  &__icon {
    margin-bottom: 5px;
    @media screen and (min-width: 768px) {
      margin-bottom: 20px;
    }
  }

  &__title {
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 2px;
    margin-bottom: 5px;
    line-height: 1.2em;

    @media screen and (min-width: 768px) {
      line-height: 30px;
    }
  }

  &__text {
    margin-bottom: 25px;
    font-size: 12px;
    line-height: 1.2em;

    @media screen and (min-width: 768px) {
      line-height: 30px;
      font-size: 1.1em;
    }
  }
}
.jetpacks {
  text-align: center;
  color: $primary-purple;
  padding: 30px 0;

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 70px 0 30px 0;
  }

  &__text {
    text-transform: uppercase;
    font-family: $primary-font;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 2px;

    @media screen and (min-width: 768px) {
      font-size: 26px;
    }
  }

  &__title {
    text-transform: uppercase;
    font-family: $primary-font;
    font-style: italic;
    font-weight: 900;
    text-transform: lowercase;
    font-size: 56px;
    letter-spacing: 1px;
  }
}

.instructions__item {
  display: inline;
}

.instructions__item:before {
  margin-right: 1rem;
}
span.blendjet-receipes-facebook a {
  color: #ffffff;
  font-weight: bold;
}
</style>
