<template lang="pug">
  .customer-staking-tab
    DataTable(
      :headers="headers"
      :items="items"
    )
      template(v-slot:[`item.country`]="{ item }")
        div {{ item.country }}

      template(v-slot:[`item.city`]="{ item }")
        div {{ item.city }}


      template(v-slot:[`item.category`]="{ item }")
        div {{ item.category }}

      template(v-slot:[`item.orderDate`]="{ item }")
        span {{ item.orderDate }}

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
            :disabled="item.stakeStatus === 'Unstaked' || item.stakeStatus === 'Process'"
            @click="showConfirmation"
          ) Unstake

          Button.pa-2(
            v-if="item.stakeStatus === 'Open' || item.stakeStatus === 'Claimed'" 
            height="25px"
            width="50%"
            color="secondary"
            @click="toRequestTest(item)"
            :disabled="item.stakeStatus === 'Open'"
          ) Proceed

        .customer-staking-tab__actions(v-else)
          Button(
            height="25px"
            width="50%"
            color="#F5F5F5" 
          ) 6D:23H:59M    

</template>

<script>

import { mapMutations, mapState } from "vuex"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import dataStaking from "./mock-staking.json"
import { requestById } from "@/common/lib/polkadot-provider/query/service-request"

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
        sortable: false,
        align: "center"
      }
    ],
    items: [],
    documents: null,
    tabs: null,
    showDialog: false,
    status: ""
  }),

  async mounted () {
    await this.fetchData ()
  },

  computed: {
    ...mapState({
      wallet: (state) => state.substrate.wallet
    })
  },

  methods: {
    ...mapMutations({
      setCategory: "lab/SET_CATEGORY",
      setStakingService: "lab/SET_STAKING_SERVICE"
    }),

    async getServiceRequest() {
      this.items = await requestById(this.wallet.address)
    },

    async toRequestTest(service) {
      this.setStakingService(service)
      this.$router.push({ 
        name: "customer-request-test-service",
        params: { flag: "staking" }
      })


      const country = service.country
      const region = service.state
      const city = service.city
      const category = service.category
      const flow = "StakingRequestService"

      this.setCategory(category)

      await this.$store.dispatch("lab/setCountryRegionCity", {country, region, city})
      await this.$store.dispatch("lab/getServicesByCategory", {category, flow})
      await this.$store.dispatch("rating/getRate")

      this.$router.push({ name: "customer-select-service"})
    },

    checkStatus(status) {
      if (status === "Open") {
        this.status = "Staked"
      }

      if (status === "Claimed") {
        this.status = "Service Available"
      }

      if (status === "Process") {
        this.status = "Request Test"
      }

      if (status === "Waiting for Service") {
        this.status = "Waiting fot status"
      }

      if (status === "Unstaked") {
        this.status = "Unstaked"
      }
    },

    async fetchData () {
      this.items = dataStaking.data
    },

    setButtonBackground(status) {
      const colors = Object.freeze({
        "OPEN": "#F60689",
        "CLAIMED": "#5640A5",
        "PROCESS": "#4CBB65",
        "WAITING FOR UNSTAKE": "#FAAD15",
        "UNSTAKED": "#E32319"
      })

      return { color: colors[status.toUpperCase()] }
    },

    showConfirmation() {
      this.$emit("unstake")
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

    &__actions
      padding: 27px
      display: flex
      align-items: center
      gap: 20px
      margin: 3px 20px
</style>
