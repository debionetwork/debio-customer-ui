<template lang="pug">
.customer-emr
  Banner(
    title="My EMR"
    subtitle="Here, you can upload a collection of your Electronic Medical Records (medical history, diagnoses, medications, treatment plans, immunization dates, allergies, radiology images, and laboratory)."
  )
    template(slot="illustration")
      ui-debio-icon(:icon="noteIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 100 86" fill)

    template(slot="cta")
      ui-debio-card(
        :to="{ name: 'customer-emr-create' }"
        title="Add new EMR"
        sub-title="Upload your Electronic Medical Record"
        tiny-card
        with-icon
        width="250"
        :block="cardBlock"
      )
        ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)
</template>

<script>
import { layersIcon, noteIllustration } from "@/common/icons"

import Banner from "@/common/components/Banner.vue"

export default {
  name: "CustomerEmr",

  components: {Banner },
  data: () => ({ layersIcon, noteIllustration, cardBlock: false }),

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  }
}
</script>

<style lang="sass" scoped>
  .customer-emr
    &::v-deep
      .banner__subtitle
        max-width: 36.188rem !important
</style>
