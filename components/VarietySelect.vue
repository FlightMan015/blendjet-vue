<template>
  <ul class="variety-dropdown-content">
    <li v-for="(item, i) in options" :key="i" @click.stop.prevent="setOptionValue(i)">
      <span class="dropdown-thumb">
        <template v-for="(variant, index) in item.variants">
          <img
            v-show="index === imageIndex[i]"
            :key="index"
            class="dropdown-thumb-image"
            :src="variant.featuredMedia.thumbnailSrc"
          />
        </template>
      </span>
      {{ item.title }}
    </li>
  </ul>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
export default {
  props: {
    options: {
      type: Array
    }
  },
  mixins: [imageOptimize],
  data() {
    return {
      imageIndex: [],
      imageInterval: null
    }
  },
  mounted() {
    this.setImageInterval()
  },
  beforeDestroy() {
    clearInterval(this.imageInterval)
  },
  methods: {
    setImageInterval() {
      clearInterval(this.imageInterval)
      this.options.forEach((option, index) => {
        this.imageIndex[index] = 1
      })
      this.imageInterval = setInterval(() => {
        this.options.forEach(({ variants }, index) => {
          this.$set(this.imageIndex, index, this.imageIndex[index] + 1)
          this.$set(this.imageIndex, index, this.imageIndex[index] % variants.length)
        })
      }, 1000)
    },
    setOptionValue(index) {
      this.$emit('updateOptions', index)
    }
  }
}
</script>

<style lang="scss" scoped>
/* Dropdown Content (Hidden by Default) */
.variety-dropdown-content {
  position: relative;
  border-radius: 25px;
  background-color: $primary-purple-tint;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  z-index: 1;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  z-index: 3;
  min-width: 340px;
  font-size: 12px;
  color: $primary-purple;
  border: 2px solid $secondary-purple-4;
  overflow: hidden;

  &__up {
    top: unset;
    bottom: 3px;
  }

  & > li {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:hover {
      @include hover-transition;
    }
  }
}

.dropdown-thumb {
  margin-right: 20px;
  margin-left: 20px;
}

.dropdown-thumb-image {
  height: 35px;
  width: auto;
}

/* Links inside the dropdown */
.dropdown-content a {
  text-decoration: none;
  color: $primary-purple !important;
}

.menu-item {
  color: $primary-purple;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background: transparent;
}
</style>
