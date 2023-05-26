<template>
  <div class="swatches columns is-marginless is-multiline nacelle">
    <product-option-swatch
      @swatchValue="setOptionValue"
      v-for="value in option.values"
      :value="value.value"
      :swatchSrc="value.swatchSrc"
      :key="value.value"
      :optionName="option.name"
      :swatchStyle="swatchStyle"
      :class="{ selected: value.value == currentOption }"
      :variants="variants"
      :selectedOptions="selectedOptions"
    />
  </div>
</template>

<script>
import ProductOptionSwatch from '~/components/nacelle/ProductOptionSwatch'
export default {
  props: {
    option: {
      type: Object
    },
    variants: {
      type: Array
    },
    selectedOptions: {
      type: Array
    },
    clearOptionValue: {
      type: Boolean
    },
    updatedOptionValue: {
      type: String,
      default: ''
    },
    currentOption: {
      type: String,
      default: ''
    }
  },
  components: {
    ProductOptionSwatch
  },
  data() {
    return {
      selectedOptionValue: null
    }
  },
  computed: {
    swatchStyle() {
      switch (this.option.name) {
        case 'Color':
          return 'bubble'
        default:
          return 'tab'
      }
    }
  },

  watch: {
    selectedOptionValue(newVal) {
      if (newVal != null) {
        this.$emit('optionSet', { name: this.option.name, value: newVal })
      }
    },
    clearOptionValue(newVal) {
      if (newVal == true) {
        this.selectedOptionValue = null
        this.$emit('clearedOptionValue')
      }
    },
    updatedOptionValue(newVal) {
      this.setOptionValue(newVal)
    },
    currentOption(newVal) {
      this.setOptionValue(newVal)
    }
  },
  methods: {
    setOptionValue(value) {
      this.selectedOptionValue = value
    }
  }
  // mounted() {
  //   this.setOptionValue(this.currentOption)
  // }
}
</script>

<style lang="scss" scoped>
.option {
  margin-bottom: 1rem;
}
.swatches {
  display: flex;
  flex-flow: row wrap;
  // justify-content: center;
  width: 400px;
}
</style>
