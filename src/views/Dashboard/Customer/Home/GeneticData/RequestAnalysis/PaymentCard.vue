<template lang="pug">
  v-card.customer-analysis-payment-card
    .customer-analysis-payment-card__data
      .customer-analysis-payment-card__data-service
        .customer-analysis-payment-card__text-label Genetic Data Name
        .customer-analysis-payment-card__data-text Cardiologi Record

      .customer-analysis-payment-card__text-label Payment
      .customer-analysis-payment-card__amount
        .customer-analysis-payment-card__data-text Account Balance
        b.customer-analysis-payment-card__data-text 4200 DBIO
      .customer-analysis-payment-card__amount
        .customer-analysis-payment-card__data-text Service Price
        b.customer-analysis-payment-card__data-text 3200 DBIO
      .customer-analysis-payment-card__rate ( 96,052 USD )

    
      .customer-analysis-payment-card__amount
        .customer-analysis-payment-card__data-tx-weight Estimated transaction weight 
          v-tooltip.visible(bottom )
            template(v-slot:activator="{ on, attrs }")
              v-icon.staking-dialog__trans-weight-icon(
                style="font-size: 12px;"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              ) mdi-alert-circle-outline 
            span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.
        .customer-analysis-payment-card__data-tx-weight 0.014 DBIO        

      Button.customer-analysis-payment-card__button(
        width="280"
        height="35"  
        color="secondary"
        @click="showInformation = true"
      ) Pay Now

    
      ImportantDialog(
        @close="showInformation = false"
        @click="onSubmit"
        :show="showInformation"
      )

    


</template>

<script>

import Button from "@/common/components/Button"
import ImportantDialog from "./Information.vue"

export default {
  name: "PaymentCard",

  components: { Button, ImportantDialog },

  data: () => ({
    showInformation: false
  }),

  methods: {
    onSubmit() {
      this.$router.push({ name: "customer-request-analysis-success"})
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-analysis-payment-card
    margin-top: 0 !important
    width: 340px
    height: 320px

    &__data
      padding: 27px 30px

    &__data-service 
      margin-bottom: 24px

    &__text-label
      @include button-2

    &__data-text
      margin-top: 16px
      @include new-body-text-2

    &__data-tx-weight
      margin-top: 16px
      @include body-text-3

    &__button
      margin-top: 16px
      
    &__amount
      display: flex
      align-items: center
      justify-content: space-between

    &__rate
      display: flex
      align-items: center
      justify-content: flex-end
      @include tiny-reg

</style>
