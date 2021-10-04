<style scoped lang="scss">
.pop-up-main{
    img {
        width: 152px;
        height: 152px;
    }
    h2 {
        width: 492px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;
        
        text-align: center;
    }
}
</style>

<template lang="pug">
    LandingPagePopUp(:previous='previous')
        template(v-slot:header) Forgot Password
        template(v-slot:main): div.pop-up-main
            img(src='@/assets/lock.png')
            h2 Restore your password using mnemonic phrase or keystore
            v-btn.white--text(elevation='0' color='primary' @click='inputMnemonic') Mnemonic Phrase
            v-btn(elevation='0' color='primary' outlined @click='importKeystore') Import Keystore
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"

export default {
  name: "ForgotPassword",
  components: {
    LandingPagePopUp
  },
  methods: {
    previous() {
      this.$router.push({name: "sign-in"})
    },

    inputMnemonic() {
      this.$router.push({name: "input-mnemonic"})
    },

    importKeystore() {
      this.$router.push({name: "import-keystore"})
    }
  }
}
</script>
