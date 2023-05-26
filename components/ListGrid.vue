<template>
  <div class="list-grid">
    <slot></slot>
  </div>
</template>
<script>export default {}</script>
<style lang="scss" scoped>
.list-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
</style>
