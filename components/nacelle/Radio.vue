<template>
  <div class="radio-component" @click.self="onChange">
    <input
      :id="id"
      type="radio"
      :name="name"
      :value="value"
      :class="className"
      :required="required"
      :disabled="disabled"
      :checked="state"
      @change.self="onChange"
    >
    <label :for="id">
      <slot name="input-box">
        <span class="input-box">
          <span class="input-box-circle" />
        </span>
      </slot>
      <slot />
    </label>
  </div>
</template>

<script>
// https://mariomka.github.io/vue-checkbox-radio/
export default {
  model: {
    prop: 'modelValue',
    event: 'input'
  },
  props: {
    id: {
      type: String,
      default () {
        return `radio-id-${this._uid}`
      }
    },
    name: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: undefined
    },
    className: {
      type: String,
      default: null
    },
    checked: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    state () {
      if (this.modelValue === undefined) {
        return this.checked
      }
      return this.modelValue === this.value
    }
  },
  watch: {
    checked (newValue) {
      if (newValue !== this.state) {
        this.toggle()
      }
    }
  },
  mounted () {
    if (this.checked && !this.state) {
      this.toggle()
    }
  },
  methods: {
    onChange () {
      this.toggle()
    },
    toggle () {
      this.$emit('input', this.state ? '' : this.value)
    }
  }
}
</script>
<style lang="scss">
  .radio-component {
    > input {
      opacity: 0;
      position: absolute;
      + label > .input-box {
        display: inline-block;
        border: 1px solid #dbdbdb;
        border-radius: 50%;
        margin: 0;
        padding: 0;
        width: 1em;
        height: 1em;
        background: #fff;
        overflow: hidden;
        vertical-align: -5%;
        user-select: none;
          > .input-box-circle {
            display: block;
            margin: 50%;
            width: 0%;
            height: 0%;
            background: #3b3b3b;
            border-radius: 50%;
            opacity: 0;
            transition: width 0.15s ease-in, height 0.15s ease-in, margin 0.15s ease-in;
          }
      }
      &:checked + label > .input-box > .input-box-circle {
        opacity: 1;
        margin: 22%;
        width: 56%;
        height: 56%;
      }
      &:focus + label > .input-box {
        box-shadow: 0 0 2px 3px #73b9ff;
      }
      &:disabled + label {
        opacity: 0.7;
      }
    }
  }
</style>
