<template>
  <div
    class="carousel-nav"
    :style="{ '--color': color, '--translucent-color': `${color}50` }"
  >
    <Chevron :color="color" :size="24" :onClick="prev" />
    <div class="carousel-nav__progressBar">
      <div
        class="carousel-nav__progress"
        :style="{ transform: `scaleX(${progress})` }"
      />
    </div>
    <Chevron :color="color" :size="24" direction="right" :onClick="next" />
  </div>
</template>

<script>
import Chevron from '~/components/svg/Chevron'

export default {
  components: {
    Chevron
  },
  props: {
    color: String,
    prev: {
      type: Function,
      default: f => f
    },
    next: {
      type: Function,
      default: f => f
    },
    progress: Number
  }
}
</script>

<style lang="scss" scoped>
.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    cursor: pointer;
  }

  &__progressBar {
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--translucent-color);
    overflow: hidden;
    width: 50vw;
    margin: 0 1rem;
  }

  &__progress {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: var(--color);
    transition: transform 0.3s ease;
    transform-origin: 0%;
  }
}
</style>
