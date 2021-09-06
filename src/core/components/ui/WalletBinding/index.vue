<template lang="pug">
  v-dialog(:value="_show", width="500", persistent)
    v-card.pb-5
      v-app-bar(flat, dense, color="white")
        v-toolbar-title.title(v-if="putAccount") Metamask Wallet
          v-spacer
            v-btn(icon @click="closeDialog")
              v-icon mdi-close
            
      div(v-if="loading")
        div(class="mt-10 mb-10" align="center")
          v-progress-circular(indeterminate, color="primary")

      div(v-if="!loading")
        div(v-if="putWallet")

          div(align="center") Connect to your Metamask!
            v-img(class= "mt-5 mb-3" src="@/assets/metamask-icon.png" max-width="80")
            span(class="grey--text") Metamask

          div(align="center" class="mt-5 grey--text") Haven't got a metamask wallet yet ?
          br
          a(href="https://docs.debio.network/getting-started")
            u Learn How to Connect ?

          div(class="mb-5 ml-8 mr-8 mt-8")
            v-btn(
              dark
              class="mt-5 align-center"
              outlined
              width="100%"
              large
              elevation="2"
              color="secondary"
              @click="setWalllet('metamask')"
            ) Connect
              
        div(class="mt-10 mb-10 ml-10 mr-10" v-if="putAccount")
        div
          div(class="align-center mb-5") Your address
          div.address( class="dg-card pb-2 pt-2", style="background: #eeeeee", elevation="0")
            div(class="ml-3 p4") {{accountList[0].address}}
              v-btn(icon @click="copyToClipboard(accountList[0].address)")
                v-icon mdi-vector-arrange-below
            
          v-row(class="mt-5")
            v-col DAI Balance
            v-col(cols="auto") {{accountList[0].balance}} ETH
              
          v-row
            v-col
            v-col(cols="auto") ({{accountList[0].balance}} USD)
          
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
import { mapState, mapMutations } from "vuex";
import { startApp } from "@/common/lib/metamask";
import { getBalanceETH } from "@/common/lib/metamask/wallet.js";
import { setEthAddress } from "@/common/lib/polkadotProvider/command/userProfile";
import { getEthFromFaucet, getDaicFromFaucet } from "@/common/lib/faucet";

export default {
  name: "WalletBinding",
  props: {
    show: Boolean,
  },
  data: () => ({
    isLoading: false,
    error: "",
    putWallet: true,
    putAccount: false,
    loading: false,
    ethAccount: null,
    accountList: [],
    inputPassword: false,
    selectAccount: null,
  }),
  computed: {
    _show: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("toggle", val);
      },
    },
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      metamaskWalletAddress: (state) => state.metamask.metamaskWalletAddress,
    }),
  },
  watch: {
    show() {
      if (this.show) {
        this.error = "";
        this.loading = false;
        this.putAccount = false;
        this.putWallet = true;
        this.inputPassword = false;
        this.isLoading = false;
      }
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setMetamaskAddress: "metamask/SET_WALLET_ADDRESS",
    }),
    async getMunnyFromFaucet(address) {
      await getEthFromFaucet(address);
      await getDaicFromFaucet(address);
    },
    async setWalllet(walletName) {
      this.error = "";
      this.loading = true;
      switch (walletName) {
        case "metamask":
          this.ethAccount = await startApp();
          if (this.ethAccount.currentAccount == "no_install") {
            this.error = "Please install MetaMask!";
          } else {
            this.accountList = [];
            for (let i = 0; i < this.ethAccount.accountList.length; i++) {
              const balance = await getBalanceETH(
                this.ethAccount.accountList[i]
              );
              var lastAddr = this.ethAccount.accountList[i].substr(
                this.ethAccount.accountList[i].length - 4
              );
              let isActive = false;
              if (
                this.metamaskWalletAddress == this.ethAccount.accountList[i]
              ) {
                isActive = true;
              }
              this.accountList.push({
                address: this.ethAccount.accountList[i],
                lastAddr: lastAddr,
                name: "Account " + (i + 1),
                balance: parseFloat(balance).toFixed(2),
                active: isActive,
              });

              try {
                await setEthAddress(this.api, this.wallet, this.ethAccount.currentAccount);
                this.setMetamaskAddress(this.ethAccount.currentAccount);
                this.$emit("status-wallet", {
                  status: true,
                  img: "metamask-account-connected.png",
                });
                await this.getMunnyFromFaucet(this.ethAccount.currentAccount);
                this.isLoading = false;
              } catch (err) {
                console.log(err.message);
                this.isLoading = false;
                this.error = err.message;
              }
            }
            this.putWallet = false;
            this.putAccount = true;
          }
          break;
      }
      this.loading = false;
    },
    closeDialog() {
      this._show = false;
      this.error = "";
      this.loading = false;
      this.putWallet = true;
      this.inputPassword = false;
    },
    async copyToClipboard(text) {
      await navigator.clipboard.writeText(text)
    }
  },
};
</script>

<style
</style>
