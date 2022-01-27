import Vue from "vue"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import SelectLocation from "@/views/Dashboard/Customer/Home/RequestTest/SelectLocation"
import RequestTestForm from "@/views/Dashboard/Customer/Home/RequestTest/RequestTestForm"

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
      vuetify,
      stubs: { RequestTestForm }
    })

    expect(container.exists()).toBe(true)
  })

  it("should render page with component requet test form", () => {
    container = shallowMount(SelectLocation, {
      localVue,
      vuetify,
      stubs: { RequestTestForm }
    })

    expect(container.findComponent(RequestTestForm).exists()).toBe(true)
  })

})
