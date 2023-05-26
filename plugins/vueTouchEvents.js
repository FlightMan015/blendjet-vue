import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents, {
  disableClick: true,
  touchClass: '',
  tapTolerance: 5,
  touchHoldTolerance: 40,
  swipeTolerance: 40,
  longTapTimeInterval: 400,
  namespace: 'touch'
})
