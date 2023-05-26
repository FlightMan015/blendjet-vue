<template>
  <div class="recipes">
    <div
      v-if="page.fields.hero"
      class="recipes__hero"
      :style="`background-image: url('${page.fields.hero.fields.file.url}')`"
    >
      <h1 class="recipes__title">{{ page.fields.title }}</h1>
    </div>
    <div class="browse-recipes">
      <h3 class="browse-recipes__title">Blend Endlessly</h3>
      <div class="columns is-multiline browse-recipes__columns">
        <div
          v-for="(recipe, i) in allRecipes.items"
          :key="i"
          class="column is-one-quarter recipe-item"
        >
          <n-link :to="`/recipes/${recipe.fields.handle}`" class="recipe-teaser">
            <div
              class="recipe-teaser__img"
              :style="
                `background-image: url('${optimizeSource({
                  url: recipe.fields.teaserImage.fields.file.url,
                  width: 500
                })}')`
              "
            ></div>
            <h5 class="recipe-teaser__title">{{ recipe.fields.title }}</h5>
            <div class="recipe-teaser__text">{{ recipe.fields.teaserText }}</div>
          </n-link>
        </div>
      </div>
      <!-- <div v-if="indexed <= allRecipes.total" class="browse-recipes__load">
        <button class="btn btn--solid-purple browse-recipes__load-link" @click="loadRecipes()">
          Load More Recipes
        </button>
      </div> -->
      <div class="browse-recipes__load">
        <Loading v-if="this.allRecipes.total > this.indexed || recipeLoading" />
      </div>
    </div>
    <Footer v-if="showFooter" />
  </div>
</template>
<script>
import imageOptimize from '~/mixins/imageOptimize'
import _ from 'lodash'
import Footer from '~/components/footer'
import Loading from '~/components/Loading'
import { createClient } from '~/plugins/contentful'
const client = createClient()

export default {
  components: {
    Footer,
    Loading
  },
  data() {
    return {
      indexed: 12,
      recipeLoading: false
    }
  },
  head() {
    const properties = {}
    const meta = []
    properties.title = 'BlendJet® Recipe Videos - New Videos Weekly'
    meta.push({
      hid: 'description',
      name: 'description',
      content:
        'Enjoy 100s of quick video recipes designed for making the very best smoothies, shakes, dips, dressings, and more in your BlendJet blender. New recipes weekly!'
    })

    return { ...properties, meta }
  },
  computed: {
    showFooter() {
      if (this.indexed >= this.allRecipes?.total) {
        return true
      }
      return false
    }
  },
  methods: {
    loadRecipes: _.debounce(async function () {
      if (this.indexed >= this.allRecipes.total || this.recipeLoading) {
        return
      }
      this.recipeLoading = true
      await client
        .getEntries({
          content_type: 'recipe',
          skip: this.indexed,
          limit: 12,
          order: '-sys.createdAt'
        })
        .then(async res => {
          this.recipeLoading = false
          this.indexed = this.indexed + 12
          this.indexed =
            this.indexed <= this.allRecipes.total ? this.indexed : this.allRecipes.total
          this.allRecipes.items = [...this.allRecipes.items, ...res.items]
        })
    }, 200),
    scrollEvent() {
      const recipesContainer = document.querySelector('.browse-recipes__columns')
      const card = document.querySelector('.recipe-item')
      const position =
        recipesContainer.offsetTop + recipesContainer.offsetHeight - card.offsetHeight * 1.5
      const bottomOfWindow = window.scrollY + window.innerHeight
      if (bottomOfWindow >= position) {
        if (this.allRecipes.total > this.indexed) {
          this.loadRecipes()
        }
      }
    }
  },
  mixins: [imageOptimize],
  async asyncData({ params }) {
    // Get Recipe Blog Page
    const recipe = await client
      .getEntries({
        content_type: 'blog',
        'fields.handle': 'recipes'
      })
      .then(async res => {
        return res.items[0]
      })

    // Culprit
    // Get Recipe Category Menu Items
    const recipeMenu = await client
      .getEntries({
        content_type: 'queue',
        'fields.handle': 'recipe-category-menu'
      })
      .then(async res => {
        const data = res.items[0]
        const items = data.fields.items.map(item => {
          if (item && item.fields) {
            return {
              handle: item.fields.handle,
              title: item.fields.title
            }
          }
          return {}
        })
        return items
      })

    // Get Recipe Category Menu Items
    const featuredRecipeCategories = await client
      .getEntries({
        content_type: 'queue',
        'fields.handle': 'featured-recipe-categories'
      })
      .then(async res => {
        const data = res.items[0]
        for (const [index, item] of data.fields.items.entries()) {
          const recipes = await client
            .getEntries({
              content_type: 'recipe',
              'fields.category.sys.contentType.sys.id': 'recipeCategory',
              'fields.category.fields.handle': item.fields.handle,
              limit: 4,
              order: '-sys.createdAt'
            })
            .then(async res => {
              return res.items
            })
          data.fields.items[index].recipes = recipes
        }
        const items = data.fields.items.map(item => {
          return {
            handle: item.fields.handle,
            title: item.fields.title,
            image: item.fields.hero.fields.file.url,
            recipes: item.recipes
          }
        })
        return items
      })

    // Browse Recipes
    const allRecipes = await client
      .getEntries({
        content_type: 'recipe',
        limit: 12,
        order: '-sys.createdAt'
      })
      .then(async res => {
        return {
          total: res.total,
          items: res.items
        }
      })

    return {
      page: recipe,
      recipeMenu,
      featuredRecipeCategories,
      allRecipes
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollEvent)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent)
  }
}
</script>
<style lang="scss" scoped>
.recipes {
  &__hero {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    @media screen and (min-width: 768px) {
      height: 500px;
    }
  }

  &__title {
    color: #fef7f1;
    font-family: $primary-font;
    font-weight: 700;
    font-size: 28px;
    letter-spacing: 3.5px;
    text-transform: uppercase;

    @media screen and (min-width: 1024px) {
      font-size: 54px;
      letter-spacing: 10px;
    }
  }
}
.category-menu {
  @include gradient-primary-purple-turquoise(to left);
  padding: 20px;
  display: flex;
  justify-content: center;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 70px;
    @include gradient-primary-purple-transparent(to left);
  }

  &__inner {
    white-space: nowrap;
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @media screen and (min-width: 1024px) {
      display: flex;
      justify-content: center;
      min-width: 1024px;
      white-space: normal;
      overflow-x: visible;
    }
  }

  &__link {
    flex-grow: 1;
    color: #fef7f1;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 1.75px;
    margin-right: 20px;

    @media screen and (min-width: 1024px) {
      margin-right: 0;
    }
  }
}

.featured-recipes {
  margin-top: 30px;
}
.recipe-section {
  max-width: 1300px;
  margin: 0 auto;
  padding: 30px 0;

  &__hero {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    margin: 0 0.75rem;
  }

  &__title {
    font-family: $primary-font;
    font-size: 36px;
    color: #fef7f1;
    font-weight: 700;
    letter-spacing: 6.67px;
    text-transform: uppercase;
  }

  &__recipes {
    margin: 30px 0;
  }

  &__cta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__cta-link {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

.recipe-teaser {
  &__img {
    width: 100%;
    padding-bottom: 75%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  &__title {
    font-family: $primary-font;
    font-size: 16px;
    color: $primary-purple;
  }

  &__text {
    font-size: 14px;
    color: #666666;
    line-height: 1.29em;
    padding-bottom: 30px;
  }
}

.browse-recipes {
  margin: 0 auto;
  padding: 30px 0 60px 0;
  background: #f6f6f6;

  &__title {
    font-size: 32px;
    font-style: italic;
    letter-spacing: 5px;
    color: $primary-purple;
    text-transform: uppercase;
    text-align: center;
    font-weight: 700;
    margin: 50px 0;
  }

  &__columns {
    max-width: 1300px;
    margin: 0 auto;
  }

  &__load {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__load-link {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
