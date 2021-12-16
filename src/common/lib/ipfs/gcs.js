import apiClientRequest from "@/common/lib/api"

export async function getSignedUrl(fileName, action = "read") {
  const { data: { signedUrl } } = await apiClientRequest.get("/gcs/signed-url", {
    params: {
      filename: fileName,
      action: action
    }
  })

  return signedUrl
}

export async function createSyncEvent({ orderId, serviceCategoryId, fileName }) {
  const { data } = await apiClientRequest.post("/bounty/create-sync-event", {
    order_id: orderId,
    service_category_id: serviceCategoryId,
    filename: fileName
  })

  return data
}
