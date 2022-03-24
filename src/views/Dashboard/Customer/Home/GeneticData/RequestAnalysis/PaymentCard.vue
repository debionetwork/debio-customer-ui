<template lang="pug">
  v-card.customer-analysis-payment-card
    .customer-analysis-payment-card__data
      .customer-analysis-payment-card__data-service
        .customer-analysis-payment-card__text-label Genetic Data Name
        .customer-analysis-payment-card__data-text {{ geneticData.title }}

      .customer-analysis-payment-card__text-label.mt-5 Payment
      div(v-if="orderStatus === 'Unpaid'")
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Account Balance
          .customer-analysis-payment-card__data-text {{ formatBalance(walletBalance) }} DBIO
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Service Price
          .customer-analysis-payment-card__data-text(:style="setStyleColor") {{ orderPrice }} {{ orderCurrency }}
        .customer-analysis-payment-card__rate ({{ orderPriceInUsd }} USD )

        .customer-analysis-payment-card__text-notes In adherence to the law and regulations of the country where your transaction will take place, service provider payouts may be processed in fiat currency. See our 
          a.link(target="_blank" href="https://docs.debio.network/legal/terms-and-condition" ) terms and conditions 
          span for more details.

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

        .customer-analysis-payment-card__button
          ui-debio-button(
            width="130" 
            color="red" 
            outlined
            @click="showCancelDialog = true"
          ) Cancel

          ui-debio-button(
            :disabled="isDeficit"
            width="130" 
            color="primary" 
            outlined
            :loading="isLoading"
            @click="setPaid"
          ) Pay Now

      div(v-else)
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Date
          .customer-analysis-payment-card__data-text.mt-3 {{ createdDate }}

        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Status
          b.customer-analysis-payment-card__data-text.mt-3 {{ orderStatus }}

        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Service Price
          b.customer-analysis-payment-card__data-text.mt-3 {{ orderPrice }} {{ orderCurrency }}
        .customer-analysis-payment-card__rate ( {{ orderPriceInUsd }} USD )

        .customer-analysis-payment-card__button.mt-8(v-if="orderStatus === 'Paid'")
          ui-debio-button(
            width="280" 
            color="red" 
            outlined
            @click="showCancelDialog = true"
          ) Cancel Request

        .customer-analysis-payment-card__button.mt-8(v-if="orderStatus === 'Fulfilled'")
          ui-debio-button(
            width="280" 
            color="secondary" 
            outlined
            @click="showCancelDialog = true"
          ) View Result

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
import ConfirmationDialog from "@/views/Dashboard/Customer/Home/MyTest/ConfirmationDialog"
import { getDbioBalance, setGeneticAnalysisPaid } from "@/common/lib/api"
import {
  cancelGeneticAnalysisOrder,
  getCreateGeneticAnalysisOrderFee
} from "@/common/lib/polkadot-provider/command/genetic-analysis-orders"
import { queryGeneticAnalysisOrders } from "@/common/lib/polkadot-provider/query/genetic-analysis-orders"
import { queryGeneticAnalysisStorage } from "@/common/lib/polkadot-provider/query/genetic-analysis"
import { queryGeneticDataById } from "@/common/lib/polkadot-provider/query/genetic-data"
import PaymentDialog from "@/common/components/Dialog/PaymentDialog"

export default {
  name: "PaymentCard",

  components: { ConfirmationDialog, PaymentDialog },

  data: () => ({
    rate: null,
    isDeficit : false,
    txWeight: 0,
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
    isRegistered: true,
    newFile: null,
    geneticLink: null,
    links: [],
    geneticData: {},
    customerBoxPublicKey: null
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      walletBalance: (state) => state.substrate.walletBalance,
      lastEventData: (state) => state.substrate.lastEventData,
      web3: (state) => state.metamask.web3
    }),

    setStyleColor() {
      if (this.isDeficit) {
        return "color: red"
      } else {
        return "color: black"
      }
    }
  },

  watch: {
    lastEventData(e) {
      if (e !== null) {
        const dataEvent = JSON.parse(e.data.toString())
        if (e.method === "GeneticAnalysisOrderPaid") {
          if (dataEvent[0].customerId === this.wallet.address) {
            this.isLoading = false
            this.$router.push({ name: "customer-request-analysis-success", params: {id: this.orderId} })
          }
        }

        if (e.method === "GeneticAnalysisOrderCancelled") {
          if (dataEvent[0].customerId === this.wallet.address) {
            this.isLoading = false
            this.showCancelDialog = false
            this.$router.push({ name: "customer-request-analysis-success", params: {id: this.orderId} })
          }
        }
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
      await this.getGeneticData()
      await this.getAnalysisStatus()
    }

    if (Number(this.walletBalance) < Number(this.web3.utils.toWei(this.orderPrice))) {
      this.isDeficit = true
    }
  },

  methods: {
    async getGeneticData() {
      this.geneticData = await queryGeneticDataById(this.api, this.geneticOrderDetail.geneticDataId)
    },

    async setPaid() {
      this.isLoading = true
      await setGeneticAnalysisPaid(this.orderId)
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
      this.isLoading = true
      await cancelGeneticAnalysisOrder(this.api, this.wallet, this.orderId)
    },

    async getAnalysisStatus() {
      const details = await queryGeneticAnalysisStorage(this.api, this.trackingId)
      if (details.status !== "Registered") {
        this.isRegistered = false
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
      margin-bottom: 10px

    &__text-label
      @include button-2

    &__text-notes
      text-align: justify
      text-justify: inter-word
      margin-top: 10px
      @include super-tiny

    &__data-text
      @include new-body-text-2

    &__data-tx-weight
      margin-top: 10px
      @include tiny-reg

    &__button
      margin-top: 16px
      display: flex
      align-items: center
      justify-content: space-between


    &__amount
      display: flex
      align-items: center
      justify-content: space-between

    &__rate
      display: flex
      align-items: center
      justify-content: flex-end
      @include tiny-reg

  .dialog-loading
    width: 500
    height: 450

    &__card
      background-color: white
      padding-bottom: 51px

</style>
