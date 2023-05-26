<template>
  <div class="variant-select nacelle">
    <product-options
      v-show="showProductOptions"
      :options="allOptions"
      :variant="selectedVariant"
      @selectedOptionsSet="setSelected"
      :variants="product.variants"
      @clear="selectedOptions = []"
      :currentOption="selectedVariant.selectedOptions[0].value"
    />
    <slot name="above-button"></slot>
    <div class="add-to-cart-buttons">
      <div v-if="displayQuantitySelect" class="quantity-select-container">
        <quantity-selector :quantity.sync="quantity" />
      </div>
      <div class="add-to-cart">
        <product-add-to-cart-button
          :quantity="quantity"
          :product="product"
          :variant="selectedVariant"
          :allOptionsSelected="allOptionsSelected"
          :onlyOneOption="true"
          @addedToCart="quantity = 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductOptions from '~/components/nacelle/ProductOptions'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'

export default {
  props: {
    product: {
      type: Object
    },
    variant: {
      type: Object
    },
    showQuantitySelect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      quantity: 1
    }
  },
  mixins: [allOptionsSelected, availableOptions],
  components: {
    ProductOptions,
    QuantitySelector,
    ProductAddToCartButton
  },
  computed: {
    showProductOptions() {
      return (
        Array.isArray(this.allOptions) &&
        this.allOptions.length >= 1 &&
        this.allOptions[0].values.length > 1 &&
        this.product.availableForSale
      )
    },
    displayQuantitySelect() {
      return (
        this.allOptionsSelected &&
        this.selectedVariant &&
        this.selectedVariant.availableForSale &&
        this.showQuantitySelect
      )
    }
  },
  methods: {
   
  },
  watch: {
    selectedVariant() {
      this.$emit('variantSelected', this.selectedVariant)
    }
  }
}
</script>

<style>
.add-to-cart-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-select-container {
  margin-right: 1rem;
}

.add-to-cart {
  margin-left: 0.75rem;
}

</style>
