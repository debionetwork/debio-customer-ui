import { createLocalVue, shallowMount, config  } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import PaymentCard from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/PaymentCard"


config.stubs["v-card"] = { template: "<div></div>" }
config.stubs["v-tooltip"] = { template: "<div></div>" }
config.stubs["v-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }

describe("Payment card", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
    localVue.use(VueRouter)
  })

  afterEach(() => {
    localVue = null
  })

  it("Should render", () => {

    PaymentCard.methods = {
      getGeneticData: jest.fn(),
      getGeneticAnalysisOrderDetail: jest.fn(),
      getAnalysisStatus: jest.fn(),
      getUsdRate: jest.fn(),
      getTxWeight: jest.fn()
    }

    container = shallowMount(PaymentCard, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            walletBalance: 0
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
