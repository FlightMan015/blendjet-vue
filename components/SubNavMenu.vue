<template>
  <div
    ref="root"
    class="sub-nav-menu"
    :style="{
      '--bgcolor': section.backgroundColor || '#fff',
      '--color': section.textColor || '#000'
    }"
  >
    <div class="sub-nav-menu__content" ref="root">
      <div class="sub-nav-menu__link" v-for="link in menu" :key="link.title">
        <a v-if="link.type === 'External'" :href="link.to">{{ link.title }}</a>
        <nuxt-link v-else :to="link.to">{{ link.title }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Scrollable from '~/components/Scrollable'

export default {
  props: {
    section: {
      type: Object,
      required: true
    }
  },
  components: { Scrollable },
  computed: {
    ...mapGetters('space', ['getLinks']),
    menu() {
      return this.getLinks(this.section.nacelleLinkListHandle)
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-nav-menu {
  background: var(--bgcolor);
  position: sticky;
  top: 100px;
  z-index: 998;

  &__content {
    max-width: 1400px;
    width: 100%;
    height: 40px;
    margin: 0 auto;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow-x: auto;
    white-space: nowrap;
    justify-content: center;
    scrollbar-width: none;
    -ms-overflow-style: none;

    @media (max-width: 1100px) {
      justify-content: flex-start; // ensure left edge of flexed container is aligned left (prevents bug where content is off-screen)
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__link {
    padding: 0 2rem;

    a {
      color: var(--color);
    }
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 40px;
    top: 0;
    background: var(--bgcolor);
    pointer-events: none;
  }

  &:before {
    left: 0;
    mask-image: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0, rgba(0, 0, 0, 1)),
      color-stop(1, rgba(0, 0, 0, 0))
    );
  }
  &:after {
    right: 0;
    mask-image: -webkit-gradient(
      linear,
      right top,
      left top,
      color-stop(0, rgba(0, 0, 0, 1)),
      color-stop(1, rgba(0, 0, 0, 0))
    );
  }
}
</style>
