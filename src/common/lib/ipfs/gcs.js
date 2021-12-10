import axios from 'axios'

export async function getSignedUrl(fileName, action = 'read') {
  const { data: { signedUrl } } = await axios.get(`${process.env.VUE_APP_BACKEND_API}/gcs/signed-url`, {
    params: {
      filename: fileName,
      action: action
    }
  })

  return signedUrl
}

export async function createSyncEvent({ orderId, serviceCategoryId, fileName }) {
  const { data } = await axios.post(`${process.env.VUE_APP_BACKEND_API}/bounty/create-sync-event`, {
    order_id: orderId,
    service_category_id: serviceCategoryId,
    filename: fileName
  })

  return data
}
