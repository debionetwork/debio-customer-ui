import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import NoLab from "@/views/Dashboard/Customer/Home/RequestTest/NoLab"

config.stubs["ui-debio-dialog"] = { template: "<div></div>"}

Vue.use(Vuetify)
const localVue = createLocalVue()

describe("No Lab", () => {
  let vuetify
  let container

  beforeEach(() => {
    vuetify =  new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(NoLab, {
      localVue,
      vuetify,
      store: new Vuex.Store({
        state: {
          lab: {
            country: "COUNTRY",
            region: "REGION",
            city: "CITY",
            category: "CATEGORY"
          }
        }
      })
    })
    expect(container.exists()).toBe(true)
  })
}) 
