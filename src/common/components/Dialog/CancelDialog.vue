<template lang="pug">
  .dialog-cancel
    v-dialog(:value="show" height="350" width="400" persistent )
      v-card 
        v-toolbar-title(class="title d-flex justify-end align-center" style="width: 100%;")
          v-btn(icon @click="closeDialog")
            v-icon.me-5.mt-5(style="font-size: 20px;") mdi-close
        

        v-card-text.mt-5(align="center")
          .dialog-cancel__title
            b.mt-5.pa-5 Do you want to cancel ?
          
          .dialog-cancel__message
            p.mt-5(class="text-h6" ) By clicking cancel, your request test process will be cancelled

          div(class="d-flex justify-space-between align-center pa-10")
            Button(
              color="secondary" 
              width="120px"
              height="35"
              @click="closeDialog"
              style="font-size: 10px;"
              outlined 
            ) No

            Button(
              color="secondary" 
              width="120px"
              height="35"
              style="font-size: 10px;"
              @click="cancelOrder"
            ) Yes
</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "CancelDialog",

  components: {
    Button
  },

  props: {
    show: Boolean
  },

  methods : {
    cancelOrder() {
      this.$emit("click")
    },

    closeDialog() {
      this.$emit("close")
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .dialog-cancel
    &__title
      color: black
      @include h2

    &__message
      @include body-text-1
</style>
