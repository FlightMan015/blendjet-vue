<!--
/****
/* Customize your Nacelle content by taking advantage
/* of named slots. For more details, refer to:
/*
/* https://docs.getnacelle.com/nuxt/pages.html#customizing-homepage-content-output
/****
-->
<template>
  <div class="article-page">
    <article class="article">
      <div class="article-header">
        <!--
                /****
                /* -- Edit Blog Article Header --
                /* |       Available slots:      |
                /*
                /* name: "tags", data: "tags"
                /* name: "title", data: "title"
                /* name: "author", data: "author"
                /* name: "date", data: "date"
                /****
              -->
        <blog-article-header
          :title="article.title"
          :author="article.author"
          :article="article"
          :tags="article.tags"
          :publishDate="article.publishDate"
        >
          <!-- <template v-slot:tags>

              </template> -->
          <!-- Extra HTML markup can also be added below the default header content -->
        </blog-article-header>
      </div>
      <div class="article-hero">
        <transition name="fade">
          <interface-featured-media
            v-if="article && article.featuredMedia"
            :media="article.featuredMedia"
          />
        </transition>
      </div>
      <div class="container">
        <transition name="fadeDelay">
          <div v-if="article" class="columns is-centered is-multiline">
            <!-- <div class="article-header column is-6 has-text-centered"> -->
            <!--
                /****
                /* -- Edit Blog Article Header --
                /* |       Available slots:      |
                /*
                /* name: "tags", data: "tags"
                /* name: "title", data: "title"
                /* name: "author", data: "author"
                /* name: "date", data: "date"
                /****
              -->
            <!-- <blog-article-header
                :title="article.title"
                :author="article.author"
                :tags="article.tags"
                :publishDate="article.publishDate"
              >
              </blog-article-header> -->
            <!-- </div> -->
            <div v-if="article.fields.youtubeUrl" class="article-embed-container">
              <iframe
                :src="`${article.fields.youtubeUrl}`"
                class="article-youtube-url"
                frameborder="0"
              ></iframe>
            </div>
            <div class="column is-9 content">
              <blog-article-content :article="article" :products="products">
                <div class="article-excerpt">{{ article.excerpt }}</div>
                <!-- Extra HTML added after content -->
                <nuxt-link :to="`/${blogHandle}/`" class="breadcrumb-back">Go Back</nuxt-link>
              </blog-article-content>
            </div>
          </div>
        </transition>
      </div>
    </article>
  </div>
</template>

<script>
import nmerge from 'nuxt-merge-asyncdata'
import { mapGetters } from 'vuex'
import getBlogArticle from '~/mixins/getBlogArticle'
import getCollection from '~/mixins/getCollection'
import viewEvent from '~/mixins/viewEvent'
import InterfaceFeaturedMedia from '~/components/nacelle/InterfaceFeaturedMedia'
import BlogArticleHeader from '~/components/nacelle/BlogArticleHeader'
import BlogArticleContent from '~/components/nacelle/BlogArticleContent'

export default nmerge({
  components: {
    InterfaceFeaturedMedia,
    BlogArticleHeader,
    BlogArticleContent
  },
  mixins: [getCollection(), getBlogArticle(), viewEvent('article')],
  computed: {
    ...mapGetters('space', ['getMetatag'])
  },
  head() {
    if (this.article) {
      const properties = {}
      const meta = []
      const title = this.getMetatag('title')

      if (this.article.fields.blogMetaTitle) {
        let fullTitle = this.article.fields.blogMetaTitle

        if (title) {
          fullTitle = `${fullTitle} | ${title.value}`
        }

        properties.title = fullTitle
        meta.push({
          hid: 'og:title',
          property: 'og:title',
          content: fullTitle
        })
      }

      if (this.article.description) {
        meta.push({
          hid: 'description',
          name: 'description',
          content: this.article.description
        })
        meta.push({
          hid: 'og:description',
          property: 'og:description',
          content: this.article.description
        })
      }

      if (this.article.featuredMedia) {
        meta.push({
          hid: 'og:image',
          property: 'og:image',
          content: this.article.featuredMedia.src
        })
      }

      meta.push({
        hid: 'og:type',
        property: 'og:type',
        content: 'article'
      })

      return {
        ...properties,
        meta
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.article-page {
  margin-top: 5px;
  // background-image: linear-gradient(to bottom, #ffffff, #f6f5fd);
}

.article-hero {
  // height: 300px;
  // background: #f5f5f5;

  @media screen and (min-width: 769px) {
    height: 720px;
  }

  /deep/ .featured-media {
    width: 100%;
    height: 100%;

    figure,
    img {
      width: 100%;
      height: 100%;
    }

    img {
      object-fit: cover;
    }
  }
}

.article-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px 0 52px 0;
  background-color: $primary-purple-tint;
}

.article .container {
  position: relative;
  padding: 2rem;
  padding-bottom: 5rem;
  background-color: #ffffff;
  max-width: 1024px;
}

.breadcrumb-back {
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  color: $primary-purple;
  cursor: pointer;
}

.article-tags {
  margin-bottom: 1em;
}

.article-body .content {
  position: relative;
}

.fade-enter-active {
  transition: opacity 0.25s;
}
.fade-enter {
  opacity: 0;
}

.fadeDelay-enter-active {
  transition: opacity 0.55s 0.25s;
}
.fadeDelay-enter {
  opacity: 0;
}
.article-embed-container {
  height: 495px;
  width: 100%;
}
iframe.article-youtube-url {
  height: 100%;
  width: 100%;
}
.article-excerpt {
  font-family: Regular;
  /*font-size: 14px; */
  line-height: 1.86;
  letter-spacing: 0.5px;
  color: $primary-purple;
  margin-bottom: 40px;
}
</style>
