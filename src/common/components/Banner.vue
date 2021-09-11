<template lang="pug">
  .banner
    .banner__wrapper
      ui-debio-card.banner__card(block)
        template
          .banner__content
            .banner__illustrations
              ui-debio-icon.banner__illustration(:icon="labIllustration" :size="cardBlock ? 250 : 180" view-box="0 0 100 100" fill)
              .banner__content-description
                .banner__title Welcome to Debio!
                .banner__subtitle The Privacy-First Platform for Personal Biomedical Testing
              
            .banner__cta
              ui-debio-card(to="/" tiny-card with-icon width="250" title="Request a Test" :block="cardBlock" sub-title="Get your biological sample tested")
                ui-debio-icon(:icon="creditCardIcon" slot="icon" size="34" color="#C400A5" fill)
              ui-debio-card(to="/" tiny-card with-icon width="250" title="Upload your EMR" :block="cardBlock" sub-title="Upload your Electronic Medical Record")
                ui-debio-icon(:icon="layersIcon" slot="icon" size="34" color="#C400A5" stroke)
</template>

<script>
import { creditCardIcon, layersIcon, labIllustration } from '@/core/icons'

export default {
  name: "Banner",

  data: () => ({ creditCardIcon, layersIcon, labIllustration, cardBlock: false }),

  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 959) this.cardBlock = true
      else this.cardBlock = false
    })
  }
}
</script>

<style lang="sass">
  .banner
    padding: 3rem
    &__card

      .ui-debio-card__body
        background: #5640A5
        padding: 35px 32px 40px
        border-radius: 4px

    &__content
      display: flex
      justify-content: space-between

    &__content-description
      margin-left: 212px

    &__illustrations
      display: flex
      align-items: center
      gap: 0 30px

    &__illustration
      position: absolute
      top: -10px

    &__title
      font-size: 30px
      font-weight: 600
      line-height: 45px
      color: #FFFFFF

    &__subtitle
      max-width: 277px
      font-size: 15px
      font-weight: 700
      line-height: 23px
      color: #FFFFFF

    &__cta
      display: flex
      gap: 20px

    @media screen and (max-width: 959px)
      &__content,
      &__illustrations,
      &__cta
        flex-direction: column

      &__content
        gap: 20px
        
      &__content-description
        margin-left: unset
        text-align: center

      &__illustrations
        align-items: center
        
      &__illustration
        position: relative
        top: unset
</style>
