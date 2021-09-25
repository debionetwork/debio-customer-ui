<template lang="pug">
  div#app: v-app
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    div(v-if="isLoadingSubstrateApi") Loading...
    router-view(v-else)
</template>
  
<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "App",

  data: () => ({
    address: ""
  }),

  computed: {
    ...mapState({
      substrateApi: (state) => state.substrate.api,
      isLoadingSubstrateApi: (state) => state.substrate.isLoadingApi,
      web3: (state) => state.metamask.web3
    })
  },

  methods: {
    ...mapActions({
      initWeb3: "metamask/initWeb3",
      initContracts: "metamask/contracts/initContracts"
    })
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap');
@import "@/common/styles/variables.scss";

* {
  font-family: "Raleway", sans-serif;
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
