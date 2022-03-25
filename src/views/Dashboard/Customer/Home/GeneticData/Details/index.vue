<template lang="pug">
  .ga-order-detail
    .ga-order-detail__title Test Summary

    .ga-order-detail__cards
      ServiceCard
      StepperStatusCard



  
</template>


<script>
import ServiceCard from "./ServiceCard"
import StepperStatusCard from "./StepperStatusCard"

export default {
  name: "GAOrderDetail",

  components: {
    ServiceCard,
    StepperStatusCard
  }

}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"
  @import "@/common/styles/functions.sass"


  .ga-order-detail
    &__title
      display: flex
      justify-content: center
      align-items: center
      letter-spacing: 0.0044em
      margin-top: toRem(52px)
      @include h6-opensans

    &__cards
      display: flex
      padding: toRem(52px)
      gap: toRem(14px)

      

</style>
