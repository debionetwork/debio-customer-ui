import Vue from "vue"
import router from "./router"
import store from "./store"
import App from "./App.vue"
import vuetify from "./common/plugins/vuetify"
import { fmtSpecimenNumber } from "./common/lib/string-format"
import { format, fromUnixTime } from "date-fns"
import "@/common/components/globalUiComponents"
import VueCountdownTimer from "vuejs-countdown-timer"
import VueGtag from "vue-gtag"

var pjson = require("../package.json")

Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_GTAG },
  appName: pjson.name,
  pageTrackerScreenviewEnabled: true
}, router)

Vue.config.productionTip = false

Vue.use(VueCountdownTimer)

Vue.filter("customerSpecimenStatus", function (val) {
  return val == "Received" ? "Received by Lab" : val
})
Vue.filter("specimenNumber", function (val) {
  return fmtSpecimenNumber(val)
})
Vue.filter("timestampToDate", function (val) {
  let timestamp
  if (typeof val == "string") {
    timestamp = parseInt(val.replaceAll(",", ""))
  } else {
    timestamp = val
  }
  try {
    return format(new Date(timestamp), "MMMM dd yyyy")
  } catch (err) {
    console.log(err)
    return ""
  }
})
Vue.filter("timestampToDateTime", function (val) {
  try {
    return format(fromUnixTime(val), "MMMM dd yyyy hh:mm")
  } catch (err) {
    console.log(err)
    return ""
  }
})

async function setupAppDependencies() {
  await store.dispatch("auth/initApp")
  await store.dispatch("metamask/initWeb3")
  store.dispatch("metamask/contracts/initContracts")
  return
}



setupAppDependencies()
  .then(() => {
    new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount("#app")
  })
