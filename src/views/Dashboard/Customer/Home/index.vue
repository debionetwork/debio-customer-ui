<template lang="pug">
.customer-home
  ui-debio-banner(
    title="Welcome to Debio!"
    subtitle="The Privacy-First Platform for Personal Biomedical Testing"
    with-decoration
    gradient-color="violet"
  )
    template(slot="illustration")
      ui-debio-icon(:icon="doctorDashboardIllustrator" :size="cardBlock ? 250 : 180" view-box="0 0 180 180" fill)

    template(slot="cta")
      ui-debio-card(
        :to="{ name: 'customer-request-test'}"
        title="Request a Test"
        sub-title="Get your biological sample tested"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="creditCardIcon" slot="icon" size="34" color="#C400A5" fill)
      ui-debio-card(
        :to="{ name: 'customer-emr-create' }"
        title="Upload your EMR"
        sub-title="Upload your Electronic Medical Record"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)
  .customer-home-__content
    div.body
      ui-debio-card.leftTable
        div.bodyHeader
          v-row
            v-col(cols="9")
              v-row
                span.topHead Recent Payments
              v-row
                span.botomHead {{ titleWording }}
            v-col(cols="3")
              Button.btnHead(
                :width="'75px'"
                :height="'25px'"
                color="#5640A5"
                outlined
                @click="goToPaymentHistory"
              ) View All

        div
          DataTable.content(
            :headers="headers"
            :items="paymentHistory"
            :sortBy="['timestamp']"
            :sort-by="[true]"
            :disableSort="true"
            :showFooter="false"

          )
            template(class="status" v-slot:[`item.serviceInfo.name`]="{item}")
              div(class="d-flex align-center")
                ui-debio-avatar.serviceImage(
                  :src="item.serviceInfo.image"
                  size="41"
                  rounded
                )
                div(class="fluid")
                  div
                    span {{ item.serviceInfo.name }}
                  div
                    span {{ item.dnaSampleTrackingId}}

            template(class="status" v-slot:[`item.status`]="{item}") {{ item.status }}

            template(v-slot:[`item.actions`]="{item}")
              ui-debio-icon.iconTable(
                :icon="eyeIcon"
                slot="icon"
                size="20"
                color="#C400A5"
                stroke
                @click="goToPaymentDetail(item.id)"
                )


      ui-debio-card.rightTable
        div.bodyHeader
          v-row
            v-col(cols="9")
              v-row
                span.topHead Recent Test
              v-row
                span.botomHead {{ titleWording }}
            v-col(cols="3")
              Button.btnHead(
                width="75px"
                height="25px"
                outlined
                color="#5640A5"
                @click="goToMyTest"
              ) View All

        div
          DataTable.content(
            :headers="headers"
            :items="orderHistory"
            :sortBy="['timestamp']"
            :disableSort="true"
            :showFooter="false"
          )

            template(class="status" v-slot:[`item.serviceInfo.name`]="{item}")
              div(class="d-flex align-center")
                ui-debio-avatar.serviceImage(
                  :src="item.serviceInfo.image"
                  size="41"
                  rounded
                )
                div(class="fluid")
                  div
                    span {{ item.serviceInfo.name }}
                  div
                    span {{ item.dnaSampleTrackingId}}


            template(v-slot:[`item.actions`]="{item}")
              ui-debio-icon.iconTable(
                :icon="eyeIcon"
                slot="icon" size="20"
                color="#C400A5"
                stroke
                @click="goToOrderDetail(item)"
                )
</template>

<script>
import { creditCardIcon, layersIcon, labIllustration, doctorDashboardIllustrator, eyeIcon } from "@/common/icons"

import Banner from "@/common/components/Banner"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import {
  ordersByCustomer,
  getOrdersData
} from "@/common/lib/polkadot-provider/query/orders"
import {
  queryDnaTestResultsByOwner,
  queryDnaTestResults
} from "@/common/lib/polkadot-provider/query/genetic-testing"
import { queryLabsById } from "@/common/lib/polkadot-provider/query/labs"
import { queryServicesById } from "@/common/lib/polkadot-provider/query/services"
import localStorage from "@/common/lib/local-storage"
import { mapState } from "vuex"
import { SUCCESS } from "@/common/constants/specimen-status";

export default {
  name: "CustomerHome",

  components: {Banner, DataTable, Button },

  data: () => ({
    creditCardIcon,
    layersIcon,
    labIllustration,
    eyeIcon,
    cardBlock: false,
    orderHistory: [],
    testHistory: [],
    titleWording: "",
    doctorDashboardIllustrator,
    paymentHistory: [],
    isLoadingTestResults: false,
    headers: [
      { text: "Service Name", value: "serviceInfo.name",sortable: true },
      { text: "Lab Name", value: "labInfo.name", sortable: true },
      { text: "Date", value: "createdAt", sortable: true },
      { text: "Status", value: "status", sortable: true },
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
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  async created() {
    await this.getTestHistoryData()
    await this.checkOrderLenght()
    await this.getDataOrderHistory()
  },

  methods: {
    async getTestHistoryData() {
      this.isLoadingTestResults = true;
      try {
        this.testHistory = [];
        let maxResults = 5;
        const address = this.wallet.address
        // Get specimens
        const specimens = await queryDnaTestResultsByOwner(this.api, address)
        if (specimens != null) {
          specimens.reverse();
          if (specimens.length < maxResults) {
            maxResults = specimens.length;
          }
          for (let i = 0; i < maxResults; i++) {
            const dnaTestResults = await queryDnaTestResults(
              this.api,
              specimens[i]
            );
            if (dnaTestResults != null) {
              const detaillab = await queryLabsById(
                this.api,
                dnaTestResults.labId
              );
              const detailOrder = await getOrdersData(
                this.api,
                dnaTestResults.orderId
              );
              const detailService = await queryServicesById(
                this.api,
                detailOrder.serviceId
              );
              this.preparePaymentHistory(dnaTestResults, detaillab, detailService); //this should prepare test history
            }
          }
        }
        this.isLoadingTestResults = false;
      } catch (err) {
        console.log(err);
        this.isLoadingTestResults = false;
      }
    },

    async getDataOrderHistory() {
      try {
        const address = this.wallet.address
        let maxResults = 5;
        const listOrderId = await ordersByCustomer(this.api, address)
        if (listOrderId.length < maxResults) {
          maxResults = listOrderId.length
        }
        for (let i = 0; i < maxResults; i++) {
          const detailOrder = await getOrdersData(this.api, listOrderId[i])
          const detaillab = await queryLabsById(this.api, detailOrder.sellerId)
          const detailService = await queryServicesById(this.api, detailOrder.serviceId);
          this.prepareOrderData(detailOrder, detaillab, detailService)
        }

        this.orderHistory.sort(
          (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
        )
  
        const status = localStorage.getLocalStorageByName("lastOrderStatus")
        if (status) this.orderHistory[0].status = status
        
      } catch (error) {
        console.log(error)
      }
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

    preparePaymentHistory(dnaTestResults, detaillab, detailService) {
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
      const number = dnaTestResults.trackingId;
      const status = SUCCESS;

      const order = {
        icon,
        number,
        timestamp,
        status,
        orderDate,
        serviceId,
        serviceInfo,
        labId,
        labInfo,
        createdAt,
        updatedAt,
        labName
      };

      this.testHistory.push(order);
    },

    goToMyTest() {
      this.$router.push({ name: "my-test" }) //go to order history page (mytest)
    },

    goToPaymentHistory() {
      this.$router.push({ name: "customer-payment-history" }) //go to payment history page
    },

    goToOrderDetail(item) { //item
      this.$router.push({ name: "order-history-detail", params: item}) //go to order history detail page
    },

    goToPaymentDetail(item) {
      this.$router.push({ name: "customer-payment-details", params: item }) //go to payment detail
    },

    async checkOrderLenght() {
      if (!this.orderHistory.length) {
        this.titleWording = "You haven’t made any order."
        return
      }
      this.titleWording = "Quick Actions to view your recent orders"
    }
  },

  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData
    })
  }
}
</script>

<style lang="sass" scoped>
  .customer-home
    &::v-deep
      .banner__illustration

      .body
        margin-top: 25px
        display: flex
        width: 100%
        flex-wrap: wrap
        gap: 20px

      .content
        margin: 0 5px 5px -5px

      .bodyHeader
        margin-left: 15px

      .leftTable
        width: 545
        flex: 1

      .rightTable
        width: 545
        flex: 1

      .topHead
        font-size: 15px
      .botomHead
        font-size: 10px
      .btnHead
        font-size: 10px
        margin-left: 25px
        margin-top: -15px
      .iconTable
        margin-left: 8px
        margin-top: -2px
      .status
        color: #48A868 !important
      .textBox
        margin-top: 14px
      .subTextBox
        margin-top: -40px
      .serviceImage
        margin: 0 10px 0 0
        border-radius: 5px
  .degenics-datatable
    margin: 20px 0 0 0
  .degenics-datatable-card
    padding: 0px
</style>
