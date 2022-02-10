import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify/lib"
import VueRouter from "vue-router"
import PaymentRemainingDialog from "@/views/Dashboard/Customer/Home/RequestTest/PayRemainingDialog"

config.stubs["ui-debio-input"] = { template: "<div></div>" }

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)


describe("Payment Remaining dialog", () => {
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
          mnemonicData: "claw spare illegal parrot crack chase buddy answer slim weird write uncle"
        },
        lab: {
          country: "ID",
          region: "JK",
          city: "Kota Administrasi Jakarta Pusat",
          category: "Single Gene",
          stakingData: {},
        },
        testRequest: {
          products: {}
        },
        metamask: {
          metamaskWalletAddress: "WALLET_ADDRESS",
          web3: "WEB3"
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(PaymentRemainingDialog, {
      localVue,
      vuetify,
      router,
      store
    })

    expect(container.exists()).toBe(true)
  })
})