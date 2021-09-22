<template lang="pug">
  .customer-create-emr
    .customer-create-emr__wrapper
      .customer-create-emr__nav
        .customer-create-emr__nav-button(@click="handleBack()")
          v-icon.customer-create-emr__nav-icon mdi-chevron-left
          span Back to My EMR
      .customer-create-emr__main
        .customer-create-emr__stepper
          ui-debio-stepper(:items="stepper")

        .customer-create-emr__forms
          ui-debio-input(v-model="documentTitle" validateOnBlur variant="small" label="Document Title" placeholder="Add Document Title" block outlined :rules="computeRules" @isError="handleError")
          ui-debio-dropdown(
            :value="selectedCategory"
            variant="small"
            label="File Category"
            return-object
            placeholder="Choose Category"
            close-on-select
            :custom-label="customLabel"
            :items="categories"
            item-text="name"
            item-value="name"
            outlined
            block
            @input="handleSelected"
          )
            template(v-slot:item="{ item }")
              span {{ item.icon }} {{ item.name }}
          ui-debio-textarea(v-model="documentDescription" variant="small" label="Description" placeholder="Add Description" :rules="computeTextAreaRules" block outlined)
          ui-debio-file(variant="small" accept=".pdf" label="Document Title" block outlined)
          Button(block :disabled="hasError" height="40" color="secondary" @click="handleContinue") Continue

</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "CustomerEmrCreate",

  components: { Button },

  data: () => ({
    hasError: false,
    documentTitle: "",
    documentDescription: "",
    selectedCategory: null,
    stepper: [
      {
        number: 1,
        title: "Select a File",
        active: true
      },
      {
        number: 2,
        title: "Upload",
        active: false
      }
    ],
    categories: [
      {
        name: "Allergies and adverse drug reactions",
        icon: "💊"
      },
      {
        name: "Chronic diseases",
        icon: "❤️"
      },
      {
        name: "Imaging Reports (e.g. X-ray)",
        icon: "📷"
      },
      {
        name: "Vaccinations",
        icon: "💉"
      },
      {
        name: "Observations of daily living (ODLs)",
        icon: "🩺"
      },
      {
        name: "Others",
        icon: "🛡️"
      }
    ]
  }),

  computed: {
    computeRules() {
      return [
        val => !!val || "Document title required!"
      ]
    },

    computeTextAreaRules() {
      return [
        val => (val && val.length >= 20) || "Document description min 20 character!"
      ]
    }
  },

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-emr" })
    },

    handleSelected(val) {
      if (val) this.selectedCategory = val.name
    },

    handleContinue() {
      // TODO: Should continue to next step
    },

    handleError(val) {
      this.hasError = val
    },

    customLabel({ icon, name }) {
      return `${icon} ${name}`
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-create-emr
    width: 100%
    height: 100%

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__nav-icon
      border-radius: 0.063rem
      color: #D3C9D1 !important
      background: #F5F7F9
      
    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__forms
      padding-bottom: 6rem
      display: flex
      flex-direction: column
      align-items: center
      gap: 2.063rem
      margin-top: 3.25rem
      width: 39.188rem

</style>
