<template lang="pug">
  v-dialog.information-dialog(:value="show" width="440" persistent rounded )
    v-card
      .information-dialog__close
        v-btn.fixed-button(icon @click="closeDialog")
          v-icon mdi-close
    
      .information-dialog__title Important Information

      .information-dialog__card
        ol.information-dialog__card-text 
          li.information-dialog__text We do not provide medical or diagnostic advice. Any service on the DeBio platform is provided for research, informational, and educational use only. You should always seek the advice of your physician or other health care provider with any questions you may have regarding diagnosis, cure, treatment, mitigation, or prevention of any disease or other medical condition or impairment or the status of your health.
          li.information-dialog__text The results obtained from the genetic analysis feature will adhere to current and present updated scientific research. As a word of caution, the results may not deduce new information and may be identical to the previous results.

      .information-dialog__button
        ui-debio-button(
          width="340"
          height="35" 
          color="secondary" 
          @click="onSubmit"
        ) Continue

</template>



<script>

export default {
  name: "InformationDialog",

  props: {
    show: Boolean
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSubmit() {
      this.$emit("click")
    }
  }
}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .information-dialog
    margin-top: 0 !important
    width: 440px
    height: 570px

    &__title
      padding: 10px 0px 24px 0px
      display: flex
      align-items: center
      justify-content: center
      letter-spacing: 0.0075em
      @include button-1

    &__card
      width: 440
      height: 335
      background-color: #F5F7F9
      margin: 0 50px 
      padding: 10px 14px 0px 14px

    &__card-text
      text-align: justify
      letter-spacing: -0.0044em
      @include new-body-text-2-medium

    &__button
      margin-top: 32px
      padding-bottom: 26px
      display: flex
      align-items: center
      justify-content: center

    &__close
      display: flex
      justify-content: flex-end
      padding: 1.013rem !important

    &__text
      margin-bottom: 10px
  
  .fixed-button
    position: fixed
    width: 50px

</style>
