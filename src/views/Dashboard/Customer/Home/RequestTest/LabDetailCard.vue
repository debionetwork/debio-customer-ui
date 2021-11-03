<template lang="pug">
  v-container.container-card
    v-card.menu-card
      .menu-card__service
        v-icon(v-if="!avatar" color="#BA8DBB" :size="90") {{ prefillService.lab.service_image || selectedService.serviceImage }}
        v-avatar.ml-2(v-else :src="avatar")
      
        .menu-card__body
          b.menu-card__service-title {{ prefillService.lab.service_name || selectedService.serviceName }}
            v-row(class="ml-1 mt-2")
              div(
                v-for="i in prefillService.lab.service_rating || selectedService.serviceRate"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star

              div(
                v-for="i in (5 - prefillService.lab.service_rating || selectedService.serviceRate)"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star-outline 

              span(class="ml-2" style="font-size: 9px;") ({{ prefillService.lab.service_rating || selectedService.countServiceRate }})

            v-row
              v-col(cols="5.5")
                b.menu-card__service-sub-title Price
                .menu-card__service-description
                  | {{ prefillService.lab.price || selectedService.detailPrice.price_components[0].value }} 
                  | {{ prefillService.lab.currency || selectedService.currency.toUpperCase() }}
              v-col(cols="6.5") 
                b.menu-card__service-sub-title Duration
                .menu-card__service-description
                  | {{ prefillService.lab.duration || selectedService.duration }} 
                  | {{ prefillService.lab.duration_type || selectedService.durationType }}

      hr(class="ml-3 me-3")
      
      div(class="d-flex")
        v-icon.ml-2(v-if="!avatar" color="#BA8DBB" :size="90") {{ icon }}
        v-avatar.ml-2(v-else :src="avatar")
            
        .menu-card__lab-detail(class="mb-1")
          b.mt-5.menu-card__service-title {{ prefillService.lab.name || selectedService.labName }}
            v-row(class="ml-1 mt-2 mb-1")
              div(
                v-for="i in prefillService.lab.lab_rating || selectedService.labRate"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star

              div(
                v-for="i in (5 - prefillService.lab.lab_rating || selectedService.labRate)"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star-outline 

              span(class="ml-2" style="font-size: 9px;") ({{ prefillService.lab.lab_rating || selectedService.countRateLab }})
        
            div.description(
              class="ml-1 mb-5 me-8 text-caption grey--text text--darken-1"
            ) {{ prefillService.lab.address || selectedService.labAddress }}
      



</template>

<script>

import { mapState } from "vuex"

export default {
  name: "LabDetailCard",

  props: {
    prefillService: { type: Object, default: () => {} }
  },

  data: () =>  ({
    rate: 3,
    icon: "mdi-hospital",
    avatar: false,
    lab: {}
  }),

  computed: {
    ...mapState({
      mnemonicData: (state) => state.substrate.mnemonicData,
      selectedService: (state) => state.testRequest.products
    })  
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
      margin: 35px 10px 5px 10px

    &__service-title
      @include body-text-2-opensans

    &__service-sub-title
      @include body-text-3-opensans

    &__service-description
      color: #C400A5
      @include body-text-medium-2-opensans
    
    &__lab-detail
      margin: 20px 5px 0px 10px
    
  .description 
    font-size: 10px
    max-height: 30px

</style>

