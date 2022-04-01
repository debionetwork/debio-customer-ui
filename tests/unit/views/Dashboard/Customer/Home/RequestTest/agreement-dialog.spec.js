import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import AgreementDialog from "@/views/Dashboard/Customer/Home/RequestTest/AgreementDialog.vue"

config.stubs["ui-debio-input"] = { template: "<div></div>"}
config.stubs["ui-debio-error-dialog"] = { template: "<div></div>"}

Vue.use(Vuetify)
Vue.use(Vuex)
const localVue = createLocalVue()

describe("Agreement dialog", () => {
  let vuetify
  let container

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(AgreementDialog, {
      localVue,
      vuetify,
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            lastEventData: "LAST_EVENT_DATA",
            walletBalance: "WALLET_BALANCE"
          },
          lab: {
            country: "COUNTRY",
            region: "REGION",
            city: "CITY",
            category: "CATEGORY"
          },
          metamask: {
            web3: "WEB3"
          }
        }
      })
    })
    expect(container.exists()).toBe(true)
  })
})
