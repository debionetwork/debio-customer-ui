import axios from "axios"

const baseUrl = process.env.VUE_APP_BACKEND_API

export async function getServiceRequestByCustomer(customerId) {
  const serviceRequests = await axios.get(`${baseUrl}/service-requests/customer/${customerId}`)
  return serviceRequests
}
