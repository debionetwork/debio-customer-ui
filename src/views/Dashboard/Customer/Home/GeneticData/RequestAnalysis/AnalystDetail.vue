<template lang="pug">
  v-dialog.analyst-detail(:value="show" width="440" persistent rounded )
    v-card.analyst-detail__card
      .analyst-detail__close
        v-btn.fixed-button(icon @click="closeDialog")
          v-icon mdi-close


      .analyst-detail__service
        .analyst-detail__service-name {{ service.serviceName }}

        .analyst-detail__service-description {{ service.description }}


        .analyst-detail__service-info
          v-row
            v-col(cols="8")
              v-icon(size="14" outlined ) mdi-timer 
              span.analyst-detail__service-info-duration {{ service.duration }} {{ service.durationType }}
            v-col(cols="4")
              b.analyst-detail__service-info-price {{ price }}
        hr

      v-row.analyst-detail__profil
        v-col(cols="3")
          ui-debio-avatar.analyst-detail__profil-avatar(:src="profileImage" size="75" rounded)
        v-col(cols="9")
          .analyst-detail__profil-name {{ service.analystsInfo.info.firstName }} {{ service.analystsInfo.info.lastName }}
          .analyst-detail__profil-desc {{ service.analystsInfo.info.specialization }}

          a(:href="service.analystsInfo.info.profileLink" target="_blank")
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
      ) - {{ experience.title }}

      .analyst-detail__button
        Button.analyst-detail__button-text(
          color="secondary" 
          width="48%"
          height="38"
          outlined
          @click="handleDownloadFile"
        ) Download Sample Report

        Button.analyst-detail__button-text(
          color="secondary" 
          width="48%"
          height="38" 
          @click="onSelect"
        ) Select This Service

</template>


<script>

import { mapMutations, mapState } from "vuex"
import Button from "@/common/components/Button"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"



export default {
  name: "AnalystDetail",

  components: {
    Button
  },

  data: () => ({
    price: null,
    profileImage: null
  }),

  props: {
    show: Boolean,
    service: Object,
    experiences: Array
  },

  mounted() {
    this.price = `${this.formatBalance(this.service.priceDetail[0].totalPrice)} ${this.service.priceDetail[0].currency}`
    
    if (!this.service.analystsInfo.info.profileImage) {
      this.profileImage = "https://ipfs.debio.network/ipfs/QmQ9Zvn4pMNMr3nVTGzYE9zGQfyFrhyAHWZNjm76pJmvRn"
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData
    })
  },

  methods: {
    ...mapMutations({
      setSelectedAnalysisService: "geneticData/SET_SELECTED_SERVICE"
    }),

    closeDialog() {
      this.$emit("close")
    },

    onSelect() {
      this.setSelectedAnalysisService(this.service)
      this.$router.push({name: "customer-request-analysis-payment"})
    },

    formatBalance(balance) {
      const formatedBalance = this.web3.utils.fromWei(String(balance.replaceAll(",", "")), "ether")
      return Number(formatedBalance).toPrecision()
    },

    async handleDownloadFile() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      const publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      const privateKey = u8aToHex(cred.boxKeyPair.secretKey)
      const arr = this.service.testResultSample.split("/")
      const fileName = arr[arr.length-1]
      const path = `${this.service.testResultSample.split("/").slice(4, 5).join("")}/${fileName}`

      await downloadDecryptedFromIPFS(
        path,
        privateKey,
        publicKey,
        fileName,
        "application/pdf"
      )

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
      height: 60px
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
