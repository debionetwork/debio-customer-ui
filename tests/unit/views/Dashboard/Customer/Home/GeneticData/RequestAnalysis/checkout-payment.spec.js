import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import CheckoutPayment from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/CheckoutPayment"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
config.stubs["v-icon"] = { template: "<div></div>" }

describe("Genetic Analysis Checkout Payment", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {
    container = shallowMount(CheckoutPayment, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
          },
          auth: {
            loadingData: "LOADING"
          },
          metamask: {
            web3: "WEB3"
          },
          geneticData: {
            selectedData: {}
          },
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
