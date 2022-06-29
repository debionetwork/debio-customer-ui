<template lang="pug">
  .container-card(@click="onClick")
    v-card.menu-card
      v-row.pa-3
        v-col(cols="4")
          v-img(v-if="!icon" src="@/assets/debio-logo.png" height="135" width="135" contain)

          ui-debio-avatar(v-else :src="icon" size="135" rounded)
    
        v-col(cols="8")
          .menu-card__title
            .menu-card__name 
              b {{ title }}
            .menu-card__price 
              b {{ price }} {{ currency.toUpperCase() }}

          .menu-card__description {{ computeDescription }}
          
          ui-debio-rating.menu-card__rating(:rating="rate" :total-reviews="countRate" size="12")

          .menu-card__lab-name
            b {{ labName }}

</template>

<script>

import { getStates } from "@/common/lib/api"
import { trimString } from "@/common/lib/string-format"

export default {
  name: "MenuCard",

  data: () => ({
    state: "",
    longString: "V9pLUf6 L6xfIGU8qZMiio vJeneVXTf xdbQbP8zTbz bGCkvMJ6o8CR88y MdtNjhge7EX9 Axsjy3nmUoX K883TkY x1b2sR9BbQmW8 diSODRv4aiTlEsloQN 9SFfdrdw9Gy BtvE5b7N4FzU0nf1vL RnCpOEHre3wAl9AI azksLAO0MliwQXRGhU30 VPIU4g001D VwLP7pKkSl9fn8 ANrngOegKH3lL IClAVFxfuDu9ZEOY 3WTKA3TzaHCNx 5sxDNZ Ho4MEBzGUu ikHZY05R adl4Tcww pUEEF29as CI4W70snNS 7qdJ2O3IW sFqAtLo7u FsL2j3bA 3x6zSLkr eMt8ZBjM jGotYPv8u AThhWfTZFgD1p nWVRFc7r6 YdEHDCsPf YAfepBKY2DjK9B G2VsqpwO 1jjLPNgKc zruru4n y6D6gnY0kP hqHwW4ca2u 5ZRhKV9 7pX4nIAst2"
  }),

  props: {
    title: String,
    icon: String,
    labName: String,
    price: String,
    avatar: String,
    currency: String,
    rate: Number,
    countRate: Number,
    description: String
  },

  computed: {
    computeDescription() {
      return trimString(this.longString, 80)
    }
  },

  async mounted() {
    await this.getStateData()
  },

  methods: {
    onClick() {
      this.$emit("click")
    },

    async getStateData() {
      const {data: {data}} = await getStates(this.country)
      const states = data
      this.state = states.filter((s) => s.state_code === this.region)[0].name
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .container-card
    width: 452px
    height: 165px
    padding: 1px
    border-radius: 8px
    cursor: pointer

    &:hover
      background-color: #FF56E0

  .menu-card 
    border-radius: 8px
    padding: 1px
    width: 450px
    height: 163px

    &__title
      display: flex
      justify-content: space-between
      height:32px

    &__name
      width: 230px
      @include body-text-3-opensans-medium
  
    &__price
      color: #C400A5
      @include body-text-3-opensans-medium

    &__lab-name
      margin-top: 9px
      width: 240px
      @include body-text-3-opensans-medium

    &__description
      margin-top: 16px
      width: 270px
      color: gray
      @include tiny-reg

    &__rating
      margin-top: 10px
</style>

