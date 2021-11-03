<template lang="pug">
  .customer-staking-tab
    .customer-staking-tab__table
      DataTable(
        :headers="headers"
        :items="items"
      )

        template(v-slot:[`item.stakeStatus`]="{ item }")
          span(:style="setButtonBackground(item.stakeStatus)") {{ item.stakeStatus }}

        template(v-slot:[`item.amount`]="{ item }")
          span(:style="setButtonBackground(item.stakeStatus)") {{ item.amount }}

        template(v-slot:[`item.actions`]="{ item }")
          .customer-staking-tab__actions(v-if="item.stakeStatus !== 'Waiting for Unstake'" )
            Button.pa-2(
              height="25px"
              width="50%"
              color="primary"
              :disabled="item.stakeStatus === 'Unstaked' || item.stakeStatus === 'Request test'"
            ) Unstake

            Button.pa-2(
              v-if="item.stakeStatus === 'Staked' || item.stakeStatus === 'Service Available'" 
              height="25px"
              width="50%"
              color="secondary"
              @click="toRequestTest"
              :disabled="item.stakeStatus === 'Staked'"
            ) Proceed

          .customer-staking-tab__actions(v-else)
            Button.pa-2(
              height="25px"
              width="50%"
              color="primary"
              disabled 
            ) 5D : 15H : 30M
          

</template>

<script>

import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"

export default {
  name: "StakingServiceTab",

  components: {
    DataTable,
    Button
  },

  data: () => ({
    headers: [
      {
        text: "Country",
        value: "country",
        sortable: true
      },
      {
        text: "City",
        value: "city",
        sortable: true
      },
      {
        text: "Service Category",
        value: "category",
        sortable: true
      },
      {
        text: "Order Date",
        value: "orderDate",
        sortable: true
      },
      {
        text: "Stake Status",
        value: "stakeStatus",
        sortable: true
      },
      {
        text: "Amount (DBIO)",
        value: "amount",
        sortable: true,
        align: "right"
      },
      {
        text: "Action",
        value: "actions",
        align: "center"
      }
    ],
    items: [
      {
        country: "Indonesia",
        city: "Kota Administrasi Jakarta Barat",
        category: "Single Gene",
        orderDate: "1 Jan 2021",
        stakeStatus: "Staked",
        amount: 2000
      },
      {
        country: "Indonesia",
        city: "Kota Administrasi Jakarta Selatan",
        category: "Single Gene",
        orderDate: "1 Oct 2021",
        stakeStatus: "Service Available",
        amount: 500
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Covid-19 Testing",
        orderDate: "23 Dec 2020",
        stakeStatus: "Request test",
        amount: 50
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Whole Genome Sequencing",
        orderDate: "23 Dec 2020",
        stakeStatus: "Waiting for Unstake",
        amount: 5000
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Whole Genome Sequencing",
        orderDate: "23 Dec 2020",
        stakeStatus: "Unstaked",
        amount: 5000
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Whole Transcriptome Sequencing",
        orderDate: "7 Agustus 2020",
        stakeStatus: "Unstaked",
        amount: 5000
      }
    ],
    documents: null,
    tabs: null
  }),

  methods: {
    toRequestTest() {
      this.$router.push({ name: "customer-request-test-service"})
    },

    setButtonBackground(status) {
      const colors = Object.freeze({
        "STAKED": "#F60689",
        "SERVICE AVAILABLE": "#5640A5",
        "REQUEST TEST": "#4CBB65",
        "WAITING FOR UNSTAKE": "#FAAD15",
        "UNSTAKED": "#E32319"
      })

      return { color: colors[status.toUpperCase()] }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-staking-tab
    width: 100%
    height: 100%
    background: #FFFFFF

    &__tabs
      padding: 2px

    &__table
      width: 100%
      padding: 0px 30px

    &__actions
      padding: 25px
      display: flex
      align-items: center
      gap: 20px
      margin: 3px 20px
</style>
