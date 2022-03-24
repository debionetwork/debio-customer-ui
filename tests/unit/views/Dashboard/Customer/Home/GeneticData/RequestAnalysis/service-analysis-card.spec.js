import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import ServiceAnalysisCard from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/ServiceAnalysisCard"

config.stubs["v-card"] = { template: "<div></div>" }
config.stubs["v-row"] = { template: "<div></div>" }
config.stubs["v-col"] = { template: "<div></div>" }
config.stubs["v-icon"] = { template: "<div></div>" }
config.stubs["v-img"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }


describe("Service Analysis card", () => {
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
    
    ServiceAnalysisCard.methods = {
      getServiceDetail: jest.fn()
    }

    container = shallowMount(ServiceAnalysisCard, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            waller: "WALLET"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
