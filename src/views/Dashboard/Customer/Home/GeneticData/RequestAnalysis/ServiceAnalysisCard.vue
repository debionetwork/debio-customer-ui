<template lang="pug">
  v-card.service-analysis-card(@click="onClick")
    .service-analysis-card__title {{ service.serviceName }}

    .service-analysis-card__description {{ service.description }}

    .service-analysis-card__info
      v-row
        v-col(cols="8")
          v-icon(size="14" outlined ) mdi-timer 
          span.service-analysis-card__info-duration {{ service.duration }} {{ service.durationType }}
        v-col(cols="4")
          b.service-analysis-card__info-price {{ formatBalance(service.priceDetail[0].totalPrice) }} {{ service.priceDetail[0].currency }}

    hr

    .service-analysis-card__analyst
      v-row
        v-col(cols=3)
          ui-debio-avatar.service-analysis-card__avatar(src="https://ipfs.io/ipfs/QmcJYkCKK7QPmYWjp4FD2e3Lv5WCGFuHNUByvGKBaytif4" size="70" rounded)

        v-col(cols=8).service-analysis-card__analyst-info
          .service-analysis-card__analyst-name {{ service.analystsInfo.info.firstName }} {{ service.analystsInfo.info.lastName }}
          .service-analysis-card__analyst-desc {{ service.analystsInfo.info.specialization }}

          a(href="https://www.linkedin.com/" target="_blank")
            v-img.service-analysis-card__social(
              alt="linkedin"
              center
              src="@/assets/linkedin-logo.png"
              height="15" 
              width="15"
            )

</template>

<script>
import { mapState } from "vuex"

export default {
  name: "ServiceAnalysisCard",

  data: () => ({
    showDetail: false
  }),

  props: {
    service: Object
  },

  computed: {
    ...mapState({
      web3: (state) => state.metamask.web3
    })
  },


  methods: {
    onClick() {
      this.$emit("click", this.service)
    },

    formatBalance(balance) {
      const formatedBalance = this.web3.utils.fromWei(String(balance.replaceAll(",", "")), "ether")
      return Number(formatedBalance).toPrecision()
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .service-analysis-card
    margin-top: 0 !important
    width: 340px
    height: 320px
    cursor: pointer

    &__title
      padding-top: 25px
      margin-left: 20px
      letter-spacing: -0.0075em
      @include button-2

    &__description
      height: 83px
      margin: 20px
      letter-spacing: -0.0044em
      @include new-body-text-2

    &__info
      margin-left: 16px
      margin-bottom: 0 !important
      padding-bottom: 20px

    &__info-duration
      letter-spacing: -0.004em
      margin-left: 5px
      @include body-text-3-opensans-medium

    &__info-price
      color: #F006CB
      @include body-text-3-opensans

    &__avatar
      margin-top: 16px
      margin-left: 16px

    &__analyst
      margin-bottom: 20px

    &__analyst-info
      margin-left: 8px

    &__analyst-name
      margin-top: 16px
      @include button-2

    &__analyst-desc
      @include body-text-3-opensans

    &__social
      margin-top: 16px
</style>
