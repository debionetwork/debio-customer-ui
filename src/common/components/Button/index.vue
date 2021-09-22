<template lang="pug">
  v-btn(
    depressed
    :color="color"
    :width="width"
    @click="onClick"
    :disabled="disabled"
    :loading="loading"
    :outlined="outlined"
    :block="block"
    :height="height")
    slot
</template>

<script>
export default {
  name: "Button",
  props: {
    color: { type: String, default: "white"},
    // dark: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    width: { type: [String, Number], default: "203px" },
    outlined: { type: Boolean, default: false },
    height: String
  },
  mounted() {
    this.changeStyle()
  },
  methods: {
    onClick() {
      this.$emit("click")
    },

    changeStyle() {
      // TODO: Do something
    }
  }
}
</script>
