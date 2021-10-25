import axios from "axios"

export const getEMRCategories = async () => {
  const { data } = await axios.get(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/emr-category`)
  
  return data
}

