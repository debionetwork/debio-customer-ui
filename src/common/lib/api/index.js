import axios from "axios"
import * as Sentry from "@sentry/vue"

// EXPORT API COLLECTIONS HERE
export * from "./categories"
export * from "./debio-balance"
export * from "./emr"
export * from "./gcs"
export * from "./labs"
export * from "./location"
export * from "./orders"
export * from "./rating"
export * from "./service-request"

// AXIOS INSTANCE EXPORT BY DEFAULT
// PLEASE DISCUSS BEFORE YOU WANT TO EDIT THIS SCRIPT
const apiClientRequest = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_API,
  headers: { "Content-Type": "application/json" },
  auth: {
    username: process.env.VUE_APP_USERNAME,
    password: process.env.VUE_APP_PASSWORD
  }
})

apiClientRequest.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Sentry.captureException(error);

    return Promise.reject(error);
  },
);

export default apiClientRequest
