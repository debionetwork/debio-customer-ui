import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from 'vue-router'
import Stepper from "@/common/components/Stepper"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import SelectServicePage from "@/views/Dashboard/Customer/Home/RequestTest/SelectServicePage"
import SelectService from "@/views/Dashboard/Customer/Home/RequestTest/SelectServicePage/SelectService"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }


Vue.use(Vuetify)
Vue.use(VueRouter)

describe("Select Service Page", () => {
  let container
  let vuetify
  let localVue = createLocalVue()
  
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(SelectServicePage, {
      localVue,
      vuetify: new Vuetify(),
      router: new VueRouter(),
      stubs: {
        SelectService
      }
    })
    
    expect(container.exists()).toBe(true)
  })

  it("should render a page with Select Service component", () => {
    container = shallowMount(SelectServicePage, {
      localVue,
      vuetify,
      stubs: {
        UiDebioStepper: Stepper,
        SelectService,
      }
    })
    expect(container.findComponent(SelectService).exists()).toBe(true)
  })
})