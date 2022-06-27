import { processEvent } from "@/common/lib/polkadot-provider/events"
import { sampleAddress, sampleRole, sampleState, sampleEvent, sampleEvent2, sampleEvent3, sampleHandler } from "./dataSample"

describe("Polkadot Events Test", () => {
  it(
    "Should receive Polkadot event if an address match",
    async () => {
      const { statusAdd } = await processEvent(sampleState, sampleAddress, sampleEvent, sampleRole, { sampleRole: sampleHandler })

      expect(statusAdd).toBe(true)
    }
  )

  it(
    "Should not receive Polkadot event if an address does not match",
    async () => {
      const { statusAdd } = await processEvent(sampleState, "foo", sampleEvent, sampleRole, { sampleRole: sampleHandler })

      expect(statusAdd).toBe(false)
    }
  )

  it(
    "Should receive Polkadot event if an address match even with a different event object structure",
    async () => {
      const { statusAdd } = await processEvent(sampleState, sampleAddress, sampleEvent2, sampleRole, { sampleRole: sampleHandler })

      expect(statusAdd).toBe(true)
    }
  )

  it(
    "Should not receive Polkadot event if an address does not match even with a different event object structure",
    async () => {
      const { statusAdd } = await processEvent(sampleState, "foo", sampleEvent2, sampleRole, { sampleRole: sampleHandler })

      expect(statusAdd).toBe(false)
    }
  )

  it(
    "Should not receive Polkadot event if an address does not match, undefined or null",
    async () => {
      const { statusAdd } = await processEvent(sampleState, sampleAddress, sampleEvent3, sampleRole, { sampleRole: sampleHandler })

      expect(statusAdd).toBe(false)
    }
  )
})
