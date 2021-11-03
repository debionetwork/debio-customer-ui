<template lang="pug">
  v-dialog(:value="show" width="400" persistent )
    v-card.pa-5
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn( class="mt-2" icon @click="closeDialog")
          v-icon mdi-close

      div(class="text-center")
        div(class="text-h5")
          b Payment

      div(class="text-start ms-5 mt-5")
        b.mb-2 {{ prefillService.lab.name || selectedService.labName }}

      div(class="ml-5 text-start")
        .address-detail {{ prefillService.lab.address || selectedService.labAddress}}
        .address-detail {{ prefillService.lab.city || selectedService.city}}


      div(class="text-start")
        div(class="ml-5 mb-2 mt-4 text-start" style="font-size: 12px;")
          b Details

      hr(class="ml-3 me-3 mb-3")

      div(class="text-start")
        div(class="ml-5 text-start me-10")
          div(class="d-flex justify-space-between mb-2" )
            div( style="font-size: 12px;" ) Service Price
            div( style="font-size: 12px;" )
              | {{ prefillService.service.price || selectedService.detailPrice.price_components[0].value }} 
              | {{ prefillService.service.currency || selectedService.currency.toUpperCase() }}

          div(class="d-flex justify-space-between" )
            div( style="font-size: 12px;" ) Quality Control Price
            div( style="font-size: 12px;" )
              | {{ prefillService.service.price || selectedService.detailPrice.additional_prices[0].value }} 
              | {{ prefillService.service.currency || selectedService.currency.toUpperCase() }}

       
      div(class="d-flex justify-end me-3" style="font-size: 12px") +
      hr(class="ml-3 me-3 mb-2")

      div(class="text-start")
        div(class="ml-5 text-start me-10")
          div(class="d-flex justify-space-between mb-2" )
            b( style=" font-size: 12px;" ) Total Price
            b( style="font-size: 12px;" )
              | {{ prefillService.service.total_price || selectedService.price }} 
              | {{ prefillService.service.currency || selectedService.currency.toUpperCase()}}



      div(class="ml-3 mt-5 me-3 text-center")
        v-text-field(
          height="40px"
          label="Input Password"
          v-model="password"
          class="password-field"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[val => !!val || 'Password is required']"
          :disabled="isLoading"
          @click:append="showPassword = !showPassword"
          @keyup.enter="onPasswordSet"
          outlined
        )
      
        Button(
          color="secondary" 
          width="100%"
          height="38"
          @click="onSubmitTemp"
          ) Pay

        v-alert.mt-5.mb-5(
          v-if="error" 
          dense 
          text 
          type="error"
          style="font-size: 12px;"
          ) {{ error }}
  
            
      

</template>

<script>

import Button from "@/common/components/Button"
import { mapState, mapMutations } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { setEthAddress, serviceHandlerMixin } from "@/common/lib/polkadot-provider"
import { ethAddressByAccountId } from "@/common/lib/polkadot-provider/query/user-profile.js"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import { createOrder } from "@/common/lib/polkadot-provider/command/orders.js"
import { startApp } from "@/common/lib/metamask"
import { getBalanceETH } from "@/common/lib/metamask/wallet.js"


export default {
  name: "PaymentReceiptDialog",

  components: {
    Button
  },

  mixins: [serviceHandlerMixin],

  props: {
    prefillService: { type: Object, default: () => {} },
    show: Boolean
  },

  data: () => ({
    password: "",
    error: "",
    showPassword: false,
    showDialog: false,
    ethSellerAddress: null,
    ethAccount: null,
    isCompleted: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs,
      labAccount: (state) => state.testRequest.lab,
      selectedService: (state) => state.testRequest.products,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    })
  },

  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    async onSubmitTemp () {
      this.error = ""
      try {
        this.wallet.decodePkcs8(this.password)
        this.$router.push({ name: "customer-request-test-success"})
      }
      catch (err) {
        console.log(err)
        this.password = ""
        this.error = "The password you entered is wrong"
      }
    },

    async onSubmit () {
      this.error = ""
      try {
        this.wallet.decodePkcs8(this.password)

        // Checking seller ready eth Address
        this.ethSellerAddress = await ethAddressByAccountId(
          this.api,
          this.labAccount._id
        )
        if (this.ethSellerAddress === null) {
          this.password = ""
          this.error = "The seller has no ETH Address."
          return
        }

        // get last order id
        const lastOrder = await lastOrderByCustomer(
          this.api,
          this.wallet.address
        )

        // cek if user has last unpaid order
        let sendOrder = false
        if (lastOrder === null) {
          sendOrder = true
        } else {

          const detailOrder = await getOrdersData(this.api, lastOrder)
          if (detailOrder.status != "Unpaid") {
            sendOrder = true
          }
        }

        // if user has unpaid order
        if (!sendOrder) {
          this.password = ""
          this.error = "You still have unpaid orders."
        }

        this.ethAccount = await startApp()
        if (this.ethAccount.currentAccount === "no_install") {
          this.password = ""
          this.error = "Please install MetaMask!"
          return
        }

        if (this.metamaskWalletAddress != null && this.metamaskWalletAddress != "") {
          
          const accountList = this.ethAccount.accountList

          if (accountList.length <= 0) {
            this.password = ""
            this.error = "Metamask has no address ETH."
            return
          }

          let statusAddUse = false
          for (let i = 0; i < accountList.length; i++) {
            if (accountList[i] === this.metamaskWalletAddress) {
              statusAddUse = true
            }                  
          }
          
          if (!statusAddUse) {
            this.password = ""
            this.error = "The address is not listed on Metamask."
            return
          }
        }

        if(this.ethAccount.currentAccount != null ) {
          await this.dispatch(
            setEthAddress, 
            this.api, 
            this.wallet, 
            this.ethAccount.currentAccount,
            async () => {
              this.setMetamaskAddress(this.ethAccount.currentAccount)
              this.$emit("status-wallet", {
                status: true
              })
              await this.getMunnyFromFaucet(this.ethAccount.currentAccount)
            }
          )
        }

        const balance = await getBalanceETH(this.metamaskWalletAddress)
        if (balance <= 0 ) {
          this.password = ""
          this.error = "ETH balance is 0"
          return
        }

        const customerBoxPublicKey = this.getKiltBoxPublicKey()
        for (let i = 0; i < this.product.length; i++) {
          await createOrder(
            this.api,
            this.wallet,
            this.products[i].accountId,
            customerBoxPublicKey,
            this.products[i].indexPrice
          )
        }
      
        this.$router.push({ name: "customer-request-test-success" })  
      } catch (err) {
        console.log(err)
        this.password = ""
        this.error = "The password you entered is wrong"
      } 
    },

    getKiltBoxPublicKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonic)
      return u8aToHex(cred.boxKeyPair.publicKey)
    },

    closeDialog() {
      // TEMPORARY
      this.$emit("close")

      // TODO : go to Payment History page
    }
  }
}
</script>

<style lang="sass">
  .address-detail
    margin-top: 2px
    font-size: 12px
</style>
