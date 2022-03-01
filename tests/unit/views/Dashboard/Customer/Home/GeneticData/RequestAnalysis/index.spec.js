import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import RequestAnalysis from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Request Analysis page", () => {
  let container
  let vuetify
  let router
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter()
    store = new Vuex.Store({
      state: {
        substrate: {
          api: "API",
          wallet: "WALLET"
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(RequestAnalysis, {
      localVue,
      vuetify,
      router,
      store
    })

    expect(container.exists()).toBe(true)
  })

})