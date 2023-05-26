<template>
  <div class="bln-checkbox-container" @click="toggleCheck">
    <div class="bln-checkbox" role="checkbox" :style="`border-color: ${colorComputed}`" >
      <div class="bln-check" >
        <svg width="16px" v-show="checked" height="11px" viewBox="0 0 16 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="D-BlendJet-Cart" transform="translate(-371.000000, -718.000000)" :fill="colorComputed">
              <g id="Upsell" transform="translate(257.000000, 0.000000)">
                <g id="JetPack" transform="translate(37.000000, 81.000000)">
                  <g id="Checkbox" transform="translate(75.000000, 633.000000)">
                    <g id="Right" transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)">
                      <polygon id="BG" transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) " points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"></polygon>
                      <polygon id="BG-Copy-2" transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) " points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"></polygon>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <div class="bln-checkbox-label" :style="`color: ${colorComputed}`">
      {{label}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialCheck: {
      type: Boolean, 
      default: false
    },
    label: {
      type: String,
      default: ''
    }, 
    color: {
      type: String,
      default: 'purple'
    }
  },
  computed: {
    colorComputed() {
      if(this.color.toLowerCase() === 'white') {
        return '#FFFFFF'
      } else if (this.color.toLowerCase() === 'purple') {
        return '#373975'
      } else {
        return this.color;
      }
    }
  },
  data() {
    return {
      checked: false
    }
  },

  methods: {
    toggleCheck() {
      this.checked = !this.checked;
      this.$emit('checked', this.checked)
    }
  },
  created() {
    if(this.initialCheck) this.checked = true;
    this.$emit('checked', this.checked)
  }
}
</script>

<style lang="scss" scoped>
  .bln-checkbox-container {
    display: flex;
    align-items: center;
    height: 20px;
    cursor: pointer;
  }

  .bln-checkbox {
    border-width: 1px;
    border-style: solid;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 20px;
    border-radius: 4px;
  }

  .bln-checkbox-label {
    font-family: Regular;
    font-size: $text-small;
    line-height: 1.17;
    letter-spacing: 0.5px;
    text-align: center;
    margin-left: 10px;
  }
</style>