import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Success from "@/views/Dashboard/Customer/Home/RequestTest/Success"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(VueRouter)

describe("Success page", () => {
  let container
  let vuetify  
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(Success, {
      localVue,
      vuetify
    })
    
    expect(container.exists()).toBe(true)
  })
})
