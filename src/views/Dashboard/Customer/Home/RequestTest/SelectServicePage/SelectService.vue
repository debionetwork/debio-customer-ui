<template lang="pug">
  .customer-select-service
    .customer-select-service__title 
      b Select your preferred Laboratory

    template(v-if="showNoLab")
      NoLab

    .customer-select-service__card(v-if="!showNoLab")
      v-row 
        v-col(
        v-for="(service, i) in serviceList"
        :key="i"
        )
          MenuCard.card(  
            :title="service.serviceName"
            :icon="service.serviceImage"
            :rate="service.serviceRate"
            :countRate="service.countServiceRate"
            :lab-name="service.labName"
            :price="service.price"
            :currency="service.currency"
            :city="service.city"
            :region="service.region"
            @click="getDetailService(service)"
          )
      
      template
        ServiceDetailDialog(
          :show="showServiceDetailDialog"
          @close="showServiceDetailDialog = false"
          )

        AlertDialog(
          :show="showAlert"
          :width="289"
          message="You have Unpaid Order"
          imgPath="alert-circle.png"
          btn-message="Go to Payment History"
          @close="closingDialog"
          @click="toPaymentHistory"
          )

</template>

<script>

import { mapState, mapMutations } from "vuex"
import NoLab from "../NoLab.vue"
import MenuCard from "../MenuCard.vue"
import AlertDialog from "@/common/components/Dialog/AlertDialog"
import ServiceDetailDialog from "../ServiceDetailDialog.vue"
import { lastOrderByCustomer, getOrdersData } from "@/common/lib/polkadot-provider/query/orders.js"


export default {
  name: "SelectService",

  components: {
    NoLab,
    MenuCard,
    ServiceDetailDialog,
    AlertDialog
  },

  data: () => ({
    showNoLab: false,
    newLab: false,
    serviceList: [],
    showServiceDetailDialog: false,
    lastOrder: null,
    showAlert: false
  }),

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      services: (state) => state.lab.services,
      rate: (state) => state.rating.rate
    })
  },

  async mounted () {
    this.getServices()
  },

  methods: {

    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    async getServices () {
      for (let i = 0; i < this.services.length; i++) {

        let {
          id: serviceId,
          lab_id: labId,
          lab_detail: {
            name: labName,
            address: labAddress,
            city,
            region
          },
          info: {
            name: serviceName,
            category: serviceCategory,
            description: serviceDescription,
            image: serviceImage,
            expected_duration: {
              duration,
              duration_type: durationType
            },
            prices_by_currency: [
              {
                currency,
                total_price : price
              }
            ]
          },
          verification_status:  verificationStatus
        } = this.services[i]

        let labRate = 0
        let countRateLab = 0
        let serviceRate = 0
        let countServiceRate = 0
        let detailPrice = this.services[i].info.prices_by_currency[0]

        if (this.rate[labId]) {
          const servicesRate = this.rate[labId].services
          labRate = this.rate[labId].rating_lab
          countRateLab = this.rate[labId].count_rating_lab
          serviceRate = servicesRate[serviceId].rating_service
          countServiceRate = servicesRate[serviceId].count_rating_service
        }

        if (durationType === "WorkingDays") {
          durationType = "Working Days"
        }

        const service = {
          serviceId,
          serviceName,
          serviceRate,
          serviceImage,
          serviceCategory,
          serviceDescription,
          labId,
          labName,
          labRate,
          labAddress,
          price,
          detailPrice,
          currency,
          city,
          region,
          countRateLab,
          countServiceRate,
          duration,
          durationType,
          verificationStatus,
          indexPrice: 0
        }
              
        if (service.verificationStatus === "Verified") {
          this.serviceList.push(service)
        }
      }

      if (!this.serviceList.length) {
        this.showNoLab = true
      }

    },
    
    async getDetailService(service) {
      this.lastOrder = await lastOrderByCustomer(
        this.api,
        this.wallet.address
      )

      const detailOrder = await getOrdersData(this.api, this.lastOrder)

      if (detailOrder.status === "Unpaid") {
        this.showAlert = true
        return
      }

      this.setProductsToRequest(service)
      this.showServiceDetailDialog = true
    },

    closingDialog() {
      this.showAlert = false
    },

    toPaymentHistory () {
      this.$router.push({ name: "customer-payment-details"})
    }
  }
}

</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-select-service
    width: 100%
    height: 100% 
    display: flex
    flex-direction: column
    align-items: center

    &__title
      display: flex
      flex-direction: column
      align-items: center
      margin-top:55px
      @include h6

    &__card
      width:1050px
      margin-top: 68px
      display: flex
      flex-direction: column
      align-items: center

</style>
