import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import OrderHistoryDetail from "@/views/Dashboard/Customer/Home/MyTest/OrderHistoryDetail"
import "@/common/plugins/debionetwork-ui-components"


Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueRouter)

const stubs = {
  uiDebioCard: true,
  uiDebioAvatar: true,
  uiDebioIcon: true,
  uiDebioModal: true
}

const mockData =
  {
    "orderId": "0x401095c56952c0e03d938fce96b5f514364179ef837f48b1d0dbdee1b5c4299b",
    "icon": "https://gateway.pinata.cloud/ipfs/QmVyETbR7KDzditVW9CAN5mnmMH9PaUmBz964SrP31eLN5",
    "dnaSampleTrackingId": "6A5VV4IQ9CQG81W2A06A5",
    "timestamp": "1652762808002",
    "status": "Registered",
    "orderDate": "Tue, 17 May 2022, 11:46",
    "serviceId": "0x3d4501dae8757eb6dc259dab3f03eb85204ad606289ed45050ca067961d01b6e",
    "serviceInfo": {
        "name": "test service name",
        "description": "h",
        "image": "https://gateway.pinata.cloud/ipfs/QmVyETbR7KDzditVW9CAN5mnmMH9PaUmBz964SrP31eLN5",
        "category": "Single Gene",
        "testResultSample": "https://gateway.pinata.cloud/ipfs/QmSAdbek1DDb91BM8no29LeRxapusH72pmMZWs8zokGt6p",
        "pricesByCurrency": [
            {
                "currency": "DAI",
                "totalPrice": "2,000,000,000,000,000,000",
                "priceComponents": [
                    {
                        "component": "testing_price",
                        "value": "1,000,000,000,000,000,000"
                    }
                ],
                "additionalPrices": [
                    {
                        "component": "qc_price",
                        "value": "1,000,000,000,000,000,000"
                    }
                ]
            }
        ],
        "expectedDuration": {
            "duration": "8",
            "durationType": "Days"
        },
        "dnaCollectionProcess": "Blood Cells - Dried Blood Spot Collection Process"
    },
    "labId": "0x4b9c27ba1bde86ea3dae37507aefd857ea4cb089f4e3a804d75ee86b9f228b42",
    "labInfo": {
        "name": "Nimia Farma",
        "address": "test",
        "profileImage": "https://gateway.pinata.cloud/ipfs/QmeTMQxGoWwMbPRKgJAMppPueRMW4MLqWMuPiVbGL5LYre"
    },
    "createdAt": "17 May 2022",
    "updatedAt": "17 May 2022",
    "labName": "Nimia Farma",
    "feedback": {
        "rejectedTitle": null,
        "rejectedDescription": null
    }
}


describe("Order Details", () => {
  let container
  let vuetify
  let router
  let store
  let localVue

  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter({
      routes: [
        {
          path: "order-history-detail",
          name: "order-history-detail",
          meta: {
            pageHeader: "Order History Detail",
            parent: "customer-test"
          },
          component: () => import( /* webpackChunkName */ "@/views/Dashboard/Customer/Home/MyTest/OrderHistoryDetail")
        },
      ]
    })
    localVue = createLocalVue()

    store = new Vuex.Store({
      state: {
        metamask: {
          metamaskWalletAddress: "metamaskWalletAddress",
          web3: "WEB3"
        },
      }
    })
  })

  it("Should render", () => {

    container = shallowMount(OrderHistoryDetail, {
      localVue,
      vuetify,
      router,
      store,
      global: {
        stubs
      },
      data: () => ({ myTest: mockData })
    })

    expect(container.exists()).toBe(true)
  })
})