export default {
  data() {
    return {
      isDown: false,
      startX: 0
    }
  },
  methods: {
    dragStart(e) {
      this.startX = e.pageX
      this.isDown = true
    },
    dragProgress(e) {
      if (!this.isDown) {
        return
      }
      const x = e.pageX
      this.posDiff = x - this.startX
    },
    dragEnd(nextVariant, prevVariant) {
      if (this.isDown) {
        if (this.posDiff >= 40) {
          prevVariant()
        } else if (this.posDiff <= -40) {
          nextVariant()
        }
      }
      this.resetPositions()
    },
    dragExit() {
      this.resetPositions()
    },
    resetPositions() {
      this.isDown = false
      this.posDiff = 0
      this.startX = 0
    }
  }
}
