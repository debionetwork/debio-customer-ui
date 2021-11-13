<template lang="pug">
  .customer-test
    modalBounty(
      :show="isShowModalBounty"
      :title="computeModalTitle"
      :sub-title="computeModalSubtitle"
      :link="computeModalLink"
      :loading="modalBountyLoading"
    )
      .modal-bounty__cta.d-flex.mt-8.justify-center
        Button(
          v-if="!!isBountyError"
          color="secondary"
          block
          outlined
          @click="isBountyError = null"
        ) Try again

        Button(
          v-else-if="isSuccessBounty"
          color="secondary"
          width="100"
          outlined
          @click="isShowModalBounty = false"
        ) Ok

        template(v-else)
          Button(outlined color="secondary" width="100" @click="isShowModalBounty = false") Cancel
          Button(color="secondary" width="100" @click="downloadFile") Yes

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
                      @click="isShowModalBounty = true"
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
import modalBounty from "./modalBounty.vue"
import DataTable from "@/common/components/DataTable"
import Button from "@/common/components/Button"
import { mapState } from "vuex"
import Kilt from "@kiltprotocol/sdk-js"
import CryptoJS from "crypto-js"
import localStorage from "@/common/lib/local-storage"
import { u8aToHex } from "@polkadot/util"
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
    modalBounty,
    Button
  },

  data: () => ({
    layersIcon,
    noteIllustration,
    cardBlock: false,
    isSuccessBounty: false,
    isShowModalBounty: false,
    modalBountyLoading: false,
    isBountyError: null,
    publicKey: null,
    secretKey: null,
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
    },

    computeModalTitle() {
      const title = this.isSuccessBounty
        ? "Great! Your data has been placed on marketplace successfully!"
        : "Do you want to add your test result as a data bounty?"

      return this.isBountyError ? this.isBountyError : title
    },

    computeModalSubtitle() {
      const subtitle = this.isSuccessBounty
        ? "Congratulations! You get XX $DBIO as reward!"
        : "You can learn more about data bounty by seeing the information"

      return this.isBountyError ? "Something went wrong, please try again" : subtitle
    },

    computeModalLink() {
      return this.isSuccessBounty || this.isBountyError ? null : "/"
    }
  },

  mounted() {
    this.onSearchInput();
  },

  async created() {
    await this.initialData()
  },

  methods: {
    async initialData() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },

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
      this.orderHistory = this.orderHistory.filter(order => order.status == "OrderPaid")
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
      this.modalBountyLoading = true
      try {
        const pair = {
          secretKey: this.secretKey,
          publicKey: this.publicKey
        }

        await syncDecryptedFromIPFS(
          "QmPMyww3BkaDYHspBvaFxA2JJQTULQfeyJLRhoSh4c98fG", // TODO: (Testing purpose) Update when my test ready
          pair,
          "file.vcf",
          "text/vCard"
        )

        await getSignedUrl(getSignedUrl, "file.vcf")
        await createSyncEvent(createSyncEvent, { filename: "file.vcf"})
      } catch (e) {
        this.isBountyError = e?.message
        this.modalBountyLoading = false
      }
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

.modal-bounty__cta
  gap: 40px
</style>
