<template lang="pug">
  .genetic-data-list
    DataTable(
      :headers="headers"
      :items="items"
    )
      template(v-slot:[`item.title`]="{ item }")
        .d-flex.flex-column.genetic-data-list__title
          span {{ item.title }}

      template(v-slot:[`item.description`]="{ item }")
        .d-flex.flex-column.genetic-data-list__description
          span {{ item.description }}

      template(v-slot:[`item.uploadDate`]="{ item }")
        .d-flex.flex-column.genetic-data-list__upload
          span {{ item.createdAt }}

      template(v-slot:[`item.actions`]="{ item }")
        .genetic-data-list__actions
          ui-debio-icon(:icon="pencilIcon" size="16" role="button" stroke @click="onEdit(item)")
          ui-debio-icon(:icon="trashIcon" size="16" role="button" stroke @click="onDelete(item)")

    ConfirmationDialog(
      :show="showDialog"
      :txWeight="Number(txWeight).toFixed(4)"
      title="Delete Genetic Data"
      message="By delete this Genetic Data, you might not be able to retrieve it back"
      btnMessage="Delete"
      @close="showDialog=false"
      @click="confirmedDelete"
    )

</template>

<script>
import { mapState } from "vuex"
import { pencilIcon, trashIcon } from "@/common/icons"
import { queryGeneticDataByOwner, queryGeneticDataById } from "@/common/lib/polkadot-provider/query/genetic-data"
import { removeGeneticData, getRemoveGeneticDataFee} from "@/common/lib/polkadot-provider/command/genetic-data"
import DataTable from "@/common/components/DataTable"
import ConfirmationDialog from "../MyTest/ConfirmationDialog"


export default {
  name: "GeneticDataList",

  components: {
    DataTable,
    ConfirmationDialog
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      web3: (state) => state.metamask.web3
    })
  },

  data: () => ({
    pencilIcon,
    trashIcon,
    headers: [
      {
        text: "Title",
        value: "title",
        sortable: true
      },
      {
        text: "Description",
        value: "description",
        sortable: false
      },
      {
        text: "Uploaded",
        value: "uploadDate",
        sortable: true
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    items: [],
    showDialog: false,
    selectedDataId: null,
    txWeight: 0
  }),

  watch: {
    lastEventData(e) {
      if (e !== null) {
        const dataEvent = JSON.parse(e.data.toString())
        if (dataEvent[1] === this.wallet.address) {
          if (e.method === "GeneticDataRemoved") {
            this.fetchGeneticData()
            this.showDialog = false
          }
        }
      }
    }
  },


  async mounted() {
    this.fetchGeneticData()
    this.getRemoveDataFee()
  },

  methods: {
    async fetchGeneticData() {
      this.items = []
      const accountId = this.wallet.address
      const dataList = await queryGeneticDataByOwner(this.api, accountId)

      for (let i = 0; i < dataList.length; i++) {
        const geneticData = await queryGeneticDataById(this.api, dataList[i])

        let { id, owenerId, reportLink, title, description, createdAt, updatedAt } = geneticData

        if (updatedAt !== "0") {
          createdAt = this.formatDate(updatedAt)
        } else {
          createdAt = this.formatDate(createdAt)
        }

        const item = { id, owenerId, reportLink, title, description, createdAt, updatedAt }
        this.items.push(item)
      }
    },

    onEdit(item) {
      this.$router.push({ name: "customer-add-genetic-data", params: { id: item.id }})

    },

    onDelete(item) {
      this.selectedDataId = item.id
      this.showDialog = true
    },

    async getRemoveDataFee() {
      const txWeight = await getRemoveGeneticDataFee(this.api, this.wallet, this.selectedDataId)
      this.txWeight = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
    },

    async confirmedDelete() {
      await removeGeneticData(this.api, this.wallet, this.selectedDataId)
    },

    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    }
  }

}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .genetic-data-list
    padding: 0 !important
    margin: -50px -28px 0 -28px


    &__title
      width: 117px

    &__description
      width: 480px

    &__updload
      width: 65px

    &__actions
      width: 45px
      display: flex
      align-items: center
      justify-content: center
      gap: 20px

</style>
