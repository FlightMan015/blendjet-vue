import Vue from 'vue'
import VModal from 'vue-js-modal/dist/ssr.nocss'

import 'vue-js-modal/dist/styles.css'

Vue.use(VModal, { 
  dynamicDefaults: {
    adaptive: true,
    width: '60%',
    height: 'auto',
    transition: 'modal',
    scrollable: true,
    focusTrap: true
    // borderRadius: '15px'

  }
})

/*
export default function(_, inject) {
  inject('modal', VModal)
}
*/