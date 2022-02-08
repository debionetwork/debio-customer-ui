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
import errorMessage from "@/common/constants/error-messages"
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

    englishAlphabeth() {
      return  val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || errorMessage.INPUT_CHARACTER("English alphabet")
    },

    fieldRequired() {
      return val => !!val || errorMessage.REQUIRED
    },

    titleRule() {
      return[
        this.fieldRequired,
        this.englishAlphabeth,
        val => val && val.length < 50 || errorMessage.MAX_CHARACTER(50)
      ]
    },

    descriptionRule() {
      return[
        this.fieldRequired,
        this.englishAlphabeth,
        val => val && val.length < 255 || errorMessage.MAX_CHARACTER(255)
        
      ]
    },

    fileRule() {
      return[
        this.fieldRequired,
        val => (val && val.size < 1000000) || errorMessage.FILE_SIZE(1)
      ]
    }
  },

  methods: {
    onSubmit() {
      console.log("HELLO from Submit")
      this.isSuccess = true
      console.log(this.isSuccess)
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
