<style scoped lang="scss">
.pop-up-main{
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
        template(v-slot:header) Backup your account
        template(v-slot:main): div.pop-up-main
            h3 We will give you 12 words that allows you to recover an account
            p You need to carefully save the  words. Copy-paste it, screenshot it, write it down, and keep it safe. If you lose it, we won't be able to help you recover it.
            v-checkbox(v-model="agreeConditions"): template(v-slot:label): div#checkboxLabel I understand that if I lose my recovery words, I will not be able  to access my account
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
      this.$router.push({name: "landing-page"})
    },
    generateMnemonic() {
      this.$router.push({name: "generate-mnemonic"})
    }
  }
}
</script>
