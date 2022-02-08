<template lang="pug">
  DataTable.genetic-data-list(
    :headers="headers"
    :items="items"
  )

</template>

<script>
import DataTable from "@/common/components/DataTable"

export default {
  name: "GeneticDataList",

  components: {
    DataTable
  },

  data: () => ({
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
    items: []
  })

}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

</style>
