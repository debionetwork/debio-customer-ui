<style scoped lang="scss">
@import "@/common/styles/variables.scss";

.pop-up-main{
    justify-content: space-between;
    height: 100%;
    
    & > div > div.forgot-password-text {
        width: 100%;
        height: 51px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 150%;
        color: $color-primary;

        display: flex;
        justify-content: flex-end;

        & > * {
            cursor: pointer;
        }
    }

    p {
        height: 27px;
    }
    .v-btn {
        margin-bottom: 16px;
    }

    .pop-up-title{
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      font-size: 35px;
      line-height: 41px;
      color: #363636;
    }
}
</style>

<template lang="pug">
  .sign-in-page
    LandingPagePopUp(:previous="previous" v-if="!isNoAccount")
      template(v-slot:header) Sign In
      template(v-slot:main): div.pop-up-main
        div.d-flex.flex-column
          p Your Address
            ui-debio-input( disabled :value="dataAccount.address" block)

          p Please input your password
          v-text-field(
            label="Type in your password"
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
          .forgot-password-text: div(v-on:click="forgotPassword") Forgot your password?

          div: v-btn.white--text(
            :disabled="!password"
            elevation="0" 
            color="primary" 
            @click="decryptWallet"
          ) Continue
          
          v-snackbar(
              v-model="snackbar"
              :timeout="timeout"
              right
              bottom
          ) {{ errorMessage }}

    LandingPagePopUp(v-if="isNoAccount")
      template(v-slot:main): div.pop-up-main
        img(src="@/assets/alert-circle.png")
        div.pop-up-title No Account Found
        div.d-flex.flex-column
          div: v-btn.white--text(
              elevation="0"
              color="primary"
              @click="generateAccount"
          ) Generate Account

          div: v-btn(
              elevation="0"
              color="primary"
              outlined 
              @click="inputMnemonic"
          ) Input Mnemonic
          
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex"
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import localStorage from "@/common/lib/local-storage"
import Dialog from "@/common/components/Dialog"


export default {
  name: "InputPassword",

  components: {
    LandingPagePopUp,
    Dialog
  },

  data: () => ({
    keystore: "",
    password: "",
    fileName: "",
    showPassword: false,
    isLoading: false,
    snackbar: false,
    timeout: 2000,
    errorMessage: "",
    dataAccount: null,
    dataAccountJson: "",
    dataMnemonic: null,
    dataMnemonicJson: null,
    isNoAccount: false,
    keystoreInputErrors: []
  }),

  computed: {
    ...mapGetters({
      pair: "substrate/wallet"
    }),
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet
    })
  },

  async mounted() {
    await this.getKeyStoreLocal()
    this.setKeystore()
  },

  methods: {
    ...mapActions({
      restoreAccountKeystore: "substrate/restoreAccountKeystore"
    }),
    previous() {
      this.$router.push({name: "landing-page"})
    },

    forgotPassword() {
      this.$router.push({name: "forgot-password"})
    },

    inputMnemonic() {
      this.$router.push({name: "input-mnemonic"})
    },

    generateAccount() {
      this.$router.push({name: "generate-account"})
    },

    async getKeyStoreLocal() {
      try {
        this.isLoading = true
        this.dataAccountJson = localStorage.getKeystore()
        if (this.dataAccountJson === null) {
          this.isNoAccount = true
        }
        this.dataAccount = JSON.parse(this.dataAccountJson)
        this.dataMnemonicJson =
          localStorage.getLocalStorageByName("mnemonic_data")
        this.dataMnemonic = JSON.parse(this.dataMnemonicJson)
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isloading = false
      }
    },

    setKeystore() {
      this.keystore = this.dataAccountJson;
      this.fileName = "keystore";
    },

    async decryptWallet() {
      this.isLoading = true
      this.keystoreInputErrors = []
      let dataKeystore = []

      const keystore = JSON.parse(this.keystore)

      if (keystore === null) {
        this.keystoreInputErrors = "no keystore"
        return
      }

      if (Array.isArray(keystore)) {
        dataKeystore = keystore
        return
      }

      dataKeystore.push(keystore)

      if (this.dataMnemonicJson !== null && this.dataMnemonicJson !== "") {
        dataKeystore.push(JSON.parse(this.dataMnemonicJson))
      }

      const result = await this.restoreAccountKeystore({
        file: dataKeystore,
        password: this.password
      })

      this.isLoading = false
      this.keystoreInputErrors = ""

      if (!result.success) {
        this.keystoreInputErrors = result.error
        return
      }

      this._show = false
      this.clearInput()
      this.$router.push({name: "customer-dashboard"})
    },

    clearInput() {
      (this.keystore = ""),
      (this.password = ""),
      (this.fileName = ""),
      (this.keystoreInputErrors = []);
    },

    toGenerateAccount() {
      this.$router.push({name: "generate-account"})
    }

  }
}
</script>
