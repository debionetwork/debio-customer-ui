<template lang="pug">
  div#app: v-app
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    LoadingScreen(v-show="isLoadingSubstrateApi")
    NoAccessMobile(v-show="isMobileDevice")
    router-view(v-show="!isLoadingSubstrateApi && !isMobileDevice")
</template>
  
<script>
import { mapState, mapActions } from "vuex"
import NoAccessMobile from "@/views/NoAccessMobile"
import LoadingScreen from "@/views/LoadingScreen"
import { generalDebounce } from "@/common/lib/utils"

export default {
  name: "App",

  components: { NoAccessMobile, LoadingScreen },

  data: () => ({
    address: "",
    isMobileDevice: false
  }),

  computed: {
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      substrateIsConnected: (state) => state.substrate.isConnected,
      isLoadingSubstrateApi: (state) => state.substrate.isLoadingApi,
      web3: (state) => state.metamask.web3
    })
  },

  watch: {
    $route(val) {
      this.formatTitle(val)
    },
    substrateIsConnected (val) {
      if(!val) {
        console.log("API is not connected")
      }
      else {
        console.log("API is connected")
      }
    }
  },

  mounted() {
    document.title = "DeBio Network"

    this.formatTitle(this.$route)

    const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Apple Safari|Safari/i
    this.handleChangeDevices(mobileDevices, window.innerWidth)

    const handleResize = generalDebounce(
      () => {
        this.handleChangeDevices(mobileDevices, window.innerWidth)
      },
      150
    )

    window.addEventListener("resize", handleResize)
  },

  methods: {
    ...mapActions({
      initWeb3: "metamask/initWeb3",
      initContracts: "metamask/contracts/initContracts"
    }),

    formatTitle(val) {
      if (!val.meta.pageHeader) return

      const routeChildren = this.$router.options.routes
        .find(route => /^\/customer/.test(route.path))
        .children

      const parentRoute = routeChildren.find(route => route.name === val.meta?.parent)

      const formatedTitle = parentRoute?.meta?.pageHeader
        ? parentRoute.meta.pageHeader
        : val.meta.pageHeader

      document.title = `DeBio Network | ${formatedTitle}`
    },

    handleChangeDevices(device, width) {
      if(device.test(navigator.userAgent) && width <= 768) this.isMobileDevice = true
      else this.isMobileDevice = false
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap');
@import "@/common/styles/variables.scss";

* {
  font-family: "Open Sans", sans-serif;
}

::-moz-selection { /* Code for Firefox */
  background: #5640A5;
  color: #FFFFFF;
}

::selection {
  background: #5640A5;
  color: #FFFFFF;
}

@media screen and (min-width: 1904px) {
  .container {
    max-width: 1400px !important;
  }
}
.dg-card {
  border-radius: 10px !important;
  box-shadow: unset !important;
  filter: drop-shadow(0px 7px 20px rgba(0, 0, 0, 0.07));

  &.alert {
    background-color: $color-primary !important;
  }
}
</style>
