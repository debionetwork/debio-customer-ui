<template lang="pug">
  .request-second-opinion
    .request-second-opinion__content
      Description.request-second-opinion__card(v-if="isDescribing"  @click="onSubmit")
      GrantAccessPHR.request-second-opinion__card(v-if="isGrantingAccess" @back="toDescribeCard")


    .request-second-opinion__nav-cards
      v-card.request-second-opinion__nav-card
        .request-second-opinion__nav-card-title Complete these two steps to get a second opinion
        .request-second-opinion__nav-card-title Step {{ step }}
        .request-second-opinion__nav-card-text(v-html="stepperText")
        
        .request-second-opinion__step-wrapper
          .request-second-opinion__step-box(:class="{'request-second-opinion__step-box-selected': step === 1 || step === 2}")
          .request-second-opinion__step-box(:class="{'request-second-opinion__step-box-selected': step === 2}")


      v-card.request-second-opinion__nav-card
        .request-second-opinion__nav-card-title Help Desk
        .request-second-opinion__nav-card-text Our team is ready to answer all your questions with regards to our platform. 
        .request-second-opinion__link-card-text 
          a  click here


</template>

<script>
import { mapMutations } from "vuex"
import Description from "./Description"
import GrantAccessPHR from "./GrantAccessPHR"


export default {
  name: "RequestPage",

  data: () => ({
    isDescribing: true,
    isGrantingAccess: false,
    dataRequest: null,
    stepper: {
      1: `Describe your symptoms.
          Choose which category it falls under; either mental or physical.`,
      2: "Allow us to access your personal health records. The healthcare professional will use this information to provide you with an alternative solution."
    },
    step: 1
  }),

  computed: {
    stepperText() {
      return this.stepper[this.step].replace(/\n/g, "<br>");
    }
  },

  components: { Description, GrantAccessPHR },

  methods: {
    ...mapMutations({
      setSecondOpinionCategory: "secondOpinion/SET_SECOND_OPINION_CATEGORY",
      setSecondOpinionSymptoms: "secondOpinion/SET_SECOND_OPINION_SYMPTOMS"
    }),

    onSubmit(val) {
      this.setSecondOpinionCategory(val.category)
      this.setSecondOpinionSymptoms(val.symptoms)
      this.dataRequest = val
      this.isDescribing = false
      this.step = 2
      this.isGrantingAccess = true
    },

    toDescribeCard() {
      this.isGrantingAccess = false
      this.step = 1
      this.isDescribing = true
    }
  }

}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .request-second-opinion
    display: flex
    justify-content: space-between

    &__content
      padding: 10px

    &__card
      width: 829px
      padding: 24px 

    &__nav-card
      width: 267px
      padding: 10px
      margin: 10px 20px 24px 10px

    &__nav-card-title
      margin-bottom: 5px
      @include button-2

    &__nav-card-text
      @include new-body-text-2

    &__step-wrapper
      padding: 16px 0 0  0
      display: flex
      gap: 12px

    &__step-box
      height: 8px
      width: 162px
      background: #E0E0E0
    
    &__step-box-selected
      background: #FFC4F9
    
    &__link-card-text
      display:block
      margin-top: 20px

</style>
