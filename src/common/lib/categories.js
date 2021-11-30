import axios from "axios"
const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL

export const getCategories = async () => {
  const { data: data } = await axios.get(`${baseUrl}/service-category`)

  return data
}
