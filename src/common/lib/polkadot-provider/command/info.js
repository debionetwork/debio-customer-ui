export async function getCreateOrderFee(api, pair, address, indexPrice, publicKey) {
  const info = await api.tx.orders
    .createOrder(address, indexPrice, publicKey, "RequestTest")
    .paymentInfo(pair)
  return info
}
