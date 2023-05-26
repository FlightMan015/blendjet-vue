<template>
  <div class="tabs" id="tab-links">
    <ul class="tab-container">
      <nuxt-link v-for="item in tabItems" :to="item.url" :key="item.text" class="tab-item" tag="li">
        <span :style="tabItemStyle">{{ item.text }}</span>
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
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
      }
    }
  },
  props: {
    tabItems: {
      type: Array,
      default: () => []
    },
    selected: {
      type: [String, Number],
      default: () => ''
    },
    noSelectStart: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    selected(newVal) {
      if (this.tabItems.indexOf(newVal) !== -1) {
        this.active = newVal
      } else {
        this.active = ''
      }
    }
  },
  methods: {
    handleChangeTab(tabItem) {
      this.active = tabItem
      this.$emit('activeTab', tabItem)
    }
  },
  mounted() {
    if (!this.noSelectStart) {
      this.active = this.tabItems[0]
    } else if (this.tabItems.indexOf(this.selected) !== -1) {
      this.active = this.selected
    }
  },
  updated() {
    if (this.tabItems.indexOf(this.selected) !== -1) {
      this.active = this.selected
    }
  }
}
</script>

<style scoped lang="scss">
.tabs ul {
  margin: auto;
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: flex-start;
  padding: 3px;
  border: 1px solid $primary-purple;
  border-radius: $border-radius;
  height: 32px;
}

#tab-links {
  .tab-container {
    width: 100%;
    height: 50px;
    padding: 0;
    border: 2px solid $secondary-purple-4;
    background: #fff;
    max-width: 360px;
    .tab-item {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary-purple;
      font-family: Bold;
      line-height: 1.17;
      letter-spacing: 1.75px;
      text-transform: uppercase;
      cursor: pointer;
      font-size: 12px;
      border-radius: $border-radius;

      &.nuxt-link-active {
        background: #e0e0ff;
        border: 2px solid $primary-purple;
        &:hover {
          background: #e0e0ff;
        }
      }
    }
  }
}
</style>
