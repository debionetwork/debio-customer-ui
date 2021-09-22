<template lang="pug">
  .banner
    .banner__wrapper
      ui-debio-card.banner__card(block)
        template
          .banner__content
            .banner__illustrations
              .banner__illustration
                slot(name="illustration")
              .banner__content-description
                .banner__title {{ title }}
                .banner__subtitle {{ subtitle }}
              
            .banner__cta
              slot(name="cta")
</template>

<script>

export default {
  name: "Banner",
  props: {
    title: { type: String, default: "Default title" },
    subtitle: { type: String, default: "Default subtitle" }
  }
}
</script>

<style lang="sass">
  .banner
    &__card

      .ui-debio-card__body
        background: #5640A5
        padding: 2.188rem 2rem 2.5rem
        border-radius: 0.25rem

    &__content
      display: flex
      justify-content: space-between

    &__content-description
      margin-left: 13.25rem

    &__illustrations
      display: flex
      align-items: center
      gap: 0 1.875rem

    &__illustration
      position: absolute

    &__title
      font-size: 1.875rem
      font-weight: 600
      line-height: 2.813rem
      color: #FFFFFF

    &__subtitle
      max-width: 17.313rem
      font-size: 0.938rem
      font-weight: 700
      line-height: 1.438rem
      color: #FFFFFF

    &__cta
      display: flex
      gap: 1.25rem

    @media screen and (max-width: 959px)
      &__content,
      &__illustrations,
      &__cta
        flex-direction: column

      &__content
        gap: 1.25rem
        
      &__content-description
        margin-left: unset
        text-align: center

      &__illustrations
        align-items: center
        
      &__illustration
        position: relative
        top: unset
</style>
