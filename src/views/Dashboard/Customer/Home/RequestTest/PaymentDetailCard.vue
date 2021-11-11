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
            | {{ dataService.detailPrice.price_components[0].value }} 
            | {{ dataService.currency.toUpperCase() }}
        
        div(class="d-flex justify-space-between" )
          div( style="font-size: 12px;" ) Quality Control Price
          div( style="font-size: 12px;" )
            | {{ dataService.detailPrice.additional_prices[0].value }} 
            | {{ dataService.currency.toUpperCase() }}

      div(class="d-flex justify-end me-3" style="font-size: 12px") +
      hr(class="ml-3 me-3 mb-2")

      div(class="ml-5 text-start me-10")
        div(class="d-flex justify-space-between mb-2" )
          b( style=" font-size: 12px;" ) Total Price
          b( style="font-size: 12px;" )
            | {{ dataService.price }} 
            | {{ dataService.currency.toUpperCase()}}

      div(class="ml-4 text-center" v-if="!isCancelled")
        div(v-if="!success" class="d-flex justify-space-between align-center")
          Button(
            class="mt-8"
            color="secondary"
            width="300"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-if="success && detailOrder.status === 'Paid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
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

        div(v-if="success && detailOrder.status === 'Unpaid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
          Button(
            color="secondary" 
            width="46%"
            height="35"
            @click="showCancelConfirmation"
            style="font-size: 10px;"
            outlined 
            ) Cancel

          Button(
            color="secondary" 
            width="46%"
            height="35"
            style="font-size: 10px;"
            @click="showReceipt = true"
            ) Pay

    template
      PaymentReceiptDialog(
        :show="showReceipt"
        @onContinue="onContinue"
        @close="showReceipt = false"
      )

      CancelDialog(
        :show="cancelDialog"
        @click="cancelOrder"
        @close="cancelDialog = false"
      )
              
      
</template>

<script>

import { mapState } from "vuex"
import Button from "@/common/components/Button"
import CancelDialog from "@/common/components/Dialog/CancelDialog"
import PaymentReceiptDialog from "./PaymentReceiptDialog.vue"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import { cancelOrder } from "@/common/lib/polkadot-provider/command/orders.js"


export default {
  name: "PaymentDetailCard",
  
  components: {
    Button,
    PaymentReceiptDialog,
    CancelDialog
  },



  data: () => ({
    showReceipt: false,
    newService: false,
    lastOrder: null,
    detailOrder: null,
    cancelDialog: false,
    isCancelled: false
  }),

  async mounted () {

    // get last order id
    this.lastOrder = await lastOrderByCustomer(
      this.api,
      this.wallet.address
    )

    this.detailOrder = await getOrdersData(this.api, this.lastOrder)
  },


  props: {
    success: { type: Boolean, default: false }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      dataService: (state) => state.testRequest.products,
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
    },

    showCancelConfirmation () {
      this.cancelDialog = true
    },

    async cancelOrder() {
      await cancelOrder(
        this.api,
        this.wallet,
        this.detailOrder.id
      )
      this.isCancelled = true
      this.cancelDialog = false
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

