<template lang="pug">
.genetic-data
  ui-debio-banner.genetic-data__banner(
    title="My Genetic Data"
    subtitle="Privacy-first biomedical service. Get your own biomedical sample at home, proceed it anonymously to expert and scientist!"
    with-decoration
    gradientColor="secondary"
  )
    template(slot="illustration")
      ui-debio-icon.genetic-data__banner-illustration(
        :icon="medicalResearchIllustration"
        :size="cardBlock ? 250 : 180"
        view-box="0 0 245 175"
        fill
      )
</template>

<script>
import { medicalResearchIllustration } from "@/common/icons"

export default {
  name: "GeneticData",
  data:() => ({
    medicalResearchIllustration
  }) 
}

</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .genetic-data
    display: flex
    flex-direction: column
    gap: 30px

    &::v-deep
      .banner__subtitle
        max-width: 36.188rem !important
        @include text-h2-banner

</style>
