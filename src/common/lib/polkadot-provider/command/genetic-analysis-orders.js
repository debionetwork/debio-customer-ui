export async function createGeneticAnalysisOrder(api, pair, geneticDataId, serviceId, priceIndex, cusomerPublicKey, geneticLink) {
  const result = await api.tx.geneticAnalysisOrders
    .createGeneticAnalysisOrder(geneticDataId, serviceId, priceIndex, cusomerPublicKey, geneticLink)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function cancelGeneticAnalysisOrder(api, pair, orderId) {
  const result = await api.tx.geneticAnalysisOrders
    .cancelGeneticAnalysisOrder(orderId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function getCreateGeneticAnalysisOrderFee(api, pair, geneticDataId, serviceId, priceIndex, cusomerPublicKey, geneticLink) {
  return api.tx.geneticAnalysisOrders
    .createGeneticAnalysisOrder(geneticDataId, serviceId, priceIndex, cusomerPublicKey, geneticLink)
    .paymentInfo(pair)
}

export async function getCancelGeneticAnalysisOrderFee(api, pair, orderId) {
  return api.tx.geneticAnalysisOrders
    .cancelGeneticAnalysisOrder(orderId)
    .paymentInfo(pair)
}
