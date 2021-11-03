<template lang="pug">
.customer-emr
  ui-debio-banner(
    title="My EMR"
    subtitle="Here, you can upload a collection of your Electronic Medical Records (medical history, diagnoses, medications, treatment plans, immunization dates, allergies, radiology images, and laboratory)."
    gradient-color="primary"
    with-decoration
  )
    template(slot="illustration")
      ui-debio-icon.banner-illustration(:icon="analiticIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 252 252" fill)

  DataTable(
    :headers="headers"
    :loading="isLoading"
    :items="emrDocuments"
  )
    template(v-slot:[`item.actions`]="{ item }")
      .customer-emr__actions
        ui-debio-icon(:icon="eyeIcon" size="16" role="button" stroke @click="onDetails(item.data.id)")
        ui-debio-icon(:icon="trashIcon" size="16" role="button" stroke @click="onDelete(item)")
        ui-debio-icon(:icon="downloadIcon" size="16" role="button" stroke @click="onDownload(item)")
</template>

<script>
import { mapState } from "vuex"
import {
  layersIcon,
  analiticIllustration,
  eyeIcon,
  trashIcon,
  downloadIcon
} from "@/common/icons"

import {
  queryGetEMRList,
  queryElectronicMedicalRecordInfoById
} from "@/common/lib/polkadot-provider/query/electronic-medical-record"
import { removeElectronicMedicalRecordInfo } from "@/common/lib/polkadot-provider/command/electronic-medical-record"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"
import { hexToU8a } from "@polkadot/util"

import DataTable from "@/common/components/DataTable"
import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"

export default {
  name: "CustomerEmr",
  mixins: [metamaskServiceHandler],

  components: { DataTable },

  data: () => ({
    layersIcon,
    analiticIllustration,
    eyeIcon,
    trashIcon,
    downloadIcon,

    cardBlock: false,
    password: "12345678",
    headers: [
      {
        text: "EMR Title",
        value: "emrTitle",
        sortable: true
      },
      {
        text: "Category",
        value: "category",
        sortable: true
      },
      {
        text: "Document Title",
        value: "title",
        sortable: true
      },
      {
        text: "Description",
        value: "description",
        sortable: true
      },
      {
        text: "Upload Date",
        value: "date",
        align: "center",
        sortable: true
      },
      {
        text: "Action",
        value: "actions",
        align: "center"
      }
    ],

    items: [
      {
        title: "Test",
        category: "Test",
        documentTitle: "Test",
        documentDescription: "Test",
        upload: "Test"
      }
    ],
    emrDocuments: []
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      loadingData: (state) => state.auth.loadingData
    })
  },

  watch: {
    lastEventData() {
      if (this.lastEventData != null) {
        const dataEvent = JSON.parse(this.lastEventData.data.toString())
        if (this.lastEventData.method == "ElectronicMedicalRecordInfoRemoved") {
          if (dataEvent[0].owner_id == this.wallet.address) {
            this.getDocumentsHistory()
          }
        }
      }
    }
  },

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  created() {
    this.getDocumentsHistory()
  },

  methods: {
    async getDocumentsHistory() {
      this.emrDocuments = []
      await this.metamaskDispatchAction(this.getEMRHistory)
    },

    async getEMRHistory() {
      const dataEMR = await this.metamaskDispatchAction(queryGetEMRList, this.api, this.wallet.address)

      if (dataEMR != null) {
        const listEMR = dataEMR.info.reduce((filtered, current) => {
          if (filtered.every(v => v !== current)) filtered.push(current)

          return filtered
        }, [])

        if (listEMR.length > 0) {
          listEMR.reverse()
          for (let i = 0; i < listEMR.length; i++) {
            const emrDetail = await this.metamaskDispatchAction(queryElectronicMedicalRecordInfoById,
              this.api,
              listEMR[i]
            )

            if (emrDetail != null) {
              this.prepareEMRData(emrDetail)
            }
          }

          this.emrDocuments.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
        }
      }
    },

    prepareEMRData(dataEMR) {
      const title = dataEMR.title
      const description = dataEMR.description
      var d = new Date(parseInt(dataEMR.uploaded_at.replace(/,/g, "")))
      const timestamp = d.getTime().toString()
      const data = dataEMR
      const date = d.toLocaleString("en-US", {
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long" // numeric, 2-digit, long, short, narrow
      })

      const order = {
        title,
        description,
        data,
        date,
        timestamp,
        type: "emr"
      }

      this.emrDocuments.push(order)
    },

    onDetails(id) {
      this.$router.push({ name: "customer-emr-details", params: { id }})
    },

    async onDelete(item) {
      this.wallet.decodePkcs8(this.password)
      await this.metamaskDispatchAction(removeElectronicMedicalRecordInfo,
        this.api,
        this.wallet,
        item.data.id
      )
    },

    async onDownload(item) {
      if (item.type !== "emr") return

      const publicKey = hexToU8a(this.mnemonicData.publicKey)
      const privateKey = hexToU8a(this.mnemonicData.privateKey)
      const baseUrl = "https://ipfs.io/ipfs/"
      const path = item.data.record_link.replace(baseUrl, "")

      await this.metamaskDispatchAction(downloadDecryptedFromIPFS,
        path,
        privateKey,
        publicKey,
        item.data.id + ".pdf",
        "application/pdf"
      )
    }
  }
}
</script>

<style lang="sass" scoped>
  .customer-emr
    display: flex
    flex-direction: column
    gap: 30px

    &__actions
      display: flex
      align-items: center
      gap: 20px

    &::v-deep
      .banner__subtitle
        max-width: 36.188rem !important
      .banner-illustration
        position: absolute
        bottom: -100px
</style>
