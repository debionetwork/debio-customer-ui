import axios from "axios"
export * from "./apiCollection"

const apiClientRequest = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API,
  headers: { "Content-Type": "application/json" },
  auth: {
    username: process.env.VUE_APP_USERNAME,
    password: process.env.VUE_APP_PASSWORD
  }
})

export default apiClientRequest
