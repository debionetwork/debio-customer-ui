import { mount, config, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import DataBounty from "@/views/Dashboard/Customer/Home/DataBounty"

config.stubs["ui-debio-banner"] = { template: "<div></div>" }
config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["v-card"] = { template: "<div></div>" }

describe("Databounty page", () => {
  let container
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })

  it("Should render", () => {
    container = mount(DataBounty, {
      localVue,
      store: new Vuex.Store({
        state: {
          substrate: {
            wallet: "WALLET"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
