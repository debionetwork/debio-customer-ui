<template lang="pug">
  v-container.container-card
    v-card.menu-card
      div(class="mt-5 mb-5 text-center" )
        b Order Summary

      div(class="ml-5 mb-2 text-start" style="font-size: 12px;")
        b Details

      hr(class="ml-3 me-3 mb-3")

      div(class="ml-5 text-start me-10")
        div(class="d-flex justify-space-between mb-2" )
          div( style="font-size: 12px;" ) Service Price
          div( style="font-size: 12px;" )
            | {{ prefillService.service.price || selectedService.detailPrice.price_components[0].value }} 
            | {{ prefillService.service.currency || selectedService.currency.toUpperCase() }}
        
        div(class="d-flex justify-space-between" )
          div( style="font-size: 12px;" ) Quality Control Price
          div( style="font-size: 12px;" )
            | {{ prefillService.service.qc_value || selectedService.detailPrice.additional_prices[0].value }} 
            | {{ prefillService.service.currency || selectedService.currency.toUpperCase() }}

      div(class="d-flex justify-end me-3" style="font-size: 12px") +
      hr(class="ml-3 me-3 mb-2")

      div(class="ml-5 text-start me-10")
        div(class="d-flex justify-space-between mb-2" )
          b( style=" font-size: 12px;" ) Total Price
          b( style="font-size: 12px;" )
            | {{ prefillService.service.total_price || selectedService.price }} 
            | {{ prefillService.service.currency || selectedService.currency.toUpperCase()}}
      
      div(class="ml-5 text-start" v-if="newService")
        v-row
          v-col(cols="6") 
            div( style="font-size: 12px;" ) Staking Amount
          v-col(cols="6") 
            div( style="font-size: 12px;" ) 400 DAI
      hr(class="ml-3 me-3 mb-5" v-if="newService")

      div(class="ml-5 text-start" v-if="newService")
        v-row
          v-col(cols="6") 
            div( style="font-size: 12px;" ) Remaining Amount
          v-col(cols="6") 
            div( style="font-size: 12px;" ) 550 DAI



      div(class="ml-4 text-center" )
        div(v-if="!success" class="d-flex justify-space-between align-center")
          Button(
            class="mt-8"
            color="secondary"
            width="300"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-else class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
          Button(
            color="secondary" 
            width="46%"
            height="35"
            @click="toInstruction"
            style="font-size: 10px;"
            outlined 
            ) View Instruction

          Button(
            color="secondary" 
            width="46%"
            height="35"
            style="font-size: 10px;"
            @click="toEtherscan"
            ) View Etherscan

    template
      PaymentReceiptDialog(
        :prefillService="prefillService"
        :show="showReceipt"
        @onContinue="onContinue"
        @close="showReceipt = false"
      )
              
      
</template>

<script>

import { mapState } from "vuex"
import Button from "@/common/components/Button"
import PaymentReceiptDialog from "./PaymentReceiptDialog.vue"

export default {
  name: "PaymentDetailCard",
  
  components: {
    Button,
    PaymentReceiptDialog
  },

  data: () => ({
    showReceipt: false,
    newService: false
  }),


  props: {
    success: { type: Boolean, default: false },
    prefillService: { type: Object, default: () => {} }
  },

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      selectedService: (state) => state.testRequest.products,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    })  
  },

  methods: {

    toEtherscan () {
      window.open(`https://rinkeby.etherscan.io/address/${this.metamaskWalletAddress}`, "_blank")
    },

    onSubmit () {
      this.showReceipt = true
    },

    onContinue() {
      this.$emit("onContinue")
    },

    toInstruction () {
      // TODO : to instruction page
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .container-card 
    width: 360px
    height: 328px
    border-radius: 8px

  .menu-card
    border-radius: 8px
    padding: 2px
    height: 320px

    &__title
      display: flex
      margin: 35px 10px 5px 10px
</style>

