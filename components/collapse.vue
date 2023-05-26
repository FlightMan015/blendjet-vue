<template>
  <div class="collapse-panel" :style="styleObj.collapsePanel ? styleObj.collapsePanel : null">
    <div @click="toggleOpen" class="heading-panel">

      <slot name="collapsed"></slot>
        <div class="plus" v-if="!isOpen">
          <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>+</title>
              <g id="User-Guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="M-BlendJet-UserGuide-2-BlendJet-GLow" transform="translate(-360.000000, -3708.000000)" fill="#373795">
                      <g id="A-Mode" transform="translate(20.000000, 2999.000000)">
                          <g id="Pulse-Mode-" transform="translate(0.000000, 690.000000)">
                              <g id="+" transform="translate(340.000000, 19.000000)">
                                  <rect id="Rectangle" x="6" y="0" width="2" height="14"></rect>
                                  <rect id="Rectangle-Copy-2" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000) " x="6" y="0" width="2" height="14"></rect>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
        <div class="minus" v-if="isOpen">
          <svg width="10px" height="14px" viewBox="0 0 10 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>BG Copy</title>
              <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="D-BlendJet-Cart" transform="translate(-1191.000000, -138.000000)" fill="#373795">
                      <g id="Cart" transform="translate(1046.000000, 0.000000)">
                          <g id="Products" transform="translate(17.000000, 54.000000)">
                              <g id="BlendJet" transform="translate(22.000000, 19.000000)">
                                  <g id="Qty" transform="translate(96.000000, 54.000000)">
                                      <rect id="BG-Copy" x="10" y="11" width="10" height="2"></rect>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
    </div>
      <div v-show="isOpen" class="expand-panel" :style="styleObj.expandPanel ? styleObj.expandPanel : null">
        <slot name="expanded"></slot>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    styleObj: {
      type: Object,
      default: () => {
        return {
          collapsePanel: {},
          exxpandPanel: {}
        }
      }
    }
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
  }
}
</script>

<style lang="scss" scoped>
.collapse-panel {
  background-color: $primary-purple-tint;
  border-radius: 12px;
  width: 100%;
  transition: 0.6s ease-in-out;
  color: $primary-purple;
  height: auto;
  cursor: pointer;
}


.heading-panel {
  height: 54px;
  display: flex;
  align-items: center;
  padding-left: 25px;
  position: relative;
}

.plus {
  position: absolute;
  right: 16px;
}

.minus {
  position: absolute;
  right: 16px;
}

.expand-panel {
  padding: 0 25px 25px 25px;
}

.expanded-content-wrapper {
  height: 0;
  overflow: hidden;
  transition: 0.6s;
}

.fade-enter-active {
  animation: fadeIn;  
  animation-duration: 0.6s;

}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.1s;
}

</style>