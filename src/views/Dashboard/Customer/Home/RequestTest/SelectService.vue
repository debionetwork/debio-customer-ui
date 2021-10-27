<template lang="pug">
  .customer-select-service
    .customer-select-service__title 
      b(v-if="!newLab") Select your preferred Laboratory
      b(v-if="newLab") New Available Lab!

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
          @onSelect="selectService"
          @close="showServiceDetailDialog = false"
          )

</template>

<script>

import { mapState, mapMutations } from "vuex"
import NoLab from "./NoLab.vue"
import MenuCard from "./MenuCard.vue"
import ServiceDetailDialog from "./ServiceDetailDialog.vue"


export default {
  name: "SelectService",

  components: {
    NoLab,
    MenuCard,
    ServiceDetailDialog
  },

  data: () => ({
    showNoLab: false,
    newLab: false,
    serviceList: [],
    showServiceDetailDialog: false
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      services: (state) => state.lab.services,
      rate: (state) => state.rating.rate
    })
  },

  async mounted () {
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
        }
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
        serviceName,
        serviceRate,
        serviceCategory,
        serviceDescription,
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
        durationType
      }

      this.serviceList.push(service)
    }

    if (!this.services.length) {
      this.showNoLab = true
    }

  },

  methods: {

    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),
    
    async getDetailService(service) {
      this.setProductsToRequest(service)
      this.showServiceDetailDialog = true
    },

    async selectService () {
      this.$emit("onSelect")
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
