import Vue from "vue"
import Vuetify from "vuetify"
import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import VueRouter from "vue-router"
import Button from "@/common/components/Button"
import EmptyDataCard from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/EmptyDataCard"


config.stubs["ui-debio-icon"] = { template: "<div></div>" }
Vue.use(Vuetify)
const localVue = createLocalVue()

describe("Empty Data Card", () => {
  let vuetify
  let container
  let stubs = { Button }

  beforeEach(() => {
    vuetify =  new Vuetify()
  })

  it("should render", () => {
    container = shallowMount(EmptyDataCard, {
      localVue,
      vuetify,
      stubs
    })
    expect(container.exists()).toBe(true)
  })
})