<template lang="pug">
  v-container.container-card
    v-card.menu-card
      div(class="d-flex ml-3 mt-3")
        v-icon.ml-2(v-if="!avatar" color="#BA8DBB" :size="90") {{ icon }}
        v-avatar.ml-2(v-else :src="avatar")
          
        div(class="mb-1")
          div.mb-2
            b(style="font-size: 16px;") {{ selectedService.serviceName }}
            v-row(class="ml-1 mt-2")
              div(
                v-for="i in selectedService.serviceRate"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star

              div(
                v-for="i in (5 - selectedService.serviceRate)"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star-outline 

              span(class="ml-2" style="font-size: 9px;") ({{ selectedService.countServiceRate }})

            v-row
              v-col(cols="5.5") 
                b Price
                div(style="font-size: 14px") 10 Dai
              v-col(cols="6.5") 
                b Duration
                div(style="font-size: 14px") 12 Working Days


      hr(class="ml-3 me-3")

      div(class="d-flex ml-3 mt-3")
        v-icon.ml-2(v-if="!avatar" color="#BA8DBB" :size="90") {{ icon }}
        v-avatar.ml-2(v-else :src="avatar")
            
        div(class="mb-1")
          v-row(class="ml-1 mt-2 mb-1")
            b(style="font-size: 16px;") {{ selectedService.labName }}
          v-row(class="ml-1 mt-2 mb-1")
            div(
              v-for="i in selectedService.labRate"
              :key="i")
              v-icon(style="font-size: 14px;" color="primary") mdi-star

            div(
              v-for="i in (5 - selectedService.labRate)"
              :key="i")
              v-icon(style="font-size: 14px;" color="primary") mdi-star-outline 

            span(class="ml-2" style="font-size: 9px;") ({{selectedService.countRateLab}})
      

          div.description(
            class="ml-1 mb-5 me-8 text-caption grey--text text--darken-1"
          ) {{ selectedService.labAddress }}
      



</template>

<script>

import { mapState } from "vuex"

export default {
  name: "LabDetailCard",

  data: () =>  ({
    rate: 3,
    icon: "mdi-apple",
    avatar: false
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
  .container-card 
    width: 420px
    height: 250px
    border-radius: 8px

  .menu-card 
    border-radius: 8px
    padding: 2px
    height: 320px
    
  .description 
    font-size: 10px
    max-height: 30px

</style>

