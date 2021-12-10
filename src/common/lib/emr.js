import axios from "axios"

export const getEMRCategories = async () => {
  const { data } = await axios.get(`${process.env.VUE_APP_BACKEND_API}/emr-category`)
  
  return data
}

