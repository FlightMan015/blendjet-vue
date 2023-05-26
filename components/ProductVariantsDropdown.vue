<template>
  <div v-if="variants && variants.length">
    <div class="dropdown" role="button" tabindex="0" @focusout="isOpen = false" :style="styleObj">
      <!-- MENU TRIGGER -->
      <div class="dropbtn" @click.prevent="toggleOpen" v-show="!isOpen">
        <!-- THUMBNAIL - Variant Image (if configured) -->
        <div v-if="variantImage && !currentVariant.withVarietyPack" class="dropdown-thumb">
          <img
            class="dropdown-thumb-image"
            :src="optimizeSource({ url: variantImage, width: 800 })"
          />
        </div>
        <div v-else-if="currentVariant.withVarietyPack" class="dropdown-thumb">
          <template v-for="(item, index) in variants">
            <img
              :key="index"
              v-show="index === imageIndex"
              class="dropdown-thumb-image"
              :src="optimizeSource({ url: item.featuredMedia.thumbnailSrc, width: 800 })"
            />
          </template>
        </div>
        <!-- LABEL -->
        <div>{{ formatTitle(currentVariant.displayName || currentVariant.title) }}</div>
        <!-- DROPDOWN INDICATOR -->
        <CaretDown :styleObj="{ marginLeft: '10px', marginRight: '10px' }" />
      </div>
      <!-- MENU -->
      <transition name="fade">
        <ul
          v-if="isOpen"
          class="dropdown-list"
          :class="{ 'dropdown-content': true, 'dropdown-content__up': this.direction === `up` }"
        >
          <li
            v-for="(variant, i) in variants"
            :key="i"
            @click.prevent="setSelectedVariant(variant)"
          >
            <div
              v-if="!variant.withVarietyPack && variant.featuredMedia.thumbnailSrc"
              class="dropdown-thumb"
            >
              <img
                class="dropdown-thumb-image"
                :src="optimizeSource({ url: variant.featuredMedia.thumbnailSrc, width: 800 })"
              />
            </div>
            <div
              v-else-if="variant.withVarietyPack && variant.featuredMedia.thumbnailSrc"
              class="dropdown-thumb"
            >
              <template v-for="(item, index) in variants">
                <img
                  :key="index"
                  v-if="index === imageIndex"
                  class="dropdown-thumb-image"
                  :src="optimizeSource({ url: item.featuredMedia.thumbnailSrc, width: 800 })"
                />
              </template>
            </div>
            <div>{{ formatTitle(variant.displayName || variant.title) }}</div>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import CaretDown from '~/components/svg/caretDown'

export default {
  props: {
    variants: {
      type: Array,
      default: () => []
    },
    withVarietyPack: {
      type: Boolean,
      default: false
    },
    currentVariant: {
      type: Object,
      default: () => ({})
    },
    styleObj: {
      type: Object,
      default: () => {}
    },
    direction: {
      type: String,
      default: 'down',
      validator(value) {
        return ['up', 'down'].indexOf(value) !== -1
      }
    }
  },
  components: {
    CaretDown
  },
  mixins: [imageOptimize],
  data() {
    return {
      isOpen: false,
      imageInterval: null,
      imageIndex: 0
    }
  },
  computed: {
    variantImage() {
      return this.currentVariant?.featuredMedia?.thumbnailSrc
    }
  },
  mounted() {
    this.setImageInterval()
  },
  beforeDestroy() {
    clearInterval(this.imageInterval)
  },
  watch: {
    variants() {
      this.setImageInterval()
    }
  },
  methods: {
    setImageInterval() {
      this.imageIndex = 0
      clearInterval(this.imageInterval)
      this.imageInterval = setInterval(() => {
        this.imageIndex++
        this.imageIndex = this.imageIndex % this.variants.length
        if (this.imageIndex === 0) {
          this.imageIndex++
        }
      }, 1000)
    },
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    /**
     * Main setter, set's the active variant and emits the external 'update' event.
     */
    setSelectedVariant(variant) {
      this.$emit('update', variant)
      this.isOpen = false
    },
    // Method to manipulate a variant title within the menu.
    // Currently only used to replace 'Peanut Butter' with the shorter 'PB'
    formatTitle(title) {
      return typeof title === 'string' ? title.replace('Peanut Butter', 'PB') : ''
    }
  }
}
</script>

<style lang="scss" scoped>
/* Dropdown Button */
.dropbtn {
  color: $primary-purple;
  outline: none;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  color: $primary-purple;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border: 2px solid $secondary-purple-4;
  border-radius: 25px;
  align-items: center;
  width: 360px;
  min-width: 160px;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  font-size: $text-small;
  background-color: $grayscale-white;
  cursor: pointer;
  &:focus {
    outline: none;
  }

  @media screen and (max-width: 360px) {
    width: 300px;
  }
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  top: -3px;
  background-color: $primary-purple-tint;
  border-radius: 25px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
  border: 2px solid $secondary-purple-4;
  z-index: 1;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  z-index: 3;

  &__up {
    top: unset;
    bottom: 3px;
  }

  & > li {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 auto;
    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:last-child {
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
    }
    &:hover {
      @include hover-transition;
    }
  }
}

.dropdown-thumb {
  margin-right: 20px;
}

.dropdown-thumb-image {
  height: 35px;
  width: auto;
  margin-right: 5px;
  margin-left: 10px;
}

/* Links inside the dropdown */
.dropdown-content a {
  text-decoration: none;
  color: $primary-purple !important;
}

.menu-item {
  color: $primary-purple;
  border-radius: 25px;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background: transparent;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
</style>
