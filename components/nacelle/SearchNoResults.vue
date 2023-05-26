<template>
  <div>
    <h2>{{title}}</h2>
    <p>{{subtitle}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Oops...no results!'
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 18px;
  text-align: center;
  font-family: Medium;
  letter-spacing: 1px;
  color: $primary-purple;
}
p {
  text-align: center;
}
</style>