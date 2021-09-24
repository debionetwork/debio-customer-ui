<template lang="pug">
  .ui-debio-file(:class="classes")
    .ui-debio-file__label(v-if="label" :aria-label="label")
      span {{ label }}
      ui-debio-icon(v-if="computeErrorMessage" :icon="alertIcon" stroke size="15" color="#C400A5")

    .ui-debio-file__wrapper
      input.ui-debio-file__input(type="file" ref="input-file" :accept="accept" @change="handleFileChange")
      ui-debio-input(block read-only :variant="variant" outlined :value="computeFileName" placeholder="Choose File...")
        v-icon(slot="icon-append" v-if="selectedFile" size="15" @click="handleClearFile") mdi-window-close
      Button.ui-debio-file__button(:color="computeButtonVariant" height="40" @click="handleChooseFile") {{ computeButtonLabel }}

    .ui-debio-file__error-message(v-if="computeErrorMessage") {{ computeErrorMessage }}
</template>

<script>
import Button from "@/common/components/Button"
import { alertIcon } from "@/common/icons"
import { validateInput } from "@/common/mixins"

export default {
  name: "UiDebioFile",
  mixins: [validateInput],

  components: { Button },

  props: {
    accept: { type: [Array, String], default: () => [".docx", ".pdf", ".doc"] },
    label: { type: String, default: null },
    variant: { type: String, default: "default" }
  },

  data: () => ({ selectedFile: null, alertIcon }),

  computed: {
    classes() {
      return [
        { "ui-debio-file--default": this.variant === "default" },
        { "ui-debio-file--small": this.variant === "small" },
        { "ui-debio-file--large": this.variant === "large" },
        { "ui-debio-file--errored": this.isError && this.isError?.length }
      ]
    },

    computeButtonVariant() {
      return this.isError && this.isError?.length ? "primary" : "secondary"
    },

    computeFileName() {
      return this.selectedFile?.name || ""
    },

    computeButtonLabel() {
      return this.selectedFile ? "Change File" : "Choose File"
    }
  },

  watch: {
    selectedFile(val) {
      const error = this.rules.reduce((filtered, rule) => {
        const isError = rule.call(this, val)

        if (typeof isError !== "boolean") filtered.push({ message: isError })

        return filtered
      }, [])

      this.$emit("isError", this.uuid, Boolean(error.length))

      this.isError = error
    }
  },

  methods: {
    handleChooseFile() {
      this.$refs["input-file"].click()
    },

    handleFileChange(event) {
      if (!event.target.value) return

      this.selectedFile = event.target.files[0]
      this.$emit("input", this.selectedFile)
    },

    handleClearFile() {
      this.$refs["input-file"].value = ""
      this.selectedFile = null
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-file
    width: 100%

    &__label
      margin-bottom: 0.75rem
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      display: flex
      align-items: center
      justify-content: space-between

    &__wrapper
      display: flex
      gap: 1rem

    &__input
      display: none

    &__error-message
      color: #C400A5
      margin-top: 0.5rem

    &--default
      .ui-debio-file__label
        @include body-text-2

      .ui-debio-file__button
        height: 47px !important

      .ui-debio-file__input
        @include body-text-medium-2

      .ui-debio-file__error-message
        @include body-text-2

    &--small
      .ui-debio-file__label
        @include body-text-4

      .ui-debio-file__button
        height: 40px !important

      .ui-debio-file__input
        @include body-text-medium-3

      .ui-debio-file__error-message
        @include body-text-4

    &--large
      .ui-debio-file__label
        @include body-text-1

      .ui-debio-file__button
        height: 59px !important

      .ui-debio-file__input
        @include body-text-medium-1

      .ui-debio-file__error-message
        @include body-text-1

    &--errored
      animation: shake .10s cubic-bezier(.7, -0.04, .61, 1.14)

      .ui-debio-file__label
        color: #C400A5 !important

      .ui-debio-input__wrapper
        border-color: #C400A5 !important

      @keyframes shake
        0%
          transform: translate(-4px, 0)
        50%
          transform: translate(0px, 0)
        75%
          transform: translate(-4px, 0)
        90%
          transform: translate(0px, 0)
        100%
          transform: translate(-4px, 0)
</style>
