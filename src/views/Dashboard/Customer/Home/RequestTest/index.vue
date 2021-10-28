<template lang="pug"> 
  .customer-request-test
    .customer-request-test__wrapper
      .customer-request-test__nav
        .customer-request-test__nav-button(@click="handleBack")
          v-icon.customer-request-test__nav-icon mdi-chevron-left
      
      .customer-request-test__main
        .customer-request-test__stepper
          ui-debio-stepper( 
            :items="stepperItems"
          )
        
        template(v-if="isSelectLocation")
          SelectLocation(
            @onSubmit="toSelectService"
          )
          
        template(v-if="isSelectService")
          SelectService(
            @onSelect="toPaymentCheckout"
          )

        template(v-if="isPaymentCheckout")
          PaymentCheckout(
            @onContinue="toSuccessPage"
          )
            
        template(v-if="isSuccessPage")
          Success

          
</template>

<script>

import SelectLocation from "./SelectLocation"
import SelectService from "./SelectService"
import PaymentCheckout from "./PaymentCheckout"
import Success from "./Success"




export default {
  name: "RequestTest",

  components: {
    SelectLocation,
    SelectService,
    PaymentCheckout,
    Success
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: true },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: false }
    ],
    isSelectLocation: true,
    isSelectService: false,
    isPaymentCheckout: false,
    isSuccessPage: false,
    showNoLab: false
  }),


  async mounted () {
    if (!this.services.length) {
      this.showNoLab = true
    }
  },

  methods: {
    handleBack() {
      if (this.isSelectLocation) {
        this.stepperItems[0].active = true
        this.stepperItems[1].active = false
        this.stepperItems[2].active = false
        this.stepperItems[3].active = false
        this.$router.push({ name: "customer-dashboard"})
      }

      if (this.isSelectService) {
        this.isSelectService = false
        this.isSelectLocation = true
        this.stepperItems[0].active = true
        this.stepperItems[1].active = false
        this.stepperItems[2].active = false
        this.stepperItems[3].active = false
      }

      if (this.isPaymentCheckout) {
        this.isPaymentCheckout = false
        this.isSelectService = true
        this.stepperItems[0].active = false
        this.stepperItems[1].active = true
        this.stepperItems[2].active = false
        this.stepperItems[3].active = false
      }

      if (this.isSuccessPage) {
        this.isSuccessPage = false
        this.isPaymentCheckout = true
        this.stepperItems[0].active = false
        this.stepperItems[1].active = false
        this.stepperItems[2].active = true
        this.stepperItems[3].active = false
      }
    },

    toSelectService() {
      this.isSelectLocation = false
      this.isSelectService = true
      this.stepperItems[0].active = false
      this.stepperItems[1].active = true
    },

    toPaymentCheckout () {
      this.isSelectService = false
      this.isPaymentCheckout = true
      this.stepperItems[1].active = false
      this.stepperItems[2].active = true
    },

    toSuccessPage () {
      this.isPaymentCheckout = false
      this.isSuccessPage = true
      this.stepperItems[2].active = false
      this.stepperItems[3].active = true
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

    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      padding-bottom: 100px
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

</style>
