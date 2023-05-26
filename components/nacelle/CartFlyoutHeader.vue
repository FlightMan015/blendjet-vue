<template>
  <div class="flyout-cart-header nacelle">
    <div class="flyout-cart-header-title">
      Your Cart
    </div>
    <div class="close" >
      <Close @click.native="close" />
    </div>
    <hr class="item-divider" />
    <!-- <slot
      name="title"
      :title="title"
    >
      <component
        :is="titleTag"
        class="flyout-cart-hearder-title"
      >
        {{ title }}
      </component>
    </slot>
    <slot name="close-button">
      <interface-close-button
        class="close"
        @close="close"
      />
    </slot> -->
    <!-- <hr class="item-divider" /> -->
  </div>
</template>

<script>
import InterfaceCloseButton from '~/components/nacelle/InterfaceCloseButton'
import Close from '~/components/svg/modalClose'

export default {
  components: {
    InterfaceCloseButton,
    Close
  },
  props: {
    // title: {
    //   type: String,
    //   default: 'Your Cart'
    // },
    // titleTag: {
    //   type: String,
    //   default: 'h3'
    // }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.flyout-cart-header {
  position: relative;
  margin: 20px 20px 0 20px;
}

.close {
  position: absolute;
  top: -12px;
  right: 0;
  cursor: pointer;
}

.item-divider {
  background-color: #343a40;
  width: 100%;
  display: block;
  height: 1px;
  // margin: 10px 0;
  opacity: 0.5;
}

.flyout-cart-header-title {
  // text-transform: uppercase;
  // font-size: 16pt;
  // font-weight: 700;
  // text-align: left;
  // margin: 1.5rem;
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-align: left;
  // margin: 20px 20px 0 20px;
  color: $primary-purple;
}
</style>
