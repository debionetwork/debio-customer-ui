<template lang="pug">
  .customer-select-service-analyst
    .customer-select-service-analyst__wrapper
      .customer-select-service-analyst__nav
        .customer-select-service-analyst__nav-button(@click="handleBack")
          v-icon.customer-select-service-analyst mdi-chevron-left
          
      .customer-select-service-analyst__main
        .customer-select-service-analyst__stepper
          ui-debio-stepper(
            :items="stepperItems"
          )

        .customer-select-service-analyst__title Select Service and Analyst
        
        .customer-select-service-analyst__cards
          v-row
            v-col(
              v-if="isLoading"
              v-for="(value) in skeletonData"
              :key="value"
            )
              v-skeleton-loader(
                type="card"
                width="300"
              )
            v-col(
              v-else
              v-for="(service, i) in serviceList"
              :key="i"
            )
              ServiceAnalysisCard.customer-select-service-analyst__card(
                :service="service"
                @click="showDetail"
              )
              
        AnalystDetail(
          :show="showAnalystDetail"
          :service="selectedService"
          :experiences="selectedAnalystExperiences"
          @close="closeDetailDialog"
        )
          
</template>

<script>

import { mapState } from "vuex"
import ServiceAnalysisCard from "./ServiceAnalysisCard"
import AnalystDetail from "./AnalystDetail"
import { queryGeneticAnalysts } from "@/common/lib/polkadot-provider/query/genetic-analysts"
import { queryGetAllGeneticAnalystServices } from "@/common/lib/polkadot-provider/query/genetic-analyst-service"
import { queryGeneticAnalystQualifications } from "@/common/lib/polkadot-provider/query/genetic-analyst-qualifications"

export default {
  name: "SelectServiceAnalyst",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Genetic Data", active: false },
      { number: 2, title: "Select Service & Analyst", active: true },
      { number: 3, title: "Checkout and Payment", active: false },
      { number: 4, title: "Success", active: false }
    ],
    showAnalystDetail: false,
    serviceList: [],
    selectedService: null,
    selectedAnalystExperiences: null,
    isLoading: false,
    skeletonData: [1, 2, 3]
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      selectedGeneticData: (state) => state.geneticData.selectedData
    })
  },

  components: {
    ServiceAnalysisCard,
    AnalystDetail
  },

  async mounted () {

    if (!this.selectedGeneticData) {
      this.$router.push({ name: "customer-request-analysis" })
    }

    await this.getGeneticAnalystService()
  },


  methods: {
    async getGeneticAnalystService() {
      this.isLoading = true
      const geneticAnalystService = await queryGetAllGeneticAnalystServices(this.api)



      for (let i = 0; i < geneticAnalystService.length; i++) {
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
        } = geneticAnalystService[i][1].toHuman()  
        
        const analystsInfo = await queryGeneticAnalysts(this.api, analystId)

        if (analystsInfo.verificationStatus === "Verified") {
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
          this.serviceList.push(service)
        }
      }
      this.isLoading = false
    },

    handleBack() {
      this.$router.push({ name: "customer-request-analysis" })
    },

    async showDetail(val) {
      this.selectedService = val
      const qualifications = val.analystsInfo.qualifications[0]
      this.showAnalystDetail = true
      await this.getExperience(qualifications)
    },

    async getExperience(id) {
      const experiences = await queryGeneticAnalystQualifications(this.api, id)
      this.selectedAnalystExperiences = experiences.info.experience
    },

    closeDetailDialog() {
      this.showAnalystDetail = false
    }
  }


}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-select-service-analyst
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

    &__cards
      margin-top: 40px
      margin-left: 16px
      
    &__card
      margin-bottom: 20px

    
</style>
