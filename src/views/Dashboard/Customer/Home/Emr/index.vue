<template lang="pug">
.customer-emr
  ui-debio-banner(
    title="My EMR"
    subtitle="Here, you can upload a collection of your Electronic Medical Records (medical history, diagnoses, medications, treatment plans, immunization dates, allergies, radiology images, and laboratory)."
    gradient-color="primary"
    with-decoration
  )
    template(slot="illustration")
      ui-debio-icon(:icon="analiticIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 252 252" fill)
</template>

<script>
import { layersIcon, analiticIllustration } from "@/common/icons"

export default {
  name: "CustomerEmr",

  data: () => ({ layersIcon, analiticIllustration, cardBlock: false }),

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
      .ui-debio-icon
        position: absolute
        bottom: -100px
</style>
