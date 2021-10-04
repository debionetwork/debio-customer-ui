<template lang="pug">
  v-card(class="degenics-datatable-card elevation-2 ma-15")
    slot(name="prepend")

    //- <!-- Data Table -->
    v-data-table(
      class="degenics-data-table"
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :search="dataTableSearchVal"
      :page.sync="page"
      :class="additionalClass"
      hide-default-footer
      :custom-filter="_customFilter"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :loading="loading"
      :show-expand="expand"
      item-key="id"
      @click:row="clickedRow"
      :loading-text="computedLoadingText"
      :disable-sort="disableSort"
    )
      //- <!-- Slots for row formatting -->
      template(v-for="(slot, name) in $scopedSlots" v-slot:[name]="item")
        slot(:name="name" v-bind="item")


    //- <!-- Custom Footer -->
    template(v-slot:footer)
      div(class="footer d-flex justify-space-between align-center flex-wrap")
        div(
          class="pagination-info"
        ) Showing {{ from() }} to {{ to() }} of {{ total() }} entries
        v-pagination(
          v-model="page"
          :length="pageCount"
          :total-visible="10"
          circle
          color="secondary"
        )

</template>

<script>
export default {
  name: "DataTable",
  props: {
    headers: { type: [Object, Array]},
    items: { type: [Object, Array]},
    additionalClass: { type: String},
    sortBy: { type: Array},
    sortDesc: { type: Array},
    loading: { type: Boolean},
    expand: { type: Boolean},
    customFilter: {type: [String, Boolean], default: false},
    loadingText: {type: String, default: ""},
    disableSort: {type: Boolean, default: false}
  },
  data: () => ({
    page: 1,
    pageCount: 0,
    entriesPerPage: 10
    
  }),
  methods: {
    clickedRow() {
      console.log("clicked")
    },
    computedLoadingText() {
      return this.loadingText ? this.loadingText : "Loading.. Please wait"
    },
    defaultFilter(value, search /*item*/) {
      return value != null &&
      search != null &&
      typeof value !== "boolean" &&
      value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
    },

    /**
     * Footer Helper functions
     */
    from() {
      if (this.totalItemLength == 0) {
        return 0
      }
      return this.entriesPerPage * (this.page - 1) + 1
    },

    to() {
      if (this.page * this.entriesPerPage > this.items.length) {
        return this.items.length
      }
      return this.page * this.entriesPerPage
    },

    total() {
      return this.totalItemLength
    }
    /** ----------------- */
  },
  computed: {
    dataTableSearchVal: {
      get() {
        return this.search
      },
      set(val) {
        this.$emit("input", val)
      }
    },
    _customFilter() {
      return this.customFilter ? this.customFilter : this.defaultFilter
    }

  }
}
</script>

<style lang="scss">
@import '/src/styles/variables.scss';

.degenics-datatable-card {
  border-radius: 8px !important;
  overflow: hidden !important;
  padding: 40px;

  box-shadow: unset !important;
  filter: drop-shadow(0px 7px 20px rgba(0, 0, 0, 0.07));
}

.degenics-data-table {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;

  /** BRI text-body */
  font-size: 9px;
  line-height: 18px;
  letter-spacing: 0.1px;
  /** */

  thead {
    background-color: #f5f7f9 !important;

    th {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
      height: 29px !important;
      /* white-space: nowrap; */
      * {
        color: black !important;
        /** BRI text-body */
        font-size: 9px;
        line-height: 18px;
        letter-spacing: 0.1px;
        /** */
      }
      i.v-icon.notranslate.v-data-table-header__icon:not(:hover) {
        opacity: 0.5;
      }
      &.active {
        i.v-icon.notranslate.v-data-table-header__icon {
          opacity: 1;
        }
      }
    }
  }

  tbody {
    border-bottom: none !important;
    td {
      * {
        height: 57.3px !important;
      }
    }

    tr {
      * {
        font-size: 9px !important;
        border-bottom: #f5f7f9 !important;
      }
    }
  }

  .footer {
    height: 72px;

    .pagination-info {
      color: $color-text-secondary;
    }
    .v-pagination {
      button {
        font-size: 11px;
        min-width: 24px;
        height: 24px;
        outline: none;
        /* outline-color: $color-secondary; */
        &:not(.v-pagination__item--active) {
          background: $color-border;
        }
      }
      li:first-child, li:last-child {
        button {
          width: 24px;
        }
      }
    }
  }
}
</style>
