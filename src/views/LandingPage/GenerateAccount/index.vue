<style scoped lang="scss">
.pop-up-main{
    .pop-up-title{
        width: 235px;
        height: 48px;

        font-family: Robto;
        font-style: normal;
        font-weight: bold;
        font-size: 25px;
        line-height: 0px;
        color: #C400A5;
    }

    .v-input--checkbox {
        width: 437px;
        height: 53px;

        font-family: Raleway;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 150%;

        display: flex;
        align-items: center;

        #checkboxLabel {
            font-size: 18px;
            line-height: 150%;
            margin-left: 20px;
        }
    }
}
</style>

<template lang="pug">
     LandingPagePopUp(:previous='previous')
        template(v-slot:main): div.pop-up-main
            div.pop-up-title Backup your account
            h3 We will give you 12 words that allows you to recover an account
            p You need to carefully save the  words. Copy-paste it, screenshot it, write it down, and keep it safe. If you lose it, we won't be able to help you recover it.
            v-checkbox(v-model="agreeConditions"): template(v-slot:label): div#checkboxLabel I understand wiht DeBio 
              //- TODO : add link 
              a Terms and Conditions 
              span and 
              a Privacy Policy
            v-btn.white--text(elevation='0' color='primary' :disabled="!agreeConditions" @click="generateMnemonic") Continue
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"

export default {
  name: "GenerateAccount",
  components: {
    LandingPagePopUp
  },
  data: () => ({
    agreeConditions: false
  }),
  methods: {
    previous() {
      this.$router.push({name: "sign-in"})
    },
    generateMnemonic() {
      this.$router.push({name: "generate-mnemonic"})
    }
  }
}
</script>
