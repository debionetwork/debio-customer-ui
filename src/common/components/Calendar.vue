<template lang="pug">
  .calendar
    .calendar__days
      .days__text(v-for="day in days") {{ day }}
    .calendar_content
      .day_content(v-for="date in date_list")
</template>

<script>
export default {
  name: "Calendar",

  props: {
    month: {type: Number, default: 0},
    year: {type: Number, default: new Date().getFullYear()},
    onlyCurrentMonth: {type: Boolean, default: true}

  },

  data: () => ({
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    dateList: [],
    selectedMonth: 0,
    selectedYear: 0
  }),

  computed: {

  },

  async mounted() {
    this.selectedMonth = this.month
    this.selectedYear = this.year

    this.updateCalendar(-1, -1, this.year, this.month)
  },

  watch: {

  },

  methods: {
    updateCalendar: (selectStart, selectEnd, year, month) => {
      this.date_list.splice(0, this.date_list.length)
      const today = new Date()
      const firstDateCurrentMonth = new Date(year, month, 1)
      const firstDateNextMonth = new Date(year, month + 1, 0)

      const dayFirstDateCurrentMonth = firstDateCurrentMonth.getDay() === 0 ? 6 : firstDateCurrentMonth.getDay() - 1
      const dayFirstDateNextMonth = firstDateNextMonth.getDay() === 0 ? 6 : firstDateNextMonth.getDay() - 1
      const startDate = new Date(year, month, -(dayFirstDateCurrentMonth - 1))
      const endDate = new Date(year, month, (6 - dayFirstDateNextMonth))

      let weekDays = []
      let date = startDate
      let indexDate = 0

      while (date.getTime() < endDate.getTime()) {
        date = new Date(year, month, (-(dayFirstDateCurrentMonth - 1) + indexDate))

        if (weekDays.length === 7) {
          this.dateList.push(weekDays)
          weekDays = []
        }

        weekDays.push({
          index: indexDate,
          date: date,
          thisMonth: date.getMonth() === month,
          isSelected: indexDate >= selectStart && indexDate <= selectEnd,
          text: date.getDate(),
          today: today.getDate() === date.getDate() && today.getMonth() === date.getMonth(),
          previousDay: today.getDate() <= date.getDate() && today.getMonth() <= date.getMonth() && today.getFullYear() <= date.getFullYear()
        })

        indexDate++
      }

      this.dateList.push(weekDays)
    }
  }
}
</script>

<style lang="sass">
  .calendar {
    margin: 50px;
    display: flex;
    flex-direction: column;
    width: 676px;
  }
  .calendar__days {
    display: flex;
    align-items: center;
    text-align: center;
    gap: 5px;
    color: #D3C9D1;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }
  .calendar__days .days__text {
    width: 92px;
    margin: 0 0 16px 0;
  }
  .calendar_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .calendar_content .day_content {
    width: 100%;
    display: flex;
    gap: 5.33px;
  }
</style>
