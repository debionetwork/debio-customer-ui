import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import RequestTestForm from "@/views/Dashboard/Customer/Home/RequestTest/RequestTestForm"
import Button from "@/common/components/Button"

Vue.use(Vuetify)

describe("Request Test Form component", () => {
  let container
  let localVue = null
  let vuetify = new Vuetify()
  let store = new Vuex.Store({
    state: {
      substrate: {
        api: "API",
        wallet: "WALLET"
      },
      auth: {
        configApp: "CONFIG_APP"
      }
    }
  })

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)

  })

  afterEach(() => {
    localVue = null
  })

  it("should render", () => {
    container = shallowMount(RequestTestForm, {
      localVue,
      vuetify,
      store,
      stubs: {
        Button
      }
    })

    expect(container.exists()).toBe(true)
  })
}) 

