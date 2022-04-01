<template lang="pug">
  .service-card
    .service-card__label Service Provider
      .service-card__service-provider
        ui-debio-avatar.service-card__service-provider-avatar(
          :src="analystAvatar"
          size="92" 
        )

        .service-card__service-provider-info
          .service-card__service-provider-name {{ analystName }}
          .service-card__service-provider-speciality {{ analystSpecialization }}

    .service-card__label Service Details
    .service-card__service-details
      p.service-card__service-details-name {{ serviceName }}
      p.service-card__service-details-desc {{ serviceDescription }}

      .service-card__service-details-info
        .service-card__service-details-timer 
          v-icon(size="14") mdi-timer
          span.service-card__service-details-duration  {{ serviceDuration }}

        b.service-card__service-details-price {{ servicePrice }}


</template>

<script>
import { mapState } from "vuex"
import { queryGeneticAnalystByAccountId } from "@debionetwork/polkadot-provider"
import { queryGeneticAnalystServicesByHashId } from "@debionetwork/polkadot-provider"
import { queryGeneticAnalysisOrderById } from "@debionetwork/polkadot-provider"


export default {
  name: "ServiceCard",

  data: () => ({
    orderId: "",
    serviceName: null,
    serviceDescription: null,
    serviceDuration: null,
    servicePrice: null,
    analystName: null,
    analystAvatar: null,
    analystSpecialization: null
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3
    })
  },

  async mounted() {
    if (this.$route.params.id) {
      this.orderId = this.$route.params.id
      await this.getGAOrder()
    }
  },

  methods: {
    async getGAOrder() {
      const gAOrder = await queryGeneticAnalysisOrderById(this.api, this.orderId)
      const serviceDetail = await queryGeneticAnalystServicesByHashId(this.api, gAOrder.serviceId)
      const analystDetail = await queryGeneticAnalystByAccountId(this.api, gAOrder.sellerId)

      this.analystName = `${analystDetail.info.firstName} ${analystDetail.info.lastName}`
      this.analystSpecialization = analystDetail.info.specialization
      this.analystAvatar = analystDetail.info.profileImage

      this.serviceName = serviceDetail.info.name
      this.serviceDescription = serviceDetail.info.description
      this.serviceDuration = `${serviceDetail.info.expectedDuration.duration} ${serviceDetail.info.expectedDuration.durationType}`
      this.servicePrice = `${this.formatPrice(serviceDetail.info.pricesByCurrency[0].totalPrice)} ${serviceDetail.info.pricesByCurrency[0].currency}`

    },

    formatPrice(price) {
      return this.web3.utils.fromWei(String(price.replaceAll(",", "")), "ether")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  @import "@/common/styles/functions.sass"

  .service-card
    border: solid 0.5px #E4E4E4
    background-color: #FFFFFF
    padding: toRem(16px)
    width: toRem(511px)

    &__label
      padding: toRem(2px)
      margin-bottom: toRem(10px)
      @include h6-opensans


    &__service-provider
      border: solid 0.5px #E4E4E4
      display: flex
      padding: toRem(10px)
      margin-bottom: toRem(16px)
      margin-top: toRem(5px)

    &__service-provider-avatar
      border: solid 0.5px #E4E4E4
      width: toRem(94px)
      margin-right: toRem(11px)

    &__service-provider-name
      @include button-2 

    &__service-provider-speciality
      margin-top: toRem(3px)
      @include body-text-3

    &__service-details
      border: solid 0.5px #E4E4E4
      margin-top: toRem(5px)
      padding: toRem(24px)
      height: toRem(193px)

    &__service-details-name
      @include body-text-medium-1

    &__service-details-desc
      height: toRem(66px)
      @include new-body-text-2

    &__service-details-duration
      letter-spacing: -0.004em
      margin-left: 5px
      @include body-text-3-opensans-medium

    &__service-details-info
      margin-top: toRem(5px)
      display: flex
      justify-content: space-between

    &__service-details-price
      color: #F006CB
      @include body-text-3-opensans
</style>
