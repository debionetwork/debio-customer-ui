<template lang="pug">
  .customer-payment-checkout
    .customer-payment-checkout__wrapper
      .customer-payment-checkout__nav
        div.text-center Request a Test

        .customer-payment-checkout__stepper
          ui-debio-stepper( 
            :items="stepperItems"
            with-line-indicator
          )

        div.mt-10(align="center") 
          b Checkout your order!

          template
            v-row.mt-10(class="d-flex justify-center")
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
                currency="Dai"
              )
              
</template>

<script>

import { mapState, mapMutations } from "vuex"
import MenuCard from "../MenuCard.vue"
import PaymentDetailCard from "./PaymentDetailCard.vue"
import Button from "@/common/components/Button"
import { fetchPaymentDetails } from "@/common/lib/orders";

export default {
  name: "RequestTestCheckout",

  components: {
    MenuCard,
    PaymentDetailCard,
    Button
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select a location and Service Category", active: false },
      { number: 2, title: "Select a lab", active: false },
      { number: 3, title: "Checkout & Payment", active: true },
      { number: 4, title: "Success", active: false }
    ],
    labDetail: "",
    labName: "",
    labAddress: "",
    productDetail: "",
    productName: "",
    productDescription: "",
    totalPrice: 0,
    productImage: "",
    qcPrice: 0,
    testingPrice: 0,
    currency: ""
  }),

  async created () {
    if (this.$route.params.id) await this.handlePrefill()

    this.labDetail = this.labAccount._source.info
    this.labName = this.labDetail.name
    this.labAdress = this.labDetail.address

    this.productDetail = this.product.info
    this.productName = this.productDetail.name
    this.productDescription = this.productDetail.description
    this.totalPrice = this.productDetail.prices_by_currency[0].total_price
    this.productImage = this.productDetail.image

    this.qcPrice = this.product.info.prices_by_currency[0].additional_prices[0].value
    this.testingPrice = this.product.info.prices_by_currency[0].price_components[0].value
    this.currency = this.product.info.prices_by_currency[0].currency

  },

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs,
      labAccount: (state) => state.testRequest.lab,
      product: (state) => state.testRequest.products
    })
  },

  async mounted () {
    console.log(this.labAccount)
  },

  methods : {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    handleBack() {
      this.$router.push({ name: "customer-select-lab"})
    },

    async handlePrefill() {
      const data = await fetchPaymentDetails(this.$route.params.id)

      this.labDetail = data?.lab_info
      this.labName = data?.lab_info.name
      this.labAdress = data?.lab_info.address

      this.productDetail = data?.service_info
      this.productName = data?.service_info.name
      this.productDescription = data?.service_info.description
      this.totalPrice = data?.service_info.prices_by_currency[0]?.total_price
      this.productImage = data?.service_info.image

      this.qcPrice = data?.service_info?.prices_by_currency[0]?.additional_prices[0]?.value
      this.testingPrice = data?.service_info?.prices_by_currency[0]?.price_components[0]?.value
      this.currency = data?.service_info?.prices_by_currency[0]?.currency[0]

      return
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

