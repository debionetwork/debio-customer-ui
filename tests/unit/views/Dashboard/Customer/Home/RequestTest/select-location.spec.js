import Vue from "vue"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import SelectLocation from "@/views/Dashboard/Customer/Home/RequestTest/SelectLocation"

Vue.use(Vuetify)

describe("Select Location component", () => {
  let container
  let vuetify
  let localVue = createLocalVue()

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(SelectLocation, {
      localVue,
      vuetify
    })

    expect(container.exists()).toBe(true)
  })
})
