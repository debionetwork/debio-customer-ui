<template lang="pug">
  v-dialog(:value="show" width="320" persistent )
    v-card 
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn( class="mt-2" icon @click="closeDialog")
          v-icon mdi-close

      div(class="text-center")
        div(class="text-h5")
          b Payment

      div(class="text-start ms-5 mt-10")
        b.mb-5 Lab DNA Favourite

      div(class="text-start ms-5 mt-5")
        .address-detail Jalan Raya Makasar No 44
        .address-detail Jakarta Pusat

      div(class="ml-5 mt-10 text-start")
          span Payment details:

      hr(class="ml-3 me-3 mb-5")

      div(class="ml-5 text-start")
        v-row
          v-col(cols="6") 
            div( style=" font-size: 12px;" ) Price:
          v-col(cols="6") 
            div( style="font-size: 12px;" ) 400 Dai

        v-row
          v-col(cols="6") 
            div( style="font-size: 12px;" ) QC Price:
          v-col(cols="6") 
            div( style="font-size: 12px;" ) 5 Dai

      hr(class="ml-3 me-3 mb-5")

      div(class="ml-5 mb-10 text-start")
        v-row
          v-col(cols="6") 
            b( style=" font-size: 12px;" ) Total:
          v-col(cols="6") 
            b( style="font-size: 12px;" ) 405 Dai
        



      div(class="ml-3 me-3 text-center")
        v-text-field(
          label="Password"
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
          @click="onSubmit"
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
      product: (state) => state.testRequest.products,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    })
  },

  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    async onSubmit () {
      this.error = ""
      try {
        this.wallet.decodePkcs8(this.password)
        this.$router.push({ name: "customer-request-test-success" })  

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
