<template>
  <svg
    @click="onClick"
    class="bi-chevron"
    :style="{ '--size': `${size}px`, '--angle': angle }"
    :fill="color"
    viewBox="0 0 16 16"
  >
    <path
      d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
    />
    <path
      d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
    />
  </svg>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      validator(val) {
        return ['up', 'right', 'down', 'left'].some(d => d === val)
      },
      default: 'down'
    },
    color: String,
    size: Number,
    onClick: {
      type: Function,
      default: f => f
    }
  },
  computed: {
    angle() {
      const direction = {
        up: 180,
        right: -90,
        down: 0,
        left: 90
      }[this.direction]

      return `${direction}deg`
    }
  }
}
</script>

<style lang="scss" scoped>
.bi-chevron {
  width: var(--size);
  height: var(--size);
  transform: rotate(var(--angle));
  transform-origin: center;
}
</style>
