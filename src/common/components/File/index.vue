<template lang="pug">
  .ui-debio-file
    label.ui-debio-file__label File input

    .ui-debio-file__wrapper
      input.ui-debio-file__input(type="file" ref="input-file" :accept="accept" @change="handleFileChange")
      ui-debio-input(block read-only variant="small" outlined :value="computeFileName")
        v-icon(slot="icon-append" v-if="selectedFile" size="15" @click="handleClearFile") mdi-window-close
      Button.ui-debio-file__button(color="secondary" height="40" @click="handleChooseFile") {{ computeButtonLabel }}

</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "UiDebioFile",

  components: { Button },

  props: {
    accept: { type: [Array, String], default: () => [".docx", ".pdf", ".doc"] }
  },

  data: () => ({
    selectedFile: null
  }),

  computed: {
    computeFileName() {
      return this.selectedFile?.name || ""
    },

    computeButtonLabel() {
      return this.selectedFile ? "Change File" : "Choose File"
    }
  },

  methods: {
    handleChooseFile() {
      this.$refs["input-file"].click()
    },

    handleFileChange(event) {
      if (!event.target.value) return

      this.selectedFile = event.target.files[0]
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
      display: inline-block
      margin-bottom: 0.75rem
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s
      @include body-text-4

    &__wrapper
      display: flex
      gap: 1rem

    &__input
      display: none
</style>
