import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Home from "@/views/Dashboard/Customer/Home"
import Vuex from "vuex"
import Vuetify from "vuetify"
import {
  ordersByCustomer,
  getOrdersData
} from "../../../../../../src/common/lib/polkadot-provider/query/orders"

jest.mock('../../../../../../src/common/lib/polkadot-provider/query/orders', () => ({
  ordersByCustomer: jest.fn(),
  getOrdersData: jest.fn(),
}))

import {
  queryDnaSamples
} from "../../../../../../src/common/lib/polkadot-provider/query/genetic-testing"

jest.mock('../../../../../../src/common/lib/polkadot-provider/query/genetic-testing', () => ({
  queryDnaSamples: jest.fn(),
}))

import { queryLabsById } from "../../../../../../src/common/lib/polkadot-provider/query/labs"

jest.mock('../../../../../../src/common/lib/polkadot-provider/query/labs', () => ({
  queryLabsById: jest.fn(),
}))

import { queryServicesById } from "../../../../../../src/common/lib/polkadot-provider/query/services"

jest.mock('../../../../../../src/common/lib/polkadot-provider/query/services', () => ({
  queryServicesById: jest.fn(),
}))

config.stubs["ui-debio-icon"] = { template: "<div></div>" }
config.stubs["ui-debio-card"] = { template: "<div></div>" }
config.stubs["ui-debio-avatar"] = { template: "<div></div>" }

describe("Dashboard Customer Home", () => {
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

  it("Should render", () => {
    container = shallowMount(Home, {
      localVue,
      vuetify: new Vuetify(),
      store: new Vuex.Store({
        state: {
          substrate: {
            api: "API",
            wallet: "WALLET",
            mnemonicData: "oil spend nation obey lecture behave lake diary reward forest gym apple"
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
