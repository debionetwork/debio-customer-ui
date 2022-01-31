import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import PaymentSuccess from "@/views/Dashboard/Customer/Home/RequestTest/Success/PaymentSuccess"

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
    container = shallowMount(PaymentSuccess, {
      localVue,
      vuetify
    })
    
    expect(container.exists()).toBe(true)
  })
})
