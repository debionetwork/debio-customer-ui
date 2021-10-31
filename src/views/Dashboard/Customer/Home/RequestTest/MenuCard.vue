<template lang="pug">
  .container-card(@click="onClick")
    v-card.menu-card

      v-row.pa-3
        v-col(cols="3")
          v-icon.ml-2(v-if="!avatar" color="#BA8DBB" size="90") {{ icon }}
          v-img.ml-2(v-else :src="avatar" max-width="90" max-height="90")
    
        v-col(cols="9")
          .menu-card__title
            .menu-card__name 
              b {{ title }}
            .menu-card__price 
              b {{ price }} {{ currency.toUpperCase() }}

          v-row(class="ml-1 mt-1 mb-1")
            div(
              v-for="i in rate"
              :key="i")
              v-icon(style="font-size: 10px;" color="primary") mdi-star

            div(
              v-for="i in ( 5 - rate)"
              :key="i")
              v-icon(style="font-size: 10px;" color="primary") mdi-star-outline 
            span.ml-2( style="font-size: 10px;") ({{ countRate }})

          .menu-card__name  
            b {{ labName }}

          .menu-card__address {{ city }}, {{ city }}
        


</template>

<script>

export default {
  name: "MenuCard",

  props: {
    title: String,
    icon: String,
    labName: String,
    city: String,
    region: String,
    price: Number,
    avatar: String,
    currency: String,
    rate: Number,
    countRate: Number
  },

  methods: {
    onClick() {
      this.$emit("click")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .container-card
    width: 452px
    height: 117px
    padding: 1px
    border-radius: 8px
    cursor: pointer

    &:hover
      background-color: #FF56E0

  .menu-card 
    border-radius: 8px
    padding: 1px
    width: 450px
    height: 115px

    &__title
      display: flex
      justify-content: space-between
      height:32px

    &__name
      width: 240px
      @include body-text-3
    
    &__price
      margin-right: 5px
      color: #C400A5
      @include body-text-3

    &__address
      width: 270px
      color: gray
      @include body-text-5

</style>

