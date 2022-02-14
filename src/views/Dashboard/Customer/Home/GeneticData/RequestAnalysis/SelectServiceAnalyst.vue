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
            v-col
              ServiceAnalysisCard(
                @click="showDetail"
              )
              
            v-col
              ServiceAnalysisCard(
                @click="showDetail"
              )

            v-col
              ServiceAnalysisCard(
                @click="showDetail"
              )

        AnalystDetail(
          :show="showAnalystDetail"
          @close="closeDetailDialog"
        )
          
</template>

<script>
import ServiceAnalysisCard from "./ServiceAnalysisCard"
import AnalystDetail from "./AnalystDetail"

export default {
  name: "SelectServiceAnalyst",

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select Genetic Data", active: false },
      { number: 2, title: "Select Service & Analyst", active: true },
      { number: 3, title: "Checkout and Payment", active: false },
      { number: 4, title: "Success", active: false }
    ],
    showAnalystDetail: false
  }),

  components: {
    ServiceAnalysisCard,
    AnalystDetail
  },

  methods: {
    handleBack() {
      this.$router.push({ name: "customer-request-analysis" })
    },

    showDetail() {
      this.showAnalystDetail = true
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
</style>
