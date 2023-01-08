import apiClientRequest from "@/common/lib/api"

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
