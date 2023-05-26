<template>
  <div>
    <div class="dropdown">
      <div class="dropbtn" role="button" @click.prevent="toggleVisible" v-show="!visible">
        <span v-if="currentVariant.featuredMedia.thumbnailSrc" class="dropdown-thumb">
          <img
            class="dropdown-thumb-image"
            :src="optimizeSource({ url: currentVariant.featuredMedia.thumbnailSrc })"
          />
        </span>
        <span>{{ currentVariant.title.replace('Peanut Butter', 'PB') }}</span>
        <CaretDown :styleObj="{ marginLeft: '30px' }" />
      </div>
      <transition name="fade">
        <ul v-if="visible" class="dropdown-content">
          <li v-for="(variant, i) in items" :key="i" @click.prevent="updateJetpack(variant)">
            <span v-if="variant.featuredMedia.thumbnailSrc" class="dropdown-thumb">
              <img
                class="dropdown-thumb-image"
                :src="optimizeSource({ url: variant.featuredMedia.thumbnailSrc })"
              />
            </span>
            {{ variant.title.replace('Peanut Butter', 'PB') }}
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
    items: {
      type: Array,
      default: () => []
    },
    currentVariant: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    CaretDown
  },
  mixins: [imageOptimize],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
    formatTitle(title) {
      return title.replace(/\s/g, '')
    },
    updateJetpack(jetpack) {
      this.$emit('update', jetpack)
      this.visible = false
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
  width: 360px;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
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

  @media screen and (max-width: 360px) {
    width: 300px;
  }

  & > li {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
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
