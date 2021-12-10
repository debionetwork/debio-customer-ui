<template lang="pug">
  v-container.container-card
    v-card.menu-card
      .menu-card__service
        ui-debio-avatar.ma-1.ml-2(:src="dataService.serviceImage" size="90" rounded)
      
        .menu-card__body
          b.menu-card__service-title {{ dataService.serviceName }}
            v-row(class="ml-1 mt-1")
              ui-debio-rating(:rating="dataService.serviceRate" :total-reviews="dataService.countServiceRate" size="12")
            
            v-row
              v-col(cols="5.5")
                b.menu-card__service-sub-title Price
                .menu-card__service-description
                  | {{ formatPrice(dataService.price) }} 
                  | {{ dataService.currency.toUpperCase() }}
              v-col(cols="6.5") 
                b.menu-card__service-sub-title Duration
                .menu-card__service-description
                  | {{ dataService.duration }} 
                  | {{ dataService.durationType }}

      hr(class="ml-3 me-3")
      
      div(class="d-flex")
        div(class="mt-8 ml-5" )
          ui-debio-avatar(:src="dataService.labImage" size="90" rounded)
            
        .menu-card__lab-detail
          b.mt-2.me-4.menu-card__service-title {{ dataService.labName }}
            v-row(class="ml-1 mt-1 mb-1")
              ui-debio-rating(:rating="dataService.labRate" :total-reviews="dataService.countRateLab" size="12")

            div.description(
              class="mb-5 me-8 text-caption grey--text text--darken-1"
            ) {{ dataService.labAddress }}, {{ dataService.city }}, {{ country(dataService.country ) }}
      



</template>

<script>

import { mapState } from "vuex"
import { getLocations } from "@/common/lib/location"


export default {
  name: "LabDetailCard",

  data: () => ({
    countries: []
  }),

  async mounted () {
    await this.getCountries()
  },

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      dataService: (state) => state.testRequest.products,
      web3: (state) => state.metamask.web3
    })
  },

  methods: {
    async getCountries() {
      const { data : { data }} = await getLocations()
      this.countries = data
    },

    formatPrice(price) {
      return this.web3.utils.fromWei(String(price), "ether")
    },

    country (country) {
      return this.countries.filter((c) => c.iso2 === country)[0].name
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .container-card 
    width: 360px
    height: 328px
    border-radius: 8px

  .menu-card 
    border-radius: 8px
    padding-top: 2px
    height: 320px

    &__body
      margin-left: 10px

    &__service
      display: flex
      margin: 20px 0px 10px 10px

    &__service-title
      @include body-text-2-opensans

    &__service-sub-title
      @include body-text-3-opensans

    &__service-description
      color: #C400A5
      @include body-text-medium-3-opensans
    
    &__lab-detail
      display: flex
      margin-top: 20px
      margin-left: 10px
    
  .description 
    font-size: 10px
    max-height: 30px

</style>

