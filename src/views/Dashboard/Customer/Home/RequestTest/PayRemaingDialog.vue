<template lang="pug">
  v-dialog(:value="show" width="480" persistent)
    v-card
      v-app-bar(flat dense color="white" )
        v-toolbar-title(class="title mt-8" v-if="agreement") Pay remaining amount
        v-spacer
        v-btn( class="mt-8" icon @click="closeDialog")
          v-icon mdi-close
      v-card(class="ms-4 me-4" style="background-color: #F5F7F9; font-family: Raleway ")
        v-card-text(class="mb-4 mt-10")
          div(style="font-size: 12px" class="me-3" )
            div 1. By clicking Pay button you will use your balance to pay the remaining amount that needed to be completed.
            div 2. The remaining amount calculated in payment details.
            div 3. If your balance is not enough to pay the remaining amount, you can top up your balance first and go back to this page.

      v-card-text(class="mt-4 pb-0 text-subtitle-1")
        div(class="text-body-1 mt-10")
          div.mb-3 Remaining Amount
            v-row
              v-col(
                cols="12"
                sm="9"
              )
                v-text-field(
                  v-model="amount"
                  outlined
                )
              
              v-col(
                cols="12"
                sm="3"
              )
                v-text-field(
                  placeholder="DBIO"
                  outlined
                )

        v-checkbox(class="mt-5")
          template(v-slot:label)
            b I have read and agree to the <a> terms and conditions </a>

      v-card-actions(class="px-6 pb-4")
        v-btn(
          depressed
          color="secondary"
          large
          width="100%"
          @click="onSubmit"
          :loading="isLoading"
        ) Continue

</template>

<script>
import { mapState } from "vuex"

export default {
  name: "PayRemainingDialog",

  props: {
    show: Boolean
  },

  data: () => ({
    currencyList: ["DBIO"], 
    currencyType: "DBIO",
    agree: false,
    amount: 10,
    dialogAlert: false,
    isLoading: false,
    transactionStep: "",
    agreement: true
  }),
  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.pair,
      country: state => state.lab.country,
      region: state => state.lab.region,
      city: state => state.lab.city,
      category: state => state.lab.category
    })
  },
  
  methods: {
    closeDialog() {
      this.$emit("close")
    },

    async onSubmit() {
      this.$router.push({ name: "customer-request-test-success"})
    }
  }
}
</script>
