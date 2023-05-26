<template>
  <div
    ref="root"
    :class="className"
    @mousedown="onMouseDown"
    @mouseleave="onMouseLeave"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDown: false,
      isScrolling: false,
      startX: null,
      scrollLeft: null
    }
  },
  props: ['className'],
  methods: {
    onMouseDown(e) {
      // if (this.$mq === 'sm') return
      this.isDown = true

      this.startX = e.pageX - this.$refs.root.offsetLeft
      this.scrollLeft = this.$refs.root.scrollLeft
    },
    onMouseLeave() {
      // if (this.$mq === 'sm') return
      this.isDown = false
    },
    onMouseUp() {
      // if (this.$mq === 'sm') return
      this.isDown = false
    },
    onMouseMove(e) {
      // if (this.$mq === 'sm' || !this.isDown) return
      if (!this.isDown) return
      e.preventDefault()
      const x = e.pageX - this.$refs.root.offsetLeft
      const travel = x - this.startX

      this.$refs.root.scrollLeft = this.scrollLeft - travel
    }
  }
}
</script>
