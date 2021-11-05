<template lang="pug">
  div.layout-dashboard
    NavigationDrawer.layout-dashboard__sidebar(:items="computeNavs")
      Button(
        outlined
        height="35px"
        @click="goToRequestTestPage"
        class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
        color="primary"
      ) Request a Test

      Button(
        outlined
        height="35px"
        @click="goToUploadEMR"
        class="font-weight-bold sidebar-text mt-4 dg-raleway-font"
        color="primary"
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
import { gridIcon, boxIcon, databaseIcon, fileTextIcon, creditCardIcon } from "@/common/icons"

export default {
  name: "MainPage",
  components: { NavigationDrawer, Navbar, Button },

  data: () => ({
    navs: [
      { text: "Dashboard", disabled: false, active: false, route: "customer-dashboard", icon: gridIcon },
      { text: "My Test", disabled: false, active: false, route: "my-test", icon: boxIcon },
      { text: "My EMR", disabled: false, active: false, route: "customer-emr", icon: fileTextIcon },
      { text: "Data Bounty", disabled: false, active: false, route: "customer-data-bounty", icon: databaseIcon },
      { text: "Payment History", disabled: false, active: false, route: "customer-payment-history", icon: creditCardIcon }
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
    },

    computeButtonActive() {
      return !/(\/customer\/request-test)/.test(this.$route.path)
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
      padding: 2.5rem 1.25rem !important
      padding-right: 2.5rem !important
      grid-area: navbar

    &__main
      padding: 1.25rem !important
      padding-right: 2.5rem !important
      grid-area: main

    &__sidebar
      grid-area: sidebar

      Button
       font-weight: 500 !important
       font-size: 13px
  
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
