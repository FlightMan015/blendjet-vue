<template>
  <div class="tabs is-toggle is-toggle-rounded">
    <ul class="tab-container">
      <li
        v-for="item in tabItems"
        @click="handleChangeTab(item)"
        :key="item"
        class="tab-item"
        :class="item === active ? 'is-active' : null"
      >
        <a>
          <span :style="tabItemStyle">{{ item }}</span>
        </a>
      </li>
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
  padding: 3px;
  border: 1px solid $primary-purple;
  border-radius: $border-radius;
  height: 32px;
}

.tabs a {
  padding: 0 1.2rem;
}
.tabs.is-toggle li a {
  background-color: transparent;
}

.tabs.is-toggle li.is-active a {
  background-color: $primary-purple;
  border: none;
  color: $grayscale-white;
  border-radius: $border-radius;
  height: 100%;
  z-index: 1;
}
</style>
