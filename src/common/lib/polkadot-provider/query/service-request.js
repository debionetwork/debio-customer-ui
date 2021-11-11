export async function requestById(api, requestId) {
  const res = await api.query.serviceRequest.requestById(requestId)
  return res.toHuman()
}
