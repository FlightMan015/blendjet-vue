<template>
  <div class="banner">
    <div class="banner__content">
      This product can't be shipped to
      {{ getCountryNameFromISO(country) }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import countryUtils from '~/mixins/countryUtils'

export default {
  props: {},
  data() {
    return {}
  },
  mixins: [countryUtils],
  computed: {
    ...mapState('user', ['country'])
  }
}
</script>

<style lang="scss" scoped>
.banner {
  min-height: 100px;
  text-align: center;
  display: flex;
  background-color: #f6f5fd;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-sizing: border-box;
  font-family: 'Bold';
  @media (max-width: 767px) {
    margin-bottom: 30px;
  }

  strong {
    color: currentColor;
    font-weight: bolder;
  }
}

.banner__content {
  display: inline-block;
  line-height: 45px;
  padding: 1rem;
  background-color: #ff8488;
  font-size: 18px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: white;
}
</style>
