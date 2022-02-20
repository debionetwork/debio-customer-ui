export async function queryGeneticAnalysts(api, accountId) {
  const res = (await api.query.geneticAnalysts.geneticAnalysts(accountId))
    .toHuman()
  return res
}

export async function queryGeneticAnalystServices(api, serviceId) {
  const res = await api.query.geneticAnalystServices.geneticAnalystServices(serviceId).toHuman()
  return res
}
