<template>
  <div class="cart-icon" @click="toggleCart">
    <svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Cart</title>
      <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="D_Nav-White-Sticky" transform="translate(-1364.000000, -22.000000)">
          <g id="Cart" transform="translate(1365.000000, 23.000000)">
            <circle id="Oval" :stroke="navColor" stroke-width="1.5" cx="12" cy="12" r="12"></circle>
            <text id="2" font-family="Helvetica" font-size="12" font-weight="normal" line-spacing="14" letter-spacing="1.5" :fill="navColor">
              <tspan :x="quantityTotal >= 10 ? '4.5' : '8.91308594'" y="16" class="inner-cart-count">{{quantityTotal}}</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {

  data() {
    return {
      countShift: '8.91308594'
    }
  },
  computed: {
    ...mapGetters('cart', ['quantityTotal'])
  },
  methods: {
    ...mapMutations('cart', ['toggleCart'])
  },
  props: {
    navColor: {
      type: String,
      default: 'black'
    }
  }
}
</script>

<style lang="scss" scoped>


.cart-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    @include hover-transition;
  }
}

.main-nav-cart {
  position: relative;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  border-radius: 24px;
  height: 27px;
  width: 27px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2px;

}

.main-nav-cart.nacelle:hover,
.main-nav-cart.nacelle:focus {
  opacity: 0.8;
}

.main-nav-cart.nacelle .cart-count {
  color: #fff;
  font-weight: 600;
  width: 1.75em;
  height: 1.75em;
  -webkit-transform: translate3d(2px, -4px, 0);
  transform: translate3d(2px, -4px, 0);
}

.cart-count {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5;
  background-color: #ffffff;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.oval {
  width: 24px;
  height: 24px;
  border-radius: 24px;
  color: $primary-purple;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
