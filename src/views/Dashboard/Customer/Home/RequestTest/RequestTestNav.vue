<template lang="pug">
    .customer-request-test__nav-button(@click="onClick")
      v-icon.customer-create-emr__nav-icon mdi-chevron-left
      span {{ title }}
</template>


<script>
export default ({
  name: "RequestTestNav",

  props: {
    title: String
  },
  
  methods: {
    onClick () {
      this.$emit("click")
    }
  }
})
</script>

export default {
 



<style lang="sass">

  @import "@/common/styles/mixins.sass"

  .customer-request-test

    &__nav-icon
      border-radius: 0.063rem
      color: #D3C9D1 !important
      background: #F5F7F9
      
    &__nav-button
      display: flex
      align-items: center
      gap: 0.625rem
      max-width: max-content
      color: #757274
      cursor: pointer
      @include body-text-3

</style>
