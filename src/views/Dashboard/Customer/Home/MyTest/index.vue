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
            StakingServiceTab

</template>

<script>
import { layersIcon, noteIllustration } from "@/common/icons"
import StakingServiceTab from "./StakingServiceTab.vue"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { mapState } from "vuex"
import localStorage from "@/common/lib/local-storage"
import { hexToU8a } from "@polkadot/util"
import { syncDecryptedFromIPFS } from "@/common/lib/ipfs"
import { getSignedUrl, createSyncEvent } from "@/common/lib/ipfs/gcs"
import dataTesting from "./dataTesting.json"
import metamaskServiceHandler from "@/common/lib/metamask/mixins/metamaskServiceHandler"

export default {
  name: "MyTest",

  mixins: [metamaskServiceHandler],

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

  async created() {
    await this.downloadFile()
    const pair = {
      secretKey: hexToU8a(this.mnemonicData.privateKey),
      publicKey: hexToU8a(this.mnemonicData.publicKey)
    }

    console.log("created ===> ", pair);
  },

  methods: {
    toRequestTest() {
      this.$router.push({ name: "customer-request-test-select-lab"})
    },

    async onSearchInput() {
      this.orderHistory = dataTesting.data.map(result => ({
        ...result._source,
        id: result._id,
        updated_at: new Date(parseInt(result._source.updated_at)).toLocaleDateString(),
        created_at: new Date(parseInt(result._source.created_at)).toLocaleDateString(),
        timestamp: parseInt(result._source.created_at)
      }))
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
    },

    async downloadFile() {
      const pair = {
        secretKey: hexToU8a(this.mnemonicData.privateKey),
        publicKey: hexToU8a(this.mnemonicData.publicKey)
      }

      // const baseUrl = "https://ipfs.io/ipfs/"
      // const path = this.ipfsUrl.replace(baseUrl, "")
      await this.metamaskDispatchAction(
        syncDecryptedFromIPFS,
        "QmPMyww3BkaDYHspBvaFxA2JJQTULQfeyJLRhoSh4c98fG",
        pair,
        "file.vcf",
        "text/vCard"
      )

      await this.metamaskDispatchAction(getSignedUrl, "file.vcf")
      await this.metamaskDispatchAction(createSyncEvent, { filename: "file.vcf"})
    }
  },

  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      lastEventData: (state) => state.substrate.lastEventData,
      mnemonicData: (state) => state.substrate.mnemonicData
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
    .banner__subtitle
      max-width: 36.188rem !important

.customer-my-test
  width: 100%
  height: 200px
  background: #FFFFFF
  margin-top: 30px

  &__tabs
    padding: 3px

  &__table
    padding: 10px

  &__actions
    padding: 35px
    display: flex
    align-items: center
    gap: 30px
    margin: 5px

  &__status
    color: #48A868

  &__title-detail
    margin: 0 5px 0 0
    border-radius: 5px
</style>
