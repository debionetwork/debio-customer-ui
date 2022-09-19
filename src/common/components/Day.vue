<template lang="pug">
  div(v-for="day in count_days" :class="{ day: (dates[day - 1] !== undefined && dates[day - 1].thisMonth), none: !(dates[day - 1] !== undefined && dates[day - 1].thisMonth), selected: (dates[day - 1] !== undefined && dates[day - 1].isSelected) }" @click="dayClick(dates[day - 1] !== undefined && dates[day - 1].thisMonth, dates[day - 1].date, dates[day - 1].index)")
    svg(v-if="dates[day - 1] !== undefined && dates[day - 1].today" class="today" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg")
      path(d="M23 23L0 4.01591e-05H19.5C21.6046 4.01591e-05 23 2.52593 23 3.65281V23Z" fill="#FF60BF")
    span {{ dates[day - 1].text.toString().trim() }}
</template>

<script>
export default {
  name: "Day",

  props: {
    dates: {type: Array}
  },

  emits: ["onUnselected", "onSelected"],

  data: () => ({
    selectedIndex: -1,
    countDay: 7

  }),

  computed: {

  },

  async mounted() {

  },

  watch: {

  },

  methods: {
    dayClick: (active, date, index)  => {
      if (index === this.selectedIndex) {
        active && this.emits("onUnselected")
        this.selectedIndex = -1
      } else {
        active && this.emits("onSelected", date, index)
        this.selectedIndex = index
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .day {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:#F7F7F7;
    border-radius: 4px;
    color: #363636;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }
  .selected {
    background-color: coral;
    color: #F7F7F7;
  }
  .none {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #363636;
    font-weight: 600;
    font-size: 14px;
    cursor: not-allowed;
    user-select: none;
  }
  .today {
    position: absolute;
    width: 23px;
    height: 23px;
    top: 0px;
    right: 0;
  }
</style>
