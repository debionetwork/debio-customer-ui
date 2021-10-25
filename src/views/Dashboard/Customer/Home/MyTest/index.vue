<template lang="pug">
  .customer-test
    Banner(
      title="My Test"
      subtitle="Privacy-first biomedical process. Get your own biomedical sample at home, proceed it anonymousely to expert and scientist!"
    )
      template(slot="illustration")
        ui-debio-icon(:icon="noteIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 100 86" fill)

      template(slot="cta")
        ui-debio-card
          ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)   

    .customer-my-test
      .customer-my-test__tabs
        template
          v-tabs(v-model="tabs")
            v-tab Test List
            
            v-tab Stake Service
              
        v-tabs-items(v-model="tabs")
          v-tab-item
            v-card(flat)
              v-card-text Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          v-tab-item
            StakingServiceTab

</template>

<script>
import { layersIcon, noteIllustration } from "@/common/icons"
import Banner from "@/common/components/Banner.vue"
import StakingServiceTab from "./StakingServiceTab.vue"

export default {
  name: "MyTest",

  components: {
    Banner,
    StakingServiceTab
  },

  data: () => ({ 
    layersIcon, 
    noteIllustration, 
    cardBlock: false,
    documents: null,
    tabs: null
  }),

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  },

  methods: {
    toRequestTest() {
      this.$router.push({ name: "customer-request-test-select-lab"})
    }
  }
}
</script>

<style lang="sass" scoped>
  .customer-
    &::v-deep
      .banner__subtitle
        max-width: 36.188rem !important

  .customer-my-test
    width: 100%
    height: 200px 
    background: #FFFFFF
    margin-top: 50px

    &__tabs
      padding: 3px

</style>
