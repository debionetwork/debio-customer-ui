<template lang="pug">
  .ga-order-details
    //- TODO: Update dummy data with data value from backend
    ui-debio-modal(
      :show="showModalReject"
      title="Reject Order"
      cta-title="Submit"
      :cta-action="handleSubmitRejection"
      :cta-outlined="false"
      @onClose="handleHideModalReject"
    )
      ui-debio-input(
        :error="isDirty.rejectionTitle && isDirty.rejectionTitle"
        :rules="$options.rules.rejectionTitle"
        variant="small"
        label="Title"
        placeholder="Add Title"
        v-model="rejectionTitle"
        outlined
        block
        validate-on-blur
        @change="handleRejectionTitle"
        @isError="handleError"
      )
      ui-debio-textarea(
        :error="isDirty.rejectionDesc && isDirty.rejectionDesc"
        :rules="$options.rules.rejectionDesc"
        variant="small"
        label="Reason"
        placeholder="Add Description"
        v-model="rejectionDesc"
        validate-on-blur
        outlined
        block
        @change="handleRejectionDesc"
        @isError="handleError"
      )

      .upload-section
        .upload-section__tx-details.d-flex.justify-space-between.background--primary(@mouseleave="handleShowTooltip")
          .upload-section__tx-title
            span Estimated transaction weight
            ui-debio-icon.ml-1(
              :icon="alertIcon"
              size="14"
              stroke
              @mouseenter="handleShowTooltip"
            )
            span.upload-section__tx-tooltip(
              :class="{ 'upload-section__tx-tooltip--show': showTooltip }"
            ) Total fee paid in DBIO to execute this transaction.

          span.upload-section__tx-price {{ txWeight }}
    
    ui-debio-icon.ga-order-details__back-button(
      :icon="chevronLeftIcon"
      size="20"
      color="#5640A5"
      role="button"
      @click="handlePrevious"
      stroke
    )

    .ga-order-details__wrapper
      ui-debio-stepper.ga-order-details__stepper(:items="computeStepper")

      h6.order-section__title {{ computeDetailsTitle }}

      section.order-section
        transition(name="transition-slide-x" mode="out-in")
          Card.order-section__hilight-description.mb-6(
            :title="rejectedOrder ? orderDataDetails.analysis_info.rejectedTitle : 'DNA Result'"
            v-if="rejectedOrder || (step === 3 && orderDataDetails.analysis_info.status !== 'Rejected')"
          )
            p(v-if="step === 3 && !rejectedOrder") {{ orderDataDetails.analysis_info.fileName }}
            p(v-if="hilightDescription")
              | {{ readMore ? hilightDescription : hilightDescription.substr(0, 130) }}
              a(
                v-if="hilightDescription.length >= 130"
                @click="readMore = !readMore"
                role="button"
              ) {{ readMore ? " Read less" : " Read more..." }}

        .order-section__services
          Card.service-details(:title="orderDataDetails.service_info.name")
            p.service-details__description(
              :title="orderDataDetails.service_info.description"
              :aria-label="orderDataDetails.service_info.description"
            ) {{ orderDataDetails.service_info.description }}

            .service-details__time.d-flex.align-center
              ui-debio-icon.mr-2(:icon="timerIcon" size="20" stroke color="#000000")
              span(:aria-label="orderDataDetails.service_info.expectedDuration") {{ orderDataDetails.service_info.expectedDuration }}

            .service-details__detail.d-flex.mt-5
              ui-debio-avatar.service-details__avatar.mr-4(
                src="https://i.pravatar.cc/80"
                alt="orderDataDetails.analyst_info"
                size="80"
              )
              .service-details__analyst
                p.service-details__analyst-name.mb-0(
                  :title="orderDataDetails.analyst_info.name"
                  :aria-label="orderDataDetails.analyst_info.name"
                ) {{ orderDataDetails.analyst_info.name }}

                p.service-details__analyst-specialization.mb-0(
                  :title="orderDataDetails.analyst_info.specialization"
                  :aria-label="orderDataDetails.analyst_info.specialization"
                ) {{ orderDataDetails.analyst_info.specialization }}

                span.service-details__analyst-price {{ orderDataDetails.service_info.price }}

          Card.order-details(title="Order ID")
            .order-details__wrapper
              span.order-details__hash(:title="orderDataDetails.id" :aria-label="orderDataDetails.id") {{ orderDataDetails.id }}
              .order-details__date.mb-4.mt-4
                b.order-details__date-label Date: 
                span.order-details__date-detail {{ orderDataDetails.createdAt }}

              b.order-details__name(
                :title="orderDataDetails.document.title"
                :aria-label="orderDataDetails.document.title"
              ) {{ orderDataDetails.document.title }}
              span.order-details__file(
                :title="orderDataDetails.document.fileName"
                :aria-label="orderDataDetails.document.fileName"
                role="button"
                @click="handleDownloadFile"
              ) {{ orderDataDetails.document.fileName }}

              .order-details__actions.d-flex.justify-space-between(v-if="orderDataDetails.analysis_info.status !== 'Rejected' && step !== 2")
                Button(
                  :disabled="completed"
                  width="130px"
                  outlined
                  color="secondary"
                  @click="handleShowModalReject"
                ) REJECT
                Button(
                  :disabled="completed"
                  width="130px"
                  color="secondary"
                  @click="handleAcceptOrder"
                ) {{ orderDataDetails.analysis_info.status === 'InProgress' ? "Upload" :"ACCEPT" }}

      transition(name="transition-slide-x" mode="out-in")
        section.upload-section.mt-6(v-if="step === 2")
          form.upload-section__forms(@submit.prevent="handleSubmitForms")
            ui-debio-file(
              v-model="document.file"
              :error="isDirty.document && isDirty.document.file"
              :rules="$options.rules.document.file"
              variant="medium"
              label="Upload Genetic Result"
              label-rules="(.pdf, .doc - Maximum fle size is 2MB)"
            )
            ui-debio-textarea(
              v-model="document.description"
              :error="isDirty.document && isDirty.document.description"
              :rules="$options.rules.document.description"
              variant="medium"
              rows="3"
              placeholder="Spider bit me help omg The metabolism analysis uses a blood or saliva sample and body-related data (e.g. weight, physical activity, eating habits) to investigate how"
              label="Comment / Feedback (Optional)"
              outlined
              block
            )

          .upload-section__tx-details.d-flex.justify-space-between(@mouseleave="handleShowTooltip")
            .upload-section__tx-title
              span Estimated transaction weight
              ui-debio-icon.ml-1(
                :icon="alertIcon"
                size="14"
                stroke
                @mouseenter="handleShowTooltip"
              )
              span.upload-section__tx-tooltip(
                :class="{ 'upload-section__tx-tooltip--show': showTooltip }"
              ) Total fee paid in DBIO to execute this transaction.

            span.upload-section__tx-price {{ txWeight }}
          Button(block :loading="isLoading" :disabled="isLoading" @click="handleSubmitForms" color="secondary") SUBMIT
</template>

<script>
import CryptoJS from "crypto-js"	
import Kilt from "@kiltprotocol/sdk-js"
import ipfsWorker from "@/common/lib/ipfs/ipfs-worker"
import cryptWorker from "@/common/lib/ipfs/crypt-worker"

import { u8aToHex } from "@polkadot/util"
import { chevronLeftIcon, timerIcon, alertIcon } from "@/common/icons"
import { validateForms } from "@/common/lib/validate"
import {
  updateStatusOrder,
  rejectOrder,
  rejectOrderFee,
  submitOrderReportFee,
  submitOrderReport
} from "@/common/lib/polkadot-provider/command/genetic-analyst/orders"
import { orderDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/orders"
import { analysisDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/analysis"
import { geneticDataById } from "@/common/lib/polkadot-provider/query/genetic-analyst/geneticData"
import { serviceDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/services"
import { analystDetails } from "@/common/lib/polkadot-provider/query/genetic-analyst/analyst"
import { mapState } from "vuex"
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs"
import { generalDebounce } from "@/common/lib/utils"

import errorMessage from "@/common/constants/error-messages"

import Card from "./Card.vue"
import Button from "@/common/components/Button"

const englishAlphabet = val => (val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? ]+$/.test(val)) || errorMessage.INPUT_CHARACTER("English alphabet")

export default {
  name: "GAOrderDetails",
  mixins: [validateForms],
  
  components: { Card, Button },

  data: () => ({
    chevronLeftIcon,
    timerIcon,
    alertIcon,

    step: 1,
    readMore: false,
    showTooltip: false,
    isLoading: false,
    showModalReject: false,
    publicKey: null,
    secretKey: null,
    rejectionTitle: null,
    rejectionDesc: null,
    txWeight: null,
    documentLink: null,
    orderDataDetails: {
      analysis_info: {},
      document: {},
      analyst_info: {},
      service_info: {}
    },
    hilightDescription: "",
    document: {
      file: null,
      recordLink: null,
      description: null
    },
    steppers: [
      { number: 1, title: "Confirm", active: false },
      { number: 2, title: "Upload Result", active: false },
      { number: 3, title: "Success", active: false }
    ]
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData,
      lastEventData: (state) => state.substrate.lastEventData,
      wallet: (state) => state.substrate.wallet
    }),

    rejectedOrder() {
      return this.orderDataDetails?.analysis_info?.status === "Rejected"
    },

    completed() {
      return this.orderDataDetails?.analysis_info?.status === "ResultReady"
    },

    computeStepper() {
      return this.steppers.map(stepper => {
        if (stepper.number === 1) return {
          ...stepper,
          active: stepper.number === this.step
        } 
        return { ...stepper, active: stepper.number === this.step }
      })
    },

    computeDetailsTitle() {
      const sectionTitles = ["Upload Result", "Completed"]
      const GENETIC_STATUS = {
        REGISTERED: "Open",
        INPROGRESS: "In Progress",
        REJECTED: "Rejected",
        RESULTREADY: "Done"
      }
      
      if (this.step === 1) return this.orderDataDetails?.analysis_info?.status === "Registered"
        ? "Awaiting Order"
        : `${GENETIC_STATUS[this.orderDataDetails?.analysis_info?.status.toUpperCase()]} Order`

      else return sectionTitles[this.step - 2]
    }
  },

  watch: {
    mnemonicData(val) {
      if (val) this.initialDataKey()
    },

    lastEventData: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function(val) {
        if (val?.section === "geneticAnalysisOrders" || val?.section === "geneticAnalysis") await this.prepareData(this.$route.params.id)
      }, 100)
    },

    document: {
      deep: true,
      immediate: true,
      handler: generalDebounce(async function() {
        await this.calculateDocumentFee()
      }, 500)
    }
  },

  async created() {
    if (this.mnemonicData) this.initialDataKey()
    await this.prepareData(this.$route.params.id)
  },

  rules: {
    rejectionTitle: [
      val => !!val || errorMessage.REQUIRED,
      val => val && val.length < 50 || errorMessage.MAX_CHARACTER(50),
      englishAlphabet
    ],
    rejectionDesc: [
      val => !!val || errorMessage.REQUIRED,
      val => val && val.length < 255 || errorMessage.MAX_CHARACTER(255),
      englishAlphabet
    ],
    document: {
      file: [
        val => !!val || errorMessage.REQUIRED,
        val => (val && val.size < 2000000) || errorMessage.FILE_SIZE(2),
        val => (val && (val.type === "application/pdf" || val.type === "application/msword" || val.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) || errorMessage.FILE_FORMAT("PDF/DOC/DOCX")
      ],
      description: [
        val => !!val || errorMessage.REQUIRED,
        val => val && val.length < 255 || errorMessage.MAX_CHARACTER(255),
        englishAlphabet
      ]
    }
  },

  methods: {
    initialDataKey() {
      const cred = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))

      this.publicKey = u8aToHex(cred.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(cred.boxKeyPair.secretKey)
    },
    
    async prepareData(id) {
      try {
        const data = await orderDetails(this.api, id)
        const serviceData = await serviceDetails(this.api, data.serviceId)
        const analystData = await analystDetails(this.api, data.sellerId)
        const analysisData = await analysisDetails(this.api, data.geneticAnalysisTrackingId)
        const geneticData = await geneticDataById(this.api, data.geneticDataId)

        this.orderDataDetails = {
          ...data,
          analysis_info: {
            ...analysisData,
            fileName: analysisData.reportLink.replaceAll("%20", " ").split("/").pop()
          },
          document: {
            ...geneticData,
            fileName: geneticData.reportLink.replaceAll("%20", " ").split("/").pop()
          },
          createdAt: new Date(+data.createdAt.replaceAll(",", "")).toLocaleString("en-GB", {
            day: "numeric",
            year: "numeric",
            month: "short"
          }),
          analyst_info: {
            ...analystData.info,
            id: analystData.accountId,
            name: `${analystData.info.firstName} ${analystData.info.lastName}`
          },
          service_info: {
            ...serviceData,
            ...serviceData.info,
            price: `
              ${Number(this.web3.utils.fromWei(String(serviceData.info.pricesByCurrency[0].priceComponents[0].value.replaceAll(",", "")), "ether")).toFixed(4)}
              ${serviceData.info.pricesByCurrency[0].currency}
            `,
            expectedDuration: `${serviceData.info.expectedDuration.duration} ${serviceData.info.expectedDuration.durationType}`
          }
        }

        if (this.orderDataDetails?.analysis_info?.status === "Rejected") this.hilightDescription = this.orderDataDetails.analysis_info.rejectedDescription
        if (this.orderDataDetails?.analysis_info?.status === "InProgress") {
          const txWeight = await submitOrderReportFee(
            this.api,
            this.wallet,
            this.orderDataDetails.geneticAnalysisTrackingId,
            this.document.recordLink,
            this.document.description
          )

          this.txWeight = "Calculating..."
          this.txWeight = `${Number(this.web3.utils.fromWei(String(txWeight.partialFee), "ether")).toFixed(4)} DBIO`
          this.step = 2
        }
        if (this.completed) {
          this.hilightDescription = this.orderDataDetails?.analysis_info?.comment
          this.step = 3
        }
      } catch (e) {
        console.error(e);
      }
    },
    
    handlePrevious() {
      if (this.step === 1 || (this.step === 3 && this.completed)) {
        this.$router.go(-1)
        return
      }

      else { this.step-- }
    },

    async handleAcceptOrder() {
      if (this.orderDataDetails.analysis_info?.status === "InProgress") {
        this.step = 2
        return
      }

      try {
        await updateStatusOrder(this.api, this.wallet, this.orderDataDetails.geneticAnalysisTrackingId, "InProgress")
        await this.calculateDocumentFee()

        this.step = 2
      } catch (e) {
        console.error(e)
      }
    },

    async handleShowModalReject() {
      await this.calculateRejectFee()

      this.showModalReject = true
    },

    async handleHideModalReject() {
      this.showModalReject = false
      this.txWeight = null
    },

    async handleSubmitRejection() {
      try {
        await rejectOrder(this.api, this.wallet, this.orderDataDetails.geneticAnalysisTrackingId, this.rejectionTitle, this.rejectionDesc)

        this.showModalReject = false
      } catch (e) {
        console.error(e);
      } finally {
        this.txWeight = null
      }
    },

    async handleRejectionTitle() {
      await this.calculateRejectFee()
    },

    async handleRejectionDesc() {
      await this.calculateRejectFee()
    },

    async calculateRejectFee() {
      const txWeight = await rejectOrderFee(this.api, this.wallet, this.orderDataDetails.geneticAnalysisTrackingId, this.rejectionTitle, this.rejectionDesc)
      this.txWeight = "Calculating..."
      this.txWeight = `${Number(this.web3.utils.fromWei(String(txWeight.partialFee), "ether")).toFixed(4)} DBIO`
    },

    async calculateDocumentFee() {
      const txWeight = await submitOrderReportFee(
        this.api,
        this.wallet,
        this.orderDataDetails.geneticAnalysisTrackingId,
        this.document.recordLink,
        this.document.description
      )

      this.txWeight = "Calculating..."
      this.txWeight = `${Number(this.web3.utils.fromWei(String(txWeight.partialFee), "ether")).toFixed(4)} DBIO`
    },

    async handleDownloadFile() {
      const fileName = this.orderDataDetails.document.fileName
      const path = `${this.orderDataDetails.document.reportLink.split("/").slice(4, 5).join("")}/${fileName}`
      await Promise.all[
        downloadDecryptedFromIPFS(
          path,
          this.secretKey,
          this.publicKey,
          fileName,
          "application/pdf"
        )
      ]
    },

    async handleSubmitForms() {
      this._touchForms("document")
      const { description: docDescription, file: docFile } = this.isDirty?.document
      if (docDescription || docFile) return

      try {
        this.isLoading = true
        await this.processFile()
      } catch (e) {
        this.isLoading = false
        console.error(e)
      }
    },

    async processFile() {
      const context = this
      const fr = new FileReader()
      const { file } = this.document

      fr.onload = async function() {
        try {
          const encrypted = await context.encrypt({
            text: fr.result,
            fileType: file.type,
            fileName: file.name
          })

          await context.upload({
            encryptedFileChunks: encrypted.chunks,
            fileName: encrypted.fileName,
            fileType: encrypted.fileType
          })

          await submitOrderReport(
            context.api,
            context.wallet,
            context.orderDataDetails.geneticAnalysisTrackingId,
            context.document.recordLink,
            context.document.description
          )

          await updateStatusOrder(context.api, context.wallet, context.orderDataDetails.geneticAnalysisTrackingId, "ResultReady")
          context.step = 3
        } catch(e) {
          console.error(e)
        }
      }

      fr.readAsArrayBuffer(file)
    },

    async encrypt({ text, fileType, fileName }) {
      const context = this
      const arrChunks = []
      let chunksAmount

      const pair = {
        secretKey: this.secretKey,
        publicKey: this.publicKey
      }

      return await new Promise((resolve, reject) => {
        try {
          cryptWorker.workerEncryptFile.postMessage({ pair, text, fileType }) // Access this object in e.data in worker
          cryptWorker.workerEncryptFile.onmessage = async (event) => {
            if (event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            context.encryptProgress = (arrChunks.length / chunksAmount) * 100

            if (arrChunks.length === chunksAmount) {
              resolve({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType
              })
            }
          }
        } catch (err) {
          reject(new Error(err.message))
        }
      })
    },

    async upload({ encryptedFileChunks, fileName, fileType }) {
      const chunkSize = 30 * 1024 * 1024 // 30 MB
      let offset = 0
      const data = JSON.stringify(encryptedFileChunks)
      const blob = new Blob([data], { type: fileType })
      const newBlobData = new File([blob], fileName)

      const uploaded = await new Promise((resolve, reject) => {
        try {
          const fileSize = newBlobData.size
          do {
            let chunk = newBlobData.slice(offset, chunkSize + offset)
            ipfsWorker.workerUpload.postMessage({
              seed: chunk.seed,
              file: newBlobData
            })
            offset += chunkSize
          } while (chunkSize + offset < fileSize)

          let uploadSize = 0
          ipfsWorker.workerUpload.onmessage = async (event) => {
            uploadSize += event.data.data.size

            if (uploadSize >= fileSize) {
              resolve({
                fileName: fileName,
                fileType: fileType,
                collection: event.data
              })
            }
          }
        } catch (err) {
          reject(new Error(err.message))
        }
      })

      const path = `${uploaded.collection.data.ipfsFilePath}/${uploaded.fileName}`

      this.document.recordLink = `https://ipfs.io/ipfs/${path}`
    },

    handleShowTooltip(e) {
      if (e.type === "mouseenter") {
        this.showTooltip = true
      } else {
        this.showTooltip = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .ga-order-details
    padding: 15px 15px 80px
    background: #ffffff
    border-radius: 4px

    &__wrapper
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

    &__back-button
      width: max-content
      border-radius: 4px
      padding: 5px
      margin-bottom: 1rem
      background: #F5F7F9

    &__stepper
      margin-bottom: 40px

    &::v-deep
      .ui-debio-modal__card
        width: 400px

  .order-section
    width: 100%
    max-width: 704px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    
    &__hilight-description
      width: 100%

    &__title
      color: #595959
      margin-bottom: 40px
      @include h6-opensans

    &__services
      display: flex
      gap: 24px

  .upload-section,
  .upload-section__forms
    display: flex
    flex-direction: column
    gap: 16px
    width: 100%
    max-width: 704px

  .upload-section
    &__tx-title,
    &__tx-price
      @include body-text-3

    &__tx-title
      position: relative
      display: flex
      align-items: center

    &__tx-tooltip
      max-width: 143px
      padding: 10px
      position: absolute
      top: 35px
      z-index: 10
      background: #fff
      border: 1px solid #D3C9D1
      right: -120px
      transition: all .3s ease-in-out
      visibility: hidden
      opacity: 0
      @include tiny-reg

      &::after
        position: absolute
        content: ""
        display: block
        top: -20px
        height: 20px
        border-color: transparent transparent #FFF transparent
        border-style: solid
        border-width: 8px

      &::before
        position: absolute
        content: ""
        display: block
        top: -21px
        height: 20px
        border-color: transparent transparent #D3C9D1 transparent
        border-style: solid
        border-width: 8px

      &--show
        opacity: 1
        visibility: visible

    &__tx-price
      color: #444444
    
  .service-details
    &__description
      width: 280px
      font-size: 14px
      text-align: justify
      display: -webkit-box
      -webkit-line-clamp: 4
      -webkit-box-orient: vertical  
      overflow: hidden

    &__analyst-name,
    &__analyst-specialization
      overflow: hidden
      text-overflow: ellipsis
      white-space: pre
      max-width: 170px

    &__analyst
      width: 100%
      position: relative

    &__analyst-name
      @include button-2

    &__analyst-specialization
      @include body-text-2

    &__analyst-price
      position: absolute
      bottom: 0
      right: 0
      color: #F006CB
      @include body-text-3-opensans-medium

  .transition-slide-x
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter
      opacity: 0
      transform: translateX(1.563rem)

    &-leave-to
      opacity: 0
      transform: translateX(-12.813rem)

  .order-details
    &__wrapper
      display: flex
      flex-direction: column

    &__actions
      margin-top: 53px

    &__hash,
    &__name,
    &__file
      overflow: hidden
      text-overflow: ellipsis
      max-width: 279px

    &__name
      white-space: pre
      @include button-2

    &__file
      width: max-content
      margin-top: 10px
      font-size: 14px
      color: #5640A5

    &__date-label
      @include button-2

    &__date-detail
      @include body-text-2
</style>
