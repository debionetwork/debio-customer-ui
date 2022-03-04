import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuex from "vuex"
import VueRouter from "vue-router"
import ServiceAnalysisCard from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/ServiceAnalysisCard"

config.stubs["ui-debio-avatar"] = { template: "<div></div>" }
config.stubs["v-card"] = { template: "<div></div>" }
config.stubs["v-row"] = { template: "<div></div>" }
config.stubs["v-col"] = { template: "<div></div>" }

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Service Analysis card", () => {

  let container
  let store
  let router

  beforeEach(() => {
    router= new VueRouter()
    store = new Vuex.Store({
      state: {
        substrate: {
          api: "API",
          web3: "WEB3"
        }
      }
    })
  })

  it("should render", () => {
    ServiceAnalysisCard.methods = {
      getServiceDetail: jest.fn() 
    };

    container = shallowMount(ServiceAnalysisCard, {
      localVue,
      store,
      router
    })
    
    expect(container.exists()).toBe(true)
  })


})



