<template lang="pug">
  .customer-select-lab
    .customer-select-lab__wrapper
      .customer-select-lab__nav
        div.text-center Request a Test
        

      .customer-select-lab__main
        .customer-select-lab__stepper
          ui-debio-stepper( 
            :items="stepperItems"
            with-line-indicator
          )
      
        .customer-select-lab.mt-10(align="center" ) 
          b Select your preferred Laboratory

      template(v-if="showNoLab")
        NoLab
      
      template(v-if="!showNoLab")
        v-row
          v-col(
            cols="12"
            xl="4"
            lg="12"
            v-for="(lab, i) in labs"
            :key="i"
          )
            MenuCard.card-test(
              :avatar="lab._source.info.profile_image"
              :title="lab._source.info.name"
              :address="lab._source.info.address"
              :sub-title="getServiceName(lab._source.services)"
              :description="getServiceDescription(lab._source.services)"
              :price="getServicePrice(lab._source.services)"
              :service-image="getServiceImage(lab._source.services)"
              @click="selectLab(lab, lab._source.services)"
            )

        template
          ServiceDetailDialog(
            :show="showServiceDetailDialog"
            :title="category"
            icon="mdi-dna"
            description="By testing your DNA you can find the best methods for exercising according to your gen behaviour."
            duration=14
            @close="showServiceDetailDialog = false"
          )

        
</template>

<script>

import { mapState, mapMutations } from "vuex"
import MenuCard from "../MenuCard.vue"
import Button from "@/common/components/Button"
import NoLab from "./NoLab"
import RequestTestNav from "../RequestTestNav"
import ServiceDetailDialog from "./ServiceDetailDialog"

export default {
  name: "SelectLab",
  components: {
    MenuCard,
    Button,
    NoLab,
    RequestTestNav,
    ServiceDetailDialog
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: "Select a location and Service Category", active: false },
      { number: 2, title: "Select a lab", active: true },
      { number: 3, title: "Checkout & Payment", active: false },
      { number: 4, title: "Success", active: false }
    ],
    showNoLab: false,
    showServiceDetailDialog: false
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs
    })
  },

  async mounted () {
    console.log("labs", this.labs)
    if (!this.labs.length) {
      this.showNoLab = true
    }
  },

  methods: {

    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS"
    }),

    getServiceName(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category === this.category) {
          return services[i].info.name
        }
      }
    }, 

    getServiceDescription(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category === this.category) {
          return services[i].info.description
        }
      }
    },

    getServicePrice(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category === this.category) {
          return services[i].info.prices_by_currency[0].total_price
        }
      }
    },

    getServiceImage(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category === this.category) {
          return services[i].info.image
        }
      }
    },

    getServiceId(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category === this.category) {
          return services[i].info.account_id
        }
      }
    },
    
    async selectLab(lab, services) {

      let selectedProduct
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category === this.category[0]) {
          selectedProduct = services[i]
        }
      }
      
      this.setProductsToRequest(selectedProduct)
      this.setLabToRequest(lab)
      this.showServiceDetailDialog = true
    },

    handleBack() {
      this.$router.push({ name: "customer-request-test"})
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .customer-select-lab
    width: 100%
    height: 100% 
    background: #FFFFFF

    &__wrapper
      width: 100%
      height: 100%
      background: #FFFFFF
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1)
      border-radius: 0.25rem

    &__nav
      padding: 2.313rem 3.125rem

    &__main
      padding: 2.313rem 3.125rem
      width: 100%
      display: flex
      flex-direction: column
      align-items: center

</style>
