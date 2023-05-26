<template>
  <div>
    <transition name="fade" mode="out-in">
      <div
        v-if="searchResults && searchResults.length == 0"
        key="no-results"
        class="no-results"
      >
        <slot name="no-results"></slot>
      </div>
      <div key="results" class="search-results" v-else>
        <slot name="result" :result="searchResults"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

export default {
  props: {
    searchKeys: {
      type: Array,
      default: () => {
        return ['title']
      }
    },
    searchData: {
      type: Array
    },
    searchQuery: {
      type: Object
    },
    relevanceThreshold: {
      type: Number,
      default: 0.2
    }
  },
  data() {
    return {
      searchRes: null
    }
  },
  computed: {
    searchResults() {
      // console.log('search Data', this.searchData)
      // console.log('search Query', this.searchQuery)
      
      if (
        this.searchData &&
        this.searchQuery &&
        this.searchQuery.value &&
        String(this.searchQuery.value) !== ''
      ) {
        // console.log('results true')
        const options = {
          keys: this.searchKeys,
          threshold: this.relevanceThreshold
        }
        const results = new Fuse(this.searchData, options).search(
          String(this.searchQuery.value)
        ).filter(result => {
            return  typeof result.item !== 'undefined' &&
                    result.item.vendor !== 'Extend' && 
                    !result.item.title.includes('Auto Delivery') &&
                    !result.item.title.includes('Starter Kit') &&
                    !result.item.title.includes('Patterns') &&   
                    !result.item.title.includes('Test') &&                                                            
                    !result.item.title.includes('DHL')
                    
          })
          .map(result => result.item)

        

         
       
          this.$emit('results', results)
          return results
      }
      // console.log('results false', this.searchData)
      this.$emit('no-query', null)
      return []
      // return this.searchData
    }
  }
}
</script>

<style lang="scss" scoped>
// .search-results,
// .no-results {
//   min-height: 100px;
// }

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>