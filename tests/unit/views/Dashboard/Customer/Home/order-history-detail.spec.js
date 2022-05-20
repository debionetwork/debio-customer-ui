import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify/lib"
import VueRouter from "vue-router"
import OrderHistoryDetail from "@/views/Dashboard/Customer/Home/MyTest/OrderHistoryDetail"


Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Order History Detail", () => {
  let container
  let store
  let vuetify
  let router

  beforeEach(() => {
    vuetify = new Vuetify()
    router = new VueRouter()
    store = new Vuex.Store({
      state: {
        substrate: {
          api: "API"
        },
        metamask: {
          web3: {
            utils: "WEB 3 UTILS"
          }
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(OrderHistoryDetail, {
      localVue,
      vuetify,
      router,
      store,
      data: () => ({
        myTest: 
          {
            "id": "0x401095c56952c0e03d938fce96b5f514364179ef837f48b1d0dbdee1b5c4299b",
            "service_id": "0x3d4501dae8757eb6dc259dab3f03eb85204ad606289ed45050ca067961d01b6e",
            "customer_id": "5FmohAvhCKiahYwrvT2PA2SWBRNj5FxQ5WeAbaz4quV3oufG",
            "customer_box_public_key": "0xd3f9a629c9333cd05b500dba96e1fe33a1c91ee86d63937111ba4e2bdb3b1e05",
            "seller_id": "5Gs9YhXaQPmzfFpEiC3D74ZhfUvBdKG1nfEPpWTiZW6CJGiS",
            "dna_sample_tracking_id": "6A5VV4IQ9CQG81W2A06A5",
            "currency": "DAI",
            "prices": [
                {
                    "component": "testing_price",
                    "value": "1,000,000,000,000,000,000"
                }
            ],
            "additional_prices": [
                {
                    "component": "qc_price",
                    "value": "1,000,000,000,000,000,000"
                }
            ],
            "status": "Paid",
            "created_at": "1,652,762,808,002",
            "updated_at": "1,652,762,856,001",
            "lab_info": {
                "box_public_key": "0x4b9c27ba1bde86ea3dae37507aefd857ea4cb089f4e3a804d75ee86b9f228b42",
                "name": "test 12",
                "email": "test@mail.com",
                "country": "ID",
                "region": "JK",
                "city": "Kota Administrasi Jakarta Timur",
                "address": "test",
                "phone_number": "121212121212",
                "website": "https://t.s",
                "latitude": null,
                "longitude": null,
                "profile_image": "https://gateway.pinata.cloud/ipfs/QmRW4iohmuPYPj7HnppTgNADxXNgALWKYQPccwu36vBwo6"
            },
            "service_info": {
                "prices_by_currency": [
                    {
                        "currency": "DAI",
                        "total_price": "2,000,000,000,000,000,000",
                        "price_components": [
                            {
                                "component": "testing_price",
                                "value": "1,000,000,000,000,000,000"
                            }
                        ],
                        "additional_prices": [
                            {
                                "component": "qc_price",
                                "value": "1,000,000,000,000,000,000"
                            }
                        ]
                    }
                ],
                "name": "test service name",
                "expected_duration": {
                    "duration": "8",
                    "durationType": "Days"
                },
                "category": "Single Gene",
                "description": "h",
                "dna_collection_process": "Blood Cells - Dried Blood Spot Collection Process",
                "test_result_sample": "https://gateway.pinata.cloud/ipfs/QmSAdbek1DDb91BM8no29LeRxapusH72pmMZWs8zokGt6p",
                "long_description": "long",
                "image": ""
            },
            "order_flow": "RequestTest",
            "blockMetaData": {
                "blockNumber": 705357,
                "blockHash": "0xf70846ce82492a22cc3b0bbb99173d6e5ed3933fa919337822d391d33969cc50"
            },
            "transaction_hash": "0x7ea85022c8d11f276d585b7ec8e367b256c72e5bb2eec6c5ea1f6527a4770943"
        }
      })
    })

    expect(container.exists()).toBe(true)
  })
})
