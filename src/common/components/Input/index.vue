<template lang="pug">
  .ui-debio-input(:class="classes" :style="computeStyle")
    label.ui-debio-input__label(for="ui-debio-input" v-if="label" :aria-label="label") {{ label }}

    .ui-debio-input__wrapper(:class="{ 'ui-debio-input__wrapper--active': focus }")
      .ui-debio-input__icon.ui-debio-input__icon--prepend(v-if="$slots['icon-prepend']")
        slot(name="icon-prepend")

      input.ui-debio-input__input(
        v-bind="$attrs"
        v-on="listeners"
        :autocomplete="autocomplete"
        :spellcheck="spellcheck"
        :disabled="disabled"
        @click="focus = true"
        @blur="focus = false"
        id="ui-debio-input"
        ref="input"
      )

      .ui-debio-input__icon.ui-debio-input__icon--append(v-if="$slots['icon-append']")
        slot(name="icon-append")
</template>

<script>
export default {
  name: "UiDebioInput",
  inheritAttrs: false,

  props: {
    autocomplete: { type: String, default: "off" },
    spellcheck: { type: String, default: "false" },
    label: { type: String, default: null },
    width: { type: [Number, String], default: 200 },

    disabled: Boolean,
    block: Boolean
  },

  data: () => ({ focus: false }),

  computed: {
    classes() {
      return [
        { "ui-debio-input--disabled": this.disabled },
        { "ui-debio-input--errored": this.hasErrors },
        { "ui-debio-input--prepend-icon":
          (this.$attrs.value && this.$slots["icon-prepend"]) || this.$slots["icon-prepend"] },
        { "ui-debio-input--append-icon":
          (this.$attrs.value && this.$slots["icon-append"]) || this.$slots["icon-append"] }
      ]
    },

    computeStyle() {
      return {
        width: this.block ? "100%" : `${this.width}px`
      }
    },

    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit("input", event.target.value)
        }
      }
    }
  }
}
</script>

<style lang="sass">
.ui-debio-input
  &__label
    display: inline-block
    margin-bottom: 0.75rem

  &__wrapper
    background: #FFFFFF
    position: relative
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
    border-radius: 0.25rem
    cursor: text
    display: flex
    border: solid 0.125rem transparent
    transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &--active
      border: solid 0.125rem #C400A5

      .ui-debio-input__icon > svg
        color: #C400A5 !important

  &__input
    cursor: inherit
    height: 100%
    width: 100%
    padding: 0.875rem 1.125rem
    font-size: 1rem
    color: black

    &:focus
      outline: none

  &--disabled
    .ui-debio-input__wrapper
      overflow: hidden
      background: #F5F5F5

      input
        cursor: not-allowed
        color: #757274

  &--prepend-icon
    .ui-debio-input__input
      margin-left: 1.375rem

  &--append-icon
    .ui-debio-input__input
      margin-right: 1.375rem

  &__icon
    width: 2.5rem
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    position: absolute
    top: 0

    > .ui-debio-icon
      transition: color .200s ease-out

    &--prepend
      left: 0
      border-radius: 0.25rem 0 0 0.25rem

    &--append
      right: 0
      border-radius: 0 0.25rem 0.25rem 0
</style>