<template>
  <div class="dont-item">
    <Dont class="dont-item__icon"/><div class="dont-item__text"><slot></slot></div>
  </div>
</template>
<script>
import Dont from '~/components/svg/guide-dont'

export default {
  components: {
    Dont
  }
}
</script>
<style lang="scss" scoped>
.dont-item {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
  width: 100%;

  @media screen and (min-width: 1024px) {
    width: 50%;
  }

  &__text {
    margin-left: 15px;
    margin-right: 15px;

    strong {
      color: $grayscale-gray
    }
  }
}
</style>
