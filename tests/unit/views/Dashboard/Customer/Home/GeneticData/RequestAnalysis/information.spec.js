import { shallowMount, config } from "@vue/test-utils"
import Information from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/Information"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
config.stubs["v-card"] = { template: "<div></div>" }
config.stubs["v-dialog"] = { template: "<div></div>" }


describe("Information pop up", () => {

  it("should render", () => {
    const container = shallowMount(Information)
    expect(container.exists()).toBe(true)
  })

})