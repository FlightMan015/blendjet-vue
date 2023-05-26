<template>
<div>
  <div class="tabs is-toggle is-toggle-rounded" v-if="!checkbox">
    <ul class="tab-container">
      <li v-for="item in tabItems" @click="handleChangeTab(item.type)" :key="item.type" class="tab-item" :class="item.type === active  ? 'is-active' : null">
        <a >
          <div :id="item.name" :style="tabItemStyle">{{item.text}}</div>
        </a>
      </li>
      <!-- <li @click="handleChangeTab('subscription')" class="tab-item" :class="active === 'subscription' ? 'is-active' : null"><span :style="tabItemStyle">Subscribe & 
         Save {{discountPercentage}}%</span></li>
      <li @click="handleChangeTab('onetime')" class="tab-item" :class="active === 'onetime'  ? 'is-active' : null"><span :style="tabItemStyle">One-time 
         Purchase</span></li> -->
    </ul>
  </div>
  <div class="checkbox" v-if="checkbox">
    <b-checkbox v-model="purchaseType" true-value="subscription" false-value="onetime" class="checkbox__text">Subscribe and Save 15%</b-checkbox>
  </div>
</div>
</template>

<script>
import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'

export default {
  data() {
    return {
      active: '',
      tabItemStyle: {
        fontSize: '12px',
        lineHeight: '1.17',
        textTransform: 'uppercase',
        fontFamily: 'Bold',
        paddingTop: '4px',
        paddingBottom: '4px'
      },
      tabItems: [
        {text: 'Subscribe \n& Save 15%', type:'subscription'},
        {text: 'One-time \npurchase', type:'onetime'}
      ]
      
      // purchaseType: this.active
    }
  },
  methods: {
    handleChangeTab(tabItem) {
      this.active = tabItem;
      this.purchaseType = tabItem;
    }
  },
  watch: {
    product() {
      this.handleChangeTab(this.active)
    }
  },
  props: {
    product: {
      type: Object,
      default: () => {
        return {
          priceRange: {
            min: '0',
            max: '0'
          },
          title: '',
          category: '',
          featuredMedia: {
            src: '',
            thumbnailSrc: ''
          },
          description: '',
          id: '',
          handle: '',
          variants: [],
          options: [],
          metafields: []
        }
      }
    },
    checkbox: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.handleChangeTab(this.tabItems[0].type)
  },
  mixins: [ rechargeProperties, productMetafields ]
}


    // TAB ANIMATION REFERENCE 
    // __animate (oldName, newName) {
    //   const
    //     oldTab = oldName !== void 0 && oldName !== null && oldName !== ''
    //       ? this.$children.find(tab => tab.name === oldName)
    //       : null,
    //     newTab = newName !== void 0 && newName !== null && newName !== ''
    //       ? this.$children.find(tab => tab.name === newName)
    //       : null

    //   if (oldTab && newTab) {
    //     const
    //       oldEl = oldTab.$el.getElementsByClassName('q-tab__indicator')[0],
    //       newEl = newTab.$el.getElementsByClassName('q-tab__indicator')[0]

    //     clearTimeout(this.animateTimer)

    //     oldEl.style.transition = 'none'
    //     oldEl.style.transform = 'none'
    //     newEl.style.transition = 'none'
    //     newEl.style.transform = 'none'

    //     const
    //       oldPos = oldEl.getBoundingClientRect(),
    //       newPos = newEl.getBoundingClientRect()

    //     newEl.style.transform = this.vertical === true
    //       ? `translate3d(0,${oldPos.top - newPos.top}px,0) scale3d(1,${newPos.height ? oldPos.height / newPos.height : 1},1)`
    //       : `translate3d(${oldPos.left - newPos.left}px,0,0) scale3d(${newPos.width ? oldPos.width / newPos.width : 1},1,1)`

    //     // allow scope updates to kick in (QRouteTab needs more time)
    //     this.$nextTick(() => {
    //       this.animateTimer = setTimeout(() => {
    //         newEl.style.transition = 'transform .25s cubic-bezier(.4, 0, .2, 1)'
    //         newEl.style.transform = 'none'
    //       }, 70)
    //     })
    //   }

    //   if (newTab && this.scrollable === true) {
    //     const
    //       { left, width, top, height } = this.$refs.content.getBoundingClientRect(),
    //       newPos = newTab.$el.getBoundingClientRect()

    //     let offset = this.vertical === true ? newPos.top - top : newPos.left - left

    //     if (offset < 0) {
    //       this.$refs.content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] += Math.floor(offset)
    //       this.__updateArrows()
    //       return
    //     }

    //     offset += this.vertical === true ? newPos.height - height : newPos.width - width
    //     if (offset > 0) {
    //       this.$refs.content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] += Math.ceil(offset)
    //       this.__updateArrows()
    //     }
    //   }
    // },
</script>

<style scoped lang="scss">

.tabs.is-toggle.is-toggle-rounded li:first-child a {
  padding-left: 1.25em;
}

.tabs.is-toggle.is-toggle-rounded li:last-child a {
  padding-left: 1.25em;
}

.tabs.is-toggle a {
  border-style: none;
  border-width: 1px;
  margin-bottom: 0;
  position: relative;
}

.tabs ul {
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: flex-start;
  // padding: 3px;
  border: 1px solid $secondary-purple-4;
  border-radius: $border-radius;
  height: 50px;
}

.tabs a {
  padding: 0 1.2rem;
}

.tabs.is-toggle li.is-active a {
  background-color: $secondary-purple-4;
  border: 1px solid $primary-purple;
  color: $primary-purple;
  border-radius: $border-radius;
  z-index: 1;
  height: 100%;
  z-index: 0;
}

.tabs.is-toggle a:hover {
  background-color: none !important;
  // @include hover-transition;
}

.tab-item {
  height: 100%;
  display: flex;
  align-items: center;
}

</style>