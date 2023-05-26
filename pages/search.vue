<!--
/****
/* For information about search & filtering, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/filtering-products.html#filtering-searching
/****
-->
<template>
  <div class="search-container">
    <div class="search-box" :class="[viewAll ? 'search-box__view-all' : '']">
      <!-- <search-box position="global" /> -->
      <search-box position="global" />
    </div>

    <transition name="fade">
      <div class="search-suggestions" v-if="!viewAll">
        <div class="search-suggestions__container" v-show="searchResultsNumber">
          <div class="search-suggestions__products">
            <!-- <div class="search-suggestions__heading">
                Products
              </div> -->
            <search-results
              :searchData="productData"
              :searchQuery="query"
              slotMode="multiple"
              v-if="productData"
              @results="showResults"
              @no-query="noQuery"
            >
              <!-- @results="setAutocompleteVisible" -->
              <template v-if="resultsVisible" v-slot:result="{ result }">
                <search-autocomplete-item
                  v-for="(item, index) in result"
                  :item="item"
                  :key="item.id"
                  :position="index"
                />
              </template>
            </search-results>
          </div>
          <!-- <div class="search-suggestions__pages">
            <div class="search-suggestions__heading">
              Pages
            </div>
            <search-results
              :searchData="blogData"
              :searchQuery="query"
              slotMode="multiple"
              v-if="blogData"
              @results="showResults"
              @no-query="noQuery"
            >
              <template v-if="resultsVisible" v-slot:result="{ result }">
                <search-autocomplete-item
                  v-for="item in result.slice(0, 5)"
                  :item="item"
                  :key="item.id"
                />
              </template>
            </search-results>
          </div> -->
        </div>
        <div class="view-more">
          <div
            class="view-more__button"
            role="button"
            v-if="searchResultsNumber"
            @click="viewAll = true"
          >
            View all results ({{ searchResultsNumber }})
          </div>
        </div>
      </div>
    </transition>

    <div class="search-results" v-if="viewAll">
      <!-- <div class="search-results__filters"></div>
      <div class="search-results__grid">
        <search-results
          :searchData="productData"
          :searchQuery="query"
          slotMode="multiple"
          v-if="productData"
          @results="showResults"
          @no-query="noQuery"
        >
          <template v-if="resultsVisible" v-slot:result="{ result }">
            <div
              v-for="item in result"
              :key="item.id"
              class="search-results__grid__item"
            >
              <div>
                <img
                  class="search-results__grid__item__img"
                  :src="optimizeSource({ url: item.featuredMedia.src })"
                />
              </div>
              <div class="search-results__grid__item__title">
                {{ item.title }}
              </div>
              <div class="search-results__grid__item__rating">
                <b-rate
                  v-model="rating"
                  :max="5"
                  :icon-pack="'mdi'"
                  :disabled="true"
                >
                </b-rate>
              </div>
              <div class="search-results__grid__item__category"></div>
              <div class="search-results__grid__item__price">
                <product-price :price="item.priceRange.min" />
              </div>
            </div>
          </template>
        </search-results>
      </div> -->
      <!-- { field: 'productType', label: 'Product Type' }, -->
      <refinement-filters
        v-if="productData"
        :propertyFilters="[{ field: 'color', label: 'Color' }]"
        :inputData="results"
        v-on:updated="updateFilteredData"
      />
      <refinement-results
        v-if="filteredData"
        :searchData="filteredData"
        :searchQuery="query"
      >
        <template v-slot:result="{ result }">
          <div>
            <!-- {{JSON.stringify(result.map(item=>item.title))}} -->
            <SearchGrid :products="result" :columns="4" />
          </div>
        </template>
        <template v-slot:no-results>
          <search-no-results />
        </template>
      </refinement-results>
    </div>
  </div>
  <!-- <div class="search-container">
    <section class="section search-section">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <search-box position="in-page" />
          </div>
        </div>
      </div>
    </section>
    <section class="section filtering">
      <div class="column is-12">
        <refinement-filters
          v-if="productData"
          :propertyFilters="[
            { field: 'productType', label: 'Product Type' },
            { field: 'color', label: 'Color' },
            { field: 'material', label: 'Material' },
            { field: 'size', label: 'Size' }
          ]"
          :priceRangeFilters="[
            { range: [0, 50], label: '< $50' },
            { range: [50, 100], label: '$50 - 100' },
            { range: [100, 200], label: '$100 - 200' },
            { range: [200, 500], label: '$200 - 500' },
            { range: [500, 0], label: '> $500' }
          ]"
          :inputData="productData"
          v-on:updated="updateFilteredData"
        />
      </div>
    </section>
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-12">
          <refinement-results
            v-if="filteredData"
            :searchData="filteredData"
            :searchQuery="query"
          >
            <template v-slot:result="{ result }">
              <product-grid :products="result" :columns="4" />
            </template>
            <template v-slot:no-results>
              <search-no-results />
            </template>
          </refinement-results>
        </div>
      </div>
    </section>
  </div> -->
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import SearchBox from '~/components/nacelle/SearchBox'
import SearchResults from '~/components/nacelle/SearchResults'
import SearchNoResults from '~/components/nacelle/SearchNoResults'
import SearchAutocompleteItem from '~/components/nacelle/SearchAutocompleteItem'
import RefinementFilters from '~/components/nacelle/RefinementFilters'
import RefinementResults from '~/components/nacelle/RefinementResults'
import SearchGrid from '~/components/searchGrid'

import imageOptimize from '~/mixins/imageOptimize'
import getDisplayPriceForCurrency from '~/mixins/getDisplayPriceForCurrency'

export default {
  data() {
    return {
      resultsVisible: false,
      searchResultsNumber: null,
      results: null,
      viewAll: false,
      rating: null,
      metaTitle: 'Search BlendJet.com - BlendJet®',
      metaDescription:
        'Are you looking for a specific product or recipe? Our search function makes quick browsing a breeze. Shop online now, and join the BlendJet revolution!'
    }
  },
  head() {
    const properties = {}
    const meta = []
    const mdescription = this.metaDescription
    const title = this.metaTitle
    if (title.length) {
      properties.title = title
    }

    if (mdescription.length) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: mdescription
      })
    }

    return { ...properties, meta }
  },
  components: {
    SearchBox,
    RefinementFilters,
    RefinementResults,
    SearchNoResults,
    SearchResults,
    SearchAutocompleteItem,
    SearchGrid
  },
  mixins: [imageOptimize, getDisplayPriceForCurrency],
  computed: {
    ...mapState('search', [
      'query',
      'loadedData',
      'filteredData',
      'autocompleteVisible'
    ]),
    ...mapGetters('search', ['productData'])
  },
  watch: {
    loadedData(newVal) {
      if (newVal) {
        if (this.$route.query && this.$route.query.q) {
          this.setQuery({
            origin: 'in-page',
            value: this.$route.query.q
          })
        }
      }
    },
    query() {
      this.viewAll = false
      // if(!this.query) {
      //   this.viewAll = false
      // }
    }
    // $route() {
    //   console.log('SEARCH ROUTE')
    //   this.setQuery(null)
    //   this.setAutocompleteNotVisible()
    // }
  },
  created() {
    if (process.browser) {
      if (!this.filteredData) {
        this.getProductData()
      }
    }
  },
  beforeDestroy() {
    this.setQuery(null)
    this.setAutocompleteNotVisible()
    this.setFilteredData(null)
  },
  methods: {
    ...mapMutations('search', ['setFilteredData']),
    ...mapMutations('search', ['setQuery']),
    ...mapMutations('search', ['setAutocompleteVisible']),
    ...mapMutations('search', ['setAutocompleteNotVisible']),
    ...mapActions('search', ['getProductData']),
    updateFilteredData(data) {
      this.setFilteredData(data)
    },
    noQuery(number) {
      this.resultsVisible = false
      this.viewAll = false
      this.searchResultsNumber = number
    },
    showResults(results) {
      this.searchResultsNumber = results.length
      this.results = results
      this.resultsVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  // margin-top: 100px;
  min-height: 100vw;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  /* justify-content: center; */
}

.search-box {
  height: 183px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: all 0.5s ease;
  // margin-top: 64px;

  &__view-all {
    background: $secondary-purple-4;
    transition: all 0.5s ease;
  }
}
.search-section {
  background: whitesmoke;
}

.search-suggestions {
  margin-top: 60px;

  &__container {
    // width: 1198px;
    display: flex;
    flex-flow: row wrap;
    // justify-content: space-between;

    @include respond-to('small') {
      width: 285px;
    }
  }

  &__products {
    width: 100%;

    @include respond-to('small') {
      width: 100%;
    }
  }

  &__pages {
    width: 50%;
    @include respond-to('small') {
      width: 100%;
    }
  }

  &__heading {
    font-family: Bold;
    font-size: $text-small;
    color: $grayscale-gray;
    line-height: 1.17;
    letter-spacing: 1.75px;
    text-transform: uppercase;
    margin-bottom: 25px;
  }
}

.search-results {
  width: 90%;

  &__grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;

    &__item {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      &__img {
        height: 350px;
        width: auto;
        object-fit: contain;
        object-position: center;
      }

      &__title {
        font-family: Bold;
        font-size: 14px;
        line-height: 1.57;
        letter-spacing: 0.5px;
        color: $primary-purple;
      }
    }
  }
}

.view-more {
  display: flex;
  justify-content: center;
  margin: 40px;

  &__button {
    @include button-primary('purple');
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.filtering {
  background: whitesmoke;
  padding: 1rem;
}
</style>
