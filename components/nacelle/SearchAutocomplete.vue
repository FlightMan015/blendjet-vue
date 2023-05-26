<template>
  <transition name="fade-up">
    <div
      class="autocomplete"
      v-show="shouldShowAutocomplete"
      @mouseenter="cursorInside = true"
     
    >
    <!-- @mouseleave="setNotVisibleAndClearQuery" -->
      <!-- <h2>Search Results</h2> -->
      <search-results
        :searchData="productData"
        :searchQuery="query"
        slotMode="multiple"
        v-if="productData"
        @results="autoCompleteVisibleCheck"
        @no-query="setAutocompleteNotVisible"
        v-click-outside="clickedOutside"
      >
      <!-- @results="setAutocompleteVisible" -->
        <template v-slot:result="{ result }">
          <search-autocomplete-item
            v-for="item in result"
            :list="true"
            :item="item"
            :key="item.id"
            @selectedQuery="emitQuery"
          />
        </template>
        <template v-slot:no-results>
          <search-no-results />
        </template>
      </search-results>
    </div>
  </transition>
</template>

<script>
import SearchResults from '~/components/nacelle/SearchResults'
import SearchNoResults from '~/components/nacelle/SearchNoResults'
import SearchAutocompleteItem from '~/components/nacelle/SearchAutocompleteItem'
import { mapState, mapMutations, mapGetters } from 'vuex'
import ClickOutside from 'vue-click-outside'

export default {
  data() {
    return {
      cursorInside: false,
      selectedResult: null,
      newSelectedResult: null, 
      hide: false
    }
  },
  components: {
    SearchResults,
    SearchNoResults,
    SearchAutocompleteItem
  },
  directives: {
    ClickOutside
  },
  watch: {
    $route() {
      this.setAutocompleteNotVisible()
    },
    query() {
      // console.log('query watch', this.query)
      this.hide = false;
      if(this.query && this.query.value !== '' && this.query.value !== this.selectedResult) {
        // console.log('watch true', this.query.value, this.selectedResult)
        this.selectedResult = null
        this.setAutocompleteVisible()
      } else {
        this.setAutocompleteNotVisible()
      }
    }
  },
  computed: {
    ...mapState('search', ['query', 'autocompleteVisible']),
    ...mapGetters('search', ['queryOrigin', 'productData']),
    shouldShowAutocomplete() {
      if (
        
        this.autocompleteVisible &&
        // this.selectedResult
        this.queryOrigin &&
        this.queryOrigin == 'global'
      ) {
        // console.log('should show autocomplete')
        return true
      }
      return
    }
  },
  methods: {
    ...mapMutations('search', ['setAutocompleteVisible']),
    ...mapMutations('search', ['setAutocompleteNotVisible']),
    ...mapMutations('search', ['setQuery']),
    setNotVisibleAndClearQuery() {
      let vm = this
      vm.cursorInside = false

      setTimeout(() => {
        if (!vm.cursorInside) {
          this.setAutocompleteNotVisible()
        }
      }, 600)

      this.setQuery(null)
    },
    autoCompleteVisibleCheck() {
      if(!this.selectedResult) {
        this.setAutocompleteVisible()
      }
      if(this.hide) {
        this.setAutocompleteNotVisible()
      }
    },
    clickedOutside() {
      this.hide = true
    },
    emitQuery(item) {
      // this.setNotVisibleAndClearQuery()
      // console.log('emit selected', item)
      this.selectedResult = item
      this.setAutocompleteNotVisible()
      this.$emit('selected', item)
      //     setTimeout(() => {
      //       console.log('timeout')
      //   // if (!vm.cursorInside) {
      //     this.setAutocompleteNotVisible()
      //   // }
      // }, 1200)
    }
  }
}
</script>

<style lang="scss" scoped>
.autocomplete {
  background: $primary-purple-tint;
  position: absolute;
  z-index: 10;
  top: 45px;
  left: 0;
  width: 100%;
  overflow: scroll;
  height: 10rem;
  // height: auto;
  // border-radius: 5px;
  padding: 1rem;
  // box-shadow: -1px 4px 7px 0px rgba(0, 0, 0, 0.08);

  @media screen and (max-width: 786px) {
    right: 0;
    left: 0;
    width: 100%;
    top: 40vh;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-up-enter, .fade-up-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(20px);
}
</style>
