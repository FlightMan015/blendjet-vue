<template>
  <!-- <?xml version="1.0" encoding="UTF-8"?> -->
  <div class="close-container" @click="onClick">
    <svg  width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="D-BlendJet-PDP-BlendJet-More-Options" transform="translate(-894.000000, -318.000000)" :fill="computedColor" :stroke="computedColor">
                <g id="x" transform="translate(895.000000, 319.000000)">
                    <path d="M11.52,3.16191517e-13 L12,0.48 L6.479,6 L12,11.52 L11.52,12 L5.999,6.48 L0.48,12 L-5.45410939e-13,11.52 L5.52,6 L-3.28403971e-13,0.48 L0.48,7.46472328e-13 L5.999,5.52 L11.52,3.16191517e-13 Z" id="Ham___Mobile_2"></path>
                </g>
            </g>
        </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Close',
  props: {
    color: {
      type: String,
      default: 'purple'
    },
    onClick: {
      type: Function,
      default: f => f
    }
  },
  computed: {
    computedColor() {
      return this.color === 'white' ? '#FFFFFF' : '#373795'
    }
  }
}
</script>

<style lang="scss" scoped>
  .close-container {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    cursor: pointer;
  }
</style>
