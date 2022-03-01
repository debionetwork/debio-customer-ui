<template lang="pug">
  v-dialog.information-dialog(:value="show" width="440" persistent rounded )
    v-card
      .information-dialog__close
        v-btn.fixed-button(icon @click="closeDialog")
          v-icon mdi-close
    
      .information-dialog__title Important Information

      .information-dialog__card
        div.information-dialog__card-text 
          span.information-dialog__text We do not provide medical or diagnostic advice. Any service on the DeBio platform is provided for research, informational, and educational use only. You should always seek the advice of your physician or other health care provider with any questions you may have regarding diagnosis, cure, treatment, mitigation, or prevention of any disease or other medical condition or impairment or the status of your health.


      .information-dialog__button
        Button(
          width="340"
          height="35" 
          color="secondary" 
          @click="onSubmit"
        ) Continue

</template>



<script>
import Button from "@/common/components/Button"

export default {
  name: "InformationDialog",

  props: {
    show: Boolean
  },

  components: { Button },

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
      padding: 40px 0px
      display: flex
      align-items: center
      justify-content: center
      letter-spacing: 0.0075em
      @include button-1

    &__card
      width: 340
      height: 335
      background-color: #F5F7F9
      margin: 0 50px 
      padding: 24px

    &__card-text
      @include new-body-text-2-medium
      text-align: justify

    &__button
      margin-top: 32px
      padding-bottom: 50px
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
