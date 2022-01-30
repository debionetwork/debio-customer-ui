import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Checkout from "@/views/Dashboard/Customer/Home/RequestTest/Checkout"
import PaymentCheckout from "@/views/Dashboard/Customer/Home/RequestTest/Checkout/PaymentCheckout"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Checkout page", () => {
  let container
  let store
  let vuetify
  let router
  
  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter()
    store = new Vuex.Store({
      state: {
        testRequest: {
          products: {
            serviceId: "wertyui",
            serviceName: "test 1"
          }
        }
      },
    })
  })

  it("should render", () => {
    container = shallowMount(Checkout, {
      localVue,
      vuetify,
      router,
      store,
      data: ()  => ({
        prefillService: {},
        stepperItems: []
      }),
      stubs: {
        PaymentCheckout
      }
    })
    
    expect(container.exists()).toBe(true)
  })
})