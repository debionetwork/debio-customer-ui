<style lang="scss" scoped>
.layout-dashboard {
    width: 100vw;
    height: 100vh;
    background: #F5F7F9;

    display: grid;
    grid-template-rows: 91px 251px calc(100% - 342px);
    grid-template-columns: 265px calc(100% - 265px);
    grid-template-areas: 
        "sidebar navbar"
        "sidebar banner"
        "sidebar main";

    &__navbar {
        min-height: 51px;

        padding: 20px !important;
        padding-right: 40px !important;
        grid-area: navbar;
    }

    &__banner {
        min-height: 211px;

        padding: 20px !important;
        padding-right: 40px !important;
        grid-area: banner;
    }

    &__main {
        padding: 20px !important;
        grid-area: main;
    }
}
</style>

<template lang="pug">
    div.layout-dashboard
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap" rel="stylesheet">

        Navbar.layout-dashboard__navbar
        Banner.layout-dashboard__banner
        
        // Main
        div.layout-dashboard__main: router-view
</template>

<script>
import Navbar from '@/common/components/Navbar.vue'
import Banner from '@/common/components/Banner.vue'

export default {
  name: 'MainPage',

  components: {
    Navbar,
    Banner,
  },
}
</script>
