<template lang="pug">
  v-dialog(:value="show" width="480" persistent )
    v-card 
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn( class="mt-8" icon @click="closeDialog")
          v-icon mdi-close

      div(class="d-flex justify-center pt-3")
        v-icon(color="#BA8DBB" :size="125") {{ icon }}
        
      div(class="d-flex justify-center pb-5 pt-5")
        div(class="text-h6")
          b {{ title }}

      div(class="pa-5")
        div(class="ml-5 pb-5")
          b Description
          div {{ description }}

        div(class="ml-5 pb-5")
          b Expected Service Duration
          div This service is expected to be completed within {{ duration }} working days
      
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

  components: {
    Button
  },

  props: {
    show: Boolean,
    title: String,
    icon: String,
    description: String,
    duration: Number,
    serviceId: String
  },

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData
    })
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSelect () {
      this.$router.push({ name: "customer-request-test-checkout" })
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
