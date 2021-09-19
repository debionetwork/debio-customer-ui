<template lang="pug">
    v-app
      NavigationDrawer
      router-view
</template>

<script>
import NavigationDrawer from "@/common/components/NavigationDrawer"

export default {
  name: "Dashboard",
  components: {
    NavigationDrawer
  }
}
</script>

<style lang="scss">
  @import "~vuetify/src/styles/styles.sass";
  @media screen and (min-width: 960px) {
    div.dg-app-bar-items-container {
      max-width: 900px !important;
    }
  }
  @media screen and (min-width: 1264px) {
    div.dg-app-bar-items-container {
      max-width: 1185px !important;
    }
  }
  @media screen and (min-width: 1904px) {
    div.dg-app-bar-items-container {
      max-width: 1400px !important;
    }
  }
  .dg-app-bar {
    > div {
      justify-content: center;

      div.dg-app-bar-items-container {
        display: flex;
        width: 100%;
      }
    }
  }
  .dg-dashboard-main {
    background: #e5e5e5;
  }
</style>
