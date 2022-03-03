import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import UiDebioErrorDialog from "@debionetwork/ui-components"
import AgreementDialog from "@/views/Dashboard/Customer/Home/RequestTest/AgreementDialog.vue"

config.stubs["ui-debio-input"] = { template: "<div></div>"}

Vue.use(Vuetify)
const localVue = createLocalVue()

describe("Agreement dialog", () => {
  let vuetify
  let container
  let stubs = { UiDebioErrorDialog }

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(AgreementDialog, {
      localVue,
      vuetify,
      stubs,
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
