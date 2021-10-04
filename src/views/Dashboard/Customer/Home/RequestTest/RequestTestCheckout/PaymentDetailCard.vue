<template lang="pug">
  v-container.container-card
    v-card.menu-card 
      v-card.menu-card
        div(class="ml-5 mt-5 mb-5 text-center" )
          span Order Details


        div(class="ml-5 text-start")
          span Details:

        hr(class="ml-3 me-3 mb-5")

        div(class="ml-5 text-start")
          v-row
            v-col(cols="6") 
              div( style=" font-size: 12px;" ) Service Price:
            v-col(cols="6") 
              div( style="font-size: 12px;" ) {{ testingPrice}} {{ currency}}
          v-row
            v-col(cols="6") 
              div( style="font-size: 12px;" ) Transaction Fee:
            v-col(cols="6") 
              div( style="font-size: 12px;" ) {{ qcPrice }} {{ currency }}

        hr(class="ml-3 me-3 mb-5")

        div(class="ml-5 text-start")
          v-row
            v-col(cols="6") 
              div( style=" font-size: 12px;" ) Total:
            v-col(cols="6") 
              div( style="font-size: 12px;" ) {{ totalPrice }} {{ currency}}
       
        template
          Button(
            v-if="!success"
            class="mt-8" 
            color="secondary" 
            width="360"
            height="32"
            @click="onSubmit"
            ) Submit Order

          div(v-else class="d-flex justify-space-between align-center pa-8")
            Button(
              class="mt-8" 
              color="secondary" 
              width="45%"
              height="32"
              @click="toInstruction"
              style="font-size: 8px;"
              outlined 
              ) View Instruction

            Button(
              class="mt-8" 
              color="secondary" 
              width="45%"
              height="32"
              style="font-size: 8px;"
              @click="toEtherscan"
              ) View Etherscan

      template
        PaymentReceiptDialog(
          :show="showReceipt"
          @close="showReceipt = false"
        )
              
      
</template>

<script>

import { mapState } from "vuex"
import Button from "@/common/components/Button"
import PaymentReceiptDialog from "./PaymentReceiptDialog.vue"

export default {
  name: "PaymentDetailCard",
  
  components: {
    Button,
    PaymentReceiptDialog
  },

  data: () => ({
    showReceipt: false
  }),

  props: {
    testingPrice: Number,
    qcPrice: Number,
    totalPrice: Number,
    currency: String,
    success: { type: Boolean, default: false }
  },

  computed: {
    ...mapState({
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    })
  },

  methods: {

    toEtherscan () {
      window.open(`https://rinkeby.etherscan.io/address/${this.metamaskWalletAddress}`, "_blank")
    },

    onSubmit () {
      this.showReceipt = true
    },

    toInstruction () {
      // TODO : to instruction page
    }
  }
}
</script>

<style lang="scss" scoped>

  .container-card {
    width: 420px;
    height: 250px;
    border-radius: 8px;
  }

  .menu-card {
    border-radius: 8px;
    padding: 2px;
    height: 320px;
  }

</style>

