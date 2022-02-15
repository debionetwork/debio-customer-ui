export async function queryGetAllGeneticAnalystServices(api) {
  let res = (await api.query.geneticAnalystServices.geneticAnalystServices.entries())
  return res
}

export async function queryGetGeneticAnalystServiceById(api, accountId) {
  let res = (await api.query.geneticAnalystServices.geneticAnalystServices(accountId))
    .toHuman()
  return res
}
