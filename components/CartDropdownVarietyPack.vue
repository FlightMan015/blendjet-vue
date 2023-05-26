<template>
  <div class="dropdown-container">
    <div class="mobile-select-container">
      <div class="select-cover">
        <span class="option-label" style="margin-right:7px">{{ label }}:</span>
        <span class="select-cover__selected">{{ formatTitle(items[currentOption].title) }}</span>
        <CaretDown :styleObj="{ marginLeft: '16px', marginBottom: '3px' }" :color="'#FFF'" />
      </div>
      <select class="mobile-select" @change="updateSelect(selectModel)" v-model="selectModel">
        <option v-for="(item, i) in items" :key="i" :value="i">{{
          formatTitle(item.title)
        }}</option>
      </select>
    </div>
    <!-- <div
      class="dropdown-cart"
      tabindex="0"
      @focusout="visible = false"
      role="menu"
      v-if="!isMobile"
    >
      <transition name="fade">
        <ul :is="type.main" v-if="visible" class="dropdown-content-cart">
          <li :is="type.item" class="cart-title">{{ label }}</li>
          <li :is="type.item" v-for="(item, i) in items" :key="i" @click.prevent="updateSelect(i)">
            <span class="check-selected-container">
              <span class="check-selected" v-if="items[currentOption].title === item.title">
                <svg
                  width="16px"
                  height="11px"
                  viewBox="0 0 16 11"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                      id="D-BlendJet-PDP-BlendJet"
                      transform="translate(-1083.000000, -6832.000000)"
                      fill="#373795"
                    >
                      <g id="Smoothies" transform="translate(0.000000, 6247.000000)">
                        <g id="3" transform="translate(1028.000000, 78.000000)">
                          <g id="Checkbox" transform="translate(53.000000, 503.000000)">
                            <g
                              id="Right"
                              transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)"
                            >
                              <polygon
                                id="BG"
                                transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) "
                                points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"
                              ></polygon>
                              <polygon
                                id="BG-Copy-2"
                                transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) "
                                points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"
                              ></polygon>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </span>
            <span class="options-cart">{{ formatTitle(item.title) }}</span>
          </li>
          <li :is="type.item" class="selected-option">
            <div class="swatch-container"></div>
            <div class="options-cart">{{ formatTitle(items[currentOption].title) }}</div>
            <div class="caret-container"><CaretDown :styleObj="{ marginRight: '30px' }" /></div>
          </li>
        </ul>
      </transition>

      <div class="dropbtn" role="button" @click.prevent="toggleVisible" v-show="!visible">
        <span class="option-label" style="margin-right:7px">{{ label }}:</span>
        <span class="selected-option">{{ formatTitle(items[currentOption].title) }}</span>
        <CaretDown :styleObj="{ marginLeft: '16px' }" :color="'#FFF'" />
      </div>
    </div> -->
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
    currentOption: {
      type: Number,
      default: 0
    },

    label: {
      type: String,
      default: ''
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
      selectModel: '',
      selectVisible: false
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
    toggleSelectVisible() {
      this.selectVisible = !this.selectVisible
    },
    formatTitle(title) {
      return title.split('-')[0].trim()
    },
    updateSelect(item) {
      this.$emit('update', item)
      this.visible = false
    },
    formatSwatchName(value) {
      const color = String(value)
        .replace(/\s+/g, '-')
        .toLowerCase()
      return `swatch-color__${color}`
    }
  },
  mounted() {
    this.selectModel = this.currentOption
    if (window.innerWidth < 768) {
      this.visible = true
      this.isMobile = true
    }
  }
}
</script>

<style lang="scss" scoped>
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
  width: 320px;
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
  width: 287px;
  min-width: 160px;
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
  position: relative;
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
  cursor: pointer;
  width: 100%;
  option {
    margin-left: 5px;
  }
}

.check-selected-container {
  width: 46px;
}

.check-selected {
  margin-left: 15px;
}

.swatch-container {
  width: 46px;
}

.caret-container {
  transform: rotate(180deg);
  position: absolute;
  right: 20px;
}

.banana-blueberry {
  border-color: #f6f3bb;
  background-color: #1e354d;
}

.options-cart {
  color: $primary-purple;
  text-align: left;
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
  color: $grayscale-white;
}

.selected-option {
  color: $grayscale-white;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  text-align: center;
}

.cart-jp-swatch {
  border: 2px solid;
  border-radius: 50%;
  height: 23px;
  width: 23px;
  margin-left: 10px;
}

.swatch {
  height: 17px;
  width: 17px;
  margin-left: 15px;
  margin-right: 12px;
  margin-bottom: 2px;
  border-radius: 50%;
}

.swatch-color {
  &__black {
    background-color: black;
  }

  &__ocean {
    background-color: #49a9e3;
  }

  &__blue {
    background-color: #49a9e3;
  }

  &__purple {
    background-color: #c345b3;
  }

  &__mint {
    background-color: #56bab2;
  }

  &__green {
    background-color: #9bcf02;
  }

  &__pink {
    background-color: #e57e85;
  }

  &__white {
    background-color: #fff;
  }

  &__lavender {
    background-color: #f9cedf;
  }

  &__lemon {
    background-color: #fff467;
  }

  &__red {
    background-color: #c5343b;
  }

  &__coral {
    background-color: #fa6d6e;
  }

  &__hot-pink {
    background-color: #de438d;
  }

  &__blush {
    background-color: #e57e85;
  }
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
