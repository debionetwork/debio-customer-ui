<template lang="pug">
  .customer-emr-details
    .customer-emr-details__wrapper(v-if="selectedFiles")
      .customer-emr-details__emr
        .customer-emr-details__emr-title List of {{ selectedFiles.title }}
        .customer-emr-details__emr-documents
          .customer-emr-details__document(
            v-for="(document, idx) in selectedFiles.files"
            :key="idx"
            role="button"
            :title="document.title"
            :class="{ 'customer-emr-details__document--active': selected === idx }"
            @click="parseResult(idx, document)"
          )
            ui-debio-icon.customer-emr-details__document-icon(
              :icon="fileTextIcon"
              size="28"
              color="#D3C9D1"
              fill
            )
            label.customer-emr-details__document-title(
              :aria-label="document.title"
            ) {{ document.title }}
      keep-alive
        .customer-emr-details__viewer
          .customer-emr-details__viewer-wrapper(
            :class="{ 'customer-emr-details__viewer-wrapper--animated': isLoading }"
          )
            h3.customer-emr-details__viewer-loading.text-center(v-if="isLoading") {{ message }}
            embed.customer-emr-details__viewer-content(
              v-if="!isLoading && result"
              :src="`${result}#view=fitH`"
              type="application/pdf"
            )
</template>

<script>
import { mapState } from "vuex"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"
import { hexToU8a } from "@polkadot/util"
import { fileTextIcon } from "@/common/icons"
import ipfsWorker from "@/common/lib/ipfs/ipfs-worker"

export default {
  name: "CustomerEmrDetails",

  data: () => ({
    fileTextIcon,

    isLoading: false,
    publicKey: null,
    secretKey: null,
    result: null,
    message: "Loading EMR your document file, please wait",
    selected: 0,
    emrDocuments: [
      {
        id: 1,
        title: "Covid 19",
        category: "Vaccinations",
        files: [
          {
            title: "Xray",
            link: "QmPMyww3BkaDYHspBvaFxA2JJQTULQfeyJLRhoSh4c98fG",
            description: "My xray sample"
          },
          {
            title: "Data vaccination",
            link: "QmUv4n9iwJw75WbYy3P8D9LUzzAdzYzcgYEMH8Du35gumE",
            description: "my vaccinations detail"
          }
        ],
        created_at: "Fri Nov 05 2021 16:29:50 GMT+0700 (Western Indonesia Time)"
      },
      {
        id: 2,
        title: "Whole genome squencing",
        category: "Vaccinations",
        files: [
          {
            title: "Xray",
            link: "QmPMyww3BkaDYHspBvaFxA2JJQTULQfeyJLRhoSh4c98fG",
            description: "My xray sample"
          },
          {
            title: "Data vaccination",
            link: "QmPMyww3BkaDYHspBvaFxA2JJQTULQfeyJLRhoSh4c98fG",
            description: "my vaccinations detail"
          }
        ],
        created_at: "2/7/2011"
      }
    ]
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      loadingData: (state) => state.auth.loadingData
    }),

    selectedFiles() {
      return this.emrDocuments[this.$route.params.id - 1]
    }
  },

  async created() {
    this.initialData()
    await this.parseResult(0, this.selectedFiles?.files[0])
  },

  methods: {
    initialData() {
      this.publicKey = hexToU8a(this.mnemonicData.publicKey)
      this.secretKey = hexToU8a(this.mnemonicData.privateKey)
    },

    async parseResult(idx, { link }) {
      this.selected = idx

      const path = link

      const secretKey = this.secretKey
      const publicKey = this.publicKey

      const pair = {
        secretKey,
        publicKey
      }

      const typeFile = "application/pdf"
      const channel = new MessageChannel()

      try {
        this.isLoading = true
        channel.port1.onmessage = ipfsWorker.workerDownload

        await ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
          channel.port2
        ])

        ipfsWorker.workerDownload.onmessage = (event) => {
          const blob = window.URL.createObjectURL(new Blob([event.data], { type: typeFile }))

          this.result = blob
          this.isLoading = false
        }
      } catch {
        this.message = "Oh no! Something went wrong. Please try again later"
      }

    },

    async download({ title, link }) {
      await downloadDecryptedFromIPFS(
        link,
        this.secretKey,
        this.publicKey,
        `${title}.pdf`,
        "application/pdf"
      )
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"
  .customer-emr-details
    padding: 80px 35px
    background: #ffffff
    border-radius: 4px

    &__wrapper
      display: flex
      gap: 35px

    &__emr
      width: 255px

    &__emr-title
      @include body-text-medium-2
    
    &__emr-documents
      display: flex
      flex-direction: column
      gap: 10px
      margin-top: 20px

    &__document
      display: flex
      align-items: center
      gap: 20px
      padding: 18px 20px
      border: 1px solid #E9E9E9
      border-radius: 4px
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &:hover
        background: #F9F9F9
        border: 1px solid #6F4CEC

      &--active
        background: #F9F9F9
        border: 1px solid #6F4CEC

    &__document-title
      max-width: 165px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      -webkit-touch-callout: none
      -khtml-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none

      @include body-text-2
    
    &__viewer
      width: 100%

    &__viewer-wrapper
      display: flex
      align-items: center
      justify-content: center
      padding: 22px
      min-height: 500px
      background: #F5F7F9
      border-radius: 4px

      &--animated
        position: relative
        overflow: hidden

        &::before
          content: ""
          display: block
          position: absolute
          top: 0
          left: 0
          width: 300px
          height: 100%
          background: rgba(255, 255, 255, .5)
          animation: shine infinite 1s

          @keyframes shine
            0%
              transform: skew(25deg) translateX(-1000px)
            100%
              transform: skew(25deg) translateX(1000px)

    &__viewer-loading
      &::after
        content: ""
        animation: dots infinite 2s linear

        @keyframes dots
          0%
            content: "."
          50%
            content: ".."
          100%
            content: "..."

    &__viewer-content
      width: 100%
      min-height: 700px
      border-radius: 4px
</style>
