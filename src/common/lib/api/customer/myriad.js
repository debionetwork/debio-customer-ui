import apiClientRequest from "@/common/lib/api"
import axios from "axios"
import getEnv from "@/common/lib/utils/env"


export async function myriadCheckUser (address) {
  const { data } = await apiClientRequest.get(`myriad/check/user/${address}`)
  return data
}

export async function checkMyriadUsername(username) {
  const { data } = await apiClientRequest.get("myriad/username/check", {
    params: {
      username
    }
  })
  return data
}

export async function myriadRegistration(info) {
  const { data } =  await apiClientRequest.post(`myriad/register`, {
    params: { info }
  })
  return data
}

export async function getNonce(address) {
  const { data } = await apiClientRequest.get(`myriad/auth/nonce/${address}`)
  return data.nonce
}

export async function myriadAuth(info) {
  const { data } = await apiClientRequest.post(`myriad/auth`, {
    params: { info }
  })
  return data
}

export async function registerVisibilityTimeline(timelineId, userId) {
  const request = axios.create({
    baseURL: getEnv("VUE_APP_BACKEND_API"),
    headers: {
      "Content-Type": "application/json",
      "debio-api-key": getEnv("VUE_APP_DEBIO_API_KEY"),
      "JWT": getEnv("VUE_APP_DEBIO_ADMIN_JWT")
    },
    auth: {
      username: getEnv("VUE_APP_USERNAME"),
      password: getEnv("VUE_APP_PASSWORD")
    }
  })

  const { data } = request.post(`myriad/timeline/add-user`, {
    params: { selectedUser: [userId], timelineId }
  })

  return data
}

export async function getMyriadListByRole(category) {
  let role
  if (category === "Physical Health") {
    role = "health-professional/physical-health"
  } else if (category === "Mental Health") {
    role = "health-professional/mental-health"
  } else {
    role = "customer"
  }

  const { data } = await apiClientRequest.get(`myriad/list/userid`, {
    params: { role }
  })
  return data
}

export async function myriadPostCreate( jwt, info) {
  const request = axios.create({
    baseURL: getEnv("VUE_APP_BACKEND_API"),
    headers: {
      "Content-Type": "application/json",
      "debio-api-key": getEnv("VUE_APP_DEBIO_API_KEY"),
      "JWT": jwt
    },
    auth: {
      username: getEnv("VUE_APP_USERNAME"),
      password: getEnv("VUE_APP_PASSWORD")
    }
  })

  const { data } = request.post(`myriad/post/create`, {
    params: { info }
  })
  return data
}
