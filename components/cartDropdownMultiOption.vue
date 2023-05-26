<template>
  <div v-if="options" class="options nacelle">
    <div class="option">
      <ProductOptionsDropdown
        :variants="variants"
        :currentOption="getOptionFromVariant(options[0])"
        @optionSet="setSelectedOptions"
        @updateOptions="updateAvailableOptions"
        :option="options[0]"
        :selectedOptions="selectedOptions"
        :clearOptionValue="clearOptionValue"
        :upsellStyle="true"
        selectType="native"
      />
    </div>
    <div class="option">
      <ProductOptionsDropdown
        :variants="variants"
        :currentOption="getOptionFromVariant(availableOptions)"
        @optionSet="setSelectedOptions"
        :option="availableOptions"
        :selectedOptions="selectedOptions"
        :clearOptionValue="clearOptionValue"
        :upsellStyle="true"
        selectType="native"
      />
    </div>
  </div>
</template>

<script>
import ProductOptionsDropdown from '~/components/ProductOptionsDropdown'

export default {
  props: {
    options: {
      type: Array
    },
    variants: {
      type: Array
    },
    variant: {
      type: Object
    },
    currentOption: {
      type: Object,
      default: () => {}
    },
    update: {
      type: Function,
      default: () => f => f
    }
  },
  data() {
    return {
      selectedOptions: [],
      clearOptionValue: false,
      availableOptions: this.options[1]
    }
  },
  components: {
    ProductOptionsDropdown
  },
  mounted() {
    this.setSelectedOptions({ name: this.options[0].name, value: this.options[0].values[0].value })
    this.setSelectedOptions({ name: this.options[1].name, value: this.options[1].values[0].value })
  },
  watch: {
    clearOptionValue(val) {
      if (val === true) {
        setTimeout(() => {
          this.clearOptionValue = false
          this.$emit('clear')
        }, 100)
      }
    }
  },
  methods: {
    // An array of the options selected by the user.
    setSelectedOptions(selectedOption) {
      const vm = this
      const searchOptions = this.selectedOptions.filter(option => {
        return option.name === selectedOption.name
      })

      if (searchOptions.length === 0) {
        vm.selectedOptions.push(selectedOption)
      } else {
        const index = vm.selectedOptions.findIndex(option => {
          return option.name === selectedOption.name
        })

        vm.selectedOptions.splice(index, 1, selectedOption)
      }
      this.update(vm.selectedOptions)
    },
    // Gets the selected option using the selectedOptions of the current variant
    getOptionFromVariant(option) {
      if (this.variant.selectedOptions && option) {
        const currentOption = this.variant.selectedOptions.filter(opt => {
          if (opt.name === option.name) {
            return opt
          }
        })
        if (currentOption) {
          if (option.name === 'Flavor') {
            const optionValue = option.values.filter(opt => {
              if (opt.value === currentOption[0].value) {
                return opt
              }
            })
            return optionValue[0]
          } else if (option.name === 'Size') {
            return currentOption[0]
          }
        }
      }
    },
    // Updates the options available depending the first option selected
    updateAvailableOptions(options) {
      this.availableOptions = options
    },
    confirmSelection() {
      this.$emit('confirmedSelection')
    }
  }
}
</script>

<style lang="scss" scoped>
.option {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
}

.swatches {
  display: flex;
  justify-content: center;
}

.reset-options {
  margin-bottom: 2rem;
}

.option-label {
  font-weight: 600;
  text-transform: uppercase;
}

.selected {
  background: red;
}
</style>
