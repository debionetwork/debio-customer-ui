<template lang="pug">
  v-card.service-analysis-card(@click="onClick")
    .service-analysis-card__title Cardiology Analysis

    .service-analysis-card__description The metabolism analysis uses a blood or saliva sample and body-related data (e.g. weight,  physical activity, eating habits) to investigate how your metabolism works.

    .service-analysis-card__info
      v-row
        v-col(cols="8")
          v-icon(size="14" outlined ) mdi-timer 
          span.service-analysis-card__info-duration 5 days
        v-col(cols="4")
          span.service-analysis-card__info-price 3000 DBIO

    hr

    .service-analysis-card__analyst
      v-row
        v-col(cols=3)
          ui-debio-avatar.service-analysis-card__avatar(src="https://ipfs.io/ipfs/QmcJYkCKK7QPmYWjp4FD2e3Lv5WCGFuHNUByvGKBaytif4" size="70" rounded)

        v-col(cols=8).service-analysis-card__analyst-info
          .service-analysis-card__analyst-name Lydia Agustin
          .service-analysis-card__analyst-desc Metabolic

          v-img.service-analysis-card__social(
            alt="linkedin"
            center
            src="@/assets/linkedin-logo.png"
            height="15" 
            width="15"
          )

</template>

<script>


export default {
  name: "ServiceAnalysisCard",

  data: () => ({
    showDetail: false
  }),

  methods: {
    onClick() {
      this.$emit("click")
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
