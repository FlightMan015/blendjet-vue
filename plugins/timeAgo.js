import Vue from 'vue'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en',
  converter(date, locale, { includeSeconds, addSuffix = true }) {
    const distanceInWordsStrict = require('date-fns/distance_in_words_strict')
    return distanceInWordsStrict(Date.now(), date, { locale, addSuffix, includeSeconds });
  }
})
