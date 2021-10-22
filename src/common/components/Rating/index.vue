<template lang="pug">
  .ui-debio-rating
    .ui-debio-rating__wrapper
      template(v-if="!interactive")
        ui-debio-icon(
          v-for="star in computeRating"
          :key="`star ${star}`"
          :icon="starIcon"
          :size="size"
          fill
          stroke
        )
        ui-debio-icon(
          v-for="star in computeEmptyRating"
          :key="`emptyStar ${star}`"
          :icon="starIcon"
          :size="size"
          stroke
        )
        p.ui-debio-rating__label.mb-0(v-if="withReviewers") ({{ totalReviews }})

      template(v-else)
        ui-debio-icon(
          v-for="star in interactiveStar"
          :key="`interactive ${star}`"
          :icon="starIcon"
          :size="size"
          role="button"
          fill
          stroke
          @click="handleClicked(star)"
        )
        ui-debio-icon(
          v-for="star in (totalRating - interactiveStar)"
          :key="`interactiveEmpty ${star}`"
          :icon="starIcon"
          :size="size"
          role="button"
          stroke
          @click="handleClicked(star + interactiveStar)"
        )
</template>

<script>
import { starIcon } from "@/common/icons"

export default {
  name: "UiDebioStepper",

  props: {
    rating: { type: Number, default: 0, validator: val => val >= 0 },
    value: { type: Number, default: 0, validator: val => val >= 0 },
    totalRating: { type: Number, default: 5, validator: val => val >= 0 },
    totalReviews: { type: Number, default: 0, validator: val => val >= 0 },
    size: { type: [String, Number], default: 0 },

    interactive: { type: Boolean, default: false },
    withReviewers: { type: Boolean, default: true }
  },

  computed: {
    computeRating() {
      return this.rating > this.totalRating ? this.totalRating : this.rating
    },
    
    computeEmptyRating() {
      const calculate = this.totalRating - this.rating
      
      return calculate <= 0 ? 0 : calculate
    }
  },

  data: () => ({
    starIcon,

    interactiveStar: 0
  }),

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val > this.totalRating) this.interactiveStar = this.totalRating
        else this.interactiveStar = val
      }
    }
  },

  methods: {
    handleClicked(star) {
      if (star === this.interactiveStar) this.interactiveStar = 0
      else this.interactiveStar = star

      this.$emit("input", this.interactiveStar)
    }
  }
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"

  .ui-debio-rating
    &__wrapper
      display: flex
      align-items: center
      gap: .5rem

    &__label
      color: #757274
      @include body-text-5
</style>
