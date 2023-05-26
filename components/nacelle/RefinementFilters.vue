<template>
  <div class="refinement-filters">
    <div class="filters">
      <div class="filters__product-type">

      </div>
      <div class="filters__colors">
       
      </div>
      <div class="filters__clear">
        <!-- <div class="filters__clear__button">
          Clear
        </div> -->
      </div>
      <div class="sort-by">
          <div class="dropdown" tabindex="0" @focusout="sortByVisible = false" >
            <div class="dropbtn" role="button" @click="toggleSortByVisible">
              <span >Relevance </span>
              <CaretDown :styleObj="{marginLeft: '16px'}" :color="'#373975'"/>     
            </div>
            <transition name="fade">
              <div v-show="sortByVisible" class="dropdown-content dropdown-content-right">
                <ul>
                  <li @click="sortBy='hi-low'" class="dropdown-text-item">
                    <div class="check-selected-container">
                      <transition name="fade">
                        <div class="check-selected" v-show="sortBy==='hi-low'">
                          <svg width="16px" height="11px" viewBox="0 0 16 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          
                            <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <g id="D-BlendJet-PDP-BlendJet" transform="translate(-1083.000000, -6832.000000)" fill="#373795">
                                <g id="Smoothies" transform="translate(0.000000, 6247.000000)">
                                  <g id="3" transform="translate(1028.000000, 78.000000)">
                                    <g id="Checkbox" transform="translate(53.000000, 503.000000)">
                                      <g id="Right" transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)">
                                        <polygon id="BG" transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) " points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"></polygon>
                                        <polygon id="BG-Copy-2" transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) " points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"></polygon>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                      </transition>
                    </div>
                    <div class="dropdown-text-item__text">
                    High to Low
                    </div>
                  </li>
                  <li @click="sortBy='low-hi'" class="dropdown-text-item">
                    <span class="check-selected-container">
                      <span class="check-selected" v-show="sortBy==='low-hi'">
                        <svg width="16px" height="11px" viewBox="0 0 16 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="D-BlendJet-PDP-BlendJet" transform="translate(-1083.000000, -6832.000000)" fill="#373795">
                              <g id="Smoothies" transform="translate(0.000000, 6247.000000)">
                                <g id="3" transform="translate(1028.000000, 78.000000)">
                                  <g id="Checkbox" transform="translate(53.000000, 503.000000)">
                                    <g id="Right" transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)">
                                      <polygon id="BG" transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) " points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"></polygon>
                                      <polygon id="BG-Copy-2" transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) " points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"></polygon>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </span>
                    </span>
                    <span class="dropdown-text-item__text">
                    Low to High
                    </span>
                  </li>
                    
                </ul>
                
              </div>
            </transition>
          </div>







    </div>
    
    </div>
<!-- 
      <div class="sort-by dropbtn" :class="[sortByVisible ? 'dropbtn__active' : '']" role="button" @click.prevent="toggleSortByVisible" >
        <span class="selected-option" >Relevance</span>
        <CaretDown :styleObj="{marginLeft: '16px'}" :color="'purple'"/>

        <transition name="fade">
          <div class="sort-by__dropdown__content" v-show="sortByVisible">
            <ul>
              <li @click="sortBy='hi-low'">
                <span class="check-selected-container">
                  <span class="check-selected" v-if="sortBy==='hi-low'">
                    <svg width="16px" height="11px" viewBox="0 0 16 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                     
                      <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="D-BlendJet-PDP-BlendJet" transform="translate(-1083.000000, -6832.000000)" fill="#373795">
                          <g id="Smoothies" transform="translate(0.000000, 6247.000000)">
                            <g id="3" transform="translate(1028.000000, 78.000000)">
                              <g id="Checkbox" transform="translate(53.000000, 503.000000)">
                                <g id="Right" transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)">
                                  <polygon id="BG" transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) " points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"></polygon>
                                  <polygon id="BG-Copy-2" transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) " points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"></polygon>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </span>
                <span class="sort-by__dropdown__option">
                High to Low
                </span>
              </li>
              <li @click="sortBy='low-hi'">
                <span class="check-selected-container">
                  <span class="check-selected" v-if="sortBy==='low-hi'">
                    <svg width="16px" height="11px" viewBox="0 0 16 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      
                      <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="D-BlendJet-PDP-BlendJet" transform="translate(-1083.000000, -6832.000000)" fill="#373795">
                          <g id="Smoothies" transform="translate(0.000000, 6247.000000)">
                            <g id="3" transform="translate(1028.000000, 78.000000)">
                              <g id="Checkbox" transform="translate(53.000000, 503.000000)">
                                <g id="Right" transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)">
                                  <polygon id="BG" transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) " points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"></polygon>
                                  <polygon id="BG-Copy-2" transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) " points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"></polygon>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                </span>
                <span class="sort-by__dropdown__option">
                Low to High
                </span>
              </li>
                
            </ul>
          </div>
        </transition>
      </div>


    </div>
  </div> -->
  <!-- <div>
    <h3>Refine Your Search</h3>
    <select v-model="sortBy">
      <option selected disabled>Sort By</option>
      <option value="hi-low">High to Low</option>
      <option value="low-hi">Low To High</option>
    </select>
    <button class="button is-text" @click="setFiltersCleared">
      Clear
    </button>
    <div class="filters">
      <div
        class="filter"
        v-for="filter in filters"
        :key="filter.property.field"
      >
        <h4>{{ filter.property.label }}</h4>

        <div class="facet-values">
          <div
            class="value"
            v-for="value in filter.values"
            :key="value"
            @click="
              toggleFilterActive({ property: filter.property.field, value })
            "
          >
            <refinement-filter-select
              :value="value"
              :activeFilters="activeFilters"
              :property="filter.property.field"
            />
          </div>
        </div>
      </div>
      <div class="filter">
        <h4>Price</h4>

        <div>
          <div
            class="value"
            v-for="priceRange in priceRangeFilters"
            :key="priceRange.label"
            @click="togglePriceRangeActive(priceRange)"
          >
            <refinement-price-filter-select
              :priceRange="priceRange"
              :activePriceRange="activePriceRange || {}"
            />
          </div>
        </div>
      </div>
    </div>
  </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import queryString from 'query-string'
import RefinementFilterSelect from '~/components/nacelle/RefinementFilterSelect'
import RefinementPriceFilterSelect from '~/components/nacelle/RefinementPriceFilterSelect'
// import CartDropdown from '~/components/cartDropdown'
import CaretDown from '~/components/svg/caretDown'

import { omit } from 'search-params'
export default {
  components: {
    RefinementFilterSelect,
    RefinementPriceFilterSelect,
    // CartDropdown,
    CaretDown
  },
  props: {
    inputData: {
      type: Array,
      required: true
    },
    propertyFilters: {
      type: Array,
      required: true
    },
    priceRangeFilters: {
      type: Array
    },
    passingConditions: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      filters: null,
      filteredData: null,
      activeFilters: [],
      outputData: null,
      activePriceRange: null,
      passedData: null,
      sortBy: 'Sort By',

      sortByVisible:false
    }
  },
  watch: {
    inputData() {
      console.log(this.inputData)
      this.setupFilters()
      this.computeFilteredData()
    },
    outputData() {
      const vm = this
      vm.$emit('updated', vm.outputData)
    },
    filters() {
      this.computeFilteredData()
    },
    activeFilters() {
      console.log('activeFiltersChanged')
      this.computeFilteredData()
    },
    activePriceRange() {
      this.computeOutputData()
    },
    sortBy() {
      this.computeOutputData()
      
    },
    filtersCleared(val) {
      // console.log(val)
      if (val === true) {
        this.activeFilters = []
        this.activePriceRange = null
        this.sortBy = 'Sort By'
        this.removeFiltersInQueryParams()
      }
    }
  },
  computed: {
    ...mapState('search', ['filtersCleared'])
  },
  methods: {
    ...mapMutations('search', [
      'setFiltersCleared',
      'setFiltersNotCleared',
      'setFilteredData'
    ]),
    toggleSortByVisible() {
      // console.log('sortBy')
      this.sortByVisible = !this.sortByVisible
    },
    computeOutputData() {
      const vm = this
      const outputWorker = new Worker('/outputWorker.js')
      outputWorker.postMessage({
        activeFilters: this.activeFilters,
        filteredData: this.filteredData,
        activePriceRange: this.activePriceRange,
        sortBy: this.sortBy
      })
      outputWorker.onmessage = function(e) {
        vm.outputData = e.data
      }
    },
    computeFilteredData() {
      const vm = this
      const filterWorker = new Worker('/filterWorker.js')
      filterWorker.postMessage({
        activeFilters: this.activeFilters,
        inputData: this.inputData
      })
      filterWorker.onmessage = function(e) {
        vm.filteredData = e.data
        vm.computeOutputData()
      }
    },
    setupFilters() {
      const vm = this
      if (vm.inputData && vm.propertyFilters) {
        vm.filters = vm.inputData
          .reduce((output, item) => {
            item.facets
              .filter(facet => facet.name !== 'Title')
              .forEach(facet => {
                const index = output.findIndex(arrayItem => {
                  return facet.name === arrayItem.property
                })
                if (index === -1) {
                  output.push({ property: facet.name, values: [facet.value] })
                } else {
                  output[index].values.push(facet.value)
                }
              })
            return output
          }, [])
          .map(facet => {
            const values = Array.from(new Set(facet.values))
            return { property: facet.property, values: values }
          })
          .filter(facet => {
            return vm.propertyFilters.find(filter => {
              return filter.field === facet.property
            })
          })
          .map(facet => {
            const index = vm.propertyFilters.findIndex(filter => {
              return filter.field === facet.property
            })
            return {
              property: {
                field: facet.property,
                label: vm.propertyFilters[index].label
              },
              values: facet.values
            }
          })
      }
    },
    filterActive(value) {
      return requestAnimationFrame(() => {
        if (this.activeFilters) {
          const filterArray = this.activeFilters.filter(filter => {
            return filter.value === value
          })
          if (filterArray.length > 0) {
            return true
          } else {
            return false
          }
        }
      })
    },
    toggleFilterActive(filter) {
      return requestAnimationFrame(() => {
        const filterInFilters = this.activeFilters.filter(filtersItem => {
          return filtersItem.property === filter.property
        })
        if (filterInFilters.length === 0) {
          this.activeFilters.push({
            property: filter.property,
            values: [filter.value]
          })
        } else {
          this.activeFilters.map((filtersItem, index) => {
            if (
              filtersItem.property === filter.property &&
              !filtersItem.values.some(value => value === filter.value)
            ) {
              filtersItem.values.push(filter.value)
            } else if (
              filtersItem.property === filter.property &&
              filtersItem.values.some(value => value === filter.value)
            ) {
              const filterIndex = filtersItem.values.indexOf(filter.value)
              filtersItem.values.splice(filterIndex, 1)
            } else {
              return filtersItem
            }
            if (filtersItem.values.length === 0) {
              this.activeFilters.splice(index, 1)
            }
          })
        }
        this.setFilterInQueryParams(filter)
        this.setFiltersNotCleared()
        this.computeFilteredData()
      })
    },
    togglePriceRangeActive(priceRange) {
      if (
        JSON.stringify(this.activePriceRange) === JSON.stringify(priceRange)
      ) {
        this.activePriceRange = null
      } else {
        this.activePriceRange = priceRange
      }
    },
    setFilterInQueryParams(filter) {
      return requestAnimationFrame(() => {
        if (process.browser) {
          let parsed = queryString.parse(location.search, {
            arrayFormat: 'comma'
          })

          let currentParams = this.readFiltersFromQueryParams()

          let transformedParams

          if (currentParams.length > 0) {
            if (
              currentParams.some(param => {
                return param.property === filter.property
              })
            ) {
              currentParams = currentParams.map(param => {
                if (
                  param.property === filter.property &&
                  !param.values.includes(filter.value)
                ) {
                  param.values.push(filter.value)
                  return param
                } else if (
                  param.property === filter.property &&
                  param.values.includes(filter.value)
                ) {
                  const index = param.values.indexOf(filter.value)
                  param.values.splice(index, 1)
                  return param
                } else {
                  return param
                }
              })
            } else {
              currentParams.push(filter)
            }
            transformedParams = {}

            currentParams.forEach(param => {
              if (param.values && param.values.length > 0) {
                transformedParams[param.property] = param.values.join(',')
              } else {
                transformedParams[param.property] = param.value
              }
            })
          } else {
            transformedParams = {
              [filter.property]: filter.value
            }
          }

          parsed = { ...parsed, ...transformedParams }

          this.$router.push({ query: parsed })
        }
      })
    },
    removeFiltersInQueryParams() {
      if (process.browser) {
        const filtersFromUrl = this.propertyFilters.map(filter => {
          return filter.field
        })
        const queryParamsString = queryString.stringify(
          queryString.parse(location.search)
        )
        const queryWithoutFilters = omit(queryParamsString, filtersFromUrl)
          .querystring
        this.$router.push({ query: queryString.parse(queryWithoutFilters) })
      }
    },
    readFiltersFromQueryParams() {
      let parsed = Object.entries(
        queryString.parse(location.search, { arrayFormat: 'comma' })
      )

      parsed = Object.fromEntries(
        parsed.map(filter => {
          if (typeof filter[1] === 'string') {
            filter[1] = [filter[1]]
          }
          return filter
        })
      )

      const filtersFromUrl = this.propertyFilters
        .map(filter => {
          return { property: filter.field, values: parsed[filter.field] }
        })
        .filter(filter => {
          return (
            filter.values !== null &&
            filter.values !== undefined &&
            filter.values.length > 0
          )
        })

      if (filtersFromUrl.length > 0) {
        return filtersFromUrl
      } else {
        return []
      }
    },
    getPassedData() {
      const vm = this
      if (vm.passingConditions) {
        return vm.inputData.filter(item => {
          const conditions = vm.passingConditions.map(passingCondition => {
            const passing = new Function(
              `return "${passingCondition.value}" ${
                passingCondition.conditional
              } "${item[passingCondition.property]}"`
            )

            return passing()
          })
          const passedConditions = conditions.every(condition => {
            return condition === true
          })
          return passedConditions === true
        })
      } else {
        return vm.inputData
      }
    }
  },
  created() {
    if (process.browser) {
      this.passedData = this.getPassedData()
      this.setupFilters()
      this.activeFilters = this.readFiltersFromQueryParams()
      if (this.filteredData && this.outputData.length > 0) {
        this.$emit('updated', this.outputData)
      }
      // console.log('filters', this.filters)
    }
  }
}
</script>
<style lang="scss" scoped>

// .dropbtn {
//   color: $primary-purple;
//   outline: none;
//   display: flex;
//   align-items: center;
//   border: 1px solid #d9dbe8;
//   position: relative;
//   border-radius: 15px;

//   &__active {
//     border: 2px solid $primary-purple;
//     // border-bottom: none;
//     border-bottom: 2px solid $primary-purple-tint;
//     border-top-right-radius: 12px;
//     border-top-left-radius: 12px;
//         border-bottom-left-radius: 0;
//     border-bottom-right-radius: 0;
//     z-index: 20;

//   }
// }

// .sort-by {

//   &__dropdown {


//     &__content {
//       background-color: $primary-purple-tint;
//       // border-radius: 12px;
//       border-top-left-radius: 12px;
//       border-bottom-left-radius: 12px;
//       border-bottom-right-radius: 12px;
//       width: 287px;
//       min-width: 160px;
//       box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
//       display: flex;
//       justify-content: flex-start;
//       flex-flow: column nowrap;
//       border: 2px solid $primary-purple;
//       font-family: Bold;
//       font-size: 14px;
//       letter-spacing: 1.75px;
//       padding-top: 0;
//       padding-bottom: 0;
//       cursor: pointer;
//       z-index: 3;
//       position: absolute;
//       // bottom: -10px;
//       top:24px;
//       right: -2px;
//       // @include respond-to('small') {
//       //   background: transparent;
//       //   text-align: center;
//       //   color: white;
//       //   border: none;
//       //   box-shadow: none;
//       // }

//       & > li {
//         height: 34px;
//         display: flex;
//         align-items: center;
//         justify-content: flex-start;
        
//         &:nth-child(even) {
//           background-color: $secondary-purple-4;
//         }
//         &:last-child {
//           border-bottom-left-radius: 12px;
//           border-bottom-right-radius: 12px;
//         }
//       }
//     }

//     &__option {
//       color: $primary-purple;
//       &:hover {
//         @include hover-transition;
//       }
//     }
//   }
// }
.filters {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
.swatch {
  height: 17px;
  width: 17px;
  margin-left: 15px;
  margin-right: 12px;
  margin-bottom: 2px;
  border-radius: 50%;
} 

.swatch-color {
  &__black {
    background-color: black;
  }

  &__ocean { 
    background-color:  #49a9e3;
  }

  &__blue {
    background-color: #49a9e3;
  }

  &__purple {
    background-color: #c345b3
  }

  &__mint {
    background-color: #56bab2;
  }

  &__green {
    background-color: #9bcf02;
  }

  &__pink {
    background-color: #e57e85;
  }

  &__white {
    background-color: #FFF;
  }

  &__lavender {
    background-color: #f9cedf
  }

  &__lemon {
    background-color: #fff467;
  }

  &__red {
    background-color: #c5343b
  }

  &__coral {
    background-color: #fa6d6e;
  }

  &__hot-pink {
    background-color: #de438d;
  }

  &__blush {
    background-color: #e57e85;
  }
}


.dropbtn {
  color: $primary-purple;
  outline: none;
  border: 1px solid $grayscale-gray;
  outline: none;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  font-family: Medium;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.5px;
  text-align: center;
  // justify-content: center;
  border: 1px solid #d9dbe8;
  position: relative;
  border-radius: 15px;

  &:focus {
    outline: none;
  }
}
/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
   &:focus {
    outline: none;
  }
}
.dropdown-mobile {
  width: 100%;
}
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  top: 30px;
  background-color: $primary-purple-tint;
  // background-color: blue;
  border-radius: 12px;
  min-width: 160px;
  width: 220px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  // z-index: 1;
  @media screen and (max-width: 768px) {
    width: 98%;
  }
}

.dropdown-content-right {
  right: 0;
}
.dropdown-text-item {
  font-size: 14px;
  color: $primary-purple;
  font-family: Bold;
  text-transform: uppercase;
  line-height: 2.29;
  letter-spacing: 1.17px;
  display: flex;
  align-items: center;
  cursor: pointer;
  // 
  &__text {
    margin-left: 20px;
  }
  // margin-bottom: 10px;
}
/* Links inside the dropdown */
.dropdown-content a {
  text-decoration: none;
  color: $primary-purple !important;
}
.menu-item {
  color: $primary-purple;
  border-radius: 25px;
}
/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background: transparent;
}
/* Show the dropdown menu on hover */
// .dropdown:hover .dropdown-content {display: block;}
/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  @include hover-transition;
  // background-color: #3e8e41;
}

.check-selected-container {
  width: 25px;
}

.check-selected {
  margin-left: 15px;
}

.caret-container {
  transform: rotate(180deg);
  position: absolute;
  right: 20px;
}
// .filters {
//   display: flex;
//   justify-content: space-between;
//   @media screen and (max-width: 786px) {
//     flex-direction: column;
//   }
// }
// .filter {
//   padding-left: 1rem;
//   border-right: 1px solid rgb(206, 206, 206);

//   flex-grow: 3;
//   margin-bottom: 0.5rem;
//   @media screen and (max-width: 786px) {
//     border: none;
//     margin-bottom: 2rem;
//   }
//   margin-right: 1rem;
//   &:last-of-type {
//     border-right: unset;
//   }
// }
// .facet-values {
//   columns: 3;
//   @media screen and (max-width: 1200px) {
//     columns: 2;
//   }
//   @media screen and (max-width: 950px) {
//     columns: 1;
//   }
// }
// .value {
//   break-inside: avoid;
//   cursor: pointer;
//   user-select: none;
// }
// h3 {
//   font-size: 16pt;
//   margin-bottom: 1.5rem;
// }
// h4 {
//   font-size: 14pt;
//   margin-bottom: 0.5rem;
// }
</style>
