<template lang="pug">
  .genetic-analysis-list
    DataTable(
      :headers="headers"
      :items="items"
      :sort-by="['timestamp']"
      :sort-desc="[true]"
    )
      template(v-slot:[`item.serviceName`]="{ item }")
        .d-flex.flex-column.genetic-analysis-list__service
          span {{ item.serviceName }}

      template(v-slot:[`item.fullName`]="{ item }")
        .d-flex.flex-column.genetic-analysis-list__name
          span {{ item.fullName }}

      template(v-slot:[`item.status`]="{ item }")
        .d-flex.flex-column.genetic-analysis-list__status
          span {{ item.status }}

      template(v-slot:[`item.actions`]="{ item }")
        .genetic-analysis-list__actions
          ui-debio-icon(v-show="!iconShow" :icon="eyeIcon" size="16" role="button" stroke @click="toDetail()")
          ui-debio-icon(v-show="item.status === 'ResultReady'" :icon="downloadIcon" size="16" role="button" stroke @click="toDownload(item)")

</template>

<script>

import { mapState } from "vuex"
import { eyeIcon, downloadIcon } from "@/common/icons"
import DataTable from "@/common/components/DataTable"
import { orderDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/orders"
import { analystDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/analyst"
import { queryGeneticAnalysisByOwner, queryGeneticAnalysisStorage, queryGeneticAnalysisOrders } from "@/common/lib/polkadot-provider/query/genetic-analysis"
import { queryGeneticAnalysts, queryGeneticAnalystServices } from "@/common/lib/polkadot-provider/query/genetic-analysts"
import { downloadFile, decryptFile, downloadDocumentFile } from "@/common/lib/pinata"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import CryptoJS from "crypto-js"

export default {
  name: "GeneticAnalysisList",

  components: {
    DataTable
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData
    })
  },

  data: () => ({
    eyeIcon,
    downloadIcon,
    headers: [
      {
        text: "Service Name",
        value: "serviceName",
        sortable: true
      },
      {
        text: "Analyst Name",
        value: "analystName",
        sortable: false
      },
      {
        text: "Order Date",
        value: "createdAt",
        sortable: true
      },
      {
        text: "Last Update",
        value: "updatedAt",
        sortable: true
      },
      {
        text: "Status",
        value: "status",
        sortable: true
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    items: [],
    iconShow: true, //temporary disable.
    iconDownloadShow: false,
    publicKey: null,
    secretKey: null
  }),

  watch: {
    mnemonicData(val) {
      if (val) this.initialData()
    },

    async lastEventData(val) {
      if(val !== null) {
        if(val.method === "Withdraw" || val.section === "balances") {
          await this.fetchGeneticAnalysisData()
        }
      }
    }
  },

  async mounted() {
    await this.fetchGeneticAnalysisData()
  },

  async created() {
    if (this.mnemonicData) this.initialData()
  },



  methods: {
    async initialData(){
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

    async fetchGeneticAnalysisData() {
      this.items = []
      const accountId = this.wallet.address
      const trackingId = await queryGeneticAnalysisByOwner(this.api, accountId)

      for (let i = 0; i < trackingId.length; i++) {
        const geneticAnalysis = await queryGeneticAnalysisStorage(this.api, trackingId[i])
        const { sellerId } = await orderDetails(this.api, geneticAnalysis.geneticAnalysisOrderId)
        const { info: analystInfo } = await analystDetails(this.api, sellerId)

        const dateCreated = new Date(parseInt(geneticAnalysis.createdAt.replace(/,/g, "")))
        const dateUpdated = new Date(parseInt(geneticAnalysis.updatedAt.replace(/,/g, "")))
        const timestamp = geneticAnalysis.updatedAt

        const updatedAt = dateUpdated.toLocaleString("en-GB", {
          day: "numeric", // numeric, 2-digit
          year: "numeric", // numeric, 2-digit
          month: "short" // numeric, 2-digit, long, short, narrow
        })

        const createdAt = dateCreated.toLocaleString("en-GB", {
          day: "numeric", // numeric, 2-digit
          year: "numeric", // numeric, 2-digit
          month: "short" // numeric, 2-digit, long, short, narrow
        })

        const geneticAnalysisTrackingId = geneticAnalysis.geneticAnalystId

        const geneticAnalystsData = await queryGeneticAnalysts(this.api, geneticAnalysisTrackingId)
        const fullName = (geneticAnalystsData.info.firstName + " " + geneticAnalystsData.info.lastName)

        const orderId = geneticAnalysis.geneticAnalysisOrderId
        const geneticAnalysisOrdersData = await queryGeneticAnalysisOrders(this.api, orderId)

        const serviceId = geneticAnalysisOrdersData.serviceId
        const geneticAnalystServicesData = await queryGeneticAnalystServices(this.api, serviceId)

        if (geneticAnalysisOrdersData.status !== "Unpaid") {
          const dataResult = {
            trackingId: trackingId[i],
            serviceName: geneticAnalystServicesData.info.name,
            analystName: fullName,
            analystInfo,
            createdAt: createdAt,
            updatedAt: updatedAt,
            status: geneticAnalysis.status,
            ipfsLink: geneticAnalysis.reportLink,
            timestamp
          }
          this.items.push(dataResult)
        }
      }
    },

    toDetail() {
      // console.log(geneticId)
      // Open new tab with sending props geneticId for fetch detail
    },

    async toDownload(item){
      if (item.status !== "ResultReady") return

      const pair = { publicKey: item.analystInfo.boxPublicKey, secretKey: this.secretKey }
      const type = "application/pdf"

      const { data } = await downloadFile(item.ipfsLink)
      const decryptedFile = decryptFile(data, pair, type)
      await downloadDocumentFile(decryptedFile, item.ipfsLink.split("/").pop(), type)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .genetic-analysis-list
    padding: 0 !important
    margin: -50px -28px 0 -28px


    &__service
      width: 117px

    &__fullName
      width: 480px

    &__status
      width: 80px

    &__actions
      width: 45px
      display: flex
      align-items: center
      justify-content: center
      gap: 20px
</style>
