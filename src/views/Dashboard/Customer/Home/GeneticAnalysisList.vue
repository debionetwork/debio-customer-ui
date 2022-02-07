<template lang="pug">
  .genetic-analysis-list
    DataTable.genetic-analysis-list__table(
      :headers="headers"
      :items="items"
    )
      template(v-slot:[`item.action`]="{ item }")
        .genetic-analysis-list__actions
          ui-debio-icon.genetic-analysis-list__action(
            :icon="downloadIcon"
            :class="{ 'genetic-analysis-list__action--disabled': item.status !== 'Done' }"
            size="16"
            role="button"
            stroke
            stroke-width="4"
            @click="onDownload(item)"
          )
</template>

<script>
import { medicalResearchIllustration } from "@/common/icons"
import { downloadIcon } from "@/common/icons"

import DataTable from "@/common/components/DataTable"

export default {
  name: "GeneticAnalysisList",
  components: { DataTable },

  data: () => ({
    medicalResearchIllustration,
    downloadIcon,

    // TODO: Update headers and items to dynamic data from backend later
    headers: [
      { text: "Service Name", value: "name", sortable: true },
      { text: "Analyst Name", value: "analyst", sortable: true },
      { text: "Order Date", value: "createdAt", sortable: true },
      { text: "Last Update", value: "updatedAt", sortable: true },
      { text: "Status", value: "status", width: "115", sortable: true },
      {
        text: "Action",
        value: "action",
        sortable: false,
        align: "center"
      }
    ],
    items: [
      {
        name: "Genome Data",
        analyst: "Hildegard Einstein",
        createdAt: "28 Jan 2022",
        updatedAt: "29 Jan 2022",
        status: "Inprogress"
      },
      {
        name: "Genotype",
        analyst: "Sarah Newton",
        createdAt: "28 Jan 2022",
        updatedAt: "29 Jan 2022",
        status: "Done"
      },
      {
        name: "Ancestry DNA Data",
        analyst: "Jacky Colombus",
        createdAt: "28 Jan 2022",
        updatedAt: "29 Jan 2022",
        status: "Done"
      },
      {
        name: "DCHGenome",
        analyst: "Azmi Galileo",
        createdAt: "28 Jan 2022",
        updatedAt: "29 Jan 2022",
        status: "Done"
      },
      {
        name: "Ancestry DNA Data B",
        analyst: "Dr Octopus",
        createdAt: "28 Jan 2022",
        updatedAt: "29 Jan 2022",
        status: "Open"
      }
    ]
  }),

  methods: {
    onDownload(item) {
      if (item.status !== "Done") return
      // TODO: Do something
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/functions.sass"

  .genetic-analysis-list

    &__actions
      display: flex
      justify-content: center
      align-items: center
      gap: toRem(16px)

    &__action--disabled
      cursor: not-allowed

      &::v-deep
        svg
          stroke: #C3C3C3
</style>
