import { shallowMount, config } from "@vue/test-utils"
import Vuetify from "vuetify"
import Information from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/Information"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
config.stubs["v-card"] = { template: "<div></div>" }
config.stubs["v-dialog"] = { template: "<div></div>" }


describe("Information pop up", () => {
  let vuetify

  beforeEach(() => {
    vuetify =  new Vuetify()
  })

  it("should render", () => {
    const container = shallowMount(Information, {
      vuetify
    })
    expect(container.exists()).toBe(true)
  })

})
