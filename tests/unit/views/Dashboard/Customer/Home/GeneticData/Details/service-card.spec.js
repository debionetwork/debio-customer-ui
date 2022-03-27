import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import ServiceCard from "@/views/Dashboard/Customer/Home/GeneticData/Details/ServiceCard"

config.stubs["v-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }

describe("Service card", () => {
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
    ServiceCard.methods = {
      getGAOrder: jest.fn()
    }

    container = shallowMount(ServiceCard, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API"
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