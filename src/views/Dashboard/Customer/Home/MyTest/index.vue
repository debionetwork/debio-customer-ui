<template lang="pug">
  .customer-test
    ui-debio-banner(
      title="My Test"
      subtitle="Privacy-first biomedical process. Get your own biomedical sample at home, proceed it anonymousely to expert and scientist!"
      with-decoration
      gradient-color="tertiary"
    )
      template(slot="illustration")
        ui-debio-icon(:icon="noteIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 100 86" fill)

      template(slot="cta")
        ui-debio-card
          ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)   

    .customer-my-test
      .customer-my-test__tabs
        template
          v-tabs(v-model="tabs")
            v-tab Test List
            
            v-tab Stake Service
              
        v-tabs-items(v-model="tabs")
          v-tab-item
            .customer-my-test__table
              DataTable(
                :headers="headers"
                :items="orderHistory"
              )
                template(class="titleSection" v-slot:[`item.service_info.name`]="{item}")
                  div(class="detailLab d-flex align-center")
                    .customer-my-test__title-detail
                      ui-debio-avatar(
                        :src="'https://picsum.photos/200/300'"
                        size="42"
                      )
                    div
                      div
                        span {{ item.service_info.name }}
                      div
                        span {{ item.dna_sample_tracking_id}}

                template(v-slot:[`item.actions`]="{ item }")
                  .customer-my-test__actions
                    Button(
                      height="40px"
                      width="50%"
                      color="primary"
                      :to="{ name: 'order-history-detail', params: item}"
                    ) Details

                    Button(
                      v-if="isRegistered"
                      height="40px"
                      width="50%"
                      color="secondary"
                      :disabled="isRegistered"
                    ) Instruction

                    Button(
                      v-if="!isReady"
                      height="40px"
                      width="50%"
                      color="secondary"
                      :disabled="!isReady"
                    ) Add as Bounty

                template(v-slot:[`item.status`]="{item}")
                  .customer-my-test__status
                  span(:style="setStatusColor(item.status)") {{ item.status }}
          v-tab-item
            .customer-my-test__table
            StakingServiceTab

</template>

<script>
import { layersIcon, noteIllustration } from "@/common/icons"
import StakingServiceTab from "./StakingServiceTab.vue"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { mapState } from "vuex"
import localStorage from "@/common/lib/local-storage"
import dataTesting from "./dataTesting.json"

export default {
  name: "MyTest",

  components: { 
    StakingServiceTab,
    DataTable,
    Button
  },

  data: () => ({ 
    layersIcon, 
    noteIllustration, 
    cardBlock: false,
    documents: null,
    tabs: null,
    isReady: false,
    isRegistered: false,
    isProcessed: false,
    orderHistory: [],
    headers: [
      { text: "Service Name", value: "service_info.name", sortable: true },
      { text: "Lab Name", value: "lab_info.name", sortable: true },
      { text: "Order Date", value: "created_at", sortable: true },
      { text: "Last Update", value: "updated_at", sortable: true },
      { text: "Test Status", value: "status", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%"
      }
    ]
  }),

  mounted() {
    this.onSearchInput();
  },

  async created() {},

  methods: {
    toRequestTest() {
      this.$router.push({ name: "customer-request-test-select-lab"})
    },

    async onSearchInput() {
      this.orderHistory = dataTesting.data.map(result => ({
        ...result._source,
        id: result._id,
        updatedAt: new Date(parseInt(result._source.updatedAt)).toLocaleDateString(),
        createdAt: new Date(parseInt(result._source.createdAt)).toLocaleDateString(),
        timestamp: parseInt(result._source.createdAt)
      }))
      this.orderHistory = this.orderHistory.filter(order => order.status == "OrderPaid")
    },

    setStatusColor(status) {
      let colors = Object.freeze({
        REGISTERED: "#44921A",
        PAID: "#E27625",
        RESULTREADY: "#5640A5",
        REJECTED: "#9B1B37",
        SUBMITEDASDATABOUNTY: "#5640A5"
      })
      return { color: colors[status.toUpperCase()] }
    },

    checkLastOrder() {
      const status = localStorage.getLocalStorageByName("lastOrderStatus")
      this.isProcessed = status ? status : null
    },

    goToDetail() {
      console.log("detail")
    },

    goToStakeData() {
      console.log("stake data")
    },

    goToInstruction() {
      console.log("insturction")
    }
  },

  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData
    }),

    userAddress() {
      return JSON.parse(localStorage.getKeystore()) ["Address"]
    }
  }
}
</script>

<style lang="sass" scoped>
  .customer-test
    &::v-deep
      

  .customer-my-test
    width: 100%
    height: 100%
    background: #FFFFFF

    &__tabs
      padding: 2px
    
    &__table
      padding-top: 0px !important
      margin-top: 0px !important

    &__actions
      padding: 25px
      display: flex
      align-items: center
      gap: 20px
      margin: 3px 20px
    
    &__title-detail
      margin: 0 10px 0 0
      border-radius: 10px
    
    &__title-number
      color: #8C8C8C

  .modal-bounty__cta
    justify-content: space-around !important
  
  .degenics-datatable-card
    padding-top: 0px !important
    
  .degenics-data-table
    margin-top: 0px !important
</style>
