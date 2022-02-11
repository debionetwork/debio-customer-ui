import { mount, shallowMount } from "@vue/test-utils"
import DataTable from "@/common/components/DataTable"
import Vue from "vue"
import Vuetify from "vuetify"
import Button from "@/common/components/Button"
import EntrySelect from "@/common/components/DataTable/EntrySelect"
import Avatar from "@/common/components/Avatar"
import Icon from "@/common/components/Icon"

Vue.use(Vuetify)
let vuetify

describe("DataTable Component", () => {
  const stubs = {
    Button,
    EntrySelect,
    UiDebioAvatar: Avatar,
    UiDebioIcon: Icon
  }
  const items = [
    {
      a: "a", b: "b", c: "c", d: "d", e: "e", f: "f"
    }
  ]
  const header = [
    { text: "a", value: "a", sortable: true },
    { text: "b", value: "b", sortable: true },
    { text: "c", value: "c", sortable: true },
    { text: "d", value: "d", sortable: true },
    { text: "e", value: "e", width: "115", sortable: true },
    {
      text: "f",
      value: "f",
      sortable: false,
      align: "center",
      width: "5%"
    }
  ]
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  const entrySelect = shallowMount(EntrySelect)
  entrySelect.setProps({ value: 1 })

  it("Should render", () => {
    const dataTableComponent = mount(DataTable, {
      vuetify,
      stubs,
      propsData: { header, items }
    })

    expect(dataTableComponent.exists()).toBe(true)
  })

  it("Should render Data Table with header", () => {
    const wrapper = mount(DataTable, {
      vuetify,
      stubs,
      propsData: { header, items}
    })

    const dataTableComponent = wrapper.find("thead")
    
    expect(dataTableComponent.exists()).toBe(true)
    expect(dataTableComponent.find("tr").exists()).toBe(true)
  })

  it("Should render Data Table with Data Item", () => {
    const wrapper = mount(DataTable, {
      vuetify,
      stubs,
      propsData: { header, items}
    })

    const dataTableComponent = wrapper.find("tbody")
    
    expect(dataTableComponent.exists()).toBe(true)
    expect(dataTableComponent.find("tr").exists()).toBe(true)
  })


  it("Should Render Data Table with footer", () => {
    const wrapper = mount(DataTable, {
      vuetify,
      stubs,
      propsData: { header, items, showFooter: true }
    })

    const dataTableComponent = wrapper.find(".footer")
    expect(dataTableComponent.exists()).toBe(true)
  })

  it("Should Render Data Table with no footer", () => {
    const wrapper = mount(DataTable, {
      vuetify,
      stubs,
      propsData: { header, items, showFooter: false }
    })

    const dataTableComponent = wrapper.find(".footer")
    expect(dataTableComponent.exists()).toBe(false)
  })
})
