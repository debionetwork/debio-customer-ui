<template lang="pug">
  .customer-test
    ui-debio-banner.customer-test__banner(
      title="My Test"
      subtitle="Privacy-first biomedical process. Get your own biomedical sample at home, proceed it anonymously to expert and scientist!"
      with-decoration
      gradientColor="tertiary"
    )
      template(slot="illustration")
        ui-debio-icon(
          :icon="medicalResearchIllustration"
          :size="cardBlock ? 250 : 180"
          view-box="10 0 245 175"
          fill
        )

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
                :items="testResult"
              )
                template(class="titleSection" v-slot:[`item.serviceInfo.name`]="{item}")
                  div(class="detailLab d-flex align-center")
                    .customer-my-test__title-detail
                      ui-debio-avatar(
                        :src="item.serviceInfo.image"
                        size="42"
                        rounded
                      )
                    div
                      div.customer-my-test__title-name
                        span {{ item.serviceInfo.name }}
                      div.customer-my-test__title-number
                        span {{ item.dnaSampleTrackingId}}

                template(v-slot:[`item.actions`]="{ item }")
                  .customer-my-test__actions
                    Button(
                      height="25px"
                      width="50%"
                      dark
                      color="primary"
                      :to="{ name: 'order-history-detail', params: item}"
                    ) Detail
                    
                    Button(
                      v-if="item.status != 'Result Ready'"
                      v-show="item.status == 'Registered'"
                      height="25px"
                      width="50%"
                      dark
                      color="secondary"
                      @click="goToInstruction(item.serviceInfo.dnaCollectionProcess)"
                    ) Instruction

                    Button(
                      v-if="item.status != 'Registered'"
                      v-show="item.status == 'Result Ready'"
                      height="25px"
                      width="50%"
                      dark
                      color="secondary"
                      @click="goToStakeData"
                    ) Add as Bounty

                template(v-slot:[`item.status`]="{item}")
                  .customer-my-test__status
                  span(:style="{color: setStatusColor(item.status)}") {{ item.status }}
          v-tab-item
            .customer-my-test__table
            StakingServiceTab(
              @unstake="showDialog = true"
            )
            ConfirmationDialog(
              :show="showDialog"
              :loading="isLoading"
              title="Are you sure you want to unstake?"
              message="If you wish to proceed, you won't be able to continue the request service process and no DBIO reward will be given. Your staking amount will be returned after 144 hours or 6 days"
              @click="unstakeService"
              this.isLoding = true
              @close="showDialog=false"
            )
            

      modalBounty(
        :show="isBounty"
        title="Do you want to add your test result as a data bounty?"
        sub-title="You can learn more about data bounty by seeing the information"
        link="/"
        :loading="isLoading"
      )
        .modal-bounty__cta.d-flex.mt-8
          Button(outlined color="secondary" width="100" @click="cancelBounty") Cancel
          Button(color="secondary" width="100" @click="submitBounty") Yes
</template>

<script>
import { layersIcon, noteIllustration, medicalResearchIllustration } from "@/common/icons"
import StakingServiceTab from "./StakingServiceTab.vue"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { mapState } from "vuex"
import {
  ordersByCustomer,
  getOrdersData
} from "@/common/lib/polkadot-provider/query/orders"
import { queryLabsById } from "@/common/lib/polkadot-provider/query/labs"
import { queryServicesById } from "@/common/lib/polkadot-provider/query/services"
import localStorage from "@/common/lib/local-storage"
import modalBounty from "./modalBounty.vue"
import {
  COVID_19,
  DRIED_BLOOD,
  URINE_COLLECTION,
  FECAL_COLLECTION,
  SALIVA_COLLECTION,
  BUCCAL_COLLECTION
} from "@/common/constants/instruction-step.js"
import dataTesting from "./dataTesting.json"
import ConfirmationDialog from "@/common/components/Dialog/ConfirmationDialog"
import { unstakeRequest } from "@/common/lib/polkadot-provider/command/service-request"

import {
  queryDnaTestResultsByOwner,
  queryDnaTestResults,
  queryDnaSamples
} from "@/common/lib/polkadot-provider/query/genetic-testing"
import {
  REGISTERED,
  REJECTED,
  ARRIVED,
  QUALITY_CONTROLLED,
  WET_WORK,
  RESULT_READY
} from "@/common/constants/specimen-status"

export default {
  name: "MyTest",

  components: {
    StakingServiceTab,
    DataTable,
    Button,
    modalBounty,
    ConfirmationDialog
  },

  data: () => ({ 
    layersIcon, 
    noteIllustration, 
    cardBlock: false,
    documents: null,
    tabs: null,
    isProcessed: true,
    isBounty: false,
    isLoading: false,
    orderHistory: [],
    btnLabel: "",
    showDialog: false,
    headers: [
      { text: "Service Name", value: "serviceInfo.name", sortable: true },
      { text: "Lab Name", value: "labInfo.name", sortable: true },
      { text: "Order Date", value: "createdAt", sortable: true },
      { text: "Last Update", value: "updatedAt", sortable: true },
      { text: "Test Status", value: "status", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%"
      }
    ],
    COVID_19,
    DRIED_BLOOD,
    URINE_COLLECTION,
    FECAL_COLLECTION,
    SALIVA_COLLECTION,
    BUCCAL_COLLECTION,
    medicalResearchIllustration,
    isLoadingOrderHistory: false,
    isLoding: false,
    isLoadingTestResults: false,
    testResult: []
  }),

  async mounted() {
    // await this.getOrderHistory()
    // console.log(this.orderHistory, "<=== order history")
    // this.onSearchInput()
    await this.getTestResultData()
    console.log(this.testResult, "<= test result")
  },

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
    },

    setStatusColor(status) { //change color for each order status
      let colors = Object.freeze({
        REGISTERED: "#6F4CEC",
        PAID: "#44921A",
        UNPAID: "#FAAD15",
        FULFILLED: "#44921A",
        CANCELLED: "#9B1B37",
        FAILED: "#9B1B37",
        RESULTREADY: "#6F4CEC",
        REJECTED: "#9B1B37",
        SUBMITEDASDATABOUNTY: "#5640A5"
      })
      return colors[status.toUpperCase()]
    },

    async getOrderHistory() {//this for get order from substrate
      try {
        this.isLoadingOrderHistory = true
        const address = this.wallet.address
        const listOrderId = await ordersByCustomer(this.api, address)
  
        for (let i = 0; i < listOrderId.length; i++) {
          const detailOrder = await getOrdersData(this.api, listOrderId[i])
          const detaillab = await queryLabsById(this.api, detailOrder.sellerId)
          const detailService = await queryServicesById(this.api, detailOrder.serviceId)
          this.prepareOrderData(detailOrder, detaillab, detailService)
        }
        
        this.orderHistory.sort(
          (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
        )
  
        const status = localStorage.getLocalStorageByName("lastOrderStatus")
        if (status) this.orderHistory[0].status = status
        
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoadingOrderHistory = false
      }
    },

    async getTestResultData(){
      this.isLoadingTestResults = true
      try {
        this.testResult = []
        const dummyAddress = "5ESGhRuAhECXu96Pz9L8pwEEd1AeVhStXX67TWE1zHRuvJNU"
        // const address = this.wallet.address,
        const speciment = await queryDnaTestResultsByOwner(this.api, dummyAddress)
        console.log(speciment, "<=== speciment sebelum reverse")
        if (speciment != null) {
          speciment.reverse()
          for (let i = 0; i < speciment.length; i++) {
            const dnaTestResults = await queryDnaTestResults(this.api, speciment[i])
            console.log(dnaTestResults, "<== dna test result")
            if (dnaTestResults != null) {
              const dnaSample = await queryDnaSamples(this.api, dnaTestResults.trackingId)
              const detaillab = await queryLabsById(this.api, dnaTestResults.labId)
              const detailOrder = await getOrdersData(this.api, dnaTestResults.orderId)
              const detailService = await queryServicesById(this.api, detailOrder.serviceId)
              this.prepareTestResult(dnaTestResults, detaillab, detailService, dnaSample)
            }
          }
        }
        this.isLoadingTestResults = false
      } catch (error) {
        console.log(error)
        this.isLoadingTestResults = false
      }
    },

    prepareTestResult(dnaTestResults, detaillab, detailService, dnaSample) {
      const feedback = {
        rejectedTitle: dnaSample.rejectedTitle,
        rejectedDescription: dnaSample.rejectedDescription
      }
      const title = detailService.info.name
      const description = detailService.info.description
      const serviceImage = detailService.info.image
      const category = detailService.info.category
      const testResultSample = detailService.info.testResultSample 
      const pricesByCurrency = detailService.info.pricesByCurrency 
      const expectedDuration = detailService.info.expectedDuration 
      const serviceId = detailService.id 
      const dnaCollectionProcess = detailService.info.dnaCollectionProcess 
      const serviceInfo = { 
        name: title,
        description: description,
        image: serviceImage,
        category: category,
        testResultSample: testResultSample,
        pricesByCurrency: pricesByCurrency,
        expectedDuration: expectedDuration,
        dnaCollectionProcess: dnaCollectionProcess
      }
      const labName = detaillab.info.name
      const address = detaillab.info.address
      const labImage = detaillab.info.profileImage
      const labId = detaillab.info.boxPublicKey 
      const labInfo = { 
        name: labName,
        address: address,
        profileImage: labImage
      }
      let icon = "mdi-needle";
      if (detailService.info.image != null) {
        icon = detailService.info.image;
      }

      const dateSet = new Date(
        parseInt(dnaTestResults.createdAt.replace(/,/g, ""))
      )
      const dateUpdate = new Date(
        parseInt(dnaTestResults.updatedAt.replace(/,/g, ""))
      )
      const timestamp = dateSet.getTime().toString();
      const orderDate = dateSet.toLocaleString("en-US", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric"
      });

      const updatedAt = dateUpdate.toLocaleString("en-US", { 
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long" // numeric, 2-digit, long, short, narrow
      })
      const createdAt = dateSet.toLocaleString("en-US", { 
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long" // numeric, 2-digit, long, short, narrow
      })
      const dnaSampleTrackingId = dnaTestResults.trackingId
      const status = this.checkSatus(dnaSample.status)
      
      const result = {
        icon,
        dnaSampleTrackingId,
        timestamp,
        status,
        orderDate,
        serviceId,
        serviceInfo,
        labId,
        labInfo,
        createdAt,
        updatedAt,
        labName,
        feedback
      }
      this.testResult.push(result)
    },

    checkSatus(status) {
      if (status == "Registered") return REGISTERED
      if (status == "Arrived") return ARRIVED
      if (status == "Rejected") return REJECTED
      if (status == "QualityControlled") return QUALITY_CONTROLLED
      if (status == "WetWork") return WET_WORK
      if (status == "ResultReady") return RESULT_READY
    },




    prepareOrderData(detailOrder, detaillab, detailService) {
      const title = detailService.info.name
      const description = detailService.info.description
      const serviceImage = detailService.info.image
      const category = detailService.info.category
      const testResultSample = detailService.info.testResultSample
      const pricesByCurrency = detailService.info.pricesByCurrency
      const expectedDuration = detailService.info.expectedDuration
      const serviceId = detailService.id
      const dnaCollectionProcess = detailService.info.dnaCollectionProcess
      const serviceInfo = {
        name: title,
        description: description,
        image: serviceImage,
        category: category,
        testResultSample: testResultSample,
        pricesByCurrency: pricesByCurrency,
        expectedDuration: expectedDuration,
        dnaCollectionProcess: dnaCollectionProcess
      }

      const labName = detaillab.info.name
      const address = detaillab.info.address
      const labImage = detaillab.info.profileImage
      const labId = detaillab.info.boxPublicKey
      const labInfo = {
        name: labName,
        address: address,
        profileImage: labImage
      }

      let icon = "mdi-needle";
      if (detailService.info.image != null) {
        icon = detailService.info.image;
      }

      const number = detailOrder.id
      const dateSet = new Date(
        parseInt(detailOrder.createdAt.replace(/,/g, ""))
      )
      const dateUpdate = new Date(
        parseInt(detailOrder.updatedAt.replace(/,/g, ""))
      )
      const timestamp = dateSet.getTime().toString();
      const orderDate = dateSet.toLocaleString("en-US", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric"
      })
      const updatedAt = dateUpdate.toLocaleString("en-US", {
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long" // numeric, 2-digit, long, short, narrow
      })
      const createdAt = dateSet.toLocaleString("en-US", {
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long" // numeric, 2-digit, long, short, narrow
      });
      const status = detailOrder.status
      const dnaSampleTrackingId = detailOrder.dnaSampleTrackingId
      const order = {
        icon,
        number,
        timestamp,
        status,
        dnaSampleTrackingId,
        orderDate,
        serviceId,
        serviceInfo,
        labId,
        labInfo,
        updatedAt,
        createdAt
      }

      this.orderHistory.push(order)
    },

    checkLastOrder() {
      const status = localStorage.getLocalStorageByName("lastOrderStatus")
      this.isProcessed = status ? status : null
    },

    goToStakeData() {
      this.isBounty = true
    },

    goToInstruction(item) {
      if (item == "Covid 19 Saliva Test") {
        window.open(this.COVID_19, "_blank")
      }
      if (item == "Blood Cells - Dried Blood Spot Collection Process") {
        window.open(this.DRIED_BLOOD, "_blank")
      }
      if (item == "Epithelial Cells - Buccal Swab Collection Process") {
        window.open(this.BUCCAL_COLLECTION, "_blank")
      }
      if (item == "Fecal Matters - Stool Collection Process") {
        window.open(this.FECAL_COLLECTION, "_blank")
      }
      if (item == "Saliva - Saliva Collection Process") {
        window.open(this.SALIVA_COLLECTION, "_blank")
      }
      if (item == "Urine - Clean Catch Urine Collection Process") {
        window.open(this.URINE_COLLECTION, "_blank")
      }
    },

    submitBounty() {
      this.isLoading = true
    },

    cancelBounty() {
      this.isBounty = false
    },

    async unstakeService () {
      this.isLoading = true
      const requestId = this.stakingId
      await unstakeRequest(this.api, this.wallet, requestId)
      this.isLoading = false
      this.showDialog = false
      this.$router.push({
        name: "customer-dashboard"
      })
    }
  },

  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      stakingId: (state) => state.lab.stakingId
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
    margin: 35px 0 0 0
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
    padding: 0.75rem !important
    
  .degenics-data-table
    margin-top: 0px !important
</style>
