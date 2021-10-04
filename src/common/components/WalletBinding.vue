<template lang="pug">
  v-dialog(:value="show", width="500", persistent)
    v-card.pb-5
      v-app-bar(flat, dense, color="white")
        v-toolbar-title
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close
            
      div(v-if="loading")
        div.mt-10.mb-10(align="center")
          v-progress-circular(indeterminate, color="primary")

      div(v-if="!loading")
        div(v-if="putWallet")

          div(v-if="!inputPassword")        
            div(align="center") Connect to your Metamask!
              v-img.mt-5.mb-3(src="@/assets/metamask-icon.png" max-width="80")
              span.grey--text Metamask

            div(align="center" class="mt-5 grey--text") Haven't got a metamask wallet yet ?
            div(align="center" class="mt-5")
              a(href="https://docs.debio.network/getting-started"): u Learn How to Connect ?

            div.mb-5.ml-8.mr-8.mt-8
              v-btn(
                dark
                class="mt-5 align-center"
                outlined
                width="100%"
                large
                elevation="2"
                color="secondary" 
                @click="inputPassword = true"
              ) Connect

          div(class="mt-10 mb-2 ml-10 mr-10" v-if="inputPassword")      
            div(align="center") Input Debio Password
              v-text-field(
                class="mt-2"
                outlined
                auto-grow
                type="password"
                @keyup.enter="onSubmit"
                v-model="password"
                label="Input your password"
              )

              v-btn(
                depressed
                color="primary"
                large
                width="100%"
                @click="setWallet('metamask')") Continue
              

        div.mt-10.mb-10.ml-10.mr-10(v-else-if='putAccount')
          div.align-center.mb-5 Your address
          div.address.dg-card.pb-2.pt-2 style="background: #eeeeee" elevation="0")
            div.ml-3.p4 {{ethAccount[0].address}}
              v-btn(icon @click="copyToClipboard(ethAccount[0].address)")
                v-icon mdi-vector-arrange-below
            
          v-row.mt-5
            v-col DAI Balance
            v-col(cols="auto") {{ethAccount[0].balance}} ETH
              
          v-row
            v-col
            v-col(cols="auto") ({{ethAccount[0].balance}} USD)
          
          v-btn(
            class="mt-5 align-center"
            outlined
            color="secondary"
            width="100%"
            large
            light
          ) Disconnect Wallet            
</template>

<script>
import { mapState, mapMutations } from "vuex"
import { handleSetWallet } from "@/common/lib/wallet"
import { serviceHandlerMixin } from "@/common/lib/polkadot-provider"
import { getEthFromFaucet, getDaicFromFaucet } from "@/common/lib/faucet"
import localStorage from "@/common/lib/local-storage"
import Button from "@/common/components/Button"

export default {
  name: "WalletBinding",

  components: {
    Button
  },

  props: {
    show: Boolean
  },

  mixins: [serviceHandlerMixin],

  data: () => ({
    error: "",
    password: "",
    putWallet: true,
    putAccount: false,
    loading: false,
    ethAccount: null,
    accountList: [],
    inputPassword: false,
    selectAccount: null
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress
    }),

    watch: {
      show() {
        if (!this.show) return
  
        this.error = ""
        this.loading = false
        this.putAccount = false
        this.putWallet = true
        this.inputPassword = false
        this.isLoading = false
      }
    }
  },

  methods: {

    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS"
    }),
    
    async getMunnyFromFaucet(address) {
      await getEthFromFaucet(address)
      await getDaicFromFaucet(address)
    },

    async setWallet(walletName) {
      this.loading = true
      this.ethAccount = await handleSetWallet(walletName, this.metamaskWalletAddress)
      try {
        if (this.wallet.isLocked) {
          await this.wallet.decodePkcs8(this.password)
        } 
        const accountId = localStorage.getAddress()
        const ethAddress = this.ethAccount[0].address
        await this.$store.dispatch("wallet/walletBinding", {accountId, ethAddress})
        this.setMetamaskAddress(this.ethAccount[0].address)
        this.$emit("status-wallet", {
          status: true
        })
        await this.getMunnyFromFaucet(this.ethAccount[0].address)
        
        this.isLoading = false
        this.putAccount = true
      } 
      catch (err) {
        console.log(err.message)
        this.isLoading = false
        this.error = err.message
      }
    },

    closeDialog() {
      this.error = ""
      this.loading = false
      this.putWallet = true
      this.inputPassword = false
      this.$emit("close")
    },
    
    async copyToClipboard(text) {
      await navigator.clipboard.writeText(text)
    }
  }
}
</script>
