<template lang="pug">
  .genetic-data
    .genetic-data__wrapper
      ui-debio-banner.genetic-data__banner(
        title="My Genetic Data"
        subtitle="Privacy-first biomedical service. Get your own biomedical sample at home, proceed it anonymously to expert and scientist!"
        gradientColor="secondary"
        with-decoration
      )
        template(slot="illustration")
          ui-debio-icon.genetic-data__banner-illustration(
            :icon="medicalResearchIllustration"
            :size="cardBlock ? 250 : 180"
            view-box="0 0 245 170"
            fill
          )
        
        template(slot="cta")
          ui-debio-card(
            :to="{ name: 'customer-add-genetic-data'}"
            title="Add Genetic Data"
            sub-title="Analyze your genetic data"
            tiny-card 
            with-icon
            width="250"
            :block="cardBlock"
          )
            ui-debio-icon(:icon="plusCircle" slot="icon" size="34" color="#C400A5" fill)

</template>

<script>
import { medicalResearchIllustration, plusCircle } from "@/common/icons"

export default {
  name: "GeneticData",
  data:() => ({
    medicalResearchIllustration,
    plusCircle
  }) 
}

</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .genetic-data
    &__wrapper
    display: flex
    flex-direction: column
    gap: 35px

    &::v-deep
      .banner__subtitle
        max-width: 29.2rem !important

</style>
