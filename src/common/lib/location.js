import axios from "axios"
const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL

export const getLocations = async () => {
  return axios.get(`${baseUrl}/location`)
}

export const getStates = async (countryCode) => {
  return axios.get(`${baseUrl}/location?country_code=${countryCode}`)
}

export const getCities = async (countryCode, stateCode) => {
  return axios.get(`${baseUrl}/location?country_code=${countryCode}&state_code=${stateCode}`)
}
