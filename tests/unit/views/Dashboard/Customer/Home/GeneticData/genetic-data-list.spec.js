import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import GeneticDataList from "@/views/Dashboard/Customer/Home/GeneticData/GeneticDataList"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }

describe("Genetic Analysis List", () => {
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

  it("Should render", () => {
    GeneticDataList.methods = {
      fetchGeneticData: jest.fn(), 
      getRemoveDataFee: jest.fn(), 
    };
    container = shallowMount(GeneticDataList, {
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
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
