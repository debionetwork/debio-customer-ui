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
          PaymentCheckout(:prefillService="prefillService")
                    
</template>

<script>

import PaymentCheckout from "./PaymentCheckout"
import { fetchPaymentDetails } from "@/common/lib/polkadot-provider/query/orders"

export default {
  name: "Checkout",

  components: {
    PaymentCheckout
  },

  data: () => ({
    prefillService: {},
    stepperItems: [
      { number: 1, title: "Select Location and Service Category", active: false },
      { number: 2, title: "Select Service", active: false },
      { number: 3, title: "Checkout & Payment", active: true },
      { number: 4, title: "Success", active: false }
    ]  
  }),

  async created() {
    if (!this.$route.params.id) return

    const data = await fetchPaymentDetails(this.$route.params.id)
    console.log(data);

    this.prefillService = {
      service: {
        price: data?.service_info.prices_by_currency[0].price_components[0].value,
        currency: data?.service_info.prices_by_currency[0].currency,
        qc_value: data?.service_info.prices_by_currency[0].additional_prices[0].value,
        total_price: data?.service_info.prices_by_currency[0].total_price
      },
      lab: {
        name: data?.lab_info.name,
        city: data?.lab_info.city,
        county: data?.lab_info.county,
        address: data?.lab_info.address,
        duration: data?.service_info.expected_duration.duration,
        duration_type: data?.service_info.expected_duration.duration_type,
        service_image: data?.service_info.image,
        service_name: data?.service_info.name,
        service_rating: 5, // Update when backend is ready
        price: data?.service_info.prices_by_currency[0].price_components[0].value,
        currency: data?.service_info.prices_by_currency[0].currency,
        lab_rating: 4
      }
    }
  },

  methods: {
    handleBack() {
      if (Object.keys(this.prefillService).length) return
      this.$router.push({ name: "customer-request-test-service"})
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
