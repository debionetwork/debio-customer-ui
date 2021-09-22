<template lang="pug">
  v-container.select-lab.mt-16
    template
      Stepper.mt-10( 
        align="center"
        withLineIndicator
        :items="stepperItems"
      )
      
    template
      div.title Select your preferred Laboratory
    
    template
      v-row.mt-10
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
  
</template>

<script>

import { mapState, mapMutations } from "vuex"
import Stepper from '@/common/components/Stepper'
import MenuCard from '@/common/components/MenuCard'

export default {
  name: "SelectLab",
    components: {
    Stepper,
    MenuCard,
  },

  data: () => ({
    stepperItems: [
      { number: 1, title: 'Select a location and Service Category', active: false },
      { number: 2, title: 'Select a lab', active: true },
      { number: 3, title: 'Checkout', active: false },
      { number: 4, title: 'Payment', active: false },
    ],
  }),

  computed: {
    ...mapState({
      country: (state) => state.lab.country,
      city: (state) => state.lab.city,
      category: (state) => state.lab.category,
      labs: (state) => state.lab.labs
    }),
  },

  methods : {

    ...mapMutations({
      setLabToRequest: "testRequest/SET_LAB",
      setProductsToRequest: "testRequest/SET_PRODUCTS",
    }),

    getServiceName(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.name
        }
      }
    }, 

    getServiceDescription(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.description
        }
      }
    },

    getServicePrice(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.prices_by_currency[0].total_price
        }
      }
    },

    getServiceImage(services) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          return services[i].info.image
        }
      }
    },
    async selectLab(lab, services) {

      let selectedProduct
      for (let i = 0; i < services.length; i++) {
        if (services[i].info.category == this.category) {
          selectedProduct = services[i]
          console.log("di dalam", selectedProduct )

        }
      }
      
      this.setProductsToRequest(selectedProduct)
      this.setLabToRequest(lab)
      this.$router.push({ name: 'request-test-checkout' })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-lab {
    width: auto;
    height: 732px;
    background: #FFFFFF;
}

.title {
  font-family: Raleway;
  margin-top: 5%;
  font-size: 20px;
  line-height: 150%;
  display: flex;
  justify-content: center;
}

.card-test {
  color: black;
}
</style>