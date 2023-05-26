<template>
  <div class="search" :class="`${position}-searchbox`">
    <search-input
      :placeholderText="placeholderText"
      :position="position"
      :term="searchTerm"
      @focus.native="getData"
      @keydown.enter.native="navigateToSearchResults"
      @clearQuery="clearQuery"
    />
    <!-- <div
      v-if="position == 'global'"
      class="button button__search"

      @click="navigateToSearchResults"
    > -->
      <!-- <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 24 24" width="30"><path d="M0 0h24v24H0z" fill="none"/><path :fill="navColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> -->
      <!-- <svg width="25px" height="23px" viewBox="0 0 25 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>Combined Shape</title>
          <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="D_Nav-White-Sticky" transform="translate(-1276.000000, -23.000000)" :stroke="navColor" stroke-width="1.5">
              <g id="Search" transform="translate(1277.000000, 24.000000)">
                <path d="M8.5,17 C13.1944204,17 17,13.1944204 17,8.5 C17,3.80557963 13.1944204,0 8.5,0 C3.80557963,0 0,3.80557963 0,8.5 C0,13.1944204 3.80557963,17 8.5,17 Z M15.5,14.5 L23.2603795,21.1774074" id="Combined-Shape"></path>
              </g>
            </g>
          </g>
      </svg> -->

    <!-- </div> -->
    <!-- <search-autocomplete @selected="setSelected" /> -->
  </div>
</template>

<script>
import SearchInput from '~/components/nacelle/SearchInput'
// import SearchAutocomplete from '~/components/nacelle/SearchAutocomplete'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      searchTerm: ''
    }
  },
  // watch: {
  //   $route() {
  //     // $route() {
  //     console.log('SEARCH ROUTE')
  //     this.setQuery(null)
  //     this.setAutocompleteNotVisible()
  //   // }
  //   }
  // },
  components: {
    SearchInput,
    // SearchAutocomplete
  },
  props: {
    position: {
      type: String,
      default: 'global',
      scrolled: false
    },
    searchCategory: {
      type: String,
      default: 'product'
    },
    placeholderText: {
      type: String,
      default: 'Search products..'
    },
    navColor: {
      type: String,
      default: 'black'
    }
  },
  computed: {
    ...mapState('search', ['query'])
  },
  
  methods: {
    ...mapMutations('menu', ['disableMenu']),
    ...mapActions('search', ['getProductData']),
    getData() {
      if (this.searchCategory === 'product') {
        this.getProductData()
      }
    },
    navigateToSearchResults() {
      const queryVal = this.query && this.query.value ? this.query.value : ''

      this.disableMenu()
      // console.log('path', $nuxt.$route.name)
      if($nuxt.$route.path === '/search') {
        // console.log('search path', $nuxt.$route.path)
        this.$router.go(-1) || this.$router.push({path: '/'})
        // this.$router.back() || this.$router.push({path: '/'});
      } else {
        if (this.position == 'global') {
          this.$router.push({ path: '/search', query: { q: queryVal } })
        } else {
          this.$router.push({query: { q: queryVal } })
        }
      }
      
    },
    setSelected(term) {
      this.searchTerm = term
    },
    clearQuery() {
      this.searchTerm = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  position: relative;
}
.global-searchbox input,
.global-searchbox button {
  margin-right: 0.5rem;
}

.button {
  &__search {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    border: none;
    background: transparent;
    border-radius: 24px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>