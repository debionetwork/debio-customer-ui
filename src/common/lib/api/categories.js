import apiClientRequest from "@/common/lib/api"

const auth = {
  username: process.env.VUE_APP_USERNAME,
  password: process.env.VUE_APP_PASSWORD
}

export const getCategories = async () => {
  const { data: data } = await apiClientRequest.get("/service-category", { auth })
  return data
}
