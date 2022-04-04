<template lang="pug">
  .payment-history-details
    ui-debio-modal(
      :show="!!messageError"
      :show-title="false"
      :show-cta="false"
      @onClose="$router.push({ name: 'customer-payment-history' })"
    )
      | {{ messageError }}

    .payment-history-details__wrapper(v-if="hasPaymentDetails")
      ui-debio-card(block centered-content)
        h2.payment-history-details__title {{ computeDetailsTitle }}
        .payment-history-details__content
          .payment-details__wrapper
            .payment-details__product
              ui-debio-avatar.product__image(
                :src="payment.service_info.image || payment.genetic_analyst_info.profile_image"
                size="150"
                rounded
              )
              .product__details
                .product__name {{ payment.service_info.name }}
                ui-debio-rating.product__lab-rating(
                  v-if="payment.section === 'order'"
                  :rating="payment.rating.rating_service"
                  :total-reviews="payment.rating.count_rating_service"
                  size="15"
                )
                .product__provider(v-if="payment.section === 'order'") {{ payment.lab_info.name }}
                .product__provider(v-else) {{ payment.genetic_analyst_info.name }}
                .product__provider-address(v-if="payment.section === 'order'")
                  span.address__title Address
                  p.address__text.mb-0 {{ payment.lab_info.address }}, {{ payment.lab_info.city }}
                .product__provider-specialist(v-else)
                  span.address__title Specialization
                  p.address__text.mb-0 {{ payment.genetic_analyst_info.specialization }}

            .payment-details__status
              .payment-details__field
                .test__title Test status
                .test__status {{ payment.test_status || "-" }}
              .payment-details__field
                .payment__title Payment Status
                .payment__status {{ payment.status }}
              .payment-details__field
                .speciment__title Specimen number
                .speciment__status {{ payment.dna_sample_tracking_id || payment.genetic_analysis_tracking_id }}

            .payment-details__instruction(v-if="payment.status === 'Paid' && payment.section === 'order'")
              ui-debio-icon.payment-details__instruction-icon(:icon="alertIcon" size="15" color="#52C41B" stroke)
              p.payment-details__instruction-text.mb-0
                | Please proceed to send sample, see instruction 
                span(class="payment-details__instruction-link" @click="handleSampleInstruction()") here!

            .payment-details__service
              .service__table
                .service__field
                  .service__field-title Service Price
                  .service__field-colon :
                  .service__field-value
                    | {{ computeTotalPrices }}
                    | {{ payment.currency }}
                .service__field
                  .service__field-title Quality Control Price
                  .service__field-colon :
                  .service__field-value
                    | {{ payment.additional_prices.length ? formatPrice(payment.additional_prices[0].value) : "-" }}
                    | {{ payment.currency }}
                .service__field(v-if="payment.status === 'Refunded'")
                  .service__field-title Refund amount
                  .service__refund -
                .service__field(v-if="payment.section === 'order'")
                  .service__field-title.d-flex.align-center
                    | Reward
                    .reward(@mouseleave="handleShowPopup('leave')")
                      ui-debio-icon.reward__icon.ml-1(
                        :icon="alertIcon"
                        size="10"
                        color="#6F6F6F"
                        stroke
                        @mouseenter="handleShowPopup('enter')"
                      )
                      .reward__popup(v-if="rewardPopup")
                        .reward__popup-text You will get the reward after your request test from requested service is completed/fulfilled
                  .service__field-colon :
                  .service__field-value - DBIO
            ui-debio-button.payment-details__etherscan-link(
              color="secondary"
              v-if="payment.section === 'order'"
              @click="handleViewEtherscan"
              :loading="isLoading"
              :disabled="!txHash || payment.status === 'Cancelled'"
              outlined
              block
            ) VIEW ON ETHERSCAN

</template>

<script>
import { alertIcon } from "@debionetwork/ui-icons"
import { fetchPaymentDetails, fetchTxHashOrder } from "@/common/lib/api";
import { getRatingService } from "@/common/lib/api"
import { queryDnaSamples } from "@debionetwork/polkadot-provider"
import { mapState } from "vuex"

import {
  COVID_19,
  DRIED_BLOOD,
  URINE_COLLECTION,
  FECAL_COLLECTION,
  SALIVA_COLLECTION,
  BUCCAL_COLLECTION
} from "@/common/constants/instruction-step.js"

import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"

// NOTE: Use anchor tag with "noreferrer noopener nofollow" for security
const anchor = document.createElement("a")
anchor.target = "_blank"
anchor.rel = "noreferrer noopener nofollow"

export default {
  name: "CustomerPaymentDetails",

  mixins: [metamaskServiceHandler],

  data: () => ({
    COVID_19,
    DRIED_BLOOD,
    URINE_COLLECTION,
    FECAL_COLLECTION,
    SALIVA_COLLECTION,
    BUCCAL_COLLECTION,

    alertIcon,
    messageError: null,
    txHash: null,
    rewardPopup: false,
    payment: {}
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      rating: (state) => state.rating.rate,
      web3: (state) => state.metamask.web3
    }),

    computeDetailsTitle() {
      return this.payment?.status === "Paid"
        ? "Thank you for your order"
        : `${this.payment?.status} Order`
    },

    hasPaymentDetails() {
      return Object.keys(this.payment)?.length
    },

    computeTotalPrices() {
      if (!this.payment?.additional_prices?.length) return this.formatPrice(this.payment?.prices[0].value)
      return this.formatPrice(this.payment?.prices[0].value) + this.formatPrice(this.payment?.additional_prices[0].value)
    }
  },

  beforeMount() {
    if (!this.$route.params.id) this.$router.push({ name: "customer-payment-history" })
  },

  async mounted() {
    await this.fetchDetails()
  },

  methods: {
    async fetchDetails() {
      try {
        let data
        let rating
        let txDetails
        let isNotGAOrders = false
        const dataPayment = await this.metamaskDispatchAction(fetchPaymentDetails, this.$route.params.id)

        if (Object.keys(dataPayment.order).length) {
          try {
            isNotGAOrders = true
            rating = await getRatingService(dataPayment.order.service_id)
            txDetails = await this.metamaskDispatchAction(fetchTxHashOrder, dataPayment.order.id)
            data = await queryDnaSamples(this.api, dataPayment.order.dna_sample_tracking_id)
          } catch (error) {
            console.error(error);
          }

          this.txHash = txDetails.transaction_hash
        }

        this.payment = isNotGAOrders
          ? {
            ...dataPayment.order,
            section: "order",
            test_status: data?.status.replace(/([A-Z]+)/g, " $1").trim(),
            rating
          }
          : {
            ...dataPayment.orderGA,
            genetic_analyst_info: {
              ...dataPayment.orderGA.genetic_analyst_info,
              name: `${dataPayment.orderGA.genetic_analyst_info.first_name} ${dataPayment.orderGA.genetic_analyst_info.last_name}`
            },
            section: "orderGA"
          }
      } catch(e) {
        if (e.response.status === 404)
          this.messageError = "Oh no! We can't find your selected order. Please select another one"

        else this.messageError = "Something went wrong. Please try again later"
      }
    },

    handleSampleInstruction() {
      const dnaCollectionProcess = this.payment.service_info.dna_collection_process

      if (dnaCollectionProcess === "Covid 19 Saliva Test") {
        anchor.href = this.COVID_19
        anchor.click()
      }
      if (dnaCollectionProcess === "Blood Cells - Dried Blood Spot Collection Process") {
        anchor.href = this.DRIED_BLOOD
        anchor.click()
      }
      if (dnaCollectionProcess === "Epithelial Cells - Buccal Swab Collection Process") {
        anchor.href = this.BUCCAL_COLLECTION
        anchor.click()
      }
      if (dnaCollectionProcess === "Fecal Matters - Stool Collection Process") {
        anchor.href = this.FECAL_COLLECTION
        anchor.click()
      }
      if (dnaCollectionProcess === "Saliva - Saliva Collection Process") {
        anchor.href = this.SALIVA_COLLECTION
        anchor.click()
      }
      if (dnaCollectionProcess === "Urine - Clean Catch Urine Collection Process") {
        anchor.href = this.URINE_COLLECTION
        anchor.click()
      }
    },

    handleShowPopup(val) {
      if (val === "enter") this.rewardPopup = true
      else this.rewardPopup = false
    },

    formatPrice(price) {
      return parseInt(this.web3.utils.fromWei(String(price.replaceAll(",", "")), "ether"))
    },

    async handleViewEtherscan() {
      anchor.href = `${process.env.VUE_APP_ETHERSCAN}${this.txHash}`
      anchor.click()
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  @import "@/common/styles/function.sass"

  .payment-history-details
    &__title
      margin-top: toRem(35px)

    &__content
      min-width: toRem(575px)
      max-width: toRem(800px)
      padding: toRem(30px)
      margin-top: toRem(60px)
      border: toRem(1px) solid #E9E9E9
      border-radius: toRem(4px)

    &::v-deep
      .ui-debio-card__body
        display: flex
        flex-direction: column
        align-items: center
        padding-bottom: toRem(100px)

  .payment-details
    &__product
      display: flex
      gap: toRem(25px)

    &__status
      display: flex
      gap: toRem(50px)
      margin: toRem(40px) 0 toRem(25px)

    &__instruction
      background: #E7FFDC
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: toRem(25px)
      gap: toRem(15px)
      padding: toRem(12px)
      color: #52C41B

    &__instruction-link
      cursor: pointer
      text-decoration: underline
      color: #A568FF

    &__etherscan-link
      margin-top: toRem(30px)

  .product
    &__details
      width: calc(100% - toRem(175px))
      display: flex
      flex-direction: column
      gap: toRem(15px)

    &__name
      @include h3-opensans

    &__lab
      width: 100%
      display: flex
      align-items: center
      justify-content: space-between
      gap: toRem(80px)
      
    &__provider
      @include body-text-2

  .address
    &__title
      @include body-text-medium-4

    &__text
      overflow: hidden
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
      color: #757274
      @include body-text-2

  .test__title,
  .payment__title,
  .speciment__title
    color: #595959
    @include body-text-4

  .test__status,
  .payment__status,
  .speciment__status
    @include body-text-medium-1

  .service
    &__table
      display: flex
      flex-direction: column

    &__field
      display: flex
      justify-content: space-between
      padding: toRem(10px) toRem(40px)
      background: #FCFCFC
      @include body-text-2

      &:nth-child(odd)
        background: #F6F7FB

    &__field-title
      flex: 1

    &__field-value
      flex: 1
      text-align: right
  .reward
    position: relative
    text-align: right

    &__popup
      width: toRem(290px)
      padding: toRem(15px)
      position: absolute
      font-size: toRem(12px)
      top: toRem(23px)
      left: toRem(-100px)
      background: #FFFFFF
      border: toRem(1px) solid #E9E9E9

      &::before
        top: toRem(-22px)
        content: ""
        display: block
        height: toRem(20px)
        left: toRem(98px)
        position: absolute
        border-color: transparent transparent #E9E9E9 transparent
        border-style: solid
        border-width: toRem(11px)

      &::after
        border-left: solid transparent toRem(10px)
        border-right: solid transparent toRem(10px)
        border-bottom: solid #FFFFFF toRem(10px)
        top: toRem(-10px)
        content: " "
        height: 0
        left: toRem(99px)
        position: absolute
        width: 0

    &__popup-text
      text-align: left
</style>
