import apiClientRequest from "@/common/lib/api"

export const getNotifications = async ({ toId, end_block, from }) => {
  const { data } = await apiClientRequest.get(`/notification/${toId}`, {
    params: { start_block: 0, end_block, role: "Customer", from }
  })

  return data
}

export const setReadNotification = async (ids) => {
  const { data } = await apiClientRequest.put("/notification/set-read-many/", { ids })

  return data
}

export const setBulkReadNotification = async (toId) => {
  const { data } = await apiClientRequest.put(`/notification/set-read/${toId}`)

  return data
}
