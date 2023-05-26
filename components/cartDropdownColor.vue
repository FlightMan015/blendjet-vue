<template>
  <div class="cart-dropdown-color">
    <div class="dropdown" tabindex="0" role="button" @focusout="showVariantSelector = false">
      <div class="dropbtn" @click="toggleVisible">
        <span class="option-label" style="margin-right:7px">{{ label }}:</span>
        <div class="dropbtn__swatch">
          <product-option-swatch
            :value="product.selectedOptions[0].value"
            :style="{}"
            :optionName="'Color'"
            :swatchStyle="'bubble'"
            :class="{ selected: false }"
            :variants="items"
            :selectedOptions="product.selectedOptions"
          />
        </div>
        <div class="dropbtn__text">
          <div class="dropbtn__text__color">
            {{ product.title.replace('Lisa Frank ', '') }}
          </div>
        </div>
        <div class="dropbtn__caret-down">
          <CaretDown color="white" />
        </div>
      </div>
      <transition name="fade">
        <div v-if="showVariantSelector" class="dropdown-content">
          <div class="dropdown-content__swatches">
            <product-options
              :options="options"
              :variant="product"
              @selectedOption="updateSelectedVariant"
              :variants="items"
              @clear="selectedOptions = []"
              :currentOption="product.selectedOptions[0].value"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import CaretDown from '~/components/svg/caretDown'
import ProductOptions from '~/components/nacelle/ProductOptions'
import ProductOptionSwatch from '~/components/nacelle/ProductOptionSwatch'

export default {
  components: {
    ProductOptions,
    ProductOptionSwatch,
    CaretDown
  },
  props: {
    items: {
      type: Array,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    product: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showVariantSelector: false
    }
  },
  methods: {
    toggleVisible() {
      this.showVariantSelector = !this.showVariantSelector
      this.$nextTick(() => {
        const media = document.querySelector('.cart-dropdown-color .dropdown-content__swatches')
        const mediaOffset = media?.getBoundingClientRect()?.bottom || 0
        const scrollContainer = document.querySelector('.cart-upsells__products')
        const scrollContainerOffset = scrollContainer?.getBoundingClientRect()?.bottom || 0
        if (mediaOffset + 120 > scrollContainerOffset) {
          scrollContainer.scroll({
            top: scrollContainer.scrollTop + (mediaOffset - scrollContainerOffset) + 120,
            behavior: 'smooth'
          })
        }
      })
    },
    updateSelectedVariant(variant) {
      this.toggleVisible()
      this.$emit('update', variant)
    }
  }
}
</script>
<style lang="scss">
.cart-dropdown-color {
  .option-label {
    font-family: Regular;
    font-size: $text-small;
    letter-spacing: 0.5px;
    line-height: 1.17;
    color: $grayscale-white;
  }
  .dropdown {
    display: flex;
    flex-flow: column;
    outline: none !important;
    .dropbtn {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .inside-color {
        width: 16px;
        height: 16px;
      }
      .dropbtn__text {
        text-align: center;
        color: #ffffff;
        border: none;
        box-shadow: none;
        text-transform: uppercase;
        font-family: Bold;
        letter-spacing: 1.75px;
        line-height: 1.17;
        font-size: 12px;
      }
      .dropbtn__caret-down {
        height: 29px;
        margin-left: 16px;
      }
    }
    .dropdown-content {
      left: calc(50% - 180px);
      max-width: 360px;
      position: absolute;
      z-index: 3;
      .dropdown-content__swatches {
        .option {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
