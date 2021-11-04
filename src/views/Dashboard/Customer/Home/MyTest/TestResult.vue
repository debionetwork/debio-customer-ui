<template lang="pug">
  div
    v-container
      ui-debio-card(width="100%")
        v-row.resultBody
          v-col(cols="12" md="9")
            ui-debio-card(width="100%" height="100%" class="mt-2")
              template
                v-progress-linear(
                  v-if="resultLoading"
                  indeterminate
                  color="primary"
                )
                v-card-text
                  embed(
                    :src="reportResult"
                    type="application/pdf"
                    v-if="isDataPdf"
                    scrolling="auto"
                    height="500px"
                    width="100%"
                  )
                  div
                    span {{dummyResult.title}} 
                    br
                  div
                    span {{dummyResult.subTitle}}
                  div
                    span {{dummyResult.content}}
          v-col(cols="12" md="3")
            div.buttonSection(v-for="(file, index) in files" :key="file.name")
              ui-debio-card(
                :title="file.fileTitle"
                :sub-title="file.fileSubTitle"
                tiny-card
                with-icon
                @click="actionDownload(file.fileType, index)"
              )
                ui-debio-icon(
                  slot="icon"
                  size="33"
                  :icon="downloadIcon"
                  stroke
                  color="#c400a5"
                )

            ui-debio-card(
              class="mt-2"
              tiny-card
              with-icon
              title="Rating"
              sub-title="Help us improve your test experience by rating this service"
              @click="actionRating"
              )
                ui-debio-icon(
                  size="33"
                  slot="icon"
                  :icon="starIcon"
                  stroke
                  color="#c400a5"
                )

      ui-debio-modal(
        :show="showModalRating"
        :cta-action="submitRating"
        title="Please tell us about your experience!"
        cta-title="Submit"
        @onClose="showModalRating = false"
      )
        template
          ui-debio-rating(
            :size="33"
            :total-rating="5"
            :with-reviewers="false"
            :interactive="true"
            @input="getRating"
          )

      ui-debio-modal(
        :show="showModal"
        :icon="checkCircleIcon"
        :cta-action="closeModal"
        :title="modalTitle"
        cta-title="OK"
        @onClose="showModal = false"
      )

</template>

<script>
import ipfsWorker from "@/common/lib/ipfs/ipfs-worker";
import { mapState } from "vuex";
import { queryDnaTestResults } from "@/common/lib/polkadot-provider/query/genetic-testing";
import { queryLabsById } from "@/common/lib/polkadot-provider/query/labs";
import { getOrdersDetail } from "@/common/lib/polkadot-provider/query/orders";
import { queryServicesById } from "@/common/lib/polkadot-provider/query/services";
import { hexToU8a } from "@polkadot/util";
import { submitRatingOrder } from "@/common/lib/rating";
import { downloadIcon, debioIcon, creditCardIcon, starIcon, checkCircleIcon } from "@/common/icons"
import Modal from "@/common/components/Modal"
import Rating from "@/common/components/Rating"
export default {
  name: "TestResult",
  components: { 
    Modal,
    Rating
  },
  data: () => ({
    privateKey: "",
    publicKey: "",
    specimentNumberInput: "",
    ownerAddress: "",
    speciment: {},
    services: [],
    rating: 0,
    lab: null,
    order: null,
    isDataPdf: false,
    serviceName: "",
    serviceCategory: "",
    downloadIcon,
    debioIcon,
    creditCardIcon,
    starIcon,
    checkCircleIcon,
    resultLoading: false,
    showModal: false,
    showModalRating: false,
    files: [],
    dataType: "report",
    fileDownloadIndex: 0,
    baseUrl: "https://ipfs.io/ipfs/",
    dummyResult: {
      title: "Whole Genome Sequencing Test Report",
      subTitle: "GSI Lab, 5 July 2021",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  }),

  async mounted() {
    this.resultLoading = true;
    this.specimentNumberInput = this.$route.params.dna_sample_tracking_id;
    this.privateKey = hexToU8a(this.mnemonicData.privateKey);
    this.ownerAddress = this.wallet.address;
    await this.getSpciments();
    await this.getLabServices();
    await this.getFileUploaded();
    await this.decryptWallet();
  },

  methods: {
    async getSpciments() {
      try {
        console.log(this.speciment, this.specimentNumberInput, this.api);
        this.speciment = await queryDnaTestResults(
          this.api,
          this.specimentNumberInput
        );
      } catch (error) {
        this.resultLoading = false;
        console.log(error);
      }
    },

    async getLabServices() {
      try {
        this.lab = await queryLabsById(this.api, this.speciment.lab_id);
        this.order = await getOrdersDetail(this.api, this.speciment.order_id);
        this.ownerAddress = this.order.customer_eth_address;
        this.services = await queryServicesById(this.api, this.order.service_id);

        this.serviceCategory = this.services.info.category;
        this.serviceName = this.services.info.name;
      } catch (error) {
        this.resultLoading = false;
        this.services = [];
      }
    },

    async getFileUploaded() {
      try {
        if (this.speciment.report_link !== "") {
          this.files.push({
            fileType: "report",
            fileName: this.serviceName + " Report",
            fileLink: this.speciment.report_link,
            fileTitle: "Download Report",
            fileSubTitle: "Download Your Test Report"
          });
        }

        if (this.speciment.result_link !== "") {
          this.files.push({
            fileType: "result",
            fileName: this.serviceName + " Result",
            fileLink: this.speciment.result_link,
            fileTitle: "Download Raw Data",
            fileSubTitle: "Download Your Genomic Data"
          });
        }
      } catch (error) {
        this.resultLoading = false;
      }
    },

    async decryptWallet() {
      try {
        this.publicKey = this.lab.info.box_public_key;
        if (this.actionType === "result") {
          await this.parseResult();
        }

        if (this.actionType === "download") {
          await this.downloadDecryptedFromIPFS();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async parseResult() {
      try {
        const path = this.files[0].fileLink.replace(this.baseUrl, "");
        const secretKey = this.privateKey;
        const publicKey = this.lab.info.box_public_key;
        
        const pair = {
          secretKey,
          publicKey
        };

        const typeFile = "text/plain";
        const channel = new MessageChannel();
        channel.port1.onmessage = ipfsWorker.workerDownload;
        ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
          channel.port2
        ]);

        ipfsWorker.workerDownload.onmessage = (event) => {
          const regexMatchPdf = /^(data:application\/\pdf)/g 
          const isDataPdf = regexMatchPdf.test(event.data);
          this.isDataPdf = isDataPdf;
          
          this.result = event.data;
          this.resultLoading = false;
        };
      } catch (error) {
        this.resultLoading = false;
      }
    },

    async downloadDecryptedFromIPFS() {
      try {
        const channel = new MessageChannel();
        channel.port1.onmessage = ipfsWorker.workerDownload;
        const path = this.files[this.fileDownloadIndex].fileLink.replace(
          this.baseUrl,
          ""
        );

        const secretKey = this.privateKey;
        const publicKey = this.publicKey;
        const pair = {
          secretKey,
          publicKey
        };
        const typeFile = "text/plain";
      
        ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
          channel.port2
        ]);

        ipfsWorker.workerDownload.onmessage = (event) => {
          this.download(
            event.data,
            this.files[this.fileDownloadIndex].fileName
          );
        };
      } catch (error) {
        console.log(error);
      }
    },

    async download(data, fileName) {
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents");
      const a = document.createElement("a");
      a.download = fileName;
      a.href = this.isDataPdf ? data : window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },

    async actionDownload(type, index) {
      this.dataType = type;
      this.fileDownloadIndex = index;
      await this.decryptWallet();
    },

    actionRating() {
      console.log("rating")
      this.showModalRating = true
    },

    closeModal(){
      this.$emit("showModal", false)
      this.showModal = false
    },

    getRating(stars) {
      this.rating = stars
    },

    async submitRating() {
      try {
        const res = await submitRatingOrder(
          this.speciment.lab_id,
          this.order.service_id,
          this.speciment.order_id,
          this.order.customer_id,
          this.rating
        );

        console.log(res);
        this.showModalRating = false
        this.showModal = true
      } catch (error) {
        this.showModalRating = false
        this.showModal = true
      }
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData
    }),

    reportResult() {
      if (this.dialog) {
        return "";
      }
      if (this.resultLoading) {
        return "Decrypting report..";
      }
      console.log("result", this.result);
      return this.result ? this.result : "No report available for this result";
    },

    modalTitle() {
      return `Thank you! ${"\n"} Your feedback has been sent`
    }
  }
}
</script>

<style lang="sass">
  .resultBody
    margin: 25px 0 0 0
  .buttonSection
    margin: 8px 0 45px 0
  .v-card__text
    height: 500px

</style>
