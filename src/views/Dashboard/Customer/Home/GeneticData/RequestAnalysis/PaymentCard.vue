<template lang="pug">
  v-card.customer-analysis-payment-card
    .customer-analysis-payment-card__data
      .customer-analysis-payment-card__data-service
        .customer-analysis-payment-card__text-label Genetic Data Name
        .customer-analysis-payment-card__data-text {{ geneticData.title }}

      .customer-analysis-payment-card__text-label Payment
      div(v-if="!isCreated")
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Account Balance
          b.customer-analysis-payment-card__data-text {{ formatBalance(walletBalance) }}  {{ service.priceDetail[0].currency }}
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Service Price
          b.customer-analysis-payment-card__data-text(:style="setStyleColor") {{ formatBalance(service.priceDetail[0].totalPrice) }} {{ service.priceDetail[0].currency }}
        .customer-analysis-payment-card__rate ( {{ formatPriceInUsd(service.priceDetail[0].totalPrice) }} USD )


        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-tx-weight Estimated transaction weight
            v-tooltip.visible(bottom )
              template(v-slot:activator="{ on, attrs }")
                v-icon.staking-dialog__trans-weight-icon(
                  style="font-size: 12px;"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                ) mdi-alert-circle-outline
              span(style="font-size: 10px;") Total fee paid in DBIO to execute this transaction.
          .customer-analysis-payment-card__data-tx-weight {{ Number(txWeight).toFixed(4) }} DBIO

        Button.customer-analysis-payment-card__button(
          :disabled="isDeficit"
          width="280"
          height="35"
          color="secondary"
          @click="onSubmit"
        ) Pay Now

      div(v-if="isCreated")
        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Date
          .customer-analysis-payment-card__data-text {{ createdDate }}

        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Status
          b.customer-analysis-payment-card__data-text {{ orderStatus }}

        .customer-analysis-payment-card__amount
          .customer-analysis-payment-card__data-text Service Price
          b.customer-analysis-payment-card__data-text {{ orderPrice }} {{ orderCurrency }}
        .customer-analysis-payment-card__rate ( {{ orderPriceInUsd }} USD )

      ImportantDialog(
        @close="showInformation = false"
        @click="onSubmit"
        :show="showInformation"
      )

      ConfirmationDialog(
        :show="showCancelDialog"
        :txWeight="Number(txWeight).toFixed(4)"
        :loading="isLoading"
        title="Cancel"
        btnMessage="Cancel Order"
        message="By cancel this service, your file might not be able to be analyzed, and your balance will be refunded"
        @click="cancelOrder"
        @close="showCancelDialog = false"
      )

      PaymentDialog(
        :show="isLoading"
      )

</template>

<script>

import { mapState } from "vuex"
import CryptoJS from "crypto-js"
import Kilt from "@kiltprotocol/sdk-js"
import { u8aToHex } from "@polkadot/util"
import cryptWorker from "@/common/lib/ipfs/crypt-worker"
import Button from "@/common/components/Button"
import ConfirmationDialog from "@/views/Dashboard/Customer/Home/MyTest/ConfirmationDialog"
import ImportantDialog from "./Information.vue"
import { getDbioBalance, setGeneticAnalysisPaid } from "@/common/lib/api"
import {
  createGeneticAnalysisOrder,
  cancelGeneticAnalysisOrder,
  getCreateGeneticAnalysisOrderFee
} from "@/common/lib/polkadot-provider/command/genetic-analysis-orders"
import { lastAnlysisOrderByCustomer, queryGeneticAnalysisOrders } from "@/common/lib/polkadot-provider/query/genetic-analysis-orders"
import { queryGeneticAnalysisStorage } from "@/common/lib/polkadot-provider/query/genetic-analysis"
import {downloadFile, uploadFile, getFileUrl } from "@/common/lib/pinata"
import { queryGeneticAnalysts } from "@/common/lib/polkadot-provider/query/genetic-analysts"
import PaymentDialog from "@/common/components/Dialog/PaymentDialog"

export default {
  name: "PaymentCard",

  components: { Button, ImportantDialog, ConfirmationDialog, PaymentDialog },

  props: {
    geneticData: Object,
    service: Object
  },

  data: () => ({
    showInformation: false,
    rate: null,
    isDeficit : false,
    txWeight: 0,
    isCreated: false,
    orderId: null,
    geneticOrderDetail: null,
    createdDate: null,
    orderStatus: null,
    orderPrice: null,
    orderCurrency: null,
    orderPriceInUsd: null,
    showCancelDialog: false,
    isLoading: false,
    trackingId: null,
    isRegistered: true,
    newFile: null,
    geneticLink: null,
    links: [],
    customerBoxPublicKey: null
    // showLoading: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      web3: (state) => state.metamask.web3,
      mnemonicData: (state) => state.substrate.mnemonicData,
      walletBalance: (state) => state.substrate.walletBalance,
      selectedGeneticData: (state) => state.geneticData.selectedData,
      selectedAnalysisService: (state) => state.geneticData.selectedAnalysisSerivice,
      lastEventData: (state) => state.substrate.lastEventData
    }),

    setStyleColor() {
      if (this.isDeficit) {
        return "color: red"
      } else {
        return "color: black"
      }
    }
  },

  async mounted() {
    await this.getUsdRate()
    await this.getTxWeight()

    if (this.$route.params.id) {
      this.isCreated = true
      this.orderId = this.$route.params.id

      await this.getGeneticAnalysisOrderDetail()
      await this.getAnalysisStatus()
    }

    if (Number(this.walletBalance) < Number((this.service.priceDetail[0].totalPrice).replaceAll(",", ""))) {
      this.isDeficit = true
    }
  },

  methods: {
    getCustomerPublicKey() {
      const identity = Kilt.Identity.buildFromMnemonic(this.mnemonicData.toString(CryptoJS.enc.Utf8))
      this.publicKey = u8aToHex(identity.boxKeyPair.publicKey)
      this.secretKey = u8aToHex(identity.boxKeyPair.secretKey)
      return u8aToHex(identity.boxKeyPair.publicKey)
    },

    async onSubmit() {
      this.$emit("click")
      this.customerBoxPublicKey = await this.getCustomerPublicKey()
      const links = JSON.parse(this.selectedGeneticData.reportLink)

      let download = []
      let fileType 
      for (let i = 0; i < links.length; i++) {
        const { type, data } = await downloadFile(links[i], true)
        fileType = type
        download.push(data)
      }

      let arr = []
      for (let i = 0; i < download.length; i++) {
        let { box, nonce } = download[i].data
        box = Object.values(box) // Convert from object to Array
        nonce = Object.values(nonce) // Convert from object to Array

        const toDecrypt = {
          box: Uint8Array.from(box),
          nonce: Uint8Array.from(nonce)
        }

        console.log("Decrypting...")
        const decryptedObject = await Kilt.Utils.Crypto.decryptAsymmetric(
          toDecrypt,
          this.publicKey,
          this.secretKey
        )
        arr = [...arr, ...decryptedObject]
      }
      console.log("Decrypted!")

      const unit8Arr = new Uint8Array(arr)
      const blob = new Blob([unit8Arr], { type: fileType })
      this.file = new File([blob], this.selectedGeneticData.id)

      const dataFile = await this.setupFileReader(this.file)      
      await this.upload({
        encryptedFileChunks: dataFile.chunks,
        fileName: dataFile.fileName,
        fileType: fileType
      })
      this.isLoading = false
    },

    setupFileReader(file) {
      return new Promise((res, rej) => {
        const context = this
        const fr = new FileReader()
        fr.onload = async function () {
          try {
            const encrypted = await context.encrypt({
              text: fr.result,
              fileType: file.type,
              fileName: file.name
            })

            const { chunks, fileName, fileType } = encrypted
            const dataFile = {
              title: "title",
              description: "description",
              file,
              chunks,
              fileName,
              fileType,
              createdAt: new Date().getTime()
            }
            res(dataFile)
          } catch (e) {
            console.error(e)
          }
        }
        fr.onerror = rej
        fr.readAsArrayBuffer(file)
      })
    },

    async encrypt({ text, fileType, fileName}) {
      console.log("encrypting..")
      const analystPublicKey = await this.getAnalystPublicKey()
      const context = this
      const arrChunks = []
      let chunksAmount
      const pair = {
        secretKey: this.secretKey,
        publicKey: analystPublicKey
      }

      return await new Promise((res, rej) => {
        try {
          cryptWorker.workerEncryptFile.postMessage({
            pair,
            text,
            fileType
          })

          cryptWorker.workerEncryptFile.onmessage = async (event) => {
            if (event.data.chunksAmount) {
              chunksAmount = event.data.chunksAmount
              return
            }

            arrChunks.push(event.data)
            context.encryptProgress = (arrChunks.length / chunksAmount) * 100

            if (arrChunks.length === chunksAmount ) {
              res({
                fileName: fileName,
                chunks: arrChunks,
                fileType: fileType
              })
            }
          }
          console.log("encrypted")
        } catch (e) {
          rej(new Error(e.message))
        }
      })

    },

    async upload({ encryptedFileChunks, fileName, fileType }) {
      for (let i = 0; i < encryptedFileChunks.length; i++) {
        const data = JSON.stringify(encryptedFileChunks[i]) // not working if the size is large
        const blob = new Blob([data], { type: fileType })

        // UPLOAD TO PINATA API
        const result = await uploadFile({
          title: fileName,
          type: fileType,
          file: blob
        })
        const link = await getFileUrl(result.IpfsHash)
        this.links.push(link)
      }

      this.geneticLink = JSON.stringify(this.links)
      if (this.geneticLink) {
        await this.createOrder()
      }
    },

    async createOrder() {
      const priceIndex = 0
      await createGeneticAnalysisOrder(
        this.api,
        this.wallet,
        this.selectedGeneticData.id,
        this.selectedAnalysisService.serviceId,
        priceIndex,
        this.customerBoxPublicKey,
        this.geneticLink,
        this.setPaid
      )
    },

    async setPaid() {
      const lastOrder = await lastAnlysisOrderByCustomer(this.api, this.wallet.address)
      this.$router.push({ name: "customer-request-analysis-success", params: {id: lastOrder} })
      await setGeneticAnalysisPaid(lastOrder)
    },

    async getGeneticAnalysisOrderDetail () {
      this.geneticOrderDetail = await queryGeneticAnalysisOrders(this.api, this.orderId)
      this.createdDate = this.formatDate(this.geneticOrderDetail.createdAt)
      this.orderStatus = this.geneticOrderDetail.status
      this.orderPrice = this.formatBalance(this.geneticOrderDetail.prices[0].value)
      this.orderCurrency = this.geneticOrderDetail.currency
      this.orderPriceInUsd = this.formatPriceInUsd(this.geneticOrderDetail.prices[0].value)
      this.trackingId = this.geneticOrderDetail.geneticAnalysisTrackingId
    },

    async getAnalystPublicKey () {
      const id = this.service.analystId
      const analystDetail = await queryGeneticAnalysts(this.api, id)
      const analystPublicKey = analystDetail.info.boxPublicKey
      return analystPublicKey
    },

    formatBalance(val) {
      const formatedBalance = this.web3.utils.fromWei(String(val.replaceAll(",", "")), "ether")
      return Number(formatedBalance).toFixed(4)
    },

    formatPriceInUsd(val) {
      const priceInUsd = Number(val.replaceAll(",", "") * this.rate.dbioToUsd )
      const formatedBalance = this.web3.utils.fromWei(String(priceInUsd), "ether")
      return Number(formatedBalance).toFixed(4)
    },

    formatDate(date) {
      const formattedDate = new Date(parseInt(date.replace(/,/g, ""))).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      })
      return formattedDate
    },

    async getUsdRate() {
      this.rate = await getDbioBalance()
    },

    async getTxWeight() {
      const txWeight = await getCreateGeneticAnalysisOrderFee(this.api, this.wallet)
      this.txWeight = this.web3.utils.fromWei(String(txWeight.partialFee), "ether")
    },

    async cancelOrder() {
      await cancelGeneticAnalysisOrder(this.api, this.wallet, this.orderId)
    },

    async getAnalysisStatus() {
      const details = await queryGeneticAnalysisStorage(this.api, this.trackingId)
      if (details.status !== "Registered") {
        this.isRegistered = false
      }
    }
  },

  watch: {
    async lastEventData(val) {
      if(val !== null) {
        const dataEvent = JSON.parse(val.data.toString())
        if (dataEvent[0].customerId === this.wallet.address) {
          if(val.method === "GeneticAnalysisOrderPaid") {
            await this.getGeneticAnalysisOrderDetail()
          }
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .customer-analysis-payment-card
    margin-top: 0 !important
    width: 340px
    height: 320px

    &__data
      padding: 27px 30px

    &__data-service
      margin-bottom: 24px

    &__text-label
      @include button-2

    &__data-text
      margin-top: 16px
      @include new-body-text-2

    &__data-tx-weight
      margin-top: 16px
      @include body-text-3

    &__button
      margin-top: 16px

    &__amount
      display: flex
      align-items: center
      justify-content: space-between

    &__rate
      display: flex
      align-items: center
      justify-content: flex-end
      @include tiny-reg

  .dialog-loading
    width: 500
    height: 450

    &__card
      background-color: white
      padding-bottom: 51px

</style>
