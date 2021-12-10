import axios from "axios"
const baseUrl = process.env.VUE_APP_BACKEND_API

export const getCategories = async () => {
  const { data: data } = await axios.get(`${baseUrl}/service-category`)

  return data
}
