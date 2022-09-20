<template lang="pug">
  .select-menstrual-calendar
    .select-menstrual-calendar__wrapper
      ui-debio-card(block)
        template
          .select-menstrual-calendar__banner
            .select-menstrual-calendar__content
              .select-menstrual-calendar__title Menstrual Calendar  Payment
              .select-menstrual-calendar__sub-title Smart way to track menstrual cycles.

            v-img(
              alt="no-list-data"
              src="@/assets/menstrual-calendar-banner.svg"
              max-width="373px"
              max-height="132px"
            )
    .select-menstrual-calendar__wrapper
      .select-menstrual-calendar__selection
        ui-debio-card.select-menstrual-calendar__calendar-selection(width="740")
          template(v-if="!submitPreview")
            .select-menstrual-calendar__head
              v-btn(
                @click="backButton"
                icon
              )
                v-icon mdi-chevron-left
              .select-menstrual-calendar__head-text
                span.select-menstrual-calendar__head-text-primary When did your last period start?
                span.select-menstrual-calendar__head-text-secondary Choose date to perform action
          template(v-if="submitPreview")
            .select-menstrual-calendar__head
              .select-menstrual-calendar__head-text
                span.select-menstrual-calendar__head-text-primary Calculating Calendar...
                span.select-menstrual-calendar__head-text-secondary Kindly wait during calculating calendar
          .select-menstrual-calendar__line-divider
          .select-menstrual-calendar__options
            ui-debio-dropdown(
              :items="monthList"
              variant="small"
              label=""
              v-model="selectedMonthText"
              placeholder=""
              item-text="text"
              item-value="text"
              outlined
              close-on-select
              width="140"
              :disabled="submitPreview"
            )
            span.select-menstrual-calendar__year {{ selectedYear }}
          .select-menstrual-calendar__calendar-wrapper
            Calendar(
              :year="selectedYear" 
              :month="selectedMonth"
              :isLoading="submitPreview"
              v-model="selectedDates"
            )
          .select-menstrual-calendar__icon-description
            .select-menstrual-calendar__icon-description-item
              svg(width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg')
                path(d='M16.5 16L0.5 0H13.7C15.1641 0 16.5 1.6 16.5 2.97139V16Z' fill='#FF60BF')
              span Today
            .select-menstrual-calendar__icon-description-item
              svg(width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg')
                rect(x='0.5' width='16' height='16' rx='2' fill='#FF99F5')
              span Menstruation
            .select-menstrual-calendar__icon-description-item
              svg(width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg')
                rect(x='0.5' width='16' height='16' rx='2' fill='#E5AEFF')
              span Prediction
            .select-menstrual-calendar__icon-description-item
              svg(width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg')
                rect(x='0.5' width='16' height='16' rx='2' fill='#D3D5FF')
              span Fertility
            .select-menstrual-calendar__icon-description-item
              svg(width='17' height='16' viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg')
                path(d='M8.49992 1.79297L12.2733 5.5663C13.0195 6.31204 13.5278 7.26235 13.7339 8.29701C13.9399 9.33167 13.8345 10.4042 13.4309 11.3789C13.0274 12.3537 12.3438 13.1868 11.4667 13.773C10.5895 14.3592 9.55824 14.6721 8.50326 14.6721C7.44827 14.6721 6.41699 14.3592 5.53985 13.773C4.66271 13.1868 3.97913 12.3537 3.57557 11.3789C3.172 10.4042 3.06659 9.33167 3.27266 8.29701C3.47873 7.26235 3.98703 6.31204 4.73326 5.5663L8.49992 1.79297Z' stroke='#C172FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round')
              span Ovulation
          .select-menstrual-calendar__note
            span(style='font-weight: 600;font-size: 14px;line-height: 20px;') Note
            span your previous menstrual cycle does not guarantee your future menstrual cycle medically or diagnostically
          template(v-if="!submitPreview")
            .select-menstrual-calendar__submit
              v-btn(
                color="secondary"
                elevation='0'
                width="180"
                height="44"
                :disabled="!submitEnabled"
                class='white--text mnemonic-list-item'
                @click="onSubmit"
              ) Submit
        ui-debio-card.select-menstrual-calendar__step(width="394")
          .select-menstrual-calendar__small-head
            svg(width='45' height='44' viewBox='0 0 45 44' fill='none' xmlns='http://www.w3.org/2000/svg')
              circle(cx='22.5' cy='22' r='22' fill='#F2F8FF')
              path(d='M27.2502 13.56V12C27.2502 11.59 26.9102 11.25 26.5002 11.25C26.0902 11.25 25.7502 11.59 25.7502 12V13.5H19.2502V12C19.2502 11.59 18.9102 11.25 18.5002 11.25C18.0902 11.25 17.7502 11.59 17.7502 12V13.56C15.0502 13.81 13.7402 15.42 13.5402 17.81C13.5202 18.1 13.7602 18.34 14.0402 18.34H30.9602C31.2502 18.34 31.4902 18.09 31.4602 17.81C31.2602 15.42 29.9502 13.81 27.2502 13.56Z' fill='#B9D5FF')
              path(d='M30.5 19.8398H14.5C13.95 19.8398 13.5 20.2898 13.5 20.8398V26.9998C13.5 29.9998 15 31.9998 18.5 31.9998H26.5C30 31.9998 31.5 29.9998 31.5 26.9998V20.8398C31.5 20.2898 31.05 19.8398 30.5 19.8398ZM19.71 28.2098C19.66 28.2498 19.61 28.2998 19.56 28.3298C19.5 28.3698 19.44 28.3998 19.38 28.4198C19.32 28.4498 19.26 28.4698 19.2 28.4798C19.13 28.4898 19.07 28.4998 19 28.4998C18.87 28.4998 18.74 28.4698 18.62 28.4198C18.49 28.3698 18.39 28.2998 18.29 28.2098C18.11 28.0198 18 27.7598 18 27.4998C18 27.2398 18.11 26.9798 18.29 26.7898C18.39 26.6998 18.49 26.6298 18.62 26.5798C18.8 26.4998 19 26.4798 19.2 26.5198C19.26 26.5298 19.32 26.5498 19.38 26.5798C19.44 26.5998 19.5 26.6298 19.56 26.6698C19.61 26.7098 19.66 26.7498 19.71 26.7898C19.89 26.9798 20 27.2398 20 27.4998C20 27.7598 19.89 28.0198 19.71 28.2098ZM19.71 24.7098C19.52 24.8898 19.26 24.9998 19 24.9998C18.74 24.9998 18.48 24.8898 18.29 24.7098C18.11 24.5198 18 24.2598 18 23.9998C18 23.7398 18.11 23.4798 18.29 23.2898C18.57 23.0098 19.01 22.9198 19.38 23.0798C19.51 23.1298 19.62 23.1998 19.71 23.2898C19.89 23.4798 20 23.7398 20 23.9998C20 24.2598 19.89 24.5198 19.71 24.7098ZM23.21 28.2098C23.02 28.3898 22.76 28.4998 22.5 28.4998C22.24 28.4998 21.98 28.3898 21.79 28.2098C21.61 28.0198 21.5 27.7598 21.5 27.4998C21.5 27.2398 21.61 26.9798 21.79 26.7898C22.16 26.4198 22.84 26.4198 23.21 26.7898C23.39 26.9798 23.5 27.2398 23.5 27.4998C23.5 27.7598 23.39 28.0198 23.21 28.2098ZM23.21 24.7098C23.16 24.7498 23.11 24.7898 23.06 24.8298C23 24.8698 22.94 24.8998 22.88 24.9198C22.82 24.9498 22.76 24.9698 22.7 24.9798C22.63 24.9898 22.57 24.9998 22.5 24.9998C22.24 24.9998 21.98 24.8898 21.79 24.7098C21.61 24.5198 21.5 24.2598 21.5 23.9998C21.5 23.7398 21.61 23.4798 21.79 23.2898C21.88 23.1998 21.99 23.1298 22.12 23.0798C22.49 22.9198 22.93 23.0098 23.21 23.2898C23.39 23.4798 23.5 23.7398 23.5 23.9998C23.5 24.2598 23.39 24.5198 23.21 24.7098ZM26.71 28.2098C26.52 28.3898 26.26 28.4998 26 28.4998C25.74 28.4998 25.48 28.3898 25.29 28.2098C25.11 28.0198 25 27.7598 25 27.4998C25 27.2398 25.11 26.9798 25.29 26.7898C25.66 26.4198 26.34 26.4198 26.71 26.7898C26.89 26.9798 27 27.2398 27 27.4998C27 27.7598 26.89 28.0198 26.71 28.2098ZM26.71 24.7098C26.66 24.7498 26.61 24.7898 26.56 24.8298C26.5 24.8698 26.44 24.8998 26.38 24.9198C26.32 24.9498 26.26 24.9698 26.2 24.9798C26.13 24.9898 26.06 24.9998 26 24.9998C25.74 24.9998 25.48 24.8898 25.29 24.7098C25.11 24.5198 25 24.2598 25 23.9998C25 23.7398 25.11 23.4798 25.29 23.2898C25.39 23.1998 25.49 23.1298 25.62 23.0798C25.8 22.9998 26 22.9798 26.2 23.0198C26.26 23.0298 26.32 23.0498 26.38 23.0798C26.44 23.0998 26.5 23.1298 26.56 23.1698C26.61 23.2098 26.66 23.2498 26.71 23.2898C26.89 23.4798 27 23.7398 27 23.9998C27 24.2598 26.89 24.5198 26.71 24.7098Z' fill='#B9D5FF')
            .select-menstrual-calendar__small-head-text
              span.select-menstrual-calendar__small-head-text-primary Menstrual Calendar Settings
              span.select-menstrual-calendar__small-head-text-secondary Update menstruation day and subscription
          .select-menstrual-calendar__line-divider
          span.select-menstrual-calendar__small-content-text Help us get to know you more deeply, complete these steps now!
          .select-menstrual-calendar__step-wrapper
            .select-menstrual-calendar__step-box(:class="{'select-menstrual-calendar__step-box-selected': true}")
            .select-menstrual-calendar__step-box(:class="{'select-menstrual-calendar__step-box-selected': submitPreview}")
</template>

<script>
import Calendar from "@/common/components/Calendar"
export default {
  name: "SelectMenstrualCalendar",

  components: {
    Calendar
  },

  data: () => ({
    monthList: [
      {value: 0, text: "January"},
      {value: 1, text: "February"},
      {value: 2, text: "March"},
      {value: 3, text: "April"},
      {value: 4, text: "May"},
      {value: 5, text: "June"},
      {value: 6, text: "July"},
      {value: 7, text: "August"},
      {value: 8, text: "September"},
      {value: 9, text: "October"},
      {value: 10, text: "November"},
      {value: 11, text: "December"}
    ],
    selectedMonthText: "",
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    selectedDates: null,
    submitEnabled: false,
    submitPreview: false
  }),

  watch: {
    selectedMonthText(newMonth) {
      this.selectedMonth = this.monthList.find((value) => value.text === newMonth).value
    },
    selectedDates(newSelected) {
      this.submitEnabled = newSelected !== null && newSelected.length > 0
    }
  },

  async created() {
    const today = new Date()
    this.selectedMonthText = this.monthList[today.getMonth()].text
    this.currentYear = today.getFullYear().toString()
  },

  methods: {
    onSubmit() {
      this.submitPreview = true
    },
    backButton() {
      this.$router.push({name: "menstrual-calendar"})
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "@/common/styles/mixins.sass"

  .select-menstrual-calendar
    &__wrapper
      height: 100%
      display: flex

    &__banner
      display: flex
      justify-content: space-between

    &__title
      @include h5-opensans

    &__sub-title
      @include body-text-2

    &__selection
      margin-top: 16px
      display: flex
      gap: 16px

    &__calendar-selection
      width: 740px

    &__head
      display: flex
      height: 60px
      align-content: center
      align-items: center
      gap: 27.33px
    
    &__head-text
      display: flex
      flex-direction: column
      gap: 8px

    &__head-text-primary
      height: 32px
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 600
      font-size: 20px
      line-height: 32px
      display: flex
      align-items: center
      letter-spacing: 0.0044em
      color: #363636

    &__head-text-secondary
      height: 20px
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      display: flex
      align-items: center
      letter-spacing: -0.0044em
      color: #757274

    &__options
      display: flex
      justify-content: space-between
      align-items: center

    &__year
      font-style: normal
      font-weight: 600
      font-size: 20px
      line-height: 32px
      color: #363636

    &__calendar-wrapper
      padding: 33px 0 35px 0

    &__icon-description
      padding: 0 0 14px 0
      display: flex
      gap: 24px
    
    &__icon-description-item
      display: flex
      gap: 8px
      font-weight: 600
      font-size: 14px
      line-height: 20px

    &__note
      display: flex
      text-align: left
      gap: 8px
      font-size: 14px

    &__submit
      display: flex
      margin: 18px 0 0 0
      justify-content: flex-end

    &__step
      height: 210px

    &__line-divider::after
      content: ""
      display: block
      border: 1px solid #E9E9E9
      margin: 24px auto

    &__small-head
      display: flex
      height: 44px
      align-content: center
      align-items: center
      gap: 16px
    
    &__small-head-text
      display: flex
      flex-direction: column
      gap: 4px

    &__small-head-text-primary
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 600
      font-size: 16px
      line-height: 22px
      display: flex
      align-items: center
      letter-spacing: 0.0044em
      color: #363636

    &__small-head-text-secondary
      font-family: 'Open Sans'
      font-style: normal
      font-weight: 400
      font-size: 14px
      line-height: 20px
      display: flex
      align-items: center
      letter-spacing: -0.0044em
      color: #757274

    &__small-content-text
      height: 44px
      font-weight: 600
      font-size: 14px
      line-height: 22px
      align-items: center
      color: #7A7A7A
      display: flex
      align-items: center

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
</style>
