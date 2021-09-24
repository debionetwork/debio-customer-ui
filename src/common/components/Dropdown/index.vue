<template lang="pug">
  .ui-debio-dropdown(:class="classes" :style="computeStyle" v-click-outside="handleBlur")
    .ui-debio-dropdown__label(:aria-label="label")
      span {{ label }}
      ui-debio-icon(v-if="computeErrorMessage" :icon="alertIcon" stroke size="15" color="#C400A5")
    .ui-debio-dropdown__wrapper(@click="openOptions")
      .ui-debio-dropdown__label-value
        span(aria-label="Vaccinations") {{ selectedOption }}
        v-icon(:class="{ 'ui-debio-dropdown__chevron--active': active }") mdi-chevron-down

      .ui-debio-dropdown__selects(:class="{ 'ui-debio-dropdown__selects--show': active }" role="listbox")
        .ui-debio-dropdown__item(
          role="option"
          v-for="(item, idx) in computeItems"
          :key="item.id"
          :class="{ 'ui-debio-dropdown__item--selected': item.selected }"
          :aria-selected="item.selected"
          @blur="handleBlur"
          @click="handleSelectItem(item, idx)"
        )
          slot(name="item" v-if="$slots.item || $scopedSlots.item" :item="item" :index="idx")
          span(v-else) {{ item[itemText] }}
    .ui-debio-input__error-message(v-if="computeErrorMessage") {{ computeErrorMessage }}
</template>

<script>
import { alertIcon } from "@/common/icons"
import { validateInput } from "@/common/mixins"

export default {
  name: "UiDebioDropdown",
  mixins: [validateInput],

  props: {
    items: { type: Array, default: () => [] },
    itemValue: { type: String, default: "" },
    width: { type: [String, Number], default: 200 },
    itemText: { type: String, default: "" },
    label: { type: String, default: "Default Label" },
    customLabel: { type: Function, default: () => {} },
    placeholder: { type: String, default: "Select options" },
    value: { type: [String, Number, Boolean, Object], default: null },
    variant: { type: String, default: "default" },

    outlined: Boolean,
    returnObject: Boolean,
    closeOnSelect: Boolean,
    block: Boolean
  },

  data: () => ({ active: false, alertIcon }),

  computed: {
    classes() {
      return [
        { "ui-debio-dropdown--default": this.variant === "default" },
        { "ui-debio-dropdown--small": this.variant === "small" },
        { "ui-debio-dropdown--large": this.variant === "large" },
        { "ui-debio-dropdown--outlined": this.outlined },
        { "ui-debio-dropdown--active": this.active },
        { "ui-debio-dropdown--errored": this.isError && this.isError?.length }
      ]
    },

    computeItems() {
      return this.items.map(item => ({ ...item, selected: false, customLabelResult: "" }))
    },

    computeStyle() {
      return {
        width: this.block ? "100%" : `${this.width}px`
      }
    },

    selectedOption() {
      return this.value
        ? this.customLabelResult
          ? this.customLabelResult
          : this.value
        : this.placeholder
    }
  },

  watch: {
    selectedOption(val) {
      let value = val
      if (value === this.placeholder) value = null
      const error = this.rules.reduce((filtered, rule) => {
        const isError = rule.call(this, value)

        if (typeof isError !== "boolean") filtered.push({ message: isError })

        return filtered
      }, [])
      this.$emit("isError", this.uuid, Boolean(error.length))

      this.isError = error
    }
  },

  methods: {
    handleSelectItem(selectedItem, indexValue) {
      this.computeItems.forEach((item , idx) => {
        if (indexValue === idx && item.selected !== true) item.selected = true

        else item.selected = false
      })

      let value = this.returnObject ? selectedItem : selectedItem[this.itemValue]

      if (!selectedItem.selected) value = null

      if (this.customLabel) this.customLabelResult = this.customLabel(selectedItem)

      if (this.closeOnSelect) this.active = false

      this.$emit("input", value)
    },

    openOptions() {
      this.active = true
    },

    handleClickOutside() {
      this.active = false
    },

    async handleBlur(event) {
      if (event?.type !== "click") await new Promise(resolve => setTimeout(resolve, 150))
      this.$nextTick(() => {
        this.active = false
        if ("blur" in this.$listeners) this.$listeners.blur()
      })
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-dropdown
    &__label
      display: inline-block
      margin-bottom: 0.75rem
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      display: flex
      align-items: center
      justify-content: space-between
    
    &__wrapper
      background: #FFFFFF
      position: relative
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem
      cursor: text
      display: flex
      border: solid 0.125rem transparent
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      cursor: pointer
      height: 2.5rem
      width: 100%
      padding: 0.875rem 1.125rem
      font-size: 1rem
      color: black

    &__label-value
      display: flex
      justify-content: space-between
      align-items: center
      width: 100%

    &__chevron
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &--active
        color: #5640A5 !important
        transform: rotate(180deg)

    &__selects
      position: absolute
      right: 0
      z-index: 20
      width: 100%
      max-height: 12.75rem
      border-radius: 0.25rem
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      background: #FFFFFF
      transform: translateY(-0.625rem)
      opacity: 0
      visibility: hidden
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &--show
        opacity: 1
        visibility: visible
        transform: translateY(0)
        overflow-y: auto

      &::-webkit-scrollbar-track
        background-color: #FFFFFF

      &::-webkit-scrollbar
        width: 0.2rem

      &::-webkit-scrollbar-thumb
        border-radius: 0.625rem
        background: #D3C9D1

    &__item
      position: relative
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      padding: 0.313rem 1.875rem
      @include body-text-medium-3

      &:first-of-type
        border-radius: 0.25rem 0.25rem 0 0

      &:last-of-type
        border-radius: 0 0 0.25rem 0.25rem

      &:hover
        background: #F5F7F9

        &::before
          opacity: 1

      &::before
        content: ""
        display: block
        position: absolute
        opacity: 0
        left: 0
        width: 0.313rem
        height: 100%
        border-radius: 0 0.25rem 0.25rem 0
        background: #C400A5
        top: 50%
        transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
        transform: translateY(-50%)

      &--selected
        background: #F5F7F9
        
        &::before
          opacity: 1


    &--disabled
      .ui-debio-dropdown__wrapper
        overflow: hidden
        background: #F5F5F5

    &--active
      .ui-debio-debio__wrapper
        border-color: #5640A5 !important

    &--prepend-icon
      .ui-debio-dropdown__label-value
        margin-left: 1.375rem

    &--append-icon
      .ui-debio-dropdown__label-value
        margin-right: 1.375rem

    &--outlined
      .ui-debio-dropdown__wrapper

        &:not(.ui-debio-dropdown__wrapper--active)
          border-color: #757274
          box-shadow: unset

    &--active
      .ui-debio-dropdown__wrapper
        border-color: #5640A5 !important

      .ui-debio-dropdown__label
        color: #5640A5 !important

      .ui-debio-dropdown__icon > svg
        color: #5640A5 !important

    // Variant
    &--outlined
      .ui-debio-dropdown__wrapper
        border-color: #757274
        box-shadow: unset
      
    &--default
      .ui-debio-dropdown__label
        @include body-text-2

      .ui-debio-dropdown__wrapper
        height: 2.938rem

      .ui-debio-dropdown__selects
        top: 4rem

      .ui-debio-dropdown__label-value
        @include body-text-medium-2

      .ui-debio-input__error-message
        @include body-text-2

    &--small
      .ui-debio-dropdown__label
        @include body-text-4

      .ui-debio-dropdown__wrapper
        height: 2.5rem

      .ui-debio-dropdown__selects
        top: 3.5rem

      .ui-debio-dropdown__label-value
        @include body-text-medium-3

      .ui-debio-input__error-message
        @include body-text-4

    &--large
      .ui-debio-dropdown__label
        @include body-text-1

      .ui-debio-dropdown__wrapper
        height: 3.688rem

      .ui-debio-dropdown__selects
        top: 4.5rem

      .ui-debio-dropdown__label-value
        @include body-text-medium-1

      .ui-debio-input__error-message
        @include body-text-1

    &--errored
      animation: shake .10s cubic-bezier(.7, -0.04, .61, 1.14)

      @keyframes shake
        0%
          transform: translate(-0.25rem, 0)
        50%
          transform: translate(0, 0)
        75%
          transform: translate(-0.25rem, 0)
        90%
          transform: translate(0, 0)
        100%
          transform: translate(-0.25rem, 0)

      .ui-debio-dropdown__wrapper
        border-color: #C400A5 !important

      .ui-debio-dropdown__label,
      .ui-debio-dropdown__label-value,
      .ui-debio-dropdown__label-value i
        color: #C400A5 !important
</style>
