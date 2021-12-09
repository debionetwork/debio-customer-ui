export async function getWeightTx(api, pair, address) {
  console.log(api, pair, address)
  const info = await api.tx.balances
    .transfer(address, 123)
    .paymentInfo(pair)
  return info
}
