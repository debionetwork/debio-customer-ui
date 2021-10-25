<template lang="pug">
  v-container.container-card
    v-card.menu-card 
      v-card.menu-card
        div(class="ml-5 mt-5 mb-5 text-center" )
          b Order Summary

        div(class="ml-5 mb-2 text-start" style="font-size: 12px;")
          b Details

        hr(class="ml-3 me-3 mb-3")

        div(class="ml-5 text-start")
          v-row
            v-col(cols="6") 
              div( style="font-size: 12px;" ) Service Price
            v-col(cols="6") 
              div( style="font-size: 12px;" ) {{ selectedService.detailPrice.price_components[0].value }} {{ selectedService.currency}}
          v-row
            v-col(cols="6") 
              div( style="font-size: 12px;" ) Quality Control Price
            v-col(cols="6") 
              div( style="font-size: 12px;" ) {{ selectedService.detailPrice.additional_prices[0].value }} {{ selectedService.currency }}

        b(class="d-flex justify-end me-3") +
        hr(class="ml-3 me-3 mb-2")

        div(class="ml-5 text-start")
          v-row
            v-col(cols="6") 
              b( style=" font-size: 12px;" ) Total Price
            v-col(cols="6") 
              b( style="font-size: 12px;" ) {{ selectedService.price }} {{ selectedService.currency}}
       
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
              width="360"
              height="32"
              @click="onSubmit"
              ) Submit Order

          div(v-else class="d-flex justify-space-between align-center pa-8")
            Button(
              color="secondary" 
              width="45%"
              height="32"
              @click="toInstruction"
              style="font-size: 8px;"
              outlined 
              ) View Instruction

            Button(
              color="secondary" 
              width="45%"
              height="32"
              style="font-size: 8px;"
              @click="toEtherscan"
              ) View Etherscan

      template
        PaymentReceiptDialog(
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
    newService: false,
    labDetail: null
  }),

  mounted () {
    this.labDetail = {
      labName : this.selectedService.labName,
      labAddress : this.selectedService.labAddress,
      city: this.selectedService.city
    }
  },


  props: {
    success: { type: Boolean, default: false }
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
    width: 420px
    height: 250px
    border-radius: 8px


  .menu-card
    border-radius: 8px
    padding: 2px
    height: 320px

</style>

