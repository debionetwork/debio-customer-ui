import axios from "axios"
import store from "@/store/index"

/**
 * 
 * @param {String} country
 * @param {String} region
 * @param {String} city
 * @param {String} category
 * @param {Boolean} isRequestService
 * 
 */

export async function getServicesByCategory(category, isRequestService) {
  const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL
  const { country, region, city} = store.getters["lab/getCountryRegionCity"]

  const params = {
    country,
    region,
    city,
    category,
    service_flow: isRequestService
  }

  const services = await axios.get(`${baseUrl}/labs`, { params })

  return services
}
