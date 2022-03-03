<template lang="pug">
  v-container.container-card
    v-card.menu-card
      .menu-card__title Order Summary

      .menu-card__sub-title-medium Details

      hr.menu-card__line

      .menu-card__details
        .menu-card__sub-title Service Price
        .menu-card__price 
          | {{ servicePrice }}
          | {{ currency }}
    

      .menu-card__details
        .menu-card__sub-title Quality Control Price
        .menu-card__price 
          | {{ qcPrice }} 
          | {{ currency }}

      .menu-card__operation +
      hr.menu-card__line

      .menu-card__details
        .menu-card__sub-title-medium Total Price
        .menu-card__price-medium
          | {{ totalPrice }} 
          | {{ currency}}


      .menu-card__details(v-if="stakingFlow")
        .menu-card__sub-title Staking Amount
        .menu-card__price
          | {{ stakingAmount }}
          | {{ currency }}
    
      .menu-card__operation(v-if="stakingFlow") -
      hr.menu-card__line(v-if="stakingFlow")

      .menu-card__details(v-if="isDeficit && stakingFlow" style="color: red")
        .menu-card__sub-title-medium Remaining Amount
        .menu-card__price-medium
          | {{ remainingStaking }}
          | {{ currency }}

      .menu-card__details(v-if="isBalanced && stakingFlow")
        .menu-card__sub-title-medium Remaining Amount
        .menu-card__price-medium
          | 0
          | {{ currency }}

      .menu-card__details(v-if="isExcess" style="color: green")
        .menu-card__sub-title-medium Excess Amount
        .menu-card__price-medium
          | {{ excessAmount }}
          | {{ currency }}

      

      div(class="text-center" v-if="!isCancelled")
        div(v-if="!success" class="mt-3 d-flex justify-center align-center")
          UiDebioButton(
            :class="setMargin"
            color="secondary"
            width="280"
            height="35"
            @click="onSubmit"
            ) Submit Order

        div(v-if="success && status === 'Paid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
          UiDebioButton(
            color="secondary" 
            width="46%"
            height="35"
            @click="toInstruction(dataService.dnaCollectionProcess)"
            style="font-size: 10px;"
            outlined 
            ) View Instruction

          UiDebioButton(
            color="secondary" 
            width="46%"
            height="35"
            style="font-size: 10px;"
            @click="toEtherscan"
            ) View Etherscan

        div(v-if="success && status === 'Unpaid'" class="d-flex justify-space-between align-center pa-4 mt-8 me-3")
          UiDebioButton(
            color="secondary" 
            width="46%"
            height="35"
            @click="showCancelConfirmation"
            style="font-size: 10px;"
            outlined 
            ) Cancel

          UiDebioButton(
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

      UiDebioCancelDialog(
        :show="cancelDialog"
        :orderId="orderId"
        @cancel="setCancelled"
        @close="cancelDialog = false"
      )
      
      PayRemainingDialog(
        :show="showPayRemainingDialog"
        :amount="remainingDbio"     
        :amountInDai="remainingDai"   
        @onContinue="onContinue"
        @close="showPayRemainingDialog = false"
      ) 

      UiDebioAlertDialog(
        :show="showAlert"
        :width="289"
        title="Unpaid Order"
        message="Complete your unpaid order first before requesting a new one. "
        imgPath="alert-circle-primary.png"
        btn-message="Go to My Payment"
        @close="showAlert = false"
        @click="toPaymentHistory"
      )


</template>

<script>
import { mapState, mapMutations } from "vuex"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import UiDebioButton from "@debionetwork/ui-components"
import UiDebioCancelDialog from "@debionetwork/ui-components"
import PaymentReceiptDialog from "./PaymentReceiptDialog.vue"
import UiDebioAlertDialog from "@debionetwork/ui-components"
import { createOrder } from "@/common/lib/polkadot-provider/command/orders.js"
import { processRequest } from "@/common/lib/polkadot-provider/command/service-request"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import PayRemainingDialog from "./PayRemainingDialog.vue"
import { getDbioBalance, fetchPaymentDetails } from "@/common/lib/api"
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
    UiDebioButton,
    PaymentReceiptDialog,
    UiDebioCancelDialog,
    PayRemainingDialog,
    UiDebioAlertDialog
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
    remainingDai: 0,
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
    excessAmount: 0,
    showAlert: false,
    servicePrice: 0,
    qcPrice: 0,
    totalPrice: 0,
    currency: "",
    success: false
  }),

  async mounted () {
    this.stakingFlow = false

    if(this.$route.params.id) {
      await this.getDataService()
    }

    if (this.dataService.detailPrice) {
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

      const stakingAmount = Number(this.stakingData.staking_amount.replaceAll(",", "")) * debioBalance.dbioToDai

      this.stakingAmount = Number(this.formatPrice(stakingAmount)).toFixed(3)
      const remainingStaking = this.dataService.price - stakingAmount
      this.remainingDai = remainingStaking
      this.remainingStaking = Number(this.formatPrice(remainingStaking)).toFixed(3)
      this.remainingDbio = Number(this.formatPrice(remainingStaking / debioBalance.dbioToDai)).toFixed(3)

      const excessAmount = stakingAmount - this.dataService.price
      this.excessAmount = Number(this.formatPrice(excessAmount)).toFixed(3)

      if (this.excessAmount > 0) {
        this.isExcess = true
      }

    }

    if (Number(this.stakingAmoung) > Number(this.totalPrice)) {
      this.isExcess = true
    }
    
    if (Number(this.stakingAmount) === Number(this.totalPrice)) {
      this.isBalanced = true
    }

    if (Number(this.stakingAmount) < Number(this.totalPrice)) {
      this.isDeficit = true
    }

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
    ...mapMutations({
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    toEtherscan () {
      window.open(`https://rinkeby.etherscan.io/tx/${this.$route.params.hash}`, "_blank")
    },

    toPaymentHistory () {
      this.$router.push({ name: "customer-payment-history" })
    },

    async onSubmit () {
      this.lastOrder = await lastOrderByCustomer(
        this.api,
        this.wallet.address
      )

      if(this.lastOrder){
        this.detailOrder = await getOrdersData(this.api, this.lastOrder)

        if (this.detailOrder.status === "Unpaid") {
          this.showAlert = true
          return
        }
      }

      if (this.isExcess && this.detailOrder !== "Unpaid") {
        const customerBoxPublicKey = await this.getCustomerPublicKey()        
        await createOrder(
          this.api,
          this.wallet,
          this.dataService.serviceId,
          customerBoxPublicKey,
          this.dataService.serviceFlow,
          this.dataService.indexPrice,
          this.processRequestService
        )
        return
      }

      if (this.remainingStaking && this.remainingStaking > 0) {
        this.showPayRemainingDialog = true
        return
      }
      this.showReceipt = true 
    },


    
    async processRequestService() {
      const lastOrder = await lastOrderByCustomer(
        this.api,
        this.wallet.address
      )

      const detailOrder = await getOrdersData(
        this.api,
        lastOrder
      )

      await processRequest(
        this.api,
        this.wallet,
        this.stakingData.lab_address,
        this.stakingData.hash,
        detailOrder.id,
        detailOrder.dnaSampleTrackingId
      )

      this.$router.push({ 
        name: "my-test",
        params: {
          page: 1
        }
      })

    },

    getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.publicKey = u8aToHex(identity.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(identity.boxKeyPair.secretKey)
      return u8aToHex(identity.boxKeyPair.publicKey)
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
    },

    async getDataService() {
      const data = await fetchPaymentDetails(this.$route.params.id)

      if (data.status !== "Unpaid") {
        this.$router.push({ name: "customer-payment-history" })
      }

      const service = {
        serviceId: data.service_id,
        serviceName: data.service_info.name,
        serviceRate: 0,
        serviceImage: data.service_info.image,
        serviceCategory: data.service_info.category,
        serviceDescription: data.service_info.description,
        labName: data.lab_info.name,
        labId: data.seller_id,
        labImage: data.lab_info.profile_image,
        labRate: 0,
        labAddress: data.lab_info.address,
        price: (data.service_info.prices_by_currency[0].total_price).replaceAll(",", ""),
        detailPrice: data.service_info.prices_by_currency[0],
        currency: data.service_info.prices_by_currency[0].currency,
        city: data.lab_info.city,
        country: data.lab_info.country,
        region: data.lab_info.region,
        countRateLab: 0,
        countServiceRate: 0,
        duration: data.service_info.expected_duration.duration,
        durationType: data.service_info.expected_duration.durationType,
        verificationStatus: "Verified",
        indexPrice: 0,
        dnaCollectionProcess: data.service_info.dna_collection_process
      }

      this.setProductsToRequest(service)

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

