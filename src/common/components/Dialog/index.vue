<template lang="pug">
  v-dialog(:value="show" height="276" :width="width === null ? '500' : width"
  persistent)
    v-card
      v-app-bar(flat dense color="white")
        v-toolbar-title(class="title d-flex justify-end align-center" style="width: 100%;")
          v-btn(icon @click="closeDialog")
            v-icon(style="font-size: 20px;") mdi-close
        v-spacer
      
      v-card-text.mt-5(align="center") {{ message}}

        div(class="d-flex justify-center pb-5 pt-5")
          v-img(v-bind:src="require('@/assets/'+imgPath)" max-width="66")
      
        div(class="d-flex justify-center pb-5 pt-5")
          Button(
            color="secondary" 
            width="auto"
            height="38"
            outlined
            @click="onSubmit"
            ) {{ btnMessage}}
      
</template>

<script>
import Button from "@/common/components/Button"

export default {
  name: "Dialog",

  components: {
    Button
  },

  props: {
    show: Boolean,
    width: Number,
    message:String,
    imgPath: String,
    btnMessage: String
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
