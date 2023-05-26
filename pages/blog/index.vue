<!--
/****
/* Blog data is loaded from your CMS with the getBlog mixin.
/* For information about connecting your blog, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/blogs.html#blogs
/****
-->
<template>
  <div class="blog">
    <div class="blog__hero-banner">
      <div class="blog__hero-banner__image-container">
        <picture :style="search == '' ? pictureStyle : pictureBgWhite">
          <img class="blog__hero-banner__image-container__img" :src="optimizeSource({url:heroUrl})" />
        </picture>
      </div>
      
      <div class="blog__hero-banner__text">
        Blendjet Blog
      </div>

        <div class="blog__filters">
          <div class="blog__filters__right">
            <div class="blog__filters__filter">
              <!-- <input v-on:keyup="updatePosts" placeholder="search..."> -->
              <input v-model="search" placeholder="search..." class="search-box">
              <svg width="25px" height="27px" viewBox="0 0 25 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-v-3864c2aa=""><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" data-v-3864c2aa=""><g id="D_Nav-White-Sticky" transform="translate(-1276.000000, -23.000000)" stroke="black" stroke-width="1.5" data-v-3864c2aa=""><g id="Search" transform="translate(1277.000000, 24.000000)" data-v-3864c2aa=""><path d="M8.5,17 C13.1944204,17 17,13.1944204 17,8.5 C17,3.80557963 13.1944204,0 8.5,0 C3.80557963,0 0,3.80557963 0,8.5 C0,13.1944204 3.80557963,17 8.5,17 Z M15.5,14.5 L23.2603795,21.1774074" id="Combined-Shape" data-v-3864c2aa=""></path></g></g></g></svg>
            </div>
          </div>
        </div>
    </div>
    
    <!--
      <div class="blog__filters">
          <div class="blog__filters__left">
            <div class="blog__filters__filter">
            </div>
            <div class="blog__filters__filter">
              
            </div>
          </div>
          <div class="blog__filters__right">
            <div class="blog__filters__filter">
              <input v-model="search" placeholder="search..." class="search-box">
              <svg width="25px" height="27px" viewBox="0 0 25 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-v-3864c2aa=""><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" data-v-3864c2aa=""><g id="D_Nav-White-Sticky" transform="translate(-1276.000000, -23.000000)" stroke="black" stroke-width="1.5" data-v-3864c2aa=""><g id="Search" transform="translate(1277.000000, 24.000000)" data-v-3864c2aa=""><path d="M8.5,17 C13.1944204,17 17,13.1944204 17,8.5 C17,3.80557963 13.1944204,0 8.5,0 C3.80557963,0 0,3.80557963 0,8.5 C0,13.1944204 3.80557963,17 8.5,17 Z M15.5,14.5 L23.2603795,21.1774074" id="Combined-Shape" data-v-3864c2aa=""></path></g></g></g></svg>
            </div>
          </div>
        </div>

    -->
    <!-- <div class="blog__preview-container"> -->
      <div v-if="showFeatured">
      <div v-for="(article, index) in topFeatured[0]" :key="index" :class="[search == '' ? 'blog-feature' : 'blog-feature-no-padding-top']">
        <article-preview
          :title="article.title || ''"
          :handle="article.handle || ''"
          :description="article.description || ''"
          :excerpt="article.excerpt || ''"
          :tags="article.tags"
          :featured-media="article.featuredMedia"
          :is-featured="true"
          :is-reversed="index == 0 ? false : true"
          :publishDate="article.publishDate"
          :path-fragment="`/${$route.name}/`"
        />
      </div>
      </div>

<!--
      <div v-for="article in nextFeaturedArticle" :key="article.id" :class="[search == '' ? 'blog-feature' : 'blog-feature-no-padding-top']">
        <article-preview
          :title="article.title || ''"
          :handle="article.handle || ''"
          :description="article.description || ''"
          :excerpt="article.excerpt || ''"
          :tags="article.tags"
          :featured-media="article.featuredMedia"
          :is-featured="true"
          :is-reversed="true"
          :publishDate="article.publishDate"
          :path-fragment="`/${$route.name}/`"
        />
      </div>
-->
      

      <div class="columns is-multiline" :class="[search == '' ? 'blog-feature' : 'blog-feature-no-padding-top']">
        <div
          v-for="article in largeThumbnailArticles"
          :key="article.id"
          class="column"
        >
          <article-preview
            :title="article.title || ''"
            :handle="article.handle || ''"
            :excerpt="article.excerpt || ''"
            :tags="article.tags"
            :publishDate="article.publishDate"
            :featured-media="article.featuredMedia"
            :path-fragment="`/${$route.name}/`"
            :is-large-thumbnail="true"
          />
        </div>
      </div>

      <div class="preview-grid">
        <!-- <div class="container">-->
          <div class="columns is-multiline">
            <div
              v-for="article in filteredArticles"
              :key="article.id"
              class="column"
              :class="[search == '' ? articleGrid : 'is-half']"
            >
              <article-preview
                :title="article.title || ''"
                :handle="article.handle || ''"
                :excerpt="article.excerpt || ''"
                :tags="article.tags"
                :publishDate="article.publishDate"
                :featured-media="article.featuredMedia"
                :path-fragment="`/${$route.name}/`"
              />
          </div>
          <!-- </div> -->
          <observe-emitter v-on:observe="fetchMore" />
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import getBlog from '~/mixins/getBlog'
import viewEvent from '~/mixins/viewEvent'
import ArticlePreview from '~/components/nacelle/ArticlePreview'
import ObserveEmitter from '~/components/nacelle/ObserveEmitter'
import imageOptimize from '~/mixins/imageOptimize'
import { createClient } from '~/plugins/contentful.js'
import Vue from 'vue'


export default {
  components: {
    ArticlePreview,
    ObserveEmitter
  },
  mixins: [
    getBlog(),
    viewEvent('blog'),
    imageOptimize
  ],
  data() {
    return {
      heroUrl: null,
      search: '',
      blogPosts: [],
      articleGrid: 'is-one-quarter',
      pictureStyle: {
        background: '#f6f6f6',
        border: 'none',
        border: '1px solid #f6f6f6'
      },
      pictureBgWhite: {
        background: '#fff',
        border: 'none',
        border: '1px solid #fff'
      },
      backdoor: 0,
      topFeatured: []
    }
  },
  methods: {
    compare(a, b) {
      if (a.publishDate > b.publishDate)
        return -1;
      if (a.publishDate < b.publishDate)
        return 1;
      return 0;
    },

    setWidthData() {
      if(window.innerWidth < 1024) {
        this.articleGrid = 'is-full';
      }
    },
  },
  computed: {
    ...mapGetters('space', ['getMetatag']),
    blogProducts() {
      if (this.blog && this.blog.products && this.blog.products.length > 0) {
        return this.blog.products
      }

      return null
    },
    showFeatured() {
      if(this.search == ''){
        return true;
      }
      return false;
    },
    featuredArticle() {
      this.backdoor;
      if(this.search == ''){
        if (this.blogPosts.length > 0) {
          console.log(this.blogPosts.length);
          //let lastIndex = this.blogPosts.length - 1;
          const copy  = [...this.blogPosts];
          //return copy.slice(0,2);
        }
      }
      return null
    },
    nextFeaturedArticle() {
      if(this.search == ''){
        if (this.blogPosts.length > 0) {
          //let lastIndex = this.blogPosts.length - 2;
          //return this.blogPosts[1]
          const copy  = [...this.blogPosts];
          return copy.slice(1,2);
        }
      }

      return null
    },
    largeThumbnailArticles() {
      if(this.search == ''){
        if (this.blogPosts.length > 0) {
          //let lastIndex = this.blogPosts.length - 2;
          const copy  = [...this.blogPosts];
          return copy.slice(2,4);
        }
      }

      return null
    },
    filteredArticles() {
      const copy = [...this.blogPosts]
      return copy.splice(4, copy.length - 4).filter(item => {
            let byTitle =
              item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
            if (byTitle === true) {
              return byTitle;
            } 
          });
    }
  },
  async mounted() {
    const client = createClient()
    const asset = await client.getAsset('3QDrYYQGdBtjLI4VQo1PBH')
    this.heroUrl = `https:${asset.fields.file.url}`
    console.log('blog handle');
    console.log(this.$route.name);
    console.log('articles', this.articles)
    this.blogPosts = [...this.articles.sort(this.compare)];
   if(this.search == ''){
        if (this.blogPosts.length > 0) {
          console.log(this.blogPosts.length);
          console.log(this.blogPosts);
          const copy  = [...this.blogPosts];
          Vue.set(this.topFeatured, 0, copy.slice(0,2));
          //return copy.slice(0,2);
        }
    }

    this.setWidthData()
    window.addEventListener('resize', function() {
      if(window.innerWidth < 1024) {
        this.articleGrid = 'is-full';
      }
      })
  },
  head() {
    const properties = {}
    const meta = []
    const title = this.getMetatag('title')

    let fullTitle = 'Blog'

    if (title) {
      fullTitle = `${fullTitle} | ${title.value}`
    }

    properties.title = fullTitle
    meta.push({
      hid: 'og:title',
      property: 'og:title',
      content: fullTitle
    })

    return {
      ...properties,
      meta
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-feature {
  background-color: #f6f6f6;
  padding: 50px 45px;
}

.blog-feature-no-padding-top {
  background-color: #f6f6f6;
  padding: 0px 45px !important;
}

.blog {
  margin-top: 5px;

  &__hero-banner {
    position: relative;

    &__text {
      position: absolute;
      width: 100%;
      margin: 0 auto;
      top: 47%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      font-family: Medium;
      font-size: 54px;
      line-height: 1;
      letter-spacing: 10px;
      color: $grayscale-white;
      text-transform: uppercase;
      @include respond-to('small') {
        font-size: 27px;
        font-weight: bold;
      }
    }

    &__image-container {
      transition: all 1s ease;

      &__img {
        object-fit: cover;
        object-position: center;
        height: 540px;
        width: 100%;
        @media screen and (max-width: 1024px) {
          object-fit: contain 100% 100%;
          height: 300px;
        }
        @media screen and (max-width: 540px) {
          object-fit: contain 100% 100%;;
          height: 250px;
        }
        
        
      }
    }
  }

  &__filters {
    height: 0px;

  }
}
.search-box {
  border: 1px solid #ccc;
  position: relative;
}

.preview-grid {
  display: flex;
  flex-flow: row;
  padding:0;
  background-color: $grayscale-white;
  padding: 0 30px;
  @include respond-to('small') {
    padding: 0 20px;
  }
}
.preview-grid .columns {
  //margin: 0 auto;
  width:100%;
  padding-top: 30px;
}


.blog__filters__right{
  position: absolute;  
  top: 87%; 
  right: 100px;
  margin-top: 7px;
  width: 15%;
  @include respond-to('small') {
    top: 70%; 
    right: 5px;
    padding: 0 20px;
    width: 40%;
  }
}

.blog__filters__right input{
   border-radius: 20px;
   padding: 10px 20px;
   width: 100%;
   position: relative;
}

.blog__filters__right svg{
   position: absolute;
   right: 10px;
   top: 5px;
   width: 15px;
   @include respond-to('small') {
     right: 30px;
   }
}
</style>
