export default {
  props: {
    frequency: {
      type: String,
      default: undefined
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      purchaseType: 'subscription',
      selectedFrequency: undefined,
      subscriptionProperties: [
        'charge_interval_frequency', // liquid: charge_interval_frequency
        'order_interval_frequency', // liquid: shipping_interval_frequency
        'order_interval_unit', // liquid: shipping_interval_unit_type
        'cutoff_day_of_month',
        'cutoff_day_of_week',
        'expire_after_specific_number_of_charges', // liquid: number_charges_until_expiration
        'order_day_of_month', // liquid: charge_on_day_of_month
        'order_day_of_week' // liquid: charge_on_day_of_week
      ]
    }
  },
  computed: {
    hasSubscription() {
      return !!this.metafieldsObj?.subscriptions
    },
    frequencies() {
      return this.metafieldsObj.subscriptions?.shipping_interval_frequency.split(',') ?? []
    },
    frequencyUnit() {
      return this.metafieldsObj.subscriptions?.shipping_interval_unit_type ?? ''
    },
    discountVariantMap() {
      return JSON.parse(this.metafieldsObj.subscriptions?.original_to_hidden_variant_map)
    },
    discountPercentage() {
      return Number(this.metafieldsObj.subscriptions?.discount_percentage)
    },
    discountPrice() {
      const price = this.product.priceRange.max
      return price - price * (this.discountPercentage / 100)
    },
    subscribeAndSave() {
      return this.discountPercentage > 0
    },
    rechargeMetafields() {
      const frequency = this.frequency || this.frequencies[0]
      const subscriptionMetafields = [
        { key: 'charge_interval_frequency', value: frequency },
        { key: 'order_interval_frequency', value: frequency },
        {
          key: 'order_interval_unit',
          value: this.frequencyUnit.toLowerCase().replace('s', '')
        }
      ]
      return this.purchaseType === 'subscription' ? subscriptionMetafields : []
    }
  },
  methods: {
    dynamicConditional(prop, testValue) {
      switch (prop) {
        case 'frequency':
          return ['charge_interval_frequency', 'order_interval_frequency'].includes(testValue)
        default:
          return testValue === prop
      }
    },
    onMetafieldsChange(prop, value) {
      const updatedMetafields = []
      this.metafields.forEach(metafield => {
        if (this.dynamicConditional(prop, metafield.key)) {
          // update subscriiption metafield
          updatedMetafields.push({ key: metafield.key, value })
        } else {
          // return unchanged metafield
          updatedMetafields.push(metafield)
        }
      })
      this.$emit('update:metafields', updatedMetafields)
    },
    onFrequencyChange(event) {
      this.$emit('update:frequency', event.target.value)
      this.onMetafieldsChange('frequency', event.target.value)
    },
    toggleSubscriptionMetafields(value) {
      let updatedMetafields
      if (value === 'onetime') {
        updatedMetafields = this.metafields.filter(metafield => {
          return !this.subscriptionProperties.includes(metafield.key)
        })
      } else {
        updatedMetafields = this.metafields.concat(this.rechargeMetafields)
      }
      this.$emit('update:metafields', updatedMetafields)
    }
  },
  created() {
    this.toggleSubscriptionMetafields(this.purchaseType)
  },
  watch: {
    purchaseType(value) {
      this.toggleSubscriptionMetafields(value)
    }
  }
}
