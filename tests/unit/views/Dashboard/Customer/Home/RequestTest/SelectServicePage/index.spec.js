import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import SelectServicePage from "@/views/Dashboard/Customer/Home/RequestTest/SelectServicePage"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }


Vue.use(Vuetify)
Vue.use(VueRouter)

describe("Select Service Page", () => {
  let container
  let vuetify
  let router
  let localVue = createLocalVue()

  beforeEach(() => {
    vuetify = new Vuetify()
    router= new VueRouter()
  })

  it("should render", () => {
    container = shallowMount(SelectServicePage, {
      localVue,
      vuetify,
      router
    })

    expect(container.exists()).toBe(true)
  })
}) 
