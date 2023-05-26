<template>
  <div class="shipping-container" v-if="!disabled">
    <div v-if="size === 'short'" class="small-size">
      <span v-if="country == 'xxxUS'">Arrives {{ shortDate }}</span>
      <!-- change X to 2 to apply fixed date -->
      <!--       <span v-else>Ships by 6/8</span> -->
      <span v-else>Ships by {{ shortDate }}</span>
    </div>
    <div v-else class="normal-size">
      <div class="normal-size__label">
        <span v-if="country == 'xxxUS'">Want it by Friday, January 22?</span>
        <span v-else>Order now and it ships by</span>
      </div>
      <div class="normal-size__countdown" v-if="size !== 'short'">
        <span v-if="country == 'xxUS'">
          <span v-if="24 - remaining.hours === 0"
            >Order within {{ 60 - remaining.minutes }} minutes</span
          >
          <span v-else-if="24 - remaining.hours === 1"
            >Order within {{ 24 - remaining.hours }} hour {{ 60 - remaining.minutes }} minutes</span
          >
          <span v-else
            >Order within {{ 24 - remaining.hours }} hours
            {{ 60 - remaining.minutes }} minutes</span
          >
        </span>
        <span v-else>
          <!--   <span>Tuesday, June 8th</span> -->
          <span>{{ arrivalDate }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<!-- Order now and it ships within 16 hours 20 minutes -->

<script>
var transitTime = 1 // US ARRIVAL DATE
var cutoffHour = 15 // 3PM cutoff time
var timezoneOffset = new Date().getTimezoneOffset() / 60 - 8 // users offset from PST

export default {
  props: {
    size: {
      type: String,
      default: ''
    },
    product: {
      type: String,
      default: 'blendjet-2'
    },
    country: {
      type: String,
      default: ''
    },
    shippingOffset: {
      type: Number,
      default: null
    },
    shippingDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currTime: +Date.now(),
      remaining: {
        hours: 0,
        minutes: 0
      },
      intervalID: null,
      locale: 'en-US',
      options: {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC'
      },
      disabled: false
    }
  },
  computed: {
    arrivalDate() {
      var now = new Date()
      now.setDate(now.getDate())
      now.setHours(16)
      now.setMinutes(0)
      now.setMilliseconds(0)
      let calculated = this.businessDaysFromDate(now, transitTime)
      if (this.shippingDate && !this.isDateBeforeToday(new Date(this.shippingDate))) {
        calculated = new Date(this.shippingDate)
      } else if (this.shippingOffset) {
        const dateWithOffset = this.businessDaysFromDate(now, transitTime, this.shippingOffset)
        if (!this.isDateBeforeToday(dateWithOffset)) {
          calculated = dateWithOffset
        }
      }
      return calculated.toLocaleString(this.locale, this.options)
    },
    shortDate() {
      var now = new Date()
      now.setDate(now.getDate())
      now.setHours(16)
      now.setMinutes(0)
      now.setMilliseconds(0)

      let calculated = this.businessDaysFromDate(now, transitTime)
      if (this.shippingDate && !this.isDateBeforeToday(new Date(this.shippingDate))) {
        calculated = new Date(this.shippingDate)
      } else if (this.shippingOffset) {
        const dateWithOffset = this.businessDaysFromDate(now, transitTime, this.shippingOffset)
        if (!this.isDateBeforeToday(dateWithOffset)) {
          calculated = dateWithOffset
        }
      }
      return calculated.toLocaleString(this.locale, {
        day: 'numeric',
        month: 'numeric',
        timeZone: 'UTC'
      })
    }
  },

  methods: {
    isDateBeforeToday(date) {
      return new Date(date.toDateString()) < new Date(new Date().toDateString())
    },
    shippingTimer() {
      this.intervalID = setInterval(() => {
        this.shippingCountdown()
      }, 30000)
    },

    businessDaysFromDate(date, businessDays, offset = 0) {
      var counter = 0
      var tmp = new Date(date)
      while (businessDays >= 0) {
        tmp.setTime(date.getTime() + counter * 86400000)
        if (this.isBusinessDay(tmp)) {
          --businessDays
        }
        ++counter
      }
      if (offset) {
        tmp.setDate(tmp.getDate() + offset)
        while (!this.isBusinessDay(tmp)) {
          tmp.setDate(tmp.getDate() + 1)
        }
      }
      return tmp
    },

    isBusinessDay(date) {
      var dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Sunday or Saturday
        return false
      }

      const holidays = [
        '12/31+5', // New Year's Day on a Saturday celebrated on previous Friday
        '1/1', // New Year's Day
        '1/2+1', // New Year's Day on a Sunday celebrated on next Monday
        '1-3/1', // Birthday of Martin Luther King, third Monday in January
        '2-3/1', // Washington's Birthday, third Monday in February
        '5~1/1', // Memorial Day, last Monday in May
        '7/3+5', // Independence Day
        '7/4', // Independence Day
        '7/5+1', // Independence Day
        '9-1/1', // Labor Day, first Monday in September
        '10-2/1', // Columbus Day, second Monday in October
        '11/10+5', // Veterans Day
        '11/11', // Veterans Day
        '11/12+1', // Veterans Day
        '11-4/4', // Thanksgiving Day, fourth Thursday in November
        '12/24+5', // Christmas Day
        '12/25', // Christmas Day
        '12/26+1' // Christmas Day
      ]

      var dayOfMonth = date.getDate()
      var month = date.getMonth() + 1
      var monthDay = month + '/' + dayOfMonth

      if (holidays.indexOf(monthDay) > -1) {
        return false
      }

      var monthDayDay = monthDay + '+' + dayOfWeek
      if (holidays.indexOf(monthDayDay) > -1) {
        return false
      }

      var weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1
      var monthWeekDay = month + '-' + weekOfMonth + '/' + dayOfWeek
      if (holidays.indexOf(monthWeekDay) > -1) {
        return false
      }

      var lastDayOfMonth = new Date(date)
      lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1)
      lastDayOfMonth.setDate(0)
      var negWeekOfMonth = Math.floor((lastDayOfMonth.getDate() - dayOfMonth - 1) / 7) + 1
      var monthNegWeekDay = month + '~' + negWeekOfMonth + '/' + dayOfWeek
      if (holidays.indexOf(monthNegWeekDay) > -1) {
        return false
      }

      return true
    },

    shippingCountdown() {
      var now = new Date()
      const total =
        Date.parse(this.arrivalDate) -
        Date.parse(now) +
        (cutoffHour - timezoneOffset) * 60 * 60 * 1000
      console.log(total)
      let minutes = Math.floor((total / 1000 / 60) % 60)
      let hours = Math.floor((total / (1000 * 60 * 60)) % 24)
      // const days = Math.floor( total/(1000*60*60*24) );

      if (minutes <= 0) {
        minutes = minutes * -1
      }

      if (hours <= 0) {
        hours = hours * -1
      }

      this.remaining = {
        // total,
        // days,
        hours,
        minutes
        // seconds
      }
    }
  },

  async mounted() {
    this.shippingCountdown()
    this.shippingTimer()

    const intl = localStorage.getItem('ww')
    if (intl === 'true') {
      this.disable = true
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalID)
  }
}
</script>

<style lang="scss" scoped>
.normal-size {
  font-family: Bold;
  letter-spacing: 1.75px;
  text-align: center;
  line-height: 1.33;
  font-size: $text-small;
  text-transform: uppercase;

  &__label {
    color: $primary-purple;
  }

  &__countdown {
    color: $secondary-purple-2;
  }
}

.small-size {
  font-family: Bold;
  letter-spacing: 1.75px;
  text-align: center;
  line-height: 1.33;
  font-size: $text-small;
  text-transform: uppercase;
}
</style>
