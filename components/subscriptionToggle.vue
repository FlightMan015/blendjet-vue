<template>
  <div>
    <!-- Checkbox UI -->
    <div class="checkbox-container" v-if="checkbox">
      <Checkbox
        :color="color"
        :initialCheck="true"
        :label="discountMessage"
        @checked="handleCheck"
      />
    </div>
    <!-- Toggle UI -->
    <div v-else class="toggle-container">
      <div class="text-container">
        <div class="text-container__option subscription">{{ discountMessage }}</div>
        <div class="text-container__option onetime">
          One-time <br />
          Purchase
        </div>
      </div>
      <div class="toggle" :class="{ active: this.value }" @click="handleClick">
        <div class="draggable" :style="style"></div>
      </div>
    </div>
  </div>
</template>

<script>
import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'
import Checkbox from '~/components/checkbox'

export default {
  props: {
    // Boolean value representing whether the toggle is active or not
    value: {
      type: Boolean,
      default: true
    },
    // Shopify product data
    product: {
      type: Object,
      default: () => {
        return {
          priceRange: {
            min: '0',
            max: '0'
          },
          title: '',
          category: '',
          featuredMedia: {
            src: '',
            thumbnailSrc: ''
          },
          description: '',
          id: '',
          handle: '',
          variants: [],
          options: [],
          metafields: []
        }
      }
    },
    // Toggle to true to have toggle appear as normal checkbox <input />
    checkbox: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'purple'
    }
  },
  components: {
    Checkbox
  },
  mixins: [rechargeProperties, productMetafields],
  data() {
    return {
      width: 100,
      pressed: 0
    }
  },
  computed: {
    style() {
      return {
        transform: `translateX(${this.pos_percentage})`
      }
    },
    pos_percentage() {
      return `${(this.sliderPosition / this.width) * 100}%`
    },
    discountMessage() {
      return `Subscribe & Save ${this.discountPercentage ? `${this.discountPercentage}%` : ''}`
    },
    sliderPosition() {
      return this.value ? 0 : 100
    }
  },
  methods: {
    /**
     * Click handler - inverts 'value' state when element is clicked
     * @param {Event} e
     */
    handleClick(e) {
      this.$emit('update:value', !this.value)
    },
    /**
     * Checkbox handler - updates based on the checkbox state
     * @param {Boolean} checked
     */
    handleCheck(checked) {
      this.$emit('update:value', checked)
    },
    /**
     * Inherited mobile drag interface methods (unknown if these are working properly)
     */
    handleDrag(e) {
      const pos = e.clientX - this.$el.offsetLeft
      const percent = (pos / this.width) * 100
      this.sliderPosition = percent <= 0 ? 0 : percent >= 100 ? 100 : percent
    },
    handleDragStart(e) {
      this.startTimer()
      window.addEventListener('mousemove', this.handleDrag)
      window.addEventListener('mouseup', this.handleDragEnd)
    },
    handleDragEnd() {
      window.removeEventListener('mousemove', this.handleDrag)
      window.removeEventListener('mouseup', this.handleDragEnd)
      this.resolvePosition()
      clearInterval(this.$options.interval)

      if (this.pressed < 30) {
        this.toggle(!this.value)
      }
      this.pressed = 0
    },
    startTimer() {
      this.$options.interval = setInterval(() => {
        this.pressed++
      }, 1)
    },
    resolvePosition() {
      this.sliderPosition = this.value ? 100 : 0
    }
  }
}
</script>

<style lang="scss" scoped>
$background: #fff;
$background-active: #fff;
$border-color: $secondary-purple-3;
$button-color: $secondary-purple-4;

$checkbox-checkmark-color: $grayscale-white;
$checkbox-border-color: $grayscale-white;

.toggle-container {
  --width: 360px;
  position: relative;
  height: 50px;
  font-size: 12px;

  // @include respond-to('small') {
  //   --width: 300px;
  //   font-size: 10px;
  // }
}

.text-container {
  position: absolute;
  background: transparent;
  height: 100%;
  align-items: center;
  z-index: 2;
  display: flex;
  pointer-events: none;
  cursor: pointer;

  &__option {
    width: calc(var(--width) / 2);
    text-align: center;
    color: $primary-purple;
    font-family: Bold;
    line-height: 1.17;
    letter-spacing: 1.75px;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0 2rem;
  }
}

.toggle {
  width: var(--width);
  height: 100%;
  background: $background;
  border: 2px solid $secondary-purple-4;
  border-radius: 200px;
  transition: background 0.6s;
  position: relative;
  cursor: pointer;

  .draggable {
    width: calc(var(--width) / 2);
    height: 100%;
    background: $button-color;
    border-radius: 200px;
    border: 2px solid $primary-purple;
    transform: translateX(0%);
    transition: transform 0.5s ease-in-out;
    cursor: pointer;
  }

  &.active {
    background: $background-active;
    transition: background 0.6s;
  }
}
</style>
