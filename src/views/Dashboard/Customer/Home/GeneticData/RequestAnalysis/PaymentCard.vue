<template lang="pug">
  v-card.customer-analysis-payment-card
    .customer-analysis-payment-card__data
      .customer-analysis-payment-card__data-service
        .customer-analysis-payment-card__text-label Genetic Data Name
        .customer-analysis-payment-card__data-text {{ geneticData.title }}

      .customer-analysis-payment-card__text-label Payment
      div(v-if="!isCreated")
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Account Balance
          b.customer-analysis-payment-card__data-text {{ formatBalance(walletBalance) }}  {{ service.priceDetail[0].currency }}
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Service Price
          b.customer-analysis-payment-card__data-text(:style="setStyleColor") {{ formatBalance(service.priceDetail[0].totalPrice) }} {{ service.priceDetail[0].currency }}
        .customer-analysis-payment-card__rate ( {{ formatPriceInUsd(service.priceDetail[0].totalPrice) }} USD )

      
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-tx-weight Estimated transaction weight 
            v-tooltip.visible(bottom )
              template(v-slot:activator="{ on, attrs }")
                v-icon.staking-dialog__trans-weight-icon(
                  style="font-size: 12px;"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                ) mdi-alert-circle-outline 
              span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.
          .customer-analysis-payment-card__data-tx-weight {{ Number(txWeight).toFixed(4) }} DBIO        

        Button.customer-analysis-payment-card__button(
          :disabled="isDeficit"
          width="280"
          height="35"  
          color="secondary"
          @click="showInformation = true"
        ) Pay Now

      div(v-if="isCreated")
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Date
          .customer-analysis-payment-card__data-text {{ createdDate }}

        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Status
          b.customer-analysis-payment-card__data-text {{ orderStatus }}

        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Service Price
          b.customer-analysis-payment-card__data-text {{ orderPrice }} {{ orderCurrency }}
        .customer-analysis-payment-card__rate ( {{ orderPriceInUsd }} USD )    

      ImportantDialog(
        @close="showInformation = false"
        @click="onSubmit"
        :show="showInformation"
      )

      ConfirmationDialog(
        :show="showCancelDialog"
        :txWeight="Number(txWeight).toFixed(4)"
        :loading="isLoading"
        title="Cancel"
        btnMessage="Cancel Order"
        message="By cancel this service, your file might not be able to be analyzed, and your balance will be refunded"
        @click="cancelOrder"
        @close="showCancelDialog = false"
      )

</template>

<script>

import { mapState } from "vuex"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import Button from "@/common/components/Button"
import ConfirmationDialog from "@/views/Dashboard/Customer/Home/MyTest/ConfirmationDialog"
import ImportantDialog from "./Information.vue"
import { getDbioBalance, setGeneticAnalysisPaid } from "@/common/lib/api"
import { 
  createGeneticAnalysisOrder,
  cancelGeneticAnalysisOrder,
  getCreateGeneticAnalysisOrderFee
} from "@/common/lib/polkadot-provider/command/genetic-analysis-orders"
import { lastAnlysisOrderByCustomer, queryGeneticAnalysisOrders } from "@/common/lib/polkadot-provider/query/genetic-analysis-orders"
import { queryGeneticAnalysisStorage } from "@/common/lib/polkadot-provider/query/genetic-analysis"

export default {
  name: "PaymentCard",

  components: { Button, ImportantDialog, ConfirmationDialog },

  props: {
    geneticData: Object,
    service: Object
  },

  data: () => ({
    showInformation: false,
    rate: null,
    isDeficit : false,
    txWeight: 0,
    isCreated: false,
    orderId: null,
    geneticOrderDetail: null,
    createdDate: null,
    orderStatus: null,
    orderPrice: null,
    orderCurrency: null,
    orderPriceInUsd: null,
    showCancelDialog: false,
    isLoading: false,
    trackingId: null,
    isRegistered: true
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData,
      walletBalance: (state) => state.substrate.walletBalance,
      selectedGeneticData: (state) => state.geneticData.selectedData,
      selectedAnalysisService: (state) => state.geneticData.selectedAnalysisSerivice,
      lastEventData: (state) => state.substrate.lastEventData
    }),

    setStyleColor() {
      if (this.isDeficit) {
        return "color: red"
      } else {
        return "color: black"
      }      
    }
  },

  async mounted() {
    await this.getUsdRate()
    await this.getTxWeight()

    if (this.$route.params.id) {
      this.isCreated = true
      this.orderId = this.$route.params.id

      await this.getGeneticAnalysisOrderDetail()
      await this.getAnalysisStatus()
    }

    if (Number(this.walletBalance) < Number((this.service.priceDetail[0].totalPrice).replaceAll(",", ""))) {
      this.isDeficit = true
    }
  },

  methods: {
    getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.publicKey = u8aToHex(identity.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(identity.boxKeyPair.secretKey)
      return u8aToHex(identity.boxKeyPair.publicKey)
    },
    
    async onSubmit() {
      const priceIndex = 0
      const customerBoxPublicKey = await this.getCustomerPublicKey()        

      await createGeneticAnalysisOrder(
        this.api,
        this.wallet,
        this.selectedGeneticData.id,
        this.selectedAnalysisService.serviceId,
        priceIndex,
        customerBoxPublicKey,
        this.setPaid
      )
    },

    async setPaid() {
      const lastOrder = await lastAnlysisOrderByCustomer(this.api, this.wallet.address)
      this.$router.push({ name: "customer-request-analysis-success", params: {id: lastOrder} })
      await setGeneticAnalysisPaid(lastOrder)
    },

    async getGeneticAnalysisOrderDetail () {
      this.geneticOrderDetail = await queryGeneticAnalysisOrders(this.api, this.orderId)
      this.createdDate = this.formatDate(this.geneticOrderDetail.createdAt)
      this.orderStatus = this.geneticOrderDetail.status
      this.orderPrice = this.formatBalance(this.geneticOrderDetail.prices[0].value)
      this.orderCurrency = this.geneticOrderDetail.currency
      this.orderPriceInUsd = this.formatPriceInUsd(this.geneticOrderDetail.prices[0].value)
      this.trackingId = this.geneticOrderDetail.geneticAnalysisTrackingId
    },

    formatBalance(val) {
      const formatedBalance = this.web3.utils.fromWei(String(val.replaceAll(",", "")), "ether")
      return Number(formatedBalance).toFixed(4)
    },

    formatPriceInUsd(val) {
      const priceInUsd = Number(val.replaceAll(",", "") * this.rate.dbioToUsd )
      const formatedBalance = this.web3.utils.fromWei(String(priceInUsd), "ether")
      return Number(formatedBalance).toFixed(4)
    },

    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    },

    async getUsdRate() {
      this.rate = await getDbioBalance()
    },

    async getTxWeight() {
      const txWeight = await getCreateGeneticAnalysisOrderFee(this.api, this.wallet)
      this.txWeight = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
    },

    async cancelOrder() {
      await cancelGeneticAnalysisOrder(this.api, this.wallet, this.orderId)
    },

    async getAnalysisStatus() {
      const details = await queryGeneticAnalysisStorage(this.api, this.trackingId)
      if (details.status !== "Registered") {
        this.isRegistered = false
      }
    }
  },

  watch: {
    async lastEventData(val) {
      if(val !== null) {
        const dataEvent = JSON.parse(val.data.toString())
        if (dataEvent[0].customerId === this.wallet.address) {
          if(val.method === "GeneticAnalysisOrderPaid") {
            await this.getGeneticAnalysisOrderDetail()
          }
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-analysis-payment-card
    margin-top: 0 !important
    width: 340px
    height: 320px

    &__data
      padding: 27px 30px

    &__data-service 
      margin-bottom: 24px

    &__text-label
      @include button-2

    &__data-text
      margin-top: 16px
      @include new-body-text-2

    &__data-tx-weight
      margin-top: 16px
      @include body-text-3

    &__button
      margin-top: 16px
      
    &__amount
      display: flex
      align-items: center
      justify-content: space-between

    &__rate
      display: flex
      align-items: center
      justify-content: flex-end
      @include tiny-reg

</style>
