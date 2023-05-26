<template>
  <div class="link-tile" ref="linkTile" :style="{ '--bgcolor': fields.backgroundColor || '#fff' }">
    <nuxt-link v-if="fields.url" :to="fields.url">
      <picture>
        <img
          :src="optimizeSource({ url: fields.featuredImage.fields.file.url, width })"
          :alt="fields.title"
        />
      </picture>
      <h3 v-if="fields.title">{{ fields.title }}</h3>
    </nuxt-link>
    <template v-else>
      <picture>
        <img
          :src="optimizeSource({ url: fields.featuredImage.fields.file.url, width })"
          :alt="fields.title"
        />
      </picture>
      <h3 v-if="fields.title">{{ fields.title }}</h3>
    </template>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'

export default {
  mixins: [imageOptimize],
  data() {
    return {
      width: null
    }
  },
  props: {
    fields: {
      type: Object
    }
  },
  mounted() {
    const { width } = this.$refs.linkTile.getBoundingClientRect()
    this.width = width
  }
}
</script>

<style lang="scss" scoped>
.link-tile {
  text-align: center;
  margin: 1rem;

  a {
    color: currentColor;
  }

  img {
    height: 300px;
    width: 300px;
    object-fit: scale-down;
    background: var(--bgcolor);
    padding: 2rem;
    border-radius: 1rem;
  }

  h3 {
    font-family: 'Bold';
    font-size: 18px;
    line-height: 1;
    text-align: center;
    text-transform: uppercase;
    margin-top: 32px;
    letter-spacing: 1.75px;
  }
}
</style>
