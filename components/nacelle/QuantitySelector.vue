<template>
  <div class="quantity-select" :style="styleObj">
    <div
      class="decrement switch"
      @mousedown="start(decrement)"
      @touchstart.prevent="start(decrement)"
      @touchend.prevent="stop"
    >
      <div class="decrement-svg">
        <svg
          width="10px"
          height="10px"
          viewBox="0 0 10 2"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
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
    <input
      :value="quantity"
      @input="update(Number($event.target.value))"
      class="quantity-input"
      type="text"
    />
    <div
      class="increment switch"
      @mousedown="start(increment)"
      @touchstart.prevent="start(increment)"
      @touchend.prevent="stop"
    >
      <div class="increment-svg">
        <svg
          width="10px"
          height="11px"
          viewBox="0 0 10 11"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <title>Combined Shape</title>
          <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="D-BlendJet-Cart" transform="translate(-1253.000000, -272.000000)" fill="#373795">
              <g id="Cart" transform="translate(1046.000000, 0.000000)">
                <g id="Products" transform="translate(17.000000, 54.000000)">
                  <g id="1" transform="translate(0.000000, 145.000000)">
                    <g id="Qty" transform="translate(118.000000, 67.000000)">
                      <path
                        d="M78,6.5 L78,10.5 L82,10.5 L82,12.5 L78,12.5 L78,16.5 L76,16.5 L76,12.5 L72,12.5 L72,10.5 L76,10.5 L76,6.5 L78,6.5 Z"
                        id="Combined-Shape"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
const timeInterval = 100

export default {
  props: {
    item: {
      type: Object
    },
    quantity: {
      type: Number,
      default: 1,
      required: true
    },
    styleObj: {
      type: Object,
      default: () => {}
    },
    isCheckout: {
      type: Boolean,
      default: false
    }
  },

  data: () => {
    return {
      interval: null,
      startTime: null,
      handler: Function
    }
  },
  methods: {
    ...mapActions('cart', ['incrementLineItem', 'decrementLineItem']),

    /**
     *  Allows us to await a setTimeout by return a Promise
     * @param milliseconds - ms argument for setTimeout
     */
    wait(milliseconds) {
      return new Promise((resolve, reject) => setTimeout(resolve, milliseconds))
    },
    /**
     *  Emits quantity update for sync modifier on parent.
     * @param quantity - new quantity value
     */
    update(quantity) {
      this.$emit('update:quantity', quantity)
    },
    /**
     *  Increase quantity. Type coersion prevents string concatenation.
     */
    increment() {
      if (this.item) {
        this.incrementLineItem(this.item.id)
      } else {
        this.update(Number(this.quantity) + 1)
      }
    },
    /**
     *  Decrease quantity. Prevents negative number.
     */

    decrement() {
      const _minCount = this.isCheckout === true ? 0 : 1
      if (this.quantity > _minCount) {
        if (this.item) {
          this.decrementLineItem(this.item.id)
          if (this.quantity == 1) {
            this.$emit('itemremoved')
          }
        } else {
          this.update(this.quantity - 1)
        }
      }
    },
    /**
     *  Start a repetitive call to increment and decrement method after a timeInterval on mousedown event and will stop on mouseup event on controls
     * @param handler - increment or decrement method
     */
    async start(handler) {
      document.addEventListener('mouseup', this.stop)
      this.startTime = new Date()
      this.handler = handler
      await this.wait(500)
      clearInterval(this.interval)
      if (this.startTime) {
        this.interval = setInterval(handler, timeInterval)
      }
    },
    /**
     * clear interval on mouseup event and remove the listener
     * @param evt - event to be removed
     */
    stop(evt) {
      document.removeEventListener(evt.type, this.stop)
      this?.handler()
      clearInterval(this.interval)
      this.interval = null
      this.handler = null
      this.startTime = null
    }
  }
}
</script>

<style lang="scss" scoped>
.quantity-select {
  border: 2px solid $primary-purple;
  border-radius: 25px;
  color: $primary-purple;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 90px;
}

.decrement-switch {
  margin-right: 5px;
}

.increment-switch {
  margin-left: 5px;
}

.quantity-input {
  background: transparent;
  text-align: center;
  width: 2rem;
  line-height: 2rem;
  border: none;
  padding-left: 5px;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  &:focus {
    outline: none;
  }
}

.switches {
  width: 2rem;
  font-size: 14pt;
  padding: 0.5rem;
}

.decrement {
  padding-left: 10px;
  margin-right: 0;
}

.increment {
  padding-right: 10px;
  margin-right: 1px;
}

.switch {
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  width: 100%;
  height: 100%;
}
</style>
