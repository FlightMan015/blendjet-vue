<template>
  <div class="do-item">
    <Do class="do-item__icon"/><div class="do-item__text"><slot></slot></div>
  </div>
</template>
<script>
import Do from '~/components/svg/guide-do'

export default {
  components: {
    Do
  }
}
</script>
<style lang="scss" scoped>
.do-item {
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
