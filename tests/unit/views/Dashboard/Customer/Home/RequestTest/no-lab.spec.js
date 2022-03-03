import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import UiDebioDialog from "@debionetwork/ui-components"
import UiDebioButton from "@debionetwork/ui-components"
import NoLab from "@/views/Dashboard/Customer/Home/RequestTest/NoLab"

Vue.use(Vuetify)
const localVue = createLocalVue()

describe("No Lab", () => {
  let vuetify
  let container
  let stubs = { UiDebioDialog, UiDebioButton }

  beforeEach(() => {
    vuetify =  new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(NoLab, {
      localVue,
      vuetify,
      stubs,
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
