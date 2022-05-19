import { mount, config, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import Vue from "vue"
import VueRouter from "vue-router"
import router from "@/router"
import TestResult from "@/views/Dashboard/Customer/Home/MyTest/TestResult.vue"

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-card"] = { template: "<div></div>" }
config.stubs["ui-debio-modal"] = { template: "<div></div>" }
config.stubs["ui-debio-rating"] = { template: "<div></div>" }
config.stubs["ui-debio-textarea"] = { template: "<div></div>" }

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueRouter)

const localVue = createLocalVue()

jest.mock("@/store/", () => ({
  state: {
    auth: {
      configApp: {
        tokenName: "test",
        escrowETHAddress: "test",
        substrateWs: "test",
        web3Rpc: "test"
      }
    }
  },

  getters: {
    getConfig(state) {
      return state.configApp
    }
  }
}))

jest.mock("@/store/auth.js")

describe("Test Result page", () => {
  let container
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()

    global.scrollTo = jest.fn()
  })

  it("Should render", () => {
    container = mount(TestResult, {
      localVue,
      router,
      vuetify,
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym cake"
          },
          auth: {
            loadingData: "LOADING"
          },
          metamask: {
            web3: "WEB3"
          }
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
