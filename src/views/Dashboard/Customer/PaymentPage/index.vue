<template lang="pug">
  v-container.payment-page.mt-16
    template
      Stepper.mt-10( 
        align="center"
        withLineIndicator
        :items="stepperItems"
      )

    template(v-if="isCompleted")
      template(style="margin-top: 5%")
        div.title(style="margin-top: 5%") Thank you for your order!
        div.title We will inform you once your transaction is completed.

      template
        v-row(class="d-flex justify-center mt-5")
          v-col(cols="5")
            Button(
              class="mt-16"
              color="secondary" 
              width="560"
              height="38"
              @click="toHomePage"
              outlined
              ) Back to Dashboard

    template(v-else)
      template(style="margin-top: 5%")
        div.title(style="margin-top: 5%") You are going to make a payment!
        div.title Please enter your password to proceed 

      template
        v-row(class="d-flex justify-center mt-16")
          v-col(cols="5")
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
              class="mt-16"
              color="secondary" 
              width="560"
              height="38"
              @click="onSubmit"
              ) Submit Payment

      template
        v-row(class="d-flex justify-center mt-5")
          v-col(cols="5")
            v-alert(
              v-if="error" 
              dense 
              text 
              type="error"            
              ) {{ error }}



      template
        Dialog(
          :show="showDialog"
          :width="289"
          message="Your payment is being processed. Please wait for the confirmation."
          imgPath="clock.png"
          btn-message="View My Transaction"
          @close="closingDialog"
          @click="onClickDialogButton"
          )
    
      


</template>

<script>

import { mapState, mapMutations } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import Stepper from '@/common/components/Stepper'
import Button from '@/common/components/Button'
import Dialog from '@/common/components/Dialog'
import { setEthAddress, serviceHandlerMixin } from "@/common/lib/polkadot-provider"
import { ethAddressByAccountId } from '@/common/lib/polkadot-provider/query/user-profile.js'
import { lastOrderByCustomer, getOrdersData } from '@/common/lib/polkadot-provider/query/orders.js'
import { createOrder } from '@/common/lib/polkadot-provider/command/orders.js'
import { startApp } from '@/common/lib/metamask'
import { getBalanceETH } from '@/common/lib/metamask/wallet.js'



export default {
  name: "PaymentPage",

  components: {
    Stepper,
    Button,
    Dialog
  },

  mixins: [serviceHandlerMixin],

  data: () => ({
    stepperItems: [
      { number: 1, title: 'Select a location and Service Category', active: false },
      { number: 2, title: 'Select a lab', active: false },
      { number: 3, title: 'Checkout', active: false },
      { number: 4, title: 'Payment', active: true },
    ],
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
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
    }),
  },

  async mounted () {
    console.log(this.labAccount)
  },

  methods : {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),

    async onSubmit () {
      this.error = ""
      try {
        this.wallet.decodePkcs8(this.password)

        // Checking seller ready eth Address
        this.ethSellerAddress = await ethAddressByAccountId(
          this.api,
          this.labAccount._id
        )
        if (this.ethSellerAddress == null) {
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
        if (lastOrder == null) {
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
        if (this.ethAccount.currentAccount == "no_install") {
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
            if (accountList[i] == this.metamaskWalletAddress) {
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
          const setEth = await this.dispatch(
            setEthAddress, 
            this.api, 
            this.wallet, 
            this.ethAccount.currentAccount,
            async () => {
              this.setMetamaskAddress(this.ethAccount.currentAccount)
              this.$emit("status-wallet", {
                status: true,
              })
              const getMunnyFromFaucet = await this.getMunnyFromFaucet(this.ethAccount.currentAccount)
              console.log("getMunnyFromFaucet", getMunnyFromFaucet)
            }
          )
          console.log("set eth address", setEth)
        }

        const balance = await getBalanceETH(this.metamaskWalletAddress)
        if (balance <= 0 ) {
          this.password = ""
          this.error = "ETH balance is 0"
          return
        }

        const customer_box_public_key = this.getKiltBoxPublicKey()
        for (let i = 0; i < this.product.length; i++) {
          await createOrder(
            this.api,
            this.wallet,
            this.products[i].accountId,
            customer_box_public_key,
            this.products[i].indexPrice
          )
        }
        this.showDialog = true
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

    onClickDialogButton () {
      window.open(`https://rinkeby.etherscan.io/address/${this.metamaskWalletAddress}`, "_blank")
    },

    closingDialog () {
      this.showDialog = false
      this.isCompleted = true
    },

    toHomePage () {
      this.$router.push({ name: 'customer-dashboard' })
    }

  }
}
</script>

<style lang="scss" scoped>
.payment-page {
    font-family: 'Raleway';
    width: auto;
    height: 732px;
    background: #FFFFFF;
}

.title {
  font-family: 'Raleway';
  font-size: 20px;
  display: flex;
  justify-content: center;
}

</style>