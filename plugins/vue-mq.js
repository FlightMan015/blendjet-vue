import Vue from 'vue'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: {
    sm: 767,
    md: 1024,
    lg: Infinity
  },
  defaultBreakpoint: 'md'
})
