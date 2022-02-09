<template lang="pug">
  .genetic-data-add
    .genetic-data-add__wrapper
      .genetic-data-add__title {{ isEdit ? "Edit Genetic Data" : "Add Genetic Data"}} 
      .genetic-data-add__forms
        ui-debio-input(
          :rules="titleRule"
          v-model="document.title"
          variant="small"
          label="Title"
          placeholder="Add title"
          outlined 
          block 
          validate-on-blur
        )

        ui-debio-textarea(
          :rules="descriptionRule"
          v-model="document.description"
          variant="small"
          label="Description"
          placeholder="Add Description"
          outlined 
          block 
          validate-on-blur
        )

        ui-debio-file(
          v-model="document.file"
          variant="small"
          :rules="fileRule"
          :accept="['.pdf', '.vcf', '.vcg.gz']"
          label="Upload File"
          placeholder="Choose File"
          validate-on-blur
        )
        .genetic-data-add__tx-weight
          span.genetic-data-add__tx-weight-text Estimated transaction weight 
            v-tooltip.visible(right)
              template(v-slot:activator="{ on, attrs }")
                v-icon.dialog-confirmation__trans-weight-icon(
                  style="font-size: 12px;"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                ) mdi-alert-circle-outline 
              span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.

          span( style="font-size: 12px;" ) 0.0014 DBIO
          
        Button(
          :disabled="!disable"
          block
          color="secondary"
          @click="onSubmit"
        ) Submit

      SuccessDialog(
        :show="isSuccess"
        title="Success"
        @close="isSuccess = false"
      )


</template>

<script>
import Button from "@/common/components/Button"
import rulesHandler from "@/common/constants/rules"
import { validateForms } from "@/common/lib/validate"
import { checkCircleIcon } from "@/common/icons"
import SuccessDialog from "@/common/components/Dialog/SuccessDialog"

export default {
  name: "AddGeneticData",
  
  components: { Button, SuccessDialog },

  mixins: [validateForms],

  data: () => ({
    document: {
      title: "",
      description: "",
      file: null
    },
    isEdit: false,
    isSuccess: false,
    checkCircleIcon
  }),

  computed: {
    disable() {
      const { title, description, file } = this.document
      return !title, description, file
    },

    titleRule() {
      return[
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(50)
      ]
    },

    descriptionRule() {
      return[
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.ENGLISH_ALPHABET,
        rulesHandler.MAX_CHARACTER(255)
      ]
    },

    fileRule() {
      return[
        rulesHandler.FIELD_REQUIRED,
        rulesHandler.FILE_SIZE(1000000)
      ]
    }
  },

  methods: {
    onSubmit() {
      this.isSuccess = true
    }
  }
}

</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .genetic-data-add
    width: 100%
    height: 100%

    &__wrapper
      background: #ffffff
      padding-top: 60px
      padding-bottom: 195px

    &__title
      text-align: center
      margin-bottom: 54px
      @include h6-opensans

    &__forms
      display: flex
      flex-direction: column
      gap: 20px
      margin: 0 auto
      max-width: 450px

    &__input
      height: 125px

    &__tx-weight
      display: flex
      justify-content: space-between

    &__tx-weight-text
      letter-spacing: -0.004em
      @include body-text-3-opensans


</style>
