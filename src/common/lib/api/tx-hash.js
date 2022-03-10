import apiClientRequest from "@/common/lib/api"

export async function postTxHash(orderId, txHash) {
  const payload = {
    transaction_hash: txHash,
    order_id: orderId
  }
  const { data } = await apiClientRequest.post("/transaction/hash", payload)
  return data 
}
