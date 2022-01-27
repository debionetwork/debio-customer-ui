import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import RequestTest from "@/views/Dashboard/Customer/Home/RequestTest"
import SelectLocation from "@/views/Dashboard/Customer/Home/RequestTest/SelectLocation"
import Vue from "vue"
import Vuetify from "vuetify"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }

Vue.use(Vuetify)

describe("Request Test Page", () => {
  let container
  let vuetify
  let localVue = createLocalVue()
  
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(RequestTest, {
      localVue,
      vuetify,
      stubs: {
        SelectLocation
      }
    })
    
    expect(container.exists()).toBe(true)
  })

  it("should render a page with Select Location component", () => {
    container = shallowMount(RequestTest, {
      localVue,
      vuetify,
      stubs: {
        SelectLocation
      }
    })

    expect(container.findComponent(SelectLocation).exists()).toBe(true)
  })

})