<template lang="pug">
  .request-second-opinion
    v-card.request-second-opinion__card
      .request-second-opinion__card-title First Step, Describe your symptoms

      v-divider.mt-5 
</template>

<script>
export default {
  name: "RequestPage"

}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .request-second-opinion
    padding: 50px
    width: 859px

    &__card
      padding: 24px 
      padding-bottom: 500px

    &__card-title
      @include button-1




</style>
