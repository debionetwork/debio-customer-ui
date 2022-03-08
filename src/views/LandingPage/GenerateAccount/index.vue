<style scoped lang="scss">
.v-input--checkbox {
    width: 437px;
    height: 53px;
    font-family: "Raleway", sans-serif;
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
      font-family: "Raleway", sans-serif;
    }
}
.m1{
  margin: 23px 0px;
}
.m40{
  margin-bottom: 40px;
}
.mt20{
  margin-top: 20px;
}
.link{
  text-decoration: none;
}
</style>

<template lang="pug">
  LandingPagePopUp(:previous='previous')
    template(v-slot:header) Generate an Account
    template(v-slot:main)
      h3.m1 Generate an account to use our features on the AppChain
      p.m40.text-justify You will receive 12 words as mnemonic phrase that allow you to recover an account, make sure you save by copy paste, write it down, and put in somewhere safe
      v-checkbox(v-model="agreeConditions"): template(v-slot:label): div#checkboxLabel I understand with DeBio 
        v-tooltip(bottom)
          template(v-slot:activator="{ on }")
            a.link(target="_blank"
              href="https://docs.debio.network/legal/privacy-policy"
              @click.stop
            ) Privacy Policy
            span  and 
            a.link(target="_blank"
              href="https://docs.debio.network/legal/terms-and-condition"
              @click.stop
            ) Terms and Condition
      .button.mt20
        v-btn(elevation='0' color='primary' :disabled="!agreeConditions" @click="generateMnemonic") Continue
</template>

<script>
import LandingPagePopUp from "@/views/LandingPage/LandingPagePopUp.vue"
import localStorage from "@/common/lib/local-storage"

export default {
  name: "GenerateAccount",

  components: {
    LandingPagePopUp
  },

  data: () => ({
    agreeConditions: false
  }),

  created() {
    const hasTerms = localStorage.getLocalStorageByName("TERMS")

    if (hasTerms) this.agreeConditions = hasTerms
  },

  methods: {
    previous() {
      const hasAddress = localStorage.getLocalStorageByName("mnemonic_data")

      if (!hasAddress) localStorage.removeLocalStorageByName("TERMS")

      this.$router.push({name: "landing-page"})
    },

    generateMnemonic() {
      localStorage.setLocalStorageByName("TERMS", this.agreeConditions)
      this.$router.push({name: "generate-mnemonic"})
    }
  }
}
</script>
