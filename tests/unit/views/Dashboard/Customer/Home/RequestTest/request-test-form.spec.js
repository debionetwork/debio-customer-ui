import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import RequestTestForm from "@/views/Dashboard/Customer/Home/RequestTest/RequestTestForm"
import Button from "@/common/components/Button"

Vue.use(Vuetify)

describe("Request Test Form component", () => {
  let container
  let localVue
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
  })

  afterEach(() => {
    localVue = null
  })

  it("should render", () => {
    container = shallowMount(RequestTestForm, {
      vuetify,
      localVue,
      store,
      stubs: {
        Button
      }
    })

    expect(container.exists()).toBe(true)
  })

  it("should render form with disabled button", () => {
    container = shallowMount(RequestTestForm, {
      vuetify,
      localVue,
      store,
      stubs: {
        Button
      }
    })

    expect(container.findComponent(Button).props().disabled).toBe(true)
  })

  it("shoud able button when have country, city, state, and category property", () => {
    container = shallowMount(RequestTestForm, {
      localVue,
      vuetify,
      store,
      stubs: {
        Button
      },
      data: () => ({
        country: "ID",
        city: "JK",
        state: "Kota Administrasi Jakarta Barat",
        category: "Single Gene"
      })
    })

    expect(container.findComponent(Button).props().disabled).toBe(false)
  })

})