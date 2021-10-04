<template lang="pug"> 
  .customer-request-test
    .customer-request-test__wrapper
      .customer-request-test__nav
        div.text-center Request a Test
      
      .customer-request-test__main
        .customer-request-test__stepper
          ui-debio-stepper( 
            :items="stepperItems"
            with-line-indicator
          )
        
        .customer-request-test__form
          RequestTestForm
             
</template>

<script>

import RequestTestForm from "./RequestTestForm"
import RequestTestNav from "./RequestTestNav"

export default {
  name: "RequestTest",

  components: {
    RequestTestForm,
    RequestTestNav
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select a location and Service Category", active: true },
      { number: 2, title: "Select a lab", active: false },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: false }
    ]
  }),

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-dashboard"})
    }
  }
}
</script>


<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-request-test
    width: 100%
    height: 100% 
    background: #FFFFFF

    &__wrapper
        width: 100%
        height: 100%
        background: #FFFFFF
        box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
        border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__main
      padding: 2.313rem 3.125rem
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__form
      width:100%
</style>
