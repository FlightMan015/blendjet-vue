<template>
  <div class="search-input-container">
    <div class="search-icon">
      <svg width="25px" height="27px" viewBox="0 0 25 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="D_Nav-White-Sticky" transform="translate(-1276.000000, -23.000000)" stroke="#373795" stroke-width="1.5">
              <g id="Search" transform="translate(1277.000000, 24.000000)">
                <path d="M8.5,17 C13.1944204,17 17,13.1944204 17,8.5 C17,3.80557963 13.1944204,0 8.5,0 C3.80557963,0 0,3.80557963 0,8.5 C0,13.1944204 3.80557963,17 8.5,17 Z M15.5,14.5 L23.2603795,21.1774074" id="Combined-Shape"></path>
              </g>
            </g>
          </g>
      </svg>
    </div>
    <input
      type="text"
      :placeholder="'Search'"
      class="search-input nacelle"
      v-model="localQuery"
      @keyup="setQueryInStore"
      :ref="`${position}-search-input`"

    />
    <div class="close-icon" @click="clearQuery">
      <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Home-Nav" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="M-BlendJet-Nav-1" transform="translate(-19.000000, -121.000000)" fill="#373795" stroke="#373795">
                  <g id="NAVIGATION" transform="translate(0.000000, 92.000000)">
                      <g id="X" transform="translate(20.000000, 30.000000)">
                          <path d="M17.28,-3.55271368e-15 L18,0.72 L9.719,8.999 L18,17.28 L17.28,18 L8.999,9.719 L0.72,18 L-3.32511796e-13,17.28 L8.28,8.999 L-3.32511796e-13,0.72 L0.72,-5.77315973e-15 L8.999,8.28 L17.28,-3.55271368e-15 Z" id="Ham___Mobile_2"></path>
                      </g>
                  </g>
              </g>
          </g>
      </svg>
    </div>
  </div>

</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    placeholderText: {
      type: String,
      default: 'Search'
    },
    position: {
      type: String
    },
    term: {
      type: String
    }
  },
  watch: {
    $route(newRoute) {
      if (this.position === 'global') {
        this.localQuery = null
        this.$refs['global-search-input'].blur()
      }
    },
    query(newVal) {
      // console.log('new val', newVal)
      if (!newVal ) {
        this.localQuery = null
        this.setQuery(null)
      } else {
        this.localQuery = newVal.value
      }
      // if (this.position === 'global' && newVal) {
      //   this.localQuery = newVal.value
      // }
    },
    term() {
      // console.log('term', this.term)
      // this.localQuery = this.term;
      // this.setAutocompleteNotVisible()
      // this.setQuery({value: this.term, origin: this.position})
    }
  },
  data() {
    return {
      localQuery: null,
      visibility: 'hidden',

    }
  },
  computed: {
    ...mapState('search', ['query']),
    // searchClass() {
    //   return {

    //   }
    // }
  },

  methods: {
    ...mapMutations('search', ['setQuery']),
    ...mapActions('events', ['searchProducts']),
    //  ...mapMutations('search', ['setAutocompleteVisible']),
    ...mapMutations('search', ['setAutocompleteNotVisible']),
    setQueryInStore(e) {
      if (e.key !== 'Enter') {
        this.setQuery({ value: this.localQuery, origin: this.position })
      }

      // Check that the key press is a letter or number and that
      // local query has a value before tracking an event
      if (/^[a-z0-9]$/i.test(e.key) && this.localQuery) {
        const trackSearchEvent = this.debounce(this.searchProducts, 500)
        trackSearchEvent({ query: this.localQuery })
      }
    },
    debounce(fn, debounceTime) {
      return (...args) => {
        if (this.timeout !== null) {
          clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => fn(...args), debounceTime)
      }
    },
    clearQuery() {
      this.$router.back()
      this.localQuery = null;
      this.setQuery(null)
      this.setAutocompleteNotVisible()
      this.$emit('clearQuery')
    }
  },
  created() {
    // console.log('input query value', this.query)
    if (this.query && this.position !== 'global') {
      this.localQuery = this.query.value
    }
  },
  mounted() {
    if (this.position !== 'global') {
      this.$refs[`${this.position}-search-input`].focus()
    }
    // if (this.position === 'global') {
    //   this.searchHidden = true;
    // } else {
    //   this.searchHidden = false;
    // }
  }
}
</script>
<style lang="scss" scoped>

.search-input-container {
  position: relative;
  width: 1198px;

  @include respond-to('small') {
    width: 285px;
  }
}

.search-icon {
  position: absolute;
  bottom: 5px;
  left: 0;
}

.close-icon {
  position: absolute;
  bottom: 5px;
  right: 0;
  z-index: 20px;
}

.search-input {
  width: 100%;
  height: 100%;
  max-width: 100%;

  background: transparent;
  border: none;
  border-bottom: 2px solid $primary-purple;
  font-family: Medium;
  font-size: 24px;
  line-height: 0.75;
  letter-spacing: 0.83px;
  padding-left: 35px;
  padding-bottom: 7px;
  color: $primary-purple;
  outline: none;


  &::placeholder {
    // font-family: Medium;
    // font-size: 24px;
    // line-height: 0.75;
    // letter-spacing: 0.83px;
    color: $secondary-purple-2;
    // padding-bottom: 18px;
    // padding-left: 35px;
  }
}
</style>
