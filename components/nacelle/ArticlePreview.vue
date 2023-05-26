<template>
  <div>
    <div
      v-if="isFeatured"
      class="featured"
      :class="[isReversed ? 'featured__reversed' : 'featured__standard']"
    >
      <div class="featured__image-container">
        <picture>
          <nuxt-link
            :to="link"
            tag="div"
            :style="`background-image: url('${featuredMedia.src}')`"
            class="featured__img"
          ></nuxt-link>
        </picture>
      </div>
      <div class="featured__content">
        <div class="featured__content__desc">
          <div class="tags-date">
            <div v-if="hasTags" class="tags-date__tags">
              {{ tags.join(', ') }}
            </div>
            <div v-if="hasTags" class="tags-date__divider">
              |
            </div>
            <div class="tags-date__date">
              {{ absoluteDate }}
            </div>
          </div>
          <div class="featured__content__title">
            {{ title }}
          </div>
          <div class="featured__content__description">
            {{ description }}
          </div>
          <div class="featured__content__excerpt">
            <!-- {{excerpt}} -->
          </div>
          <nuxt-link :to="link">
            <div class="featured__content__read-more" role="button">
              Read&nbsp;More
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>

    <div v-else-if="isLargeThumbnail" class="large-thumbnail">
      <picture>
        <nuxt-link
          :to="link"
          tag="div"
          :style="`background-image: url('${featuredMedia.src}')`"
          class="featured__img"
        ></nuxt-link>
      </picture>
      <div class="description">
        <div class="tags-date">
          <div v-if="hasTags" class="tags-date__tags">
            {{ tags.join(', ') }}
          </div>
          <div v-if="hasTags" class="tags-date__divider">
            |
          </div>
          <div class="tags-date__date">
            {{ absoluteDate }}
          </div>
        </div>
        <div class="featured__content__title">
          {{ title }}
        </div>
        <div class="featured__content__description">
          {{ description }}
        </div>
        <div class="featured__content__excerpt">
          <!-- {{excerpt}} -->
        </div>
        <nuxt-link :to="link">
          <div class="featured__content__read-more" role="button">
            Read&nbsp;More
          </div>
        </nuxt-link>
      </div>
    </div>

    <div v-else class="article-preview" style="margin-left:20px;">
      <!-- <slot name="media" :featuredMedia="featuredMedia"> -->
      <div class="article-preview__image-container">
        <nuxt-link :to="link">
          <div
            class="article-preview__img"
            :style="`background-image: url('${featuredMedia.src}')`"
          ></div>
          <!--<picture>
                <img :src="optimizeSource({url: featuredMedia.src})" class="article-preview__image-container__img">
              </picture> -->
        </nuxt-link>
      </div>
      <!-- </slot> -->
      <slot
        name="details"
        :title="title"
        :excerpt="excerpt"
        :handle="handle"
        :readMoreText="readMoreText"
        :link="link"
        :tags="tags"
        :publishDate="publishDate"
      >
        <div class="article-preview__content">
          <div class="article-preview__content__inner">
            <div class="tags-date">
              <div v-if="hasTags" class="tags-date__tags">
                {{ tags.join(', ') }}
              </div>
              <div v-if="hasTags" class="tags-date__divider">
                |
              </div>
              <div class="tags-date__date">
                {{ absoluteDate }}
              </div>
            </div>
            <nuxt-link :to="link" class="article-preview__content__title">
              {{ title }}
            </nuxt-link>
            <!-- <p>
                {{ excerpt }}
              </p>
              <p>
                <nuxt-link :to="link">
                  {{ readMoreText }}
                </nuxt-link>
              </p> -->
          </div>
        </div>
      </slot>
    </div>
    <hr class="mobile-divider" />
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import dayjs from 'dayjs'
export default {
  mixins: [imageOptimize],
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    handle: {
      type: String,
      default: '',
      required: true
    },
    excerpt: {
      type: String,
      default: '',
      required: true
    },
    tags: {
      type: Array,
      default: () => {
        return []
      }
    },
    publishDate: {
      type: Number,
      default: -1
    },
    pathFragment: {
      type: String,
      default: '/blog/'
    },
    featuredMedia: {
      type: Object,
      default: () => {
        return null
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isLargeThumbnail: {
      type: Boolean,
      default: false
    },
    isReversed: {
      type: Boolean,
      default: false
    },
    readMoreText: {
      type: String,
      default: 'Read More'
    },
    dateFormatString: {
      type: String,
      default: 'MMMM D, YYYY'
    }
  },
  computed: {
    link() {
      return `${this.pathFragment}${this.handle}`
    },
    hasTags() {
      return this.tags && this.tags.length > 0
    },
    absoluteDate() {
      if (this.publishDate > -1) {
        return dayjs(this.publishDate * 1000).format(this.dateFormatString)
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.featured {
  display: flex;
  flex-wrap: wrap;
  // height: 500px;
  // border-radius: 12px;

  @include respond-to('small') {
    padding: 20px;
  }

  &__reversed {
    flex-direction: row-reverse;
  }

  &__standard {
    flex-direction: row;
  }

  &__image-container {
    width: 65%;
    //min-height: 600px;
    @include respond-to('small') {
      width: 100%;
      flex-flow: row nowrap;
      height: auto;
    }

    &__img {
      object-fit: cover;
      object-position: center;
      height: 100%;
      width: 100%;
      @include respond-to('small') {
        border-top-right-radius: 12px;
        border-bottom-left-radius: 0;
        height: 210px;
      }
    }
  }

  &__img {
    padding-bottom: 60%;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  &__content {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    width: 35%;
    padding: 70px;
    background-color: $grayscale-white;
    //min-height: 600px;
    @media screen and (min-width: 1024px) {
      padding: 0px 70px !important;
    }
    @include respond-to('small') {
      height: auto;
      padding: 30px;
      padding-top: 50px !important;
    }
    &__desc {
      @media screen and (min-width: 1520px) {
        margin-top: -200px !important;
      }
    }

    @include respond-to('small') {
      border-top-right-radius: 0;
      border-bottom-left-radius: 12px;
      width: 100%;
      flex-flow: row nowrap;
      padding: 0 20px 20px 20px;
      margin-top: -7px;
    }

    &__title {
      font-family: Bold;
      font-size: 28px;
      line-height: 1.14;
      letter-spacing: 3.5px;
      color: $primary-purple;
      margin-bottom: 10px;
      text-transform: uppercase;

      @include respond-to('small') {
        font-size: 24px;
        letter-spacing: 3.5px;
        line-height: 1.17;
      }
    }

    &__description {
      font-family: Regular;
      font-size: 14px;
      letter-spacing: 0.5px;
      line-height: 1.29;
      color: #57575c;
    }

    &__excerpt {
      font-family: Regular;
      font-size: 14px;
      line-height: 1.57;
      letter-spacing: 0.5px;
      margin-bottom: 30px;
    }

    &__read-more {
      @include button-primary('purple-ghost');
      width: 145px;
    }
  }
}

.tags-date {
  font-family: Bold;
  font-size: 12px;
  line-height: 0.88;
  letter-spacing: 2.33px;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;

  @include respond-to('small') {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  &__tags {
    color: $secondary-purple-3;
  }

  &__divider {
    color: $grayscale-gray;
    margin: 0 10px;
    @include respond-to('small') {
      margin: 0 5px;
    }
  }

  &__date {
    color: $grayscale-gray;
  }
}

// .article-preview ::v-deep .featured-media {
//   border-radius: 12px;
//   width: 315px;
//   height: 240px;
//   object-position: center;
//   object-fit: contain;
// }
.large-thumbnail {
  background-color: #fff;
  border-radius: 10px;
}

.large-thumbnail .featured {
  &__img {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  &__content {
    &__title {
      min-height: 50px;
      @media screen and (min-width: 769px) and (max-width: 1248px) {
        min-height: 100px;
      }
    }
  }
}

.large-thumbnail .description {
  padding: 30px;
  height: 270px;
  @media screen and (min-width: 769px) and (max-width: 1248px) {
    height: 300px;
  }
  @media screen and (max-width: 768px) {
    height: 250px;
  }
  @media screen and (min-width: 1500px) {
    height: 250px;
  }
}

.article-preview {
  padding: 25px 15px;

  @include respond-to('small') {
    display: flex;
    width: 100%;
    flex-direction: row;
    padding: 5px 15px 20px 0px;
  }
  &__image-container {
    @include respond-to('small') {
      height: auto;
      width: 60%;
      flex-direction: column;
    }

    &__img {
      width: 100%;
      border-radius: 12px;
      object-position: center;
      object-fit: contain;
      flex-direction: column;
      @include respond-to('small') {
        height: auto;
        object-fit: cover;
      }
    }
  }

  &slot {
    flex-direction: column;
  }

  &__img {
    width: 100%;
    padding-bottom: 75%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  &__content {
    width: 100%;
    @include respond-to('small') {
      margin-left: 15px;
      width: 100%;
    }
    &__title {
      // & a {
      font-family: Bold;
      font-size: 18px;
      line-height: 1.22;
      letter-spacing: 2.5px;
      color: $primary-purple;
      text-transform: uppercase;

      @include respond-to('small') {
        font-size: 16px;
        line-height: 1.26;
      }
      // }
    }
  }
}

.mobile-divider {
  margin: 0;
  @media screen and (min-width: 769px) {
    display: none;
  }
}
// .is-featured {
//   // position: relative;
//   background-color: #f5f5f5;
// }

// .is-featured ::v-deep .featured-media {
//   @media screen and (min-width: 769px) {
//     // position: absolute;
//     // top: 0;
//     // bottom: 0;
//     // left: 0;
//     // width: 60%;

//     display: flex;

//     figure {
//       width: 100%;
//       height: 100%;

//       img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//         object-position: center;
//       }
//     }
//   }
// }

// .is-featured .article-preview-content {
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   margin-left: auto;
//   margin-right: auto;
//   padding: 1rem;
//   padding-bottom: 2rem;
//   max-width: 1200px;

//   @media screen and (min-width: 769px) {
//     padding-top: 3rem;
//     padding-bottom: 3rem;
//     min-height: 500px;
//   }
// }

// .is-featured .article-preview-inner {
//   margin-top: -4rem;
//   padding: 2rem;
//   background-color: #ffffff;

//   @media screen and (min-width: 769px) {
//     margin-top: 0;
//     width: 42%;
//   }
// }
</style>
