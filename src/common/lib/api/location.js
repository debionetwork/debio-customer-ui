import apiClientRequest from "@/common/lib/api"
const auth = {
  username: process.env.VUE_APP_USERNAME,
  password: process.env.VUE_APP_PASSWORD
}

export const getLocations = async () => {
  return apiClientRequest.get("/location", { auth })
}

export const getStates = async (countryCode) => {
  return apiClientRequest.get(`/location?country_code=${countryCode}`, { auth } )
}

export const getCities = async (countryCode, stateCode) => {
  return apiClientRequest.get(`/location?country_code=${countryCode}&state_code=${stateCode}`, { auth } )
}
