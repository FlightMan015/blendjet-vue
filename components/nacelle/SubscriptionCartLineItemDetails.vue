<template>
  <div v-if="isSubscription" class="subscription-details">
    <slot :subscription="subscription" />
  </div>
</template>

<script>
export default {
  props: {
    lineItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
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
    subscription () {
      const props = {}
      this.lineItem.metafields.forEach(meta => {
        if (this.subscriptionProperties.includes(meta.key)) {
          // frequency helper
          if (meta.key === 'charge_interval_frequency') {
            props.frequency = meta.value
          }
          // unit helper
          if (meta.key === 'order_interval_unit') {
            props.unit = meta.value
          }
          props[meta.key] = meta.value
        }
      })
      // pluralize unit
      props.unit = this.pluralize(props.unit, props.frequency)
      return props
    },
    isSubscription () {
      return !!this.subscription.charge_interval_frequency
    }
  },
  methods: {
    pluralize (unit, count) {
      return Number(count) > 1 ? unit + 's' : unit
    }
  }
}
</script>

<style lang="scss" scoped>
  .subscription-details {
    margin-bottom: 15px;
    font-size: 0.8rem;
  }
</style>
