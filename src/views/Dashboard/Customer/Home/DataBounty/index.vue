<template lang="pug">
  .customer-data-bounty
    .customer-data-bounty__wrapper
      ui-debio-banner.customer-data-bounty__banner(
        title="Data Bounty"
        subtitle="Spread medical awareness to the world! store your genetical test result to ocean marketplace as data aggregation, and receive $DBIO reward!"
        gradient-color="secondary"
        with-decoration
      )
        template(slot="illustration")
          ui-debio-icon(
            :icon="researchIllustration"
            :size="cardBlock ? 250 : 180"
            view-box="0 0 170 170"
            fill
          )

      DataTable(:headers="headers" :items="bounties")
        template(slot="prepend")
          .customer-data-bounty__text
            h2.customer-data-bounty__title Data Bounty
            p.customer-data-bounty__subtitle.mb-0 Your data bounty history

        template(v-slot:[`item.name`]="{ item }")
          .customer-data-bounty__item-wrapper
            ui-debio-avatar.customer-data-bounty__item-image(:src="item.avatar" rounded)
            .customer-data-bounty__item-details
              .customer-data-bounty__item-name {{ item.name }}
              .customer-data-bounty__item-speciment {{ item.speciment }}

        template(v-slot:[`item.hash`]="{ item }")
          .customer-data-bounty__hash.d-flex.align-center
            .customer-data-bounty__item-hash {{ item.hash }}
            Button.customer-data-bounty__copy(color="primary" width="60" height="22" @click="handleCopy($event, item.hash)") Copy
              
</template>

<script>
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { researchIllustration } from "@/common/icons" 

export default {
  name: "CustomerDataBounty",

  components: { DataTable, Button },

  data: () => ({
    researchIllustration,

    bounties: [
      {
        name: "Covid-19 Testing",
        speciment: "AYEY6073POOH",
        labName: "GSI Lab",
        avatar: "https://picsum.photos/40",
        desc: "Result from covid-19 test gen contain badai sitokin and low hemoglobin it’s hapen mostly in tropis region",
        reward: "100 DBIO",
        hash: "F6325D9FE1CAC14BA1AS3832NC"
      },
      {
        name: "Covid-19 Testing2",
        speciment: "AYEY6073POOH",
        labName: "GSI Lab",
        avatar: "https://picsum.photos/40",
        desc: "Result from covid-19 test gen contain badai sitokin and low hemoglobin it’s hapen mostly in tropis region",
        reward: "100 DBIO",
        hash: "A6325D9FE1CAC14BA1AS3832NC"
      }
    ],

    headers: [
      {
        text: "Service Name",
        value: "name",
        sortable: true
      },
      {
        text: "Lab Name",
        value: "labName",
        sortable: true
      },
      {
        text: "Description",
        value: "desc",
        width: "350",
        sortable: true
      },
      {
        text: "Reward",
        value: "reward",
        sortable: true
      },
      {
        text: "Hashcode",
        value: "hash",
        align: "center",
        sortable: false
      }
    ],
    cardBlock: false
  }),

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  methods: {
    handleCopy(e, hash) {
      e.target.textContent = "Copied"

      setTimeout(() => {
        e.target.textContent = "Copy"
      }, 1000)

      navigator.clipboard.writeText(hash)
    }    
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-data-bounty
    &__wrapper
      display: flex
      flex-direction: column
      gap: 35px

    &__item-wrapper
      display: flex
      align-items: center
      gap: 15px

    &__item-details
      display: flex
      flex-direction: column
      gap: 2px

    &__item-name
      @include body-text-3-opensans

    &__item-speciment
      color: #8C8C8C
      @include body-text-3-opensans
    
    &__hash
      width: max-content
      gap: 10px
      padding: 2px
      padding-left: 10px
      border-radius: 4px
      background: #EDF2F7

    &__item-hash
      width: 180px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis

    &__copy
      text-transform: capitalize
      font-size: 10px

    &::v-deep
      .banner__subtitle
        max-width: 29.2rem !important
</style>
