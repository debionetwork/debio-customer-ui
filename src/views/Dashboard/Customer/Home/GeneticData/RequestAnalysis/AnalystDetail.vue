<template lang="pug">
  v-dialog.analyst-detail(:value="show" width="440" persistent rounded )
    v-card.analyst-detail__card
      .analyst-detail__close
        v-btn.fixed-button(icon @click="closeDialog")
          v-icon mdi-close


      .analyst-detail__service
        .analyst-detail__service-name Cardiology Analysis

        .analyst-detail__service-description The metabolism analysis uses a blood or saliva sample and body-related data (e.g. weight, physical activity, eating habits) to investigate how your metabolism works.


        .analyst-detail__service-info
          v-row
            v-col(cols="8")
              v-icon(size="14" outlined ) mdi-timer 
              span.analyst-detail__service-info-duration 5 days
            v-col(cols="4")
              span.analyst-detail__service-info-price 3000 DBIO
        hr

      v-row.analyst-detail__profil
        v-col(cols="3")
          ui-debio-avatar.analyst-detail__profil-avatar(src="https://ipfs.io/ipfs/QmcJYkCKK7QPmYWjp4FD2e3Lv5WCGFuHNUByvGKBaytif4" size="75" rounded)
        v-cols(cols="9")
          .analyst-detail__profil-name Lydia Agustin
          .analyst-detail__profil-desc Metabolic

          v-img.analyst-detail__profil-social(
            alt="linkedin"
            center
            src="@/assets/linkedin-logo.png"
            height="15" 
            width="15"
          )

      .analyst-detail__profil-experience Experience
      ul.analyst-detail__profil-experience-list(
        v-for="(experience, i) in experiences"
        :key="i"
      ) - {{ experience }}

      .analyst-detail__button
        Button.analyst-detail__button-text(
          color="secondary" 
          width="48%"
          height="38" 
          outlined 
          @click="downloadFile"
        ) Download Sample Report

        Button.analyst-detail__button-text(
          color="secondary" 
          width="48%"
          height="38" 
          @click="onSelect"
        ) Select This Service

</template>


<script>

import Button from "@/common/components/Button"

export default {
  name: "AnalystDetail",

  data: () => ({
    experiences: [
      "Skin Councelor at RS Pertamina",
      "Skin Cancer Councelor for WHO",
      "Senior Dermatologist on RS Pertamina",
      "Health Skin Advisor for Siloam Hospital from 2019 to 2021",
      "Best Skin Councelor at Indonesian Medic Awards 2019"
    ]
  }),

  components: {
    Button
  },

  props: {
    show: Boolean
  },

  methods: {

    closeDialog() {
      this.$emit("close")
    },

    donwloadFile() {
      console.log("Downloading...")
    },

    onSelect() {
      this.$router.push({name: "customer-request-analysis-payment"})
    }

  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .analyst-detail
    &__service
      padding: 15px 35px 0 35px

    &__service-name
      @include button-2

    &__service-description
      margin-top: 8px
      @include body-text-3-opensans

    &__service-info
      margin-top: 16px
      margin-bottom: 20px

    &__service-info-duration
      letter-spacing: -0.004em
      margin-left: 5px
      @include body-text-3-opensans-medium

    &__service-info-price
      color: #F006CB
      @include body-text-3-opensans

    &__profil
      margin-left: 0 !important
      padding: 12px 23px

    &__profil-name
      margin-top: 12px
      @include body-text-1

    &__profil-desc
      color: #8C8C8C
      @include body-text-3

    &__profil-social
      margin-top: 16px


    &__profil-experience
      margin-left: 0 !important
      padding: 12px 35px
      @include button-2

    &__profil-experience-list
      margin-left: 0 !important
      padding-left: 35px
      @include body-text-3
    
    &__button
      display: flex
      align-items: center
      justify-content: space-between
      padding: 29px 35px 55px 35px
      gap: 10px

    &__button-text
      @include body-text-5-opensans

    &__close
      display: flex
      justify-content: flex-end
      padding: 1.013rem !important
    
  .fixed-button
    position: fixed
    width: 50px

</style>
