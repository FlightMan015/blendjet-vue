<template>
  <div class="blah">

    <div
      v-if="content.fields.layout === 'Image Left' || content.fields.layout === 'Image Right'"
      class="our-journey__section"
      :class="[
        { reverse: content.fields.layout === 'Image Right'},
        { dark: color === 'dark'},
        { 'text-right': content.fields.textAlignment === 'Right'},
        { 'text-centered': content.fields.textAlignment === 'Center'}
      ]"
    >
      <div class="our-journey__section__side">
        <img class="our-journey__section__img" :src="optimizeSource({ url: content.fields.image.fields.file.url })" :alt="content.fields.image.fields.description" />
      </div>
      <div class="our-journey__section__side">
        <div class="our-journey__section__text-block text-purple">
          <div class="our-journey__section__text-block__heading">
            {{ content.fields.title }}
          </div>
          <div class="our-journey__section__text-block__main">
            <RichTextRenderer :document="content.fields.text" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="content.fields.layout === 'No Image'"
      class="our-journey__section our-journey__section--no-image"
    >
      <div class="our-journey__section__text-block__main text-centered">
        <h3 class="our-journey__section__text-block__heading text-centered">
          {{ content.fields.title }}
        </h3>
        <RichTextRenderer :document="content.fields.text" />
      </div>
    </div>

    <div
      v-else-if="content.fields.layout === 'Image Background'"
      class="our-journey__dream"
      :style="`background-image: url('${optimizeSource({ url: content.fields.image.fields.file.url })}')`"
      aria-label="Green BlendJet with Fruits"
    >
      <div class="our-journey__dream__text-block">
        <div class="our-journey__dream__text-block__heading">
          {{ content.fields.title }}
        </div>
        <div class="our-journey__section__text-block__main">
          <RichTextRenderer :document="content.fields.text" />
        </div>
      </div>
    </div>


  </div>
</template>
<script>
import imageOptimize from '~/mixins/imageOptimize'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

export default {
  props: {
    content: {
      type: Object,
      default: null
    },
    color: {
      type: String,
      default: null
    }
  },
  mixins: [imageOptimize],
  components: {
    RichTextRenderer
  },
}
</script>
<style lang="scss" scoped>
.our-journey {

  &__section {
    display: flex;
    flex-flow: row wrap;
    margin: 0 50px;
    color: white;

    @include respond-to('small') {
      margin: 0;
      flex-direction: column-reverse;
      padding: 23px 15px 23px 15px;
    }

    &.reverse {
      flex-direction: row-reverse;

      @include respond-to('small') {
        flex-direction: column-reverse;
      }
    }

    &.dark {
      color: $primary-purple;
    }

    &--no-image {
      max-width: 743px;
      text-align: center;
      margin: 0 auto;
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
      max-width: 100%;

      @media screen and (min-width: 1024px) {
        margin: 0 40px;
      }
    }

    &__text-block {

      @include respond-to('small') {
        min-width: auto;
        width: 343px;
        margin-bottom: 30px;
      }

      &__heading  {
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

        p {
          padding-bottom: 10px;
        }
      }
    }
  }

  &__dream {
    position: relative;
    margin-bottom: 92px;
    margin-top: 112px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    border-radius: 30px;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;

    @include respond-to('small') {
      margin-top: 55px;
      margin-bottom: 0px;
      border-radius: 5px;
    }

    h5 {
      font-family: Regular;
      font-size: 18px;
      line-height: 1.28;
      letter-spacing: 0.75px;
      margin-bottom: 23px;
    }

    &__text-block {
      max-width: 375px;
      min-width: 343px;
      color: $grayscale-white;
      margin-left: 70px;
      margin-top: 70px;
      padding-top: 50px;
      padding-bottom: 50px;

      @include respond-to('small') {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        padding-top: 135px;
        padding-bottom: 135px;
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

.darken-image {
  filter: brightness(70%);
}

.text-right {
  text-align: right;
}

.text-centered {
  text-align: center;
}

.our-journey__section__text-block__main.text-centered a{
  color:#ffffff;
}
.our-journey__section__text-block__main.text-centered a:hover{
  color:#000;
}
.our-journey__section__text-block__main a{
  color:#ffffff;
}
.our-journey__section__text-block__main a:hover{
  color:#000;
}
</style>
