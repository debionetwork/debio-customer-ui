<template lang="pug">
  v-container.request-checkout.mt-16
    template
      Stepper.mt-10( 
        align="center"
        withLineIndicator
        :items="stepperItems"
      )
      
    template
      div.title Checkout your order!

    template
      v-row.mt-10(class="d-flex justify-center")
        MenuCard.card-test(
          :title="labDetail.name"
          :address="labDetail.address"
          :sub-title="productDetail.name"
          :description="productDetail.description"
          :price="productDetail.prices_by_currency[0].total_price"
          :service-image="productDetail.image"

        )

        v-container.payment-details
          v-card.menu-card
            div(class="ml-5 mt-8 mb-8 text-center" )
              span(class="text-lg-h6") Payment Details

            div(class="ml-5 text-start")
              v-row.mb-5
                v-col(cols="6") 
                  b Recepient:
                v-col(cols="6") 
                  div.mb-1( style="font-size: 12px;" ) {{ labDetail.name }}
                  div( style="font-size: 12px;" ) {{ labDetail.address }}
                  

            hr(class="ml-3 me-3 mb-5")
            div(class="ml-5 mb-5 text-start")
              b Payment Details:
            div(class="ml-5 text-start")
              v-row
                v-col(cols="6") 
                  div( style=" font-size: 12px;" ) Service Price:
                v-col(cols="6") 
                  div( style="font-size: 12px;" ) {{ testingPrice}} {{ currency}}
              v-row
                v-col(cols="6") 
                  div( style="font-size: 12px;" ) Transaction Fee:
                v-col(cols="6") 
                  div( style="font-size: 12px;" ) {{ qcPrice }} {{ currency }}

      template
        div(align="center")
          Button(
            class="mt-16"
            color="secondary" 
            width="560"
            height="38"
            @click="onSubmit"
            ) Proceed to payment

</template>

<script>

import { mapState, mapMutations } from "vuex"
import Stepper from '@/common/components/Stepper'
import MenuCard from '@/common/components/MenuCard'
import Button from '@/common/components/Button'


export default {
  name: "RequestTestCheckout",

  components: {
    Stepper,
    MenuCard,
    Button
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: 'Select a location and Service Category', active: false },
      { number: 2, title: 'Select a lab', active: false },
      { number: 3, title: 'Checkout', active: true },
      { number: 4, title: 'Payment', active: false },
    ],
    labDetail: "",
    productDetail: "",
    qcPrice: 0,
    testingPrice: 0,
    currency: ""
  }),

  async mounted () {
    this.labDetail = this.labAccount._source.info
    this.productDetail = this.product.info
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
    }),
  },

  methods : {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),

    async onSubmit () {
      this.$router.push({ name: 'request-test-payment' })
    }
  }
}
</script>

<style lang="scss" scoped>
.request-checkout {
    font-family: 'Raleway';
    width: auto;
    height: 732px;
    background: #FFFFFF;
}

.title {
  font-family: 'Raleway';
  margin-top: 5%;
  font-size: 20px;
  line-height: 150%;
  display: flex;
  justify-content: center;
}

.card-test {
  font-family: 'Raleway';
  color: black;
}

.payment-details {
  width: 420px;
  border-radius: 8px;
}

.menu-card {
  border-radius: 8px;
  padding: 2px;
  height: 320px;
}
</style>