<template lang="pug">
  .customer-payment-success
    .customer-payment-success__wrapper
      .customer-payment-success__nav
        div.text-center Request a Test

      .customer-payment-success__main
        .customer-payment-success__stepper
          ui-debio-stepper( 
            :items="stepperItems"
            with-line-indicator
          )

        div.mt-5(align="center") 
          div.title Thank you for your order!
          div.title We will inform you once your transaction is completed.

          template
            v-row.mt-10.mb-5(class="d-flex justify-center")
              MenuCard.card-test(
                :title="labName"
                :address="labAddress"
                :sub-title="productName"
                :description="productDescription"
                :price="totalPrice"
                :service-image="productImage"
              )

              PaymentDetailCard.card-test(
                :testing-price="testingPrice"
                :qc-price="qcPrice"
                :totalPrice="totalPrice"
                success
                currency="Dai"
              )
    
      
</template>

<script>

import { mapState, mapMutations } from "vuex"
import MenuCard from "../MenuCard.vue"
import PaymentDetailCard from "../RequestTestCheckout/PaymentDetailCard"
import Button from "@/common/components/Button"

export default {
  name: "PaymentPage",

  components: {
    Button,
    MenuCard,
    PaymentDetailCard
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select a location and Service Category", active: false },
      { number: 2, title: "Select a lab", active: false },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: true }
    ],
    password: "",
    error: "",
    showPassword: false,
    showDialog: false,
    ethSellerAddress: null,
    ethAccount: null,
    isCompleted: false,
    success: true
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs,
      labAccount: (state) => state.testRequest.lab,
      product: (state) => state.testRequest.products,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    })
  },

  methods : {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    closingDialog () {
      this.showDialog = false
      this.isCompleted = true
    },

    toHomePage () {
      this.$router.push({ name: "customer-dashboard" })
    },

    handleBack() {
      this.$router.push({ name: "customer-request-test-checkout"})
    }

  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-payment-success
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

    &__button
      padding: 10rem
      align-items: center  

</style>

