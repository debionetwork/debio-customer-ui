<template lang="pug">
  .customer-staking-tab
    .customer-staking-tab__table
      DataTable(
        :headers="headers"
        :items="items"
      )
        template(v-slot:[`item.country`]="{ item }")
          div {{ item.country }}

        template(v-slot:[`item.city`]="{ item }")
          div {{ item.city }}

        template(v-slot:[`item.category`]="{ item }")
          div {{ item.serviceCategory }}

        template(v-slot:[`item.orderDate`]="{ item }")
          span 11/11/2021

        template(v-slot:[`item.stakeStatus`]="{ item }")
          span(:style="setButtonBackground(item.status)") {{ getStatusName(item.status)}} 

        template(v-slot:[`item.amount`]="{ item }")
          span(:style="setButtonBackground(item.status)") {{ item.stakingAmount/1000000000000000000 }}

        template(v-slot:[`item.actions`]="{ item }")
          .customer-staking-tab__actions(v-if="item.status !== 'WaitingForUnstaked'" )
            Button.pa-4(
              height="25px"
              width="100px"
              style="font-size: 1em"
              color="primary"
              @click="getUnstakingDialog(item.hash_)"
              :disabled="item.stakeStatus === 'Unstaked' || item.stakeStatus === 'Process'"
            ) Unstake

            Button.pa-4(
              v-if="item.stakeStatus === 'Open' || item.stakeStatus === 'Claimed'" 
              height="25px"
              style="font-size: 1em"
              width="100px"
              color="secondary"
              @click="toRequestTest(item)"
              :disabled="item.stakeStatus === 'Open'"
            ) Proceed

          .customer-staking-tab__actions(v-else)
            Button.pa-4(
              style="font-size: 1em"
              height="25px"
              width="100px"
              color="#F5F5F5"
            ) {{ setRemainingStakingDate(item.unstakedAt) }}
    
    ConfirmationDialog(
      :show="showDialog"
      title="Are you sure you want to unstake?"
      message="If you wish to proceed, you won't be able to continue the request service process and no DBIO reward will be given. Your staking amount will be returned after 144 hours or 6 days"
      @click="unstakeService"
      @close="closingDialog"
    )

</template>

<script>

import { mapState, mapMutations } from "vuex"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import stakingStatus from "@/common/constants/staking-status"
import dataStaking from "./stakingData.json"
import ConfirmationDialog from "@/common/components/Dialog/ConfirmationDialog"
import { unstakeRequest } from "@/common/lib/polkadot-provider/command/service-request"
import { getServiceRequestByCustomer } from "@/common/lib/service-request"


export default {
  name: "StakingServiceTab",

  components: {
    DataTable,
    Button,
    ConfirmationDialog
  },

  data: () => ({
    status: "",
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
    requestId: ""
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      pair: (state) => state.substrate.wallet
    })
  },

  async mounted () {
    await this.fetchData ()
  },

  methods: {
    ...mapMutations({
      setCategory: "lab/SET_CATEGORY",
      setStakingService: "lab/SET_STAKING_SERVICE"
    }),

    async fetchData () {
      this.items = dataStaking.data // TO REMOVE when the indexer is working
      await getServiceRequestByCustomer(this.pair.address)
      
    },

    async getServiceRequest() {
      // TODO : get service request
    },

    setRemainingStakingDate(date) {
      const day = new Date(parseInt(date)).getDate() + 6 - new Date().getDate()
      const hours = new Date(parseInt(date)).getHours() + 24 - new Date().getHours()
      const minutes = new Date(parseInt(date)).getMinutes() + 60 - new Date().getMinutes()
      return `${day}D:${hours}H:${minutes}M`      
    },

    async toRequestTest() {
      this.setStakingService(this.service)
      this.$router.push({ 
        name: "customer-request-test-service",
        params: { flag: "staking" }
      })

      const country = this.service.country
      const region = this.service.state
      const city = this.service.city
      const category = this.service.category
      const flow = "StakingRequestService"

      this.setCategory(category)

      await this.$store.dispatch("lab/setCountryRegionCity", {country, region, city})
      await this.$store.dispatch("lab/getServicesByCategory", {category, flow})
      await this.$store.dispatch("rating/getRate")

      this.$router.push({ name: "customer-request-test-service"})
    },

    getUnstakingDialog(id) {
      this.showDialog = true
      this.requestId = id
    },

    setButtonBackground(status) {
      const colors = Object.freeze({
        "OPEN": "#F60689",
        "CLAIMED": "#5640A5",
        "PROCESS": "#4CBB65",
        "WAITINGFORUNSTAKED": "#FAAD15",
        "UNSTAKED": "#E32319"
      })

      return { color: colors[status.toUpperCase()] }
    },

    closingDialog() {
      console.log("close di sini")
      this.showDialog = false
    },

    getStatusName(status) {
      for (const key in stakingStatus) {
        if (key === status.toUpperCase()) {
          return stakingStatus[key]
        }
      }
    },

    async unstakeService () {
      await unstakeRequest(
        this.api,
        this.pair,
        this.requestId
      )
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
