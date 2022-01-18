<template lang="pug">
  v-dialog.remaining-dialog(:value="show" width="480" persistent rounded )
    v-card.remaining-dialog__dialog
      v-app-bar(flat dense color="white" )
        v-toolbar-title.remaining-dialog__title Pay remaining amount
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close
      .remaining-dialog__card
        .remaining-dialog__card-text
          //- TO ADJUST
          .remaining-dialog__card-text-content 1. By clicking Pay button you will use your balance to pay the remaining amount that needed to be completed.
          .remaining-dialog__card-text-content 2. The remaining amount calculated in payment details.
          .remaining-dialog__card-text-content 3. If your balance is not enough to pay the remaining amount, you can top up your balance first and go back to this page.

      .remaining-dialog__input
        .remaining-dialog__input-label Remaining Amount
        ui-debio-input.remaining-dialog__input-field(
          variant="small"
          width="100%"
          outlined
          disabled 
          :placeholder="amount"
        )

        .remaining-dialog__trans-weight
          .remaining-dialog__trans-weight-text
            v-tooltip.visible(bottom)
              template(v-slot:activator="{on, attrs}")
                v-icon.remaining-dialog__trans-weight-icon(
                  style="font-size: 12px;"
                  color="primary"
                  dark 
                  v-bind="attrs"
                  v-on="on" 
                ) mdi-alert-circle-outline
              span(style="font-size: 10ps;") Total fee paid in DBIO to execute this transaction.

          div(style="font-size: 12px;") {{ Number(txWeight).toFixed(4) }} DBIO

        v-btn.remaining-dialog__input-button(
          depressed
          color="secondary"
          large
          width="100%"
          height="35" 
          @click="onSubmit"
          :loading="isLoading"
        ) Continue

</template>

<script>
import { mapState } from "vuex"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { startApp } from "@/common/lib/metamask"
import { getBalanceETH } from "@/common/lib/metamask/wallet.js"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import { ethAddressByAccountId } from "@/common/lib/polkadot-provider/query/user-profile.js"
import { createOrder } from "@/common/lib/polkadot-provider/command/orders.js"
import { processRequest } from "@/common/lib/polkadot-provider/command/service-request"
import { getCreateOrderFee } from "@/common/lib/polkadot-provider/command/info"
import localStorage from "@/common/lib/local-storage"

export default {
  name: "PayRemainingDialog",

  props: {
    show: Boolean,
    amount: Number
  },

  data: () => ({
    currencyType: "DBIO",
    agree: false,
    dialogAlert: false,
    isLoading: false,
    transactionStep: "",
    error: "",
    password: "",
    txWeight: 0
  }),
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet,
      country: state => state.lab.country,
      region: state => state.lab.region,
      city: state => state.lab.city,
      category: state => state.lab.category,
      stakingData: (state) => state.lab.stakingData,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      selectedService: (state) => state.testRequest.products
    })
  },

  async mounted () {
    const txWeight = await getCreateOrderFee(
      this.api, 
      this.pair, 
      this.selectedService.serviceId,
      this.selectedService.indexPrice
    )

    this.txWeight = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
  },
  
  methods: {
    closeDialog() {
      this.$emit("close")
    },

    async onSubmit() {
      this.isLoading = true
      this.error = ""

      this.ethAccount = await startApp()
      if (this.ethAccount.currentAccount === "no_install") {
        this.isLoading = false
        this.error = "Please install MetaMask!"
        return
      }

      // cek kalo udah binding wallet
      if (!this.metamaskWalletAddress) {
        this.isLoading = false
        this.password = ""
        this.error = "Metamask has no address ETH."
        return
      }

      // check ETH Balance
      const balance = await getBalanceETH(this.metamaskWalletAddress)
      if (balance <= 0 ) {
        this.isLoading = false
        this.password = ""
        this.error = "ETH balance is 0"
        return
      }

      // Seller has no ETH address
      this.ethSellerAddress = await ethAddressByAccountId(
        this.api,
        this.stakingData.lab_address
      )

      if (this.ethSellerAddress === null) {
        this.isLoading = false
        this.password = ""
        this.error = "The seller has no ETH Address."
        return
      }

      const mnemonic = localStorage.getLocalStorageByName("mnemonic_data")
      const decryptedMnemonic = CryptoJS.AES.decrypt(mnemonic, "cocacola").toString(CryptoJS.enc.Utf8)
      const identity = await Kilt.Identity.buildFromMnemonic(decryptedMnemonic)
      const customerBoxPublicKey = u8aToHex(identity.boxKeyPair.publicKey)
      const serviceFlow = "StakingRequestService"
      await createOrder(
        this.api,
        this.pair,
        this.selectedService.serviceId,
        customerBoxPublicKey,
        serviceFlow,
        this.selectedService.indexPrice,
        this.processService
      )
      this.$router.push({ name: "customer-request-test-success"})
    },

    async processService () {
      this.lastOrder = await lastOrderByCustomer(
        this.api,
        this.pair.address
      )
      this.detailOrder = await getOrdersData(this.api, this.lastOrder)
      const orderId = this.detailOrder.id
      const dnaSampleTrackingId = this.detailOrder.dnaSampleTrackingId
      const additional = this.detailOrder.additionalPrices

      await processRequest(
        this.api,
        this.pair,
        this.stakingData.lab_address,
        this.stakingData.hash,
        orderId,
        dnaSampleTrackingId,
        additional
      )
      this.isLoading = false
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .remaining-dialog
    &__title
      display: flex
      align-items: center
      letter-spacing: 0.0075em
      margin-left: 20px
      margin-top: 10px
      @include button-1
    
    &__dialog
      padding-bottom: 20px

    &__card
      background-color: #F5F7F9
      margin: 0px 30px

    &__card-text
      padding: 18px 12px
      letter-spacing: -0.004em

    &__card-text-content
      @include body-text-3-opensans

    &__input
      margin: 11px 30px

    &__input-label
      display: flex
      align-items: center
      letter-spacing: -0.0075em
      margin-bottom: 11px
      @include button-2
    
    &__input-field
      max-height: 18px
      letter-spacing: -0.004em
      margin-bottom: 50px
      @include body-text-3-opensans
   
    &__trans-weight
      margin-top: 20px
      margin-bottom: 20px
      display: flex
      justify-content: space-between

    &__trans-weight-text
      letter-spacing: -0.004em
      display: flex
      align-items: center
      @include body-text-3-opensans

    &__input-button
      display: flex
      align-items: center
      text-align: center
      letter-spacing: -0.015em
      margin-top: 20px
      @include tiny-semi-bold

    &__trans-weight-icon
      margin-left: 5px
</style>
