import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import GAListDetials from "@/views/Dashboard/Customer/Home/GeneticData/Details"


describe("Details GA page", () => {
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

    GAListDetials.methods = {
      getCancelFee: jest.fn()
    }

    container = shallowMount(GAListDetials, {
      localVue,
      vuetify: new Vuetify(),
      $route: {
        params: {
          id: "ID"
        }
      },
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET"
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

