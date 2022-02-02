import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify/lib"
import VueRouter from "vue-router"
import PaymentDetailCard from "@/views/Dashboard/Customer/Home/RequestTest/PaymentDetailCard"

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Payment Detail Card", () => {
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
          api: "API",
          wallet: "WALLET",
          mnemonicData: "claw spare illegal parrot crack chase buddy answer slim weird write uncle", 
        },
        testRequest: {
          products: {},
        },
        metamask: {
          metamaskWalletAddress: "metamaskWalletAddress",
          web3: "WEB3",
        },
        lab: {
          stakingData: {}
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(PaymentDetailCard, {
      localVue,
      vuetify,
      router,
      store
    })

    expect(container.exists()).toBe(true)
  })
})

