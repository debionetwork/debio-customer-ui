import axios from "axios"

export const getLabRating = async (id) => {
  const { data } = await axios.get(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/rating/lab/${id}`)

  return data
}
