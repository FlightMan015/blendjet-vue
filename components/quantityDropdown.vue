<template>
  <div class="quantity-container">
    <div class="quantity-label">{{ label }}:</div>
    <div class="mobile-select-container">
      <div class="select-cover" role="button">
        <span class="select-cover__selected">{{ quantity }}</span>
        <CaretDown :styleObj="{ marginLeft: '16px', marginBottom: '3px' }" :color="'#FFF'" />
      </div>
      <select
        class="mobile-select"
        @change="updateQuantity(selectQuantity)"
        v-model="selectQuantity"
      >
        <option v-for="(item, i) in items" :key="i" :value="item">{{ item }}</option>
      </select>
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
      default: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    label: {
      type: String,
      default: 'Quantity'
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  components: {
    CaretDown
  },
  mixins: [imageOptimize],
  data() {
    return {
      visible: false,
      type: {
        main: 'ul',
        item: 'li'
      },
      isMobile: false,
      selectQuantity: 0
    }
  },
  watch: {
    quantity(newVal) {
      if (newVal !== this.selectQuantity) {
        this.selectQuantity = newVal
      }
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
    updateQuantity(item) {
      console.log('quantity', item)
      this.$emit('update:quantity', item)
      this.visible = false
    }
  },
  mounted() {
    this.selectQuantity = this.quantity
    if (window.innerWidth < 768) {
      this.isMobile = true
    }
  }
}
</script>

<style lang="scss" scoped>
.quantity-container {
  display: flex;
  align-items: center;
  position: relative;
}

.dropbtn {
  color: $primary-purple;
  outline: none;
  display: flex;
  align-items: center;
}

.dropdown-cart {
  position: relative;
  color: $grayscale-white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  align-items: center;
  font-family: Bold;
  letter-spacing: 1.75px;
  line-height: 1.17;
  font-size: $text-small;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

.dropdown-content-cart {
  background-color: $primary-purple-tint;
  border-radius: 12px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  border: 2px solid $primary-purple;
  font-family: Bold;
  font-size: 14px;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  z-index: 3;
  position: absolute;
  bottom: -10px;

  & > li {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:last-child {
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
}

.mobile-select-container {
  display: flex;
  align-items: center;
}

.select-cover {
  pointer-events: none;
  display: flex;
  align-items: center;

  &__selected {
    text-align: center;
    color: $grayscale-white;
    border: none;
    box-shadow: none;
    text-transform: uppercase;
    font-family: Bold;
    letter-spacing: 1.75px;
    line-height: 1.17;
    font-size: $text-small;
  }
}

.mobile-select {
  opacity: 0;
  top: 0;
  right: 0;
  position: absolute;
  font-size: 16px;
  left: 0;
  cursor: pointer;
  width: 100%;
  text-align: center;
  option {
    text-align: center;
  }
}

.check-selected-container {
  width: 40px;
}

.check-selected {
  margin-left: 10px;
}

.swatch-container {
  width: 40px;
}

.caret-container {
  transform: rotate(180deg);
}

.options-cart {
  color: $primary-purple;
  &:hover {
    @include hover-transition;
  }
}

.cart-title {
  margin-left: 17px;
  color: $grayscale-gray;
  text-transform: uppercase;
}

.option-label {
  font-family: Regular;
  font-size: $text-small;
  letter-spacing: 0.5px;
  line-height: 1.17;
  margin-right: 14px;
  color: $grayscale-white;
}

.selected-option {
  color: $grayscale-white;
  text-transform: uppercase;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
.quantity-label {
  font-size: 12px;
  letter-spacing: 0.5px;
  line-height: 1.17;
  margin-right: 14px;
  color: #fff;
}
</style>
