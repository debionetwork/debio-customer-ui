import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import SuccessPage from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/SuccessPage"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"


config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
config.stubs["v-card"] = { template: "<div></div>" }

describe("Success page", () => {
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
    SuccessPage.methods = {
      getAnalysisOrderDetail: jest.fn(),
      getServiceDetail: jest.fn(),
      getGeneticData: jest.fn(),
      getAnalysisStatus: jest.fn()
    };
    container = shallowMount(SuccessPage, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET"
          }
        }
      }),
      router: new VueRouter()
    })

    expect(container.exists()).toBe(true)
  })
})