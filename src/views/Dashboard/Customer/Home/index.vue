<template lang="pug">
.customer-home
  Banner(
    title="Welcome to Debio!"
    subtitle="The Privacy-First Platform for Personal Biomedical Testing"
  )
    template(slot="illustration")
      ui-debio-icon(:icon="labIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 100 100" fill)

    template(slot="cta")
      ui-debio-card(
        to="/"
        title="Request a Test"
        sub-title="Get your biological sample tested"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="creditCardIcon" slot="icon" size="34" color="#C400A5" fill)
      ui-debio-card(
        to="/"
        title="Upload your EMR"
        sub-title="Upload your Electronic Medical Record"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)
</template>

<script>
import { creditCardIcon, layersIcon, labIllustration } from "@/common/icons"

import Banner from "@/common/components/Banner.vue"

export default {
  name: "CustomerHome",

  components: {Banner },
  data: () => ({ creditCardIcon, layersIcon, labIllustration, cardBlock: false }),

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  }
}
</script>

<style lang="sass" scoped>
  .customer-home
    &::v-deep
      .banner__illustration
        top: -0.625rem !important
</style>
