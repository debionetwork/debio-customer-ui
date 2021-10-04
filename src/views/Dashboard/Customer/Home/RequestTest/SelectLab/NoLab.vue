<template lang="pug">
  v-card.no-lab-card
    div.card-title Oops!
    div.card-sub-title There are no available labs provide this service in your area.
    div.card-body 
      div 1. You can request a lab to register to DeBio by clicking the "Request a service" button.
      div 2. Additionally, you can stake an amount of tokens or regular currency (USD), which will be given as an incentive to labs registering in your location.
      div 3. Labs will use the result of this form, filled-in by you and other DeBio users, to evaluate the demand in the area you designated. 

    v-row(class="d-flex justify-center mt-16")
      v-col(cols="5")
        Button.mt-5.mb-10(
          color="secondary" 
          width="560"
          height="38"
          @click="showingAgreementDialog"
          ) Request a service

    template
      AgreementDialog(
        :show="showAgreement"
        @close="closingDialog"
        @click="onClickDialogButton"
      )

    template
      Dialog(
        :show="showSuccessDialog"
        :width="289"
        message="Your request has been submitted"
        imgPath="check-circle.png"
        btn-message="Back to Dashboard"
        @close="closingDialog"
        @click="toHomePage"
        )
  
</template>

<script>
import { mapState } from "vuex"
import AgreementDialog from "./AgreementDialog.vue"
import Dialog from "@/common/components/Dialog"
import Button from "@/common/components/Button"


export default {
  name: "NoLab",

  components: {
    Dialog,
    AgreementDialog,
    Button
  },

  data: () => ({
    showAgreement: false,
    showSuccessDialog: false
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs
    })
  },

  async mounted () {
    if (!this.labs.length) this.showNoLab = true
  },

  methods: {
    showingAgreementDialog () {
      this.showAgreement = true
    },

    closingDialog() {
      this.showAgreement = false
    },

    onClickDialogButton() {
      this.showAgreement = false
      this.showSuccessDialog = true
    },

    toHomePage () {
      this.$router.push({ name: "customer-dashboard" })
    }
  }

}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .card-title 
    @include body-text-2

  .card-sub-title 
    margin-bottom: 2%
    margin-top: 2%
    color:#F92020
    @include body-text-2

  .card-body 
    @include body-text-3
    
  .no-lab-card 
    padding: 5%
    margin: 4%
    border-radius: 4

</style>
