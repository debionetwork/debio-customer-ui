<template lang="pug">
  .ga-dashboard
    .ga-dashboard__wrapper
      ui-debio-banner.ga-dashboard__banner(
        title="Genetic Analyst"
        subtitle="Povide service for customer who have been tested in previous years can get interpretation that leads to improved maintenance."
        gradient-color="tertiary"
        with-decoration
      )
        template(slot="illustration")
          ui-debio-icon(
            :icon="geneticAnalystIllustration"
            :size="cardBlock ? 250 : 120"
            view-box="0 0 120 120"
            fill
          )

      DataTable(:headers="headers" :items="orderLists")
        template(slot="prepend")
          .ga-dashboard__text
            h2.ga-dashboard__table-title Order Lists
            p.ga-dashboard__table-subtitle.mb-0 List of all services ordered by Customers

        template(v-slot:[`item.id`]="{ item }")
          span {{ `${item.id.substr(0, 4)}...${item.id.substr(item.id.length - 3)}` }}

        template(v-slot:[`item.action`]="{ item }")
          .ga-dashboard__table-action.d-flex.justify-center
            router-link(:to="{ name: 'ga-order-details', params: { id: item.id, item } }")
              ui-debio-icon(
                :icon="eyeIcon"
                role="button"
                size="16"
                stroke
              )

</template>

<script>
import { GAGetOrders } from "@/common/lib/api"
import { geneticAnalystIllustration, eyeIcon } from "@/common/icons"

import DataTable from "@/common/components/DataTable"
import { mapState } from "vuex"


export default {
  name: "GADashboard",
  components: { DataTable },

  data: () => ({
    geneticAnalystIllustration,
    eyeIcon,

    cardBlock: false,
    orderLists: [],
    headers: [
      {
        text: "Order ID",
        value: "id",
        sortable: true
      },
      {
        text: "Service Name",
        value: "name",
        sortable: true
      },
      {
        text: "Order Date",
        value: "created_at",
        sortable: true
      },
      {
        text: "Price",
        value: "price",
        sortable: true
      },
      {
        text: "Status",
        value: "status",
        sortable: true
      },
      {
        text: "Action",
        value: "action",
        align: "center",
        sortable: false
      }
    ]
  }),

  computed: {
    ...mapState({
      lastEventData: (state) => state.substrate.lastEventData,
      web3: (state) => state.metamask.web3
    })
  },

  watch: {
    lastEventData(val) {
      if (val === null) return
      if (val.section === "geneticAnalysisOrders") this.getOrdersData()
    }
  },

  created() {
    this.getOrdersData()
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  methods: {
    async getOrdersData() {
      const orderData = await GAGetOrders()
      this.orderLists = orderData.data.map(order => {
        const sourceData = order._source
        // TODO: Remove OR condition here after backend ready
        const formatedPrice = `${this.web3.utils.fromWei(String(sourceData.prices[0]?.value.replaceAll(",", "") || 0), "ether")} ${sourceData?.currency}`

        return {
          ...sourceData,
          price: formatedPrice,
          created_at: new Date(+sourceData.created_at.replaceAll(",", "")).toLocaleString("en-GB", {
            day: "numeric",
            year: "numeric",
            month: "short"
          })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .ga-dashboard
    &__wrapper
      display: flex
      flex-direction: column
      gap: 35px

    &__table-title
      @include body-text-medium-1

    &__table-subtitle
      @include body-text-3


    &::v-deep
      .v-data-table > .v-data-table__wrapper > table > tbody > tr > td
        @include body-text-3

      .banner__content-description
        margin-left: 10.25rem

      .banner__subtitle
        max-width: 32.2rem !important
</style>
