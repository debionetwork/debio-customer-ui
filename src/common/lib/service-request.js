import axios from "axios"

const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL

export async function getServiceRequestByCustomer(customerId) {
  const serviceRequests = await axios.get(`${baseUrl}/service-requests/customer/${customerId}`)
  return serviceRequests
}
