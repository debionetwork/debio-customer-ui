<template lang="pug">
  div#app: v-app
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    template(v-if="showModalError")
      ui-debio-modal.app-modal-error(
        :show="showModalError"
        disable-dismiss
        :show-title="false"
        :show-cta="false"
      )
        ui-debio-icon(:icon="cableErrorIcon" fill size="100")
        h6.app-modal-error__title Aw, Snap!
        p.app-modal-error__subtitle Something went wrong! Reinitializing the RPC connection...

    template(v-else)
      LoadingScreen(v-show="isLoadingSubstrateApi")
      NoAccessMobile(v-show="isMobileDevice")
      router-view(v-show="!isLoadingSubstrateApi && !isMobileDevice")
</template>
  
<script>
import { cableErrorIcon } from "@debionetwork/ui-icons"
import { mapState, mapActions } from "vuex"
import { generalDebounce } from "@/common/lib/utils"
import NoAccessMobile from "@/views/NoAccessMobile"
import LoadingScreen from "@/views/LoadingScreen"

export default {
  name: "App",

  components: { NoAccessMobile, LoadingScreen },

  data: () => ({
    cableErrorIcon,

    address: "",
    isMobileDevice: false,
    showModalError: false
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
      if(!val) this.showModalError = true
      else this.showModalError = false
    }
  },

  mounted() {
    this.initFacebookPixel()
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

    initFacebookPixel() {
      const scriptTag = document.createElement("script")
      const noScriptTag = document.createElement("noscript")
      scriptTag.type = "text/javascript"

      const pixelNoScript = `
        <img height="1" width="1" src="https://www.facebook.com/tr?id=${process.env.VUE_APP_FB_PIXEL_ID}&ev=PageView&noscript=1" />
      `
      const pixelScript = `
        !function(f, b, e, v, n, t, s) {
          if (f.fbq) return
          n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
          }
          if (!f._fbq) f._fbq = n
          n.push = n
          n.loaded = !0
          n.version = "2.0"
          n.queue = []
          t = b.createElement(e)
          t.async = !0
          t.src = v
          s = b.getElementsByTagName(e)[0]
          s.parentNode.insertBefore(t, s)
        }(window, document, "script", 'https://connect.facebook.net/en_US/fbevents.js')

        fbq('init', "${process.env.VUE_APP_FB_PIXEL_ID}")
      `

      scriptTag.append(pixelScript)
      noScriptTag.append(pixelNoScript)

      document.head.appendChild(scriptTag)
      document.head.appendChild(noScriptTag)
    },

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
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap");
@import "@/common/styles/variables.scss";
@import "@/common/styles/mixins.sass";

* {
  font-family: "Open Sans", sans-serif;
}

.app-modal-error {
  .ui-debio-modal__card {
    width: 300px;
    gap: 1rem;
    border-radius: 10px;
  }

  &__title {
    @include h6-opensans
  }

  &__subtitle {
    max-width: 200px;
    text-align: center;
    color: #595959;
    @include body-text-3-opensans
  }

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
