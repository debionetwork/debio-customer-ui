<template lang="pug">
  v-container.container-card
    v-card.menu-card
      .menu-card__title Order Summary

      .menu-card__sub-title-medium Details

      hr.menu-card__line

      .menu-card__details
        .menu-card__sub-title Service Price
        .menu-card__price 
          | {{ formatPrice((dataService.detailPrice.price_components[0].value).replaceAll(",", "")) }}
          | {{ dataService.currency.toUpperCase() }}
    

      .menu-card__details
        .menu-card__sub-title Quality Control Price
        .menu-card__price 
          | {{ formatPrice((dataService.detailPrice.additional_prices[0].value).replaceAll(",", "")) }} 
          | {{ dataService.currency.toUpperCase() }}

      .menu-card__operation +
      hr.menu-card__line

      .menu-card__details
        .menu-card__sub-title-medium Total Price
        .menu-card__price-medium
          | {{ (formatPrice(dataService.price).replaceAll(",", "")) }} 
          | {{ dataService.currency.toUpperCase()}}


      .menu-card__details(v-if="stakingFlow")
        .menu-card__sub-title Staking Amount
        .menu-card__price
          | {{ stakingAmount }}
          | {{ dataService.currency.toUpperCase() }}
    
      .menu-card__operation(v-if="stakingFlow") -
      hr.menu-card__line(v-if="stakingFlow")

      .menu-card__details(v-if="isDeficit" style="color: red")
        .menu-card__sub-title-medium Remaining Amount
        .menu-card__price-medium
          | {{ remainingStaking }}
          | {{ dataService.currency.toUpperCase() }}

      .menu-card__details(v-if="isBalanced  ")
        .menu-card__sub-title-medium Remaining Amount
        .menu-card__price-medium
          | 0
          | {{ dataService.currency.toUpperCase() }}

      .menu-card__details(v-if="isExcess" style="color: green")
        .menu-card__sub-title-medium Excess Amount
        .menu-card__price-medium
          | {{ excessAmount }}
          | {{ dataService.currency.toUpperCase() }}

      

      div(class="text-center" v-if="!isCancelled")
        div(v-if="!success" class="mt-3 d-flex justify-center align-center")
          Button(
            :class="setMargin"
            color="secondary"
            width="280"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-if="success && status === 'Paid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
          Button(
            color="secondary" 
            width="46%"
            height="35"
            @click="toInstruction(dataService.dnaCollectionProcess)"
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
        @cancel="setCancelled"
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
import { getDbioBalance } from "@/common/lib/api"
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
    orderId: "",
    COVID_19,
    DRIED_BLOOD,
    URINE_COLLECTION,
    FECAL_COLLECTION,
    SALIVA_COLLECTION,
    BUCCAL_COLLECTION,
    isDeficit: false,
    isExcess: false,
    isBalanced: false,
    excessAmount: 0
  }),

  async mounted () {
    this.stakingFlow = false
    this.orderId = ""

    if (this.dataService.length !== 0) {
      this.servicePrice = this.formatPrice((this.dataService.detailPrice.price_components[0].value).replaceAll(",", ""))
      this.qcPrice = this.formatPrice((this.dataService.detailPrice.additional_prices[0].value).replaceAll(",", ""))
      this.totalPrice = this.formatPrice(this.dataService.price).replaceAll(",", "")
      this.currency = this.dataService.currency.toUpperCase() 
    }


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

    if (this.dataService.serviceFlow === "StakingRequestService") {
      this.stakingFlow = true
      const debioBalance = await getDbioBalance()

      const stakingAmount = Number(this.stakingData.staking_amount.replaceAll(",", "")) * debioBalance

      this.stakingAmount = Number(this.formatPrice(stakingAmount)).toFixed(3)
      const remainingStaking = this.dataService.price - stakingAmount
      this.remainingStaking = Number(this.formatPrice(remainingStaking)).toFixed(3)
      this.remainingDbio = Number(this.formatPrice(remainingStaking / debioBalance)).toFixed(3)

      const excessAmount = stakingAmount - this.dataService.price
      this.excessAmount = Number(this.formatPrice(excessAmount)).toFixed(3)
      
    }

    if (this.stakingAmoung > Number(this.totalPrice)) {
      this.isExcess = true
    }
    
    if (this.stakingAmount === Number(this.totalPrice)) {
      this.isBalanced = true
    }

    if (this.stakingAmount < Number(this.totalPrice)) {
      this.isDeficit = true
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
      window.open(`https://rinkeby.etherscan.io/tx/${this.$route.params.hash}`, "_blank")
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
    },

    setCancelled() {
      this.isCancelled = true
      this.$emit("cancel")
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
      margin-top: 30px
      margin-bottom: 25px
      justify-content: center
      display: flex
      @include h6-opensans

    &__sub-title
      margin-left: 38px
      @include body-text-3-opensans
    
    &__sub-title-medium
      margin-left: 38px
      @include body-text-3-opensans-medium
  
    &__price
      margin-right: 38px
      @include body-text-3-opensans

    &__price-medium
      margin-right: 38px
      @include body-text-3-opensans-medium

    &__line
      margin: 1px 24px

    &__details
      margin-top: 5px
      display: flex
      justify-content: space-between

    &__operation
      margin-right: 24px
      display: flex
      justify-content: flex-end
      @include body-text-3-opensans-medium

</style>

