<template lang="pug">
  div.layout-dashboard
    NavigationDrawer.layout-dashboard__sidebar(:items="computeNavs")
      Button(
        outlined
        height="35px"
        @click="goToRequestTestPage"
        class="font-weight-bold sidebar-text primary--text mt-4 dg-raleway-font"
        color="#FF56E0"
      ) Request a Test

      Button(
        outlined
        height="35px"
        @click="goToUploadEMR"
        class="font-weight-bold sidebar-text primary--text mt-4 dg-raleway-font"
        color="#FF56E0"
      ) Upload EMR

    Navbar.layout-dashboard__navbar
    .layout-dashboard__main
      transition(name="transition-slide-x" mode="out-in")
        router-view
</template>

<script>
import NavigationDrawer from "@/common/components/NavigationDrawer"
import Navbar from "@/common/components/Navbar.vue"
import Button from "@/common/components/Button"

export default {
  name: "MainPage",
  components: { NavigationDrawer, Navbar, Button },

  data: () => ({
    navs: [
      { text: "Dashboard", disabled: false, active: false, route: "customer-dashboard", img: "@/assets/grid.png" },
      { text: "My Test", disabled: false, active: false, route: "customer-test", img: "@/assets/box.png" },
      { text: "My EMR", disabled: false, active: false, route: "customer-emr", img: "@/assets/file-text.png" },
      { text: "Order History", disabled: false, active: false, route: "customer-order-history", img: "@/assets/credit-card.png" }
    ]
  }),

  computed: {
    computeNavs() {
      const setActive = name => {
        return (
          this.$route.name === name ||
          this.$route.meta.parent === name
        )
      }

      return this.navs.map(nav => ({ ...nav, active: setActive(nav.route) }))
    }
  },

  methods: {
    goToRequestTestPage() {
      this.$router.push({ name: "customer-request-test" })
    },

    goToUploadEMR() {
      this.$router.push({ name: "customer-emr-create" })
    }
  }
}
</script>

<style lang="sass" scoped>
  .layout-dashboard
    width: 100vw
    min-height: 100vh
    background: #F5F7F9
    display: grid
    grid-template-rows: 5.688rem calc(100% - 6.563rem) calc(100% - 21.375rem)
    grid-template-columns: 16.563rem calc(100% - 16.563rem)
    grid-template-areas: "sidebar navbar" "sidebar main"

    &__navbar
      padding: 1.25rem !important
      padding-right: 2.5rem !important
      grid-area: navbar

    &__main
      padding: 1.25rem !important
      padding-right: 2.5rem !important
      grid-area: main

    &__sidebar
      grid-area: sidebar
  
  .transition-slide-x
    &-enter-active,
    &-leave-active
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

    &-enter
      opacity: 0
      transform: translateX(1.563rem)

    &-leave-to
      opacity: 0
      transform: translateX(-12.813rem)
</style>
