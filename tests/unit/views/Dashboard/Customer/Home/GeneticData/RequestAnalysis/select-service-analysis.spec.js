import { createLocalVue, shallowMount, config } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import SelectServiceAnalyst from "@/views/Dashboard/Customer/Home/GeneticData/RequestAnalysis/SelectServiceAnalyst"


config.stubs["ui-debio-stepper"] = { template: "<div></div>" }
config.stubs["v-icon"] = { template: "<div></div>" }
config.stubs["v-row"] = { template: "<div></div>" }
config.stubs["v-col"] = { template: "<div></div>" }
config.stubs["v-skeleton-loader"] = { template: "<div></div>" }

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe("Select Service Analys page", () => {
  let container
  let vuetify
  let store
  let router


  beforeEach(() => {
    vuetify = new Vuetify()
    router= new VueRouter()
    store = new Vuex.Store({
      state: {
        substrate: {
          api: "API"
        },
        geneticData: {
          selectedData: {
            id: "0x961467d9e2a510d777c7a89a15f54d6c6b354c3fd1c78bcf8d06202285e4894b",
            ownerId: "5DygXy2zxyYNhF7MRcxp1cBGirEHFXiWHgywVboC3Us1DVHs",
            title: "file",
            description: "abcdefgh",
            reportLink: "[https://ipfs.debio.network/ipfs/QmSxZ7zBqoVex2bmNeGGpBakAieLkghcJ75iyUXyhpv77C]",
            createdAt: "1,646,212,770,002",
            updatedAt: 0
          }
        }
      }
    })
  })

  it("should render", () => {
    container = shallowMount(SelectServiceAnalyst, {
      localVue,
      vuetify,
      store,
      router
    })

    expect(container.exists()).toBe(true)
  })

})
