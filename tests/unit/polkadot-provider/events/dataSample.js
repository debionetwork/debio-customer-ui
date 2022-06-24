import configEvent from "@/store/substrate/event-types.json"

export const sampleAddress = "sampleAddress"
export const sampleRole = "customer"
export const sampleState = { configEvent }
export const sampleEvent = {
  "index": "sampleIndex",
  "data": [
    "sampleAddress",
    {
      "hash": "sampleHash",
      "requesterAddress": "sampleAddress",
      "labAddress": null,
      "country": "sampleCountry",
      "region": "sampleRegion",
      "city": "sampleCity",
      "serviceCategory": "sampleServiceCategory",
      "stakingAmount": "sampleStakingAmount",
      "status": "Open",
      "createdAt": "now",
      "updatedAt": null,
      "unstakedAt": null
    }
  ],
  section: "serviceRequest",
  method: "ServiceRequestCreated"
}

export const sampleEvent2 = {
  "index": "sampleIndex",
  "data": [
    "sampleAddress",
    [
      {
        "hash": "sampleHash",
        "requesterAddress": "sampleAddress",
        "labAddress": null,
        "country": "sampleCountry",
        "region": "sampleRegion",
        "city": "sampleCity",
        "serviceCategory": "sampleServiceCategory",
        "stakingAmount": "sampleStakingAmount",
        "status": "Open",
        "createdAt": "now",
        "updatedAt": null,
        "unstakedAt": null
      }
    ]
  ],
  section: "serviceRequest",
  method: "ServiceRequestCreated"
}
