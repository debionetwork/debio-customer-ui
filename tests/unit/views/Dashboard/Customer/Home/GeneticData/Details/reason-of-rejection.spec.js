import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import ReasonOfRejection from "@/views/Dashboard/Customer/Home/GeneticData/Details/ReasonOfRejection"


config.stubs["v-dialog"] = { template: "<div></div>" }
config.stubs["v-card"] = { template: "<div></div>" }
config.stubs["ui-debio-button"] = { template: "<div></div>" }

describe("Reson of Rejections", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("should render", () => {
    ReasonOfRejection.methods = {
      getGAOrderDetail: jest.fn()
    }

    container = shallowMount(ReasonOfRejection, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
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