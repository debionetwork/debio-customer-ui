import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import LabDetailCard from "@/views/Dashboard/Customer/Home/RequestTest/LabDetailCard"

config.stubs["ui-debio-avatar"] = { template: "<div></div>" }
config.stubs["ui-debio-rating"] = { template: "<div></div>" }

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Lab Detail Card", () => {
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
          mnemonicData: "claw spare illegal parrot crack chase buddy answer slim weird write uncle"
        },
        testRequest: {
          products: []
        },
        metamask: {
          web3: "WEB3"
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(LabDetailCard, {
      localVue,
      vuetify,
      router,
      store,
      data: () => ({
        service: {},
        countries: {},
        price: "",
        currency: "",
        country: ""
      })
    })

    expect(container.exists()).toBe(true)
  })
})

