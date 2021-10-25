<template lang="pug">
  .customer-staking-tab
    .customer-staking-tab__table
      DataTable(
        :headers="headers"
        :items="items"
      )
        template(v-slot:[`item.actions`]="{ item }")
          .customer-staking-tab__actions
            Button(
              height="40px"
              width="50%"
              color="primary"
              :disabled="item.unstake"
            ) Unstake

            Button(
              height="40px"
              width="50%"
              color="secondary"
              @click="toRequestTest"
              :disabled="item.proceed"
            ) Proceed
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
        text: "Amount (DAI)",
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
        amount: 2000,
        unstake: true,
        proceed: false
      },
      {
        country: "Indonesia",
        city: "Kota Administrasi Jakarta Selatan",
        category: "Single Gene",
        orderDate: "1 Oct 2021",
        stakeStatus: "Unstaked",
        amount: 500,
        unstake: true,
        proceed: true
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Covid-19 Testing",
        orderDate: "23 Dec 2020",
        stakeStatus: "Request test",
        amount: 50,
        unstake: false,
        proceed: false
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Whole Genome Sequencing",
        orderDate: "23 Dec 2020",
        stakeStatus: "Staked",
        amount: 5000,
        proceed: false
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Whole Genome Sequencing",
        orderDate: "23 Dec 2020",
        stakeStatus: "Request test",
        amount: 5000,
        unstake: true,
        proceed: true
      },
      {
        country: "Singapore",
        city: "Singapore",
        category: "Whole Transcriptome Sequencing",
        orderDate: "7 Agustus 2020",
        stakeStatus: "Request test",
        amount: 5000,
        unstake: true,
        proceed: true
      }
    ],
    documents: null,
    tabs: null
  }),

  methods: {
    toRequestTest() {
      this.$router.push({ name: "customer-request-test-select-lab"})
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
      padding: 3px

    &__table
      padding: 10px

    &__actions
      padding: 35px
      display: flex
      align-items: center
      gap: 30px
      margin: 5px
</style>
