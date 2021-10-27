<template lang="pug">
  v-dialog.pa-5(:value="show" width="480" persistent )
    v-card 
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn( class="mt-8" icon @click="closeDialog")
          v-icon mdi-close

      div(class="d-flex justify-center pt-3")
        v-icon(color="#BA8DBB" :size="125") mdi-apple
        
      div(class="d-flex justify-center pb-5 pt-5")
        div(class="text-h6")
          b {{ selectedService.serviceName }}

      div(class="pa-5")
        div(class="ml-5 pb-5")
          b Description
          div  {{ selectedService.serviceDescription }}

        div(class="ml-5 pb-5")
          b Expected Duration
          div {{ selectedService.duration }} {{ selectedService.durationType}}

      
      v-row.pa-3
        v-col(cols="3")
          v-icon.ml-2(v-if="!avatar" color="#BA8DBB" size="90") mdi-apple
          v-img.ml-2(v-else :src="avatar" max-width="90" max-height="90")
        
        v-col(cols="9")
          div
            b {{ selectedService.labName }}

            v-row(class="ml-1 mt-1 mb-1")
              div(
                v-for="i in selectedService.labRate"
                :key="i")
                v-icon(style="font-size: 9px;" color="primary") mdi-star

              div(
                v-for="i in ( 5 - selectedService.labRate )"
                :key="i")
                v-icon(style="font-size: 9px;" color="primary") mdi-star-outline 
              span.ml-2( style="font-size: 9px;") ({{ selectedService.countRateLab }})

          div
            span {{ selectedService.labAddress }}

      template
        div(class="d-flex justify-space-between align-center pa-8")
          Button(
            color="secondary" 
            width="45%"
            height="38" 
            style="font-size: 8px"
            outlined 
            @click="downloadFile"
          ) Download Sample Report

          Button(
            color="secondary" 
            width="45%"
            height="38" 
            style="font-size: 8px" 
            @click="onSelect"
          ) Select This Service

</template>


<script>

import { mapState } from "vuex"
import Button from "@/common/components/Button"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"
import { hexToU8a } from "@polkadot/util"


export default {
  name: "ServiceDetailDialog",
  data: () => ({
    formatedDurationType: "",
    avatar: ""
  }),

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
    })  
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSelect () {
      this.$emit("onSelect")
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


