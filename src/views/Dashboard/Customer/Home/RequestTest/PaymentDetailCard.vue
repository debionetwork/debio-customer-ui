<template lang="pug">
  v-container.container-card
    v-card.menu-card
      div(class="mt-5 mb-3 text-center" )
        b Order Summary

      div(class="ml-5 mb-1 text-start" style="font-size: 12px;")
        b Details

      hr(class="ml-3 me-3 mb-3")

      div(class="ml-5 text-start me-10")
        div(class="d-flex justify-space-between mb-2" )
          div( style="font-size: 12px;" ) Service Price
          div( style="font-size: 12px;" )
            | {{ formatPrice(dataService.detailPrice.price_components[0].value) }} 
            | {{ dataService.currency.toUpperCase() }}
        
        div(class="d-flex justify-space-between" )
          div( style="font-size: 12px;" ) Quality Control Price
          div( style="font-size: 12px;" )
            | {{ formatPrice(dataService.detailPrice.additional_prices[0].value) }} 
            | {{ dataService.currency.toUpperCase() }}

      hr(class="ml-3 me-3 mb-2")

      div(class="ml-5 text-start me-10")
        div(class="d-flex justify-space-between mb-2" )
          b( style=" font-size: 12px;" ) Total Price
          b( style="font-size: 12px;" )
            | {{ formatPrice(dataService.price) }} 
            | {{ dataService.currency.toUpperCase()}}


      div(class="ml-5 text-start me-10" v-if="stakingFlow")
        div(class="d-flex justify-space-between" )
          div( style=" font-size: 12px;" ) Staking Amount
          div( style="font-size: 12px;" ) {{ stakingAmount }} {{ selectedService.currency.toUpperCase()}}
      
      hr(class="ml-3 me-3 mb-1" v-if="stakingFlow")

      div(class="ml-5 text-start me-10 mb-5" v-if="stakingFlow")
        div(class="d-flex justify-space-between" )
          b( style=" font-size: 12px;" ) Remaining Amount
          b( style="font-size: 12px;" ) {{ remainingStaking }} {{ selectedService.currency.toUpperCase()}}


      div(class="ml-4 text-center" v-if="!isCancelled")
        div(v-if="!success" class="d-flex justify-space-between align-center")
          Button(
            :class="setMargin"
            color="secondary"
            width="300"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-if="success && status === 'Paid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
          Button(
            color="secondary" 
            width="46%"
            height="35"
            @click="toInstruction(selectedService.dnaCollectionProcess)"
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

        div(v-if="success && status === 'Unpaid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
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
        :orderId="orderId"
        @cancel="isCancelled = true"
        @close="cancelDialog = false"
      )
      
      PayRemainingDialog(
        :show="showPayRemainingDialog"
        :amount="remainingDbio"        
        @onContinue="onContinue"
        @close="showPayRemainingDialog = false"
      )       

</template>

<script>
import { mapState } from "vuex"
import Button from "@/common/components/Button"
import CancelDialog from "@/common/components/Dialog/CancelDialog"
import PaymentReceiptDialog from "./PaymentReceiptDialog.vue"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import PayRemainingDialog from "./PayRemainingDialog.vue"
import { getDbioBalance } from "@/common/lib/debio-balance"
import {
  COVID_19,
  DRIED_BLOOD,
  URINE_COLLECTION,
  FECAL_COLLECTION,
  SALIVA_COLLECTION,
  BUCCAL_COLLECTION
} from "@/common/constants/instruction-step.js"

export default {
  name: "PaymentDetailCard",
  
  components: {
    Button,
    PaymentReceiptDialog,
    CancelDialog,
    PayRemainingDialog
  },

  data: () => ({
    showReceipt: false,
    newService: false,
    lastOrder: null,
    detailOrder: null,
    cancelDialog: false,
    isCancelled: false,
    status: "Unpaid",
    labDetail: null,
    stakingFlow: false,
    stakingAmount: 0,
    remainingStaking: 0,
    remainingDbio: 0,
    showPayRemainingDialog: false,
    orderId: 0,
    COVID_19,
    DRIED_BLOOD,
    URINE_COLLECTION,
    FECAL_COLLECTION,
    SALIVA_COLLECTION,
    BUCCAL_COLLECTION
  }),

  async mounted () {
    this.stakingFlow = false

    if (this.$route.params.id) {
      this.success = true
      this.orderId = this.$route.params.id.toString()
    }
    // get last order id
    this.lastOrder = await lastOrderByCustomer(
      this.api,
      this.wallet.address
    )

    if (this.lastOrder) {
      this.detailOrder = await getOrdersData(this.api, this.lastOrder)
      this.status = this.detailOrder.status
      this.orderId = this.detailOrder.id
    }

    if (this.stakingData) {
      this.stakingFlow = true
      const debioBalance = await getDbioBalance()
      const stakingAmount = this.stakingData.staking_amount * debioBalance.dai
      this.stakingAmount = Number(this.formatPrice(stakingAmount)).toFixed(2)
      const remainingStaking = this.selectedService.price - stakingAmount
      this.remainingStaking = Number(this.formatPrice(remainingStaking))
      this.remainingDbio = Number(this.formatPrice(remainingStaking / debioBalance.dai)).toFixed(3)
    }
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
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      selectedService: (state) => state.testRequest.products,
      stakingData: (state) => state.lab.stakingData,
      web3: (state) => state.metamask.web3
    }),

    setMargin() {
      if (this.stakingFlow) {
        return "mt-2"
      }
      return "mt-12"
    }
  },

  methods: {

    toEtherscan () {
      window.open(`https://rinkeby.etherscan.io/address/${this.metamaskWalletAddress}`, "_blank")
    },

    onSubmit () {
      if (this.remainingStaking && this.remainingStaking > 0) {
        this.showPayRemainingDialog = true
        return
      }
      this.showReceipt = true 
    },

    onContinue() {
      this.$emit("onContinue")
    },

    toInstruction (dnaCollectionProcess) {
      if (dnaCollectionProcess === "Covid 19 Saliva Test") {
        window.open(this.COVID_19, "_blank")
      }
      if (dnaCollectionProcess === "Blood Cells - Dried Blood Spot Collection Process") {
        window.open(this.DRIED_BLOOD, "_blank")
      }
      if (dnaCollectionProcess === "Epithelial Cells - Buccal Swab Collection Process") {
        window.open(this.BUCCAL_COLLECTION, "_blank")
      }
      if (dnaCollectionProcess === "Fecal Matters - Stool Collection Process") {
        window.open(this.FECAL_COLLECTION, "_blank")
      }
      if (dnaCollectionProcess === "Saliva - Saliva Collection Process") {
        window.open(this.SALIVA_COLLECTION, "_blank")
      }
      if (dnaCollectionProcess === "Urine - Clean Catch Urine Collection Process") {
        window.open(this.URINE_COLLECTION, "_blank")
      }
    },

    showCancelConfirmation () {
      this.cancelDialog = true
    },

    formatPrice (price) {
      return this.web3.utils.fromWei(String(price), "ether")
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

