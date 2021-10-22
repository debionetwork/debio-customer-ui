<template lang="pug">
  .payment-history
    .payment-history__wrapper
      DataTable(:headers="paymentHeaders" :items="payments")
        template(slot="prepend")
          .payment-history__nav
            .payment-history__nav-text
              h2.payment-history__title Payment History
              p.payment-history__subtitle.mb-0 List of all request service payment
            ui-debio-input.payment-history__search-bar(
              outlined
              variant="small"
              width="270"
              placeholder="Service Name, Payment Status, Lab Name"
            )
              ui-debio-icon(slot="icon-append" size="20" :icon="searchIcon" stroke)
        template(v-slot:[`item.service_info.name`]="{ item }")
          .payment-history__name-details
            ui-debio-avatar(:src="'https://picsum.photos/200'" size="41" rounded)
            .payment-history__item-details
              .payment-history__item-name {{ item.service_info.name }}
              .payment-history__item-speciment {{ item.dna_sample_tracking_id }}

        template(v-slot:[`item.service_info.prices_by_currency[0].total_price`]="{ item }")
          .payment-history__price-details
            .payment-history__item-price {{ item.service_info.prices_by_currency[0].total_price }}
            .payment-history__item-currency {{ item.service_info.prices_by_currency[0].currency }}

        template(v-slot:[`item.reward`]="{ item }")
          span N/A

        template(v-slot:[`item.status`]="{ item }")
          span(:style="{ color: setButtonBackground(item.status) }") {{ item.status }}

        template(v-slot:[`item.actions`]="{ item }")
          Button(
            :color="item.status === 'unpaid' ? 'secondary' : 'primary'"
            width="80"
            height="25"
            dark
            :to="{ name: 'customer-payment-details', params: item }"
            block
          ) {{ item.status === 'unpaid' ? 'Pay' : 'Details' }}
</template>

<script>
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { searchIcon } from "@/common/icons"
// import { searchOrder } from "@/common/lib/polkadot-provider/query/orders";
import mock from "./mock.json"

export default {
  name: "CustomerPaymentHistory",

  components: { DataTable, Button },

  data: () => ({
    searchIcon,
    
    paymentHeaders: [
      { text: "Service Name", value: "service_info.name", sortable: true },
      { text: "Lab Name", value: "lab_info.name", sortable: true },
      { text: "Order Date", value: "created_at", sortable: true },
      { text: "Price", value: "service_info.prices_by_currency[0].total_price", sortable: true },
      { text: "Reward", value: "reward", align: "right", sortable: true },
      { text: "Status", value: "status", align: "right", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%"
      }
    ],
    payments: []
  }),

  async created() {
    await this.onSearchInput()
  },

  methods: {
    async onSearchInput() {
      // const results = await searchOrder(val)
      this.payments = mock.data.map(result => ({
        ...result._source,
        id: result._id,
        created_at: new Date(parseInt(result._source.created_at)).toLocaleDateString(),
        timestamp: parseInt(result._source.created_at)
      }))
    },

    setButtonBackground(status) {
      const colors = Object.freeze({
        FULFILLED: "#5640a5",
        PAID: "#5640a5",
        CANCELLED: "#9B1B37",
        REFUNDED: "#595959",
        UNPAID: "#E27625"
      })

      return colors[status.toUpperCase()]
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .payment-history
    &__nav
      display: flex
      align-items: center
      justify-content: space-between
    
    &__name-details
      display: flex
      gap: 15px
      align-items: center

    &__item-details
      display: flex
      gap: 8px
      flex-direction: column

    &__item-name
      @include body-text-medium-3

    &__item-speciment
      color: #757274
      @include body-text-4
</style>
