<template lang="pug">
  v-dialog(:value="show" width="480" persistent rounded )
    v-card
      div.pa-5(class="d-flex justify-end") 
        v-btn.fixed-button(icon @click="closeDialog")
          v-icon mdi-close

      div.pa-5(class="d-flex justify-center")
        ui-debio-avatar(:src="selectedService.serviceImage" size="125" rounded)
        
      div(class="d-flex justify-center pb-5 pt-1")
        .dialog-service__title
          b {{ selectedService.serviceName }}

      div(class="pa-5")
        div(class="pa-2")
          .dialog-service__sub-title
            b Description
          .dialog-service__description
            div  {{ selectedService.serviceDescription }}

        div(class="pa-2")
          .dialog-service__sub-title
            b Expected Duration
          .dialog-service__description          
            div {{ selectedService.duration }} {{ selectedService.durationType}}
      
      v-row(class="pa-5")
        v-col(cols="3")
          ui-debio-avatar(:src="selectedService.labImage" size="90" rounded)
        
        v-col(cols="6 mt-3")
          .dialog-service__sub-title
            b {{ selectedService.labName }}

          .dialog-service__description          
            span {{ selectedService.labAddress }}, {{ selectedService.city }}, {{ country }}

        v-col
          v-row(class="ml-1 mt-1")
            div(
              v-for="i in selectedService.labRate"
              :key="i")
              v-icon(style="font-size: 10px;" color="primary") mdi-star

            div(
              v-for="i in ( 5 - selectedService.labRate )"
              :key="i")
              v-icon(style="font-size: 10px;" color="primary") mdi-star-outline 

            div.ml-2
              span(style="font-size: 10px;" ) ({{ selectedService.countRateLab }})

      .dialog-service__button
        Button(
          color="secondary" 
          width="48%"
          height="38" 
          style="font-size: 11px"
          outlined 
          @click="downloadFile"
        ) Download Sample Report

        Button(
          color="secondary" 
          width="48%"
          height="38" 
          style="font-size: 11px"
          @click="onSelect"
        ) Select This Service

</template>


<script>

import { mapState } from "vuex"
import Button from "@/common/components/Button"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"
import { hexToU8a } from "@polkadot/util"
import { getLocations } from "@/common/lib/location"


export default {
  name: "ServiceDetailDialog",
  
  data: () => ({
    formatedDurationType: "",
    avatar: "",
    countries: []
  }),

  async mounted () {
    await this.getCountries()
  },

  components: {
    Button
  },

  props: {
    show: Boolean
  },

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      selectedService: (state) => state.testRequest.products
    }),

    country () {
      return this.countries.filter((c) => c.iso2 === this.selectedService.country)[0].name
    }
  },

  methods: {

    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },

    closeDialog() {
      this.$emit("close")
    },

    onSelect () {
      this.$router.push({ name: "customer-request-test-checkout"})
    },

    async downloadFile () {
      const publicKey = hexToU8a(this.mnemonicData.publicKey)
      const privateKey = hexToU8a(this.mnemonicData.privateKey)
      const baseUrl = "https://ipfs.io/ipfs/"
      const path = this.downloadPath.replace(baseUrl, "")
      await downloadDecryptedFromIPFS(
        path,
        privateKey,
        publicKey,
        this.serviceId + ".pdf",
        "application/pdf"
      )
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-service
    &__title
      display: flex
      align-items: center
      text-align: center
      letter-spacing: 0.0044rem
      @include h6

    &__sub-title
      @include body-text-2-opensans

    &__description
      @include body-text-3-opensans

    &__button
      margin-top: 15px
      display: flex
      align-items: center
      justify-content: space-between
      padding: 0 35px 40px 35px
      gap: 10px
    
  .fixed-button
    position: fixed
    width: 50px

      

</style>
