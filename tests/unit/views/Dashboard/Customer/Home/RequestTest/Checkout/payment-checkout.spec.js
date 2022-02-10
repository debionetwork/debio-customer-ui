import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import PaymentCheckout from "@/views/Dashboard/Customer/Home/RequestTest/Checkout/PaymentCheckout"

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Payment checkout component", () => {
  let container
  let store
  let vuetify
  let router

  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter()
    store = new Vuex.Store({
      state: {
        substrate: {
          api: "API"
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(PaymentCheckout, {
      localVue,
      vuetify,
      router,
      store,
      data: () => ({
        isCancelled: false
      })
    })

    expect(container.exists()).toBe(true)
  })
})
