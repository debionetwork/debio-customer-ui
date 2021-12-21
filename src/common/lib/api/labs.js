import apiClientRequest from "@/common/lib/api"
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

const auth = {
  username: process.env.VUE_APP_USERNAME,
  password: process.env.VUE_APP_PASSWORD
}

export async function getServicesByCategory(category, flow) {
  const { country, region, city} = store.getters["lab/getCountryRegionCity"]

  const params = {
    country,
    region,
    city,
    category,
    service_flow: flow
  }

  const { data : data } = await apiClientRequest.get("/labs", { params , auth })
  return data
}
