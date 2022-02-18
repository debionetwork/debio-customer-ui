import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import CustomerEmrDetails from "@/views/Dashboard/Customer/Home/Emr/Details"
import Vuex from "vuex"
import Vuetify from "vuetify"

config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }

describe("Customer EMR Dashboard Details", () => {
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
    CustomerEmrDetails.methods = {
      initialData: jest.fn()
    };
    container = shallowMount(CustomerEmrDetails, {
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
