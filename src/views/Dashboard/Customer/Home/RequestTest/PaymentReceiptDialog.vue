<template lang="pug">
  v-dialog(:value="show" width="400" rounded persistent )
    v-card.pa-5
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn( class="mt-2" icon @click="closeDialog")
          v-icon mdi-close

      div(class="text-center")
        div(class="text-h5")
          b Payment

      div(class="text-start ms-5 mt-5")
        b.mb-2 {{ selectedService.labName }}

      div(class="ml-5 text-start")
        .address-detail {{ selectedService.labAddress}}
        .address-detail {{ selectedService.city}}

      div(class="ml-5 mb-2 mt-4 text-start" style="font-size: 12px;")
        b Details

      hr(class="ml-3 me-3 mb-3")

      div(class="text-start")
        div(class="ml-5 text-start me-10")
          div(class="d-flex justify-space-between mb-2" )
            div( style="font-size: 12px;" ) Service Price
            div( style="font-size: 12px;" )
              | {{ formatPrice((selectedService.detailPrice.price_components[0].value).replaceAll(",", "")) }} 
              | {{ selectedService.currency.toUpperCase() }}

          div(class="d-flex justify-space-between" )
            div( style="font-size: 12px;" ) Quality Control Price
            div( style="font-size: 12px;" )
              | {{ formatPrice((selectedService.detailPrice.additional_prices[0].value).replaceAll(",", "")) }} 
              | {{ selectedService.currency.toUpperCase() }}

       
      div(class="d-flex justify-end me-3" style="font-size: 12px") +
      hr(class="ml-3 me-3 mb-2")

      div(class="text-start")
        div(class="ml-5 text-start me-10")
          div(class="d-flex justify-space-between mb-2" )
            b( style=" font-size: 12px;" ) Total Price
            b( style="font-size: 12px;" )
              | {{  formatPrice((selectedService.price).replaceAll(",", "")) }} 
              | {{ selectedService.currency.toUpperCase()}}



      div(class="ml-3 mt-5 me-3 text-center")
        v-text-field(
          label="Input Password"
          v-model="password"
          class="password-field"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[val => !!val || 'Password is required']"
          :disabled="isLoading"
          @click:append="showPassword = !showPassword"
          outlined
        )
        
        v-progress-circular.mb-5(
          v-if="isLoading"
          indeterminate
          color="primary"
          )
      
        v-alert.mt-5.mb-5(
          v-if="error" 
          dense 
          text 
          type="error"
          style="font-size: 12px;"
        ) {{ error }}

        Button(
          color="secondary" 
          width="100%"
          height="38"
          @click="onSubmit"
        ) Pay

    ErrorDialog(
      :show="showError"
      :title="errorTitle"
      :message="errorMsg"
      @close="showError = false"
    )
</template>

<script>

import Button from "@/common/components/Button"
import ErrorDialog from "@/common/components/Dialog/ErrorDialog"
import { mapState, mapMutations } from "vuex"
import { serviceHandlerMixin } from "@/common/lib/polkadot-provider"
import { ethAddressByAccountId } from "@/common/lib/polkadot-provider/query/user-profile.js"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"
import { createOrder } from "@/common/lib/polkadot-provider/command/orders.js"
import { startApp, getTransactionReceiptMined } from "@/common/lib/metamask"
import { getBalanceETH, getBalanceDAI } from "@/common/lib/metamask/wallet.js"
import { approveDaiStakingAmount, checkAllowance, sendPaymentOrder  } from "@/common/lib/metamask/escrow"
import localStorage from "@/common/lib/local-storage"
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import { errorHandler } from "@/common/lib/error-handler"



export default {
  name: "PaymentReceiptDialog",

  components: {
    Button,
    ErrorDialog
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
    isCompleted: false,
    isLoading: false,
    dataEvent: null,
    lastOrder: null,
    detailOrder: null,
    status: "",
    orderId: "",
    txHash: "",
    showError: false,
    errorTitle: "",
    errorMsg: ""
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      selectedService: (state) => state.testRequest.products,
      lastEventData: (state) => state.substrate.lastEventData,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
      metamaskWalletBalance: (state) => state.metamask.metamaskWalletBalance,
      mnemonicData: state => state.substrate.mnemonicData,
      walletBalance: (state) => state.substrate.walletBalance,
      web3: (state) => state.metamask.web3
    })
  },

  watch: {
    lastEventData() {
      if (this.lastEventData) {
        if (this.lastEventData.method === "OrderPaid") {
          this.isLoading = false
          this.password = ""
          this.$router.push({ 
            name: "customer-request-test-success",
            params: {
              hash: this.txHash
            }
          })
        }
      }      
    }
  },

  async mounted () {

    if (this.lastEventData) {
      if (this.lastEventData.method === "OrderCreated") {
        this.dataEvent = JSON.parse(this.lastEventData.data.toString())[0]
      }
    }

    // get last order id
    this.lastOrder = await lastOrderByCustomer(
      this.api,
      this.wallet.address
    )

    if (this.lastOrder) {
      this.detailOrder = await getOrdersData(this.api, this.lastOrder)
      this.status = this.detailOrder.status
    }
  },

  methods: {
    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS"
    }),

    async onSubmit () {
      this.isLoading = true
      this.error = ""
      try {
        this.wallet.decodePkcs8(this.password)        
        this.ethAccount = await startApp()
        if (this.ethAccount.currentAccount === "no_install") {
          this.isLoading = false
          this.password = ""
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
          this.error = "You don't have enough ETH"
          return
        }

        // check DAI Balance 
        const daiBalance = await getBalanceDAI(this.metamaskWalletAddress)
        if (Number(daiBalance) < Number(this.web3.utils.fromWei(String(this.selectedService.price)))) {
          this.isLoading = false
          this.password = ""
          this.error = "You don't have enough DAI"
          return
        }


        // Seller has no ETH address
        this.ethSellerAddress = await ethAddressByAccountId(
          this.api,
          this.selectedService.labId
        )

        if (this.ethSellerAddress === null) {
          this.isLoading = false
          this.password = ""
          this.error = "The seller has no ETH Address."
          return
        }

        const mnemonic = localStorage.getLocalStorageByName("mnemonic_data")
        const decryptedMnemonic = CryptoJS.AES.decrypt(mnemonic, this.password).toString(CryptoJS.enc.Utf8)
        
        const identity = await Kilt.Identity.buildFromMnemonic(decryptedMnemonic)
        const customerBoxPublicKey = u8aToHex(identity.boxKeyPair.publicKey)

        if (this.status !== "Unpaid") {
          const serviceFlow = "RequestTest"
          await createOrder(
            this.api,
            this.wallet,
            this.selectedService.serviceId,
            customerBoxPublicKey,
            serviceFlow,
            this.selectedService.indexPrice,
            this.payOrder
          )
        } else {
          this.payOrder()
        }
      } catch (err) {
        this.isLoading = false
        this.password = ""
        this.showError = true
        const error = await errorHandler(err.message)
        this.error = error.message
        this.errorTitle = error.title
        this.errorMsg = error.message
      } 
    },

    async payOrder () {
      try {
        // get last order id
        this.lastOrder = await lastOrderByCustomer(
          this.api,
          this.wallet.address
        )
        this.detailOrder = await getOrdersData(this.api, this.lastOrder)

        const stakingAmountAllowance = await checkAllowance(this.metamaskWalletAddress)
        const totalPrice = this.selectedService.price

        if (stakingAmountAllowance < totalPrice ) {
          const txHash = await approveDaiStakingAmount(
            this.metamaskWalletAddress,
            totalPrice
          )
          await getTransactionReceiptMined(txHash)
        }

        this.txHash = await sendPaymentOrder(this.api, this.lastOrder, this.metamaskWalletAddress, this.ethSellerAddress)  
        await getTransactionReceiptMined(this.txHash)
        
      } catch (err) {
        this.isLoading = false
        this.password = ""
        this.showError = true
        const error = await errorHandler(err.message)
        this.error = error.message
        this.errorTitle = error.title
        this.errorMsg = error.message
      }

    },

    formatPrice(price) {
      return this.web3.utils.fromWei(String(price), "ether")
    },

    closeDialog(){
      this.$emit("close")
    }
  }
}
</script>

<style lang="sass">
  .address-detail
    margin-top: 2px
    font-size: 12px
</style>
