export async function queryGeneticAnalysisStorage(api, trackingId) {
  const res = await api.query.geneticAnalysis.geneticAnalysisStorage(trackingId)
  return res.toHuman()
}

export async function queryGeneticAnalysisByOwner(api, accountId) {
  const res = await api.query.geneticAnalysis.geneticAnalysisByOwner(accountId).toHuman()
  return res
}

export async function queryGeneticAnalysisOrders(api, orderId) {
  const res = await api.query.geneticAnalysisOrders.geneticAnalysisOrders(orderId).toHuman()
  return res
}
