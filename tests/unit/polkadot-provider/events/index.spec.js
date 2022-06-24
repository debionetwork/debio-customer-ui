// import masterConfigEvent from "@/store/substrate/event-types.json"
import { processEvent } from "@/common/lib/polkadot-provider/events"
import { sampleAddress, sampleRole, sampleState, sampleEvent, sampleEvent2 } from "./dataSample"
import { customerHandler } from "@/common/lib/polkadot-provider/events/handlers/customer"

describe("Polkadot Events Test", () => {
  beforeEach(() => {
    JSON.parse = jest.fn().mockImplementationOnce(dataObject => {
      return dataObject.split(",")
    })
  })

  it(
    "Should receive Polkadot event if an address match",
    async () => {
      const { statusAdd } = await processEvent(sampleState, sampleAddress, sampleEvent, sampleRole, { customer: customerHandler })

      expect(statusAdd).toBe(true)
    }
  )

  it(
    "Should not receive Polkadot event if an address does not match",
    async () => {
      const { statusAdd } = await processEvent(sampleState, "foo", sampleEvent, sampleRole, { customer: customerHandler })

      expect(statusAdd).toBe(false)
    }
  )

  it(
    "Should receive Polkadot event if an address match even with a different event object structure",
    async () => {
      const { statusAdd } = await processEvent(sampleState, sampleAddress, sampleEvent2, sampleRole, { customer: customerHandler })

      expect(statusAdd).toBe(true)
    }
  )

  it(
    "Should not receive Polkadot event if an address does not match even with a different event object structure",
    async () => {
      const { statusAdd } = await processEvent(sampleState, "foo", sampleEvent2, sampleRole, { customer: customerHandler })

      expect(statusAdd).toBe(false)
    }
  )
})
