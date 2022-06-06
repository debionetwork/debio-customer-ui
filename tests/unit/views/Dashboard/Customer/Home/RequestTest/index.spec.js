import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import RequestTest from "@/views/Dashboard/Customer/Home/RequestTest"
import pageView from "@/common/lib/utils/pageView"

config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(VueRouter)

describe("Request test page", () => {
  let container
  let vuetify  
  let router

  beforeEach(() => {
    global.fbq = jest.fn()
    vuetify = new Vuetify()
    router = new VueRouter()
  })

  it("should render", () => {
    container = shallowMount(RequestTest, {
      localVue,
      vuetify,
      router,
      mixins: [pageView]
    })
    
    expect(container.exists()).toBe(true)
  })
})
