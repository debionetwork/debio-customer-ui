<template lang="pug">
  .wrap
    span.skeleton-loader(
      v-if="isLoading" 
      v-for="_ in countDay"
    )

    div(
      v-if="!isLoading"
      v-for='day in countDay' 
      :class='{ day: (dates[day - 1] !== undefined && dates[day - 1].thisMonth), none: !(dates[day - 1] !== undefined && dates[day - 1].thisMonth), selected: (dates[day - 1] !== undefined && dates[day - 1].isSelected) }' 
      @click='dayClick(dates[day - 1] !== undefined && dates[day - 1].thisMonth && dates[day - 1].isPast, dates[day - 1].date, dates[day - 1].index)'
    )
      div(
        v-if="dates[day - 1] !== undefined && dates[day - 1].thisMonth"
      )
        svg.today(
          v-if='dates[day - 1] !== undefined && dates[day - 1].today' width='23' height='23' viewBox='0 0 23 23' fill='none' xmlns='http://www.w3.org/2000/svg'
        )
          path(
            d='M23 23L0 4.01591e-05H19.5C21.6046 4.01591e-05 23 2.52593 23 3.65281V23Z' 
            fill='#FF60BF'
          )
        svg.checked(
          v-if='(dates[day - 1] !== undefined && dates[day - 1].isSelected)' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'
        )
          path(
            d='M8.27702 14.6673C11.9437 14.6673 14.9437 11.6673 14.9437 8.00065C14.9437 4.33398 11.9437 1.33398 8.27702 1.33398C4.61035 1.33398 1.61035 4.33398 1.61035 8.00065C1.61035 11.6673 4.61035 14.6673 8.27702 14.6673Z' 
            stroke='white' 
            stroke-width='1.5' 
            stroke-linecap='round' 
            stroke-linejoin='round'
          )
          path(
            d='M5.44434 7.99995L7.331 9.88661L11.111 6.11328' 
            stroke='white' 
            stroke-width='1.5' 
            stroke-linecap='round' 
            stroke-linejoin='round'
          )
        span(
          :class="{ past: (dates[day - 1] !== undefined && dates[day - 1].isPast && !dates[day - 1].isSelected) }"
        ) {{ dates[day - 1].text.toString().trim() }}
</template>

<script>
export default {
  name: "Day",

  props: {
    dates: {type: Array},
    isLoading: {type: Boolean, default: false}
  },

  data: () => ({
    selectedIndex: -1,
    countDay: 7

  }),

  methods: {
    dayClick(active, date, index) {
      if (index === this.selectedIndex) {
        active && this.$emit("on-unselected")
        this.selectedIndex = -1
      } else {
        const selectedDate = []
        for (let currNum = 0; currNum <= 4; currNum++) {
          selectedDate.push(new Date(date.getFullYear(), date.getMonth(), (date.getDate() + currNum)))
        }
        active && this.$emit("on-selected", selectedDate, index)
        this.selectedIndex = index
      }
    }
  }
}
</script>

<style scoped>
  .wrap {
    display: flex;
    gap: 5.33px;
  }
  .skeleton-loader {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    border-radius: 4px;
    cursor: progress; 
    background: 
      linear-gradient(0.25turn, transparent, #fff, transparent),
      linear-gradient(#eee, #eee),
      radial-gradient(38px circle at 19px 19px, #eee 50%, transparent 51%),
      linear-gradient(#eee, #eee);  
    background-repeat: no-repeat;
    background-size: 315px 250px, 315px 180px, 100px 100px, 225px 30px; 
    background-position: -315px 0, 0 0, 0px 190px, 50px 195px; 
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {  
    to {
      background-position: 315px 0, 0 0, 0 190px, 50px 195px;
    }
  }

  .past {
    color: #363636;
  }

  .day {
    position: relative;
    width: 92px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:#F7F7F7;
    border-radius: 4px;
    color: #D3C9D1;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }

  .selected {
    background-color: #FFC4F9;
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
    color: #D3C9D1;
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

  .checked {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 0;
    right: 0;
    margin: 0 4px 4px 0;
  }

  .drop {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    margin: 4px 0 0 4.67px;
  }
</style>
