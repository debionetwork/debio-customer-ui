import axios from "axios"
const baseUrl = process.env.VUE_APP_BACKEND_API

export const getDbioBalance = async () => {
  const dbioBalance = await axios.get(`${baseUrl}/set-dbio-balance`)
  return dbioBalance.data
}
