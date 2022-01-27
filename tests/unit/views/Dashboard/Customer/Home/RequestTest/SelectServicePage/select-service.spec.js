import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import SelectService from "@/views/Dashboard/Customer/Home/RequestTest/SelectServicePage/SelectService"
import MenuCard from "@/views/Dashboard/Customer/Home/RequestTest/MenuCard"
import NoLab from "@/views/Dashboard/Customer/Home/RequestTest/NoLab"


Vue.use(Vuetify)

describe("Select Service", () => {
  let container
  let localVue = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)
  })

  afterEach(() => {
    localVue = null
  })

  it("should render", () => {
    container = shallowMount(SelectService, {
      localVue,
      vuetify: new Vuetify(),
      stubs: { MenuCard, NoLab },
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
          },
          lab: {
            country: "ID",
            city: "JK",
            country: "Kota Administrasi Jakarta Barat",
            category: "Single Gene",
            dataServices: [{"Services": "Data Service"}]
          }
        }
      })
      
    })
    expect(container.exists()).toBe(true)
  })
})
