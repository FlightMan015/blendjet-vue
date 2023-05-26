<template>
  <div class="media-tile">
    <!-- HEADER -->
    <div class="media-tile__header" v-if="title">
      {{ title }}
    </div>

    <!-- TEXT -->
    <div class="media-tile__text" v-if="text">
      <RichTextRenderer :document="text" />
    </div>

    <!-- MEDIA -->
    <div v-if="media && media.url" class="media-tile__media">
      <!-- MEDIA - VIDEO -->
      <VideoContainer
        v-if="media.type == 'video'"
        :source="media.url"
        class="media-tile__media__video"
      />

      <!-- MEDIA - IMAGE -->
      <img
        v-else-if="media"
        class="media-tile__media__image"
        :src="
          optimizeSource({
            url: media.url,
            width: 500
          })
        "
      />
    </div>
  </div>
</template>

<script>
// Components
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import VideoContainer from '~/components/VideoContainer'

// Mixins
import imageOptimize from '~/mixins/imageOptimize'

// Vars
const videoFormats = ['mp4', 'mov', 'webm', 'ogg']
const imageFormats = ['tif', 'tiff', 'jpg', '.jpeg', '.gif', '.png']

export default {
  data() {
    return {}
  },
  mixins: [imageOptimize],
  components: {
    RichTextRenderer,
    VideoContainer
  },
  props: {
    title: String,
    text: [String, Object],
    contentfulMedia: Object,
    externalMediaUrl: String
  },
  computed: {
    media() {
      const url = this.externalMediaUrl || this.contentfulMedia?.fields?.file?.url || undefined
      const ext = url && url.split('.').pop()
      const type = ext && videoFormats.find(f => ext.startsWith(f)) ? 'video' : 'image'
      return {
        url,
        type
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.media-tile {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin-bottom: 80px;
  width: 520px;

  @include respond-to('small') {
    width: auto;
  }

  // HEADER
  &__header {
    font-size: 24px;
    font-family: Bold;
    letter-spacing: 4px;
    line-height: 1.17;
    text-transform: uppercase;
    text-align: center;
    color: $primary-purple;
    margin-bottom: 15px;
    @include respond-to('small') {
      font-size: 18px;
      line-height: 1.22;
      letter-spacing: 2.5px;
      padding: 0 10px;
    }
  }

  // TEXT
  &__text {
    font-family: Regular;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.29;
    color: $grayscale-gray;
    text-align: center;
    margin-bottom: 35px;
    @include respond-to('small') {
      padding: 0 20px;
    }
  }

  // MEDIA
  &__media {
    width: 520px;
    height: 520px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;

    @include respond-to('small') {
      width: 100%;
      height: auto;
      min-height: 375px;
      min-width: 375px;
      max-width: 540px;
      border-radius: 0;
    }

    video,
    img {
      object-fit: cover;
    }

    &__video {
    }

    &__image {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
