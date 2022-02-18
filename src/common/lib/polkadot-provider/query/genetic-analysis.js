export async function queryGeneticAnalysisStorage(api, trackingId) {
  const res = await api.query.geneticAnalysis.geneticAnalysisStorage(trackingId)
  return res.toHuman()
}
