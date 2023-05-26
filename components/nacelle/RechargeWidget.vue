<template>
  <div class="recharge-widget nacelle">
    <div class="is-mobile">
      <div class="recharge">
        <radio-component
          v-model="purchaseType"
          name="purchaseType"
          value="onetime"
          :class="[{ selected: purchaseType === 'onetime'}]"
          class="recharge-radio"
        >
          One-Time Purchase
        </radio-component>
        <radio-component
          v-model="purchaseType"
          name="purchaseType"
          value="subscription"
          checked
          :class="[{ selected: purchaseType === 'subscription'}]"
          class="recharge-radio"
        >
          Subscribe
          <span v-if="subscribeAndSave">
            & SAVE ({{ discountPercentage }}%): {{ discountPrice | currency({
              symbol: '$',
              thousandsSeparator: ',',
              fractionCount: 2,
              fractionSeparator: '.',
              symbolPosition: 'front',
              symbolSpacing: false
            }) }}
          </span>
          <div v-if="!hideDropdown">
            <label class="recharge-label">
              Deliver Every:
            </label>
            <div class="select">
              <select
                @change="onFrequencyChange($event)"
              >
                <option
                  v-for="freq in frequencies"
                  :key="freq"
                  :value="freq"
                >
                  {{ freq }} {{ frequencyUnit }}
                </option>
              </select>
            </div>
          </div>
        </radio-component>
      </div>
    </div>
  </div>
</template>

<script>
import rechargeProperties from './rechargeMixin'
import productMetafields from './productMetafields'
import Radio from './Radio'

export default {
  components: {
    'radio-component': Radio
  },
  mixins: [rechargeProperties, productMetafields],
  props: {
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
    }
  },
  computed: {
    hideDropdown () {
      return this.purchaseType === 'onetime' || (this.frequencies && this.frequencies.length === 1)
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .recharge {
    border: 1px solid #f3f3f3;
    border-radius: 4px;
  }
  .recharge-label {
    display: block;
    margin: 5px 0;
    font-weight: bold;
  }
  .recharge-radio {
    padding: 10px;
    cursor: pointer;

    &:not(.selected) {
      background: #f3f3f3;

      &:hover {
        background: #e9e9e9;
      }
    }
  }
</style>
