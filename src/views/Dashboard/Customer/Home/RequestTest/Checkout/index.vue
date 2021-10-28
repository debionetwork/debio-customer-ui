<template lang="pug"> 
  .customer-payment-checkout
    .customer-payment-checkout__wrapper
      .customer-payment-checkout__nav
        .customer-payment-checkout__nav-button(@click="handleBack")
          v-icon.customer-payment-checkout__nav-icon mdi-chevron-left
      
      .customer-payment-checkout__main
        .customer-payment-checkout__stepper
          ui-debio-stepper( 
            :items="stepperItems"
          )
        
        template
          PaymentCheckout
                    
</template>

<script>

import PaymentCheckout from "./PaymentCheckout"

export default {
  name: "Checkout",

  components: {
    PaymentCheckout
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: false },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: true },
      { number: 4, title: "Success", active: false }
    ]  
  }),

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-select-service"})
    }
  }
}
</script>


<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-payment-checkout
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
