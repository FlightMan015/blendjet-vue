<!-- page.fields.features.fields.features -->
<template>
  <div
    v-if="title || description || (Array.isArray(features) && features.length)"
    class="features-container sticky"
  >
    <div class="features-column">
      <!-- TITLE -->
      <div class="features-heading" v-if="title">
        {{ title }}
      </div>
      <!-- DESCRIPTION -->
      <div class="features-text" v-if="description">
        <RichTextRenderer :document="description" />
      </div>
      <!-- FEATURES -->
      <div class="features-wrapper" v-if="Array.isArray(features) && features.length">
        <div v-for="feature in features" class="features-row" :key="feature.title">
          <!-- FEATURE - ICON -->
          <div class="features-icon">
            <ModelIcon :type="feature.icon" />
          </div>
          <!-- FEATURE - TEXT -->
          <div class="features-text-block">
            <div class="features-text-block__title">
              {{ feature.title }}
            </div>
            <div class="features-text-block__text" v-if="feature.description">
              <RichTextRenderer :document="feature.description" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import ModelIcon from '~/components/ModelIcon'
export default {
  components: {
    RichTextRenderer,
    ModelIcon
  },
  mixins: [imageOptimize],
  props: {
    title: {
      type: String,
      default: ''
    },
    features: {
      type: Array,
      default: () => []
    },
    description: null
  }
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 260px;
}

.features-container {
  display: flex;
  justify-content: center;
  color: $grayscale-white;
}
.features-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: auto;
  justify-content: center;
  align-items: center;
  max-width: 550px;

  // @include respond-to('medium') {
  //   flex-direction: column;
  // flex-wrap: nowrap;
  // }
}

.features-heading {
  font-size: 24px;
  font-family: Medium;
  letter-spacing: 4px;
  line-height: 1.17;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 20px;
  @include respond-to('small') {
    margin-top: 30px;
    font-size: 18px;
    line-height: 1.22;
    letter-spacing: 2.5px;
  }
}

.features-text {
  font-family: Medium;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: 0.5px;
  color: $grayscale-white;
  text-align: center;
  margin-bottom: 45px;

  @include respond-to('small') {
    font-size: 14px;
    line-height: 1.29;
  }
}

.features-column {
  width: 60%;
  display: flex;
  flex-flow: column nowrap;

  @include respond-to('small') {
    width: 90%;
  }
}

.features-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  align-items: center;
  margin: 16px 30px;
  width: 90px;
  flex: 1;
  min-height: 120px;

  @include respond-to('small') {
    flex-flow: column nowrap;
    align-items: center;
  }
}

.features-icon-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.features-icon {
  width: 84px;
  display: flex;
  justify-content: center;

  @include respond-to('small') {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.features-text-block {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  @include respond-to('small') {
    margin-left: 0;
    margin-top: 20px;
  }

  &__title {
    font-family: Bold;
    font-size: $text-small;
    letter-spacing: 1.75px;
    line-height: 1.17;
    text-align: center;
    text-transform: uppercase;

    @include respond-to('small') {
      text-align: center;
    }
  }

  &__text {
    font-family: Regular;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.29;
    @include respond-to('small') {
      text-align: center;
    }
  }
}
</style>
