<template>
  <component
    :is="tag"
    v-bind="linkProps()"
    :style="{ '--color': color }"
    :class="{'cta-button': true, 'cta-button__outlined': ctaStyle === 'outline'}"
    @click="event => $emit('clicked', event)"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    ctaStyle: {
      type: String
    },
    color: {
      type: String
    }
  },
  computed: {
    isExternalLink() {
      return this.to.match(/^(http(s)?|ftp):\/\//)
    },
    tag() {
      return this.isExternalLink ? 'a' : 'button'
    }
  },
  methods: {
    linkProps() {
      if (this.isExternalLink) {
        return {
          href: this.to,
          target: '_blank',
          rel: 'noopener'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.cta-button {
  background-color: var(--color);
  border-color: var(--color);
  border-radius: 40px;
  border-width: 1px;
  color: #363636;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-family: 'Bold';
  font-size: 12px;
  height: 40px;
  letter-spacing: 1.75px;
  line-height: 14px;
  padding: 0.5rem 2rem;
  text-transform: uppercase;
  white-space: nowrap;
  width: 240px;

  &__outlined {
    border: 1px solid;
    background: none;
    color: var(--color);
    border-color: var(--color);
  }

  &:hover {
    opacity: 0.7;
    transition: 0.5s ease;
  }

  &:focus {
    outline: none;
  }
}
</style>
