<template lang="pug">
  .customer-request-analyst-success
    .customer-request-analyst-success__wrapper
      .customer-request-analyst-success__nav
        .customer-request-analyst-success__nav-button
          
      .customer-request-analyst-success__main
        .customer-request-analyst-success__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )

        div(v-if="orderStatus !== 'Cancelled'")
          .customer-request-analyst-success__title Thank you for your order!
          .customer-request-analyst-success__sub-title(v-if="!isProcessing") Please wait, Genetic Analyst will confirm your order soon
          .customer-request-analyst-success__sub-title(v-else) Please wait while your genetic data is being analyzed

        
        div(v-if="orderStatus === 'Cancelled'")
          .customer-request-analyst-success__title Your service has been cancelled!


        
        .customer-request-analyst-success__cards
          ServiceAnalysisCard(
            :service="service"
          )
          PaymentCard(
            :genetic-data="geneticData"
          )
        

  

</template>

<script>
import { mapState } from "vuex"
import ServiceAnalysisCard from "./ServiceAnalysisCard.vue"
import PaymentCard from "./PaymentCard"
import { queryGeneticAnalysisOrders } from "@/common/lib/polkadot-provider/query/genetic-analysis-orders"
import { queryGetGeneticAnalystServiceById } from "@/common/lib/polkadot-provider/query/genetic-analyst-service"
import { queryGeneticAnalysts } from "@/common/lib/polkadot-provider/query/genetic-analysts"
import { queryGeneticDataById } from "@/common/lib/polkadot-provider/query/genetic-data"
import { queryGeneticAnalysisStorage } from "@/common/lib/polkadot-provider/query/genetic-analysis"


export default {
  name: "SuccessPage",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Genetic Data", active: false },
      { number: 2, title: "Select Service & Analyst", active: false },
      { number: 3, title: "Checkout and Payment", active: false },
      { number: 4, title: "Success", active: true }
    ],
    geneticOrderAnalysisDetail: null,
    serviceAnalysis: null,
    geneticData: null,
    service: null,
    orderStatus: null,
    isProcessing: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  components: {
    ServiceAnalysisCard,
    PaymentCard
  },

  async mounted() {
    await this.getAnalysisOrderDetail()
    await this.getServiceDetail()
    await this.getGeneticData()
    await this.getAnalysisStatus()

    if (this.orderStatus === "Cancelled") {
      this.stepperItems[3].title = "Cancelled"
    }
  },

  methods: {
    async getAnalysisOrderDetail() {
      const analysisOrderId = this.$route.params.id
      const analysisOrderDetail = await queryGeneticAnalysisOrders(this.api, analysisOrderId)
      this.geneticOrderAnalysisDetail = analysisOrderDetail
      this.orderStatus = this.geneticOrderAnalysisDetail.status
      this.trackingId = this.geneticOrderAnalysisDetail.geneticAnalysisTrackingId
    },

    async getAnalysisStatus() {
      const details = await queryGeneticAnalysisStorage(this.api, this.trackingId)
      if (details.status === "InProgress") {
        this.isProcessing = true
      }

    },

    async getServiceDetail() {
      const serviceDetail = await queryGetGeneticAnalystServiceById(this.api, this.geneticOrderAnalysisDetail.serviceId)
    
      let {
        id: serviceId,
        ownerId: analystId,
        info: {
          name: serviceName,
          pricesByCurrency: priceDetail,
          expectedDuration: {
            duration,
            durationType
          },
          description,
          testResultSample
        }     
      } = serviceDetail

      const analystsInfo = await queryGeneticAnalysts(this.api, analystId)
      const service = {
        serviceId,
        analystId,
        serviceName,
        priceDetail,
        duration,
        durationType,
        description,
        testResultSample,
        analystsInfo
      }

      this.service = service

    },

    async getGeneticData() {
      const geneticData = await queryGeneticDataById(this.api, this.geneticOrderAnalysisDetail.geneticDataId)
      this.geneticData = geneticData
    }

  }


}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-request-analyst-success
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

    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

    &__main
      padding-bottom: 100px
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      margin-top:50px
      @include h6-opensans

    &__sub-title
      display: flex
      flex-direction: column
      align-items: center
      @include body-text-3-opensans

    &__cards
      display: flex
      align-items: center
      justify-content: space-between
      padding: 29px 35px 55px 35px
      gap: 32px

</style>
