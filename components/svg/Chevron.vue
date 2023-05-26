<template>
  <svg @click="onClick" class="chevron" :style="{ '--size': `${size}px`, '--angle': angle }" viewBox="0 0 29 29">
    <g fill="none" transform="matrix(-1 0 0 1 28 1)">
      <circle cx="13.5" cy="13.5" r="13.5" :stroke="color" stroke-width="1.5" />
      <g :fill="color">
        <path d="M18.318 13.046l-6.364-6.364-1.272 1.272 6.364 6.364z" />
        <path d="M18.319 13.033l-6.364 6.364-1.273-1.273 6.364-6.364z" />
      </g>
    </g>
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
      default: 'left'
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
        up: 90,
        right: 180,
        down: -90,
        left: 0
      }[this.direction]

      return `${direction}deg`
    }
  }
}
</script>

<style lang="scss" scoped>
.chevron {
  width: var(--size);
  height: var(--size);
  transform: rotate(var(--angle));
  transform-origin: center;
}
</style>
