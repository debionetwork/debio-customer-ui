<template lang="pug">
  v-dialog.dialog-confirmation(:value="show" height="535" width="400" persistent)
    v-card.dialog-confirmation__card
      v-app-bar(flat dense color="white")
        v-spacer
        v-btn(icon @click="closeDialog")
          v-icon mdi-close
      
      .dialog-confirmation__title(align="center") {{ title }}

      .dialog-confirmation__icon
        v-img(v-bind:src="require('@/assets/alert-triangle.png')" max-width="87.07")


      v-card-text.dialog-confirmation__description {{ message}}

      .dialog-confirmation__button
        Button(
          color="secondary" 
          width="280px"
          height="35px"
          @click="onSubmit"
        ) Unstake
  
      v-progress-linear(
        v-if="loading"
        indeterminate
        color="primary"
      )
      
</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "ConfirmationDialog",

  components: {
    Button
  },

  props: {
    show: Boolean,
    message:String,
    title: String,
    loading:Boolean
  },

  methods: {
    closeDialog() {
      this.$emit("close")
    },

    onSubmit() {
      this.$emit("click")
    }
  }
}
</script>


<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-confirmation
    &__title
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      letter-spacing: 0.0044em
      padding-top: 30px
      padding-bottom: 72.07px
      @include h6

    &__icon
      display: flex
      justify-content: center
      align-items: center

    &__description
      display: flex
      justify-content: center
      text-align: center
      letter-spacing: -0.0044em
      margin-top: 57.5px
      
    &__button
      padding: 60px
    

</style>
