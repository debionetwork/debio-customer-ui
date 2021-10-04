<template lang="pug">
  v-container.container-card(@click="onClick")
    v-card.menu-card(hover)
      div(class="d-flex align-center ml-3 mt-3")
        v-icon.ml-2(v-if="!avatar" color="#BA8DBB" :size="60") {{ icon }}
        v-avatar.ml-2(v-else :src="avatar")
          
        div(class="ml-2 mb-1" style="width: 100%;")
          div.mb-2
            b(class="ml-1 mt-1" style="font-size: 16px;") {{ title }}
            v-row(class="ml-1 mt-2 mb-1")
              div(
                v-for="i in rate"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star

              div(
                v-for="i in 2"
                :key="i")
                v-icon(style="font-size: 14px;" color="primary") mdi-star-outline 

              span(class="ml-2" style="font-size: 9px;") (1)

            div(class="text-caption grey--text text--darken-1" style="font-size: 10px;") {{ address }}
      
      hr(class="ml-3 me-3")
      
      div(class= "mt-1 ml-3 mb-4") 
        span(style="font-size: 14px;") Service Offered

      div(class="d-flex align-center")                
        v-icon(class="ml-5 me-3" color="#BA8DBB" :size="30") {{ serviceImage }}
        
        div(class="ml-1" style="width: 100%;")
          div(class="ml-1 mb-2 d-flex justify-space-between fill-height" style="width: 100%;")
            b(style="text-align; start; font-size: 16px;") {{ subTitle }}
            b(class="primary--text me-12" style="text-align: end; font-size: 16px;") {{ price }} Dai

          div.description(
            class="ml-1 mb-5 me-8 text-caption grey--text text--darken-1"
          ) {{ description }}

</template>

<script>

export default {
  name: "MenuCard",

  data: () =>  ({
    rate: 3,
    icon: "mdi-hospital"
  }),

  props: {
    image: String,
    title: String,
    subTitle: String,
    address: String,
    description: String,
    price: Number,
    serviceImage: String
  },

  methods: {
    onClick() {
      this.$emit("click")
    }
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

