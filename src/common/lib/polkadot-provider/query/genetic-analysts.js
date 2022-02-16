export async function queryGeneticAnalysts(api, accountId) {
  const res = (await api.query.geneticAnalysts.geneticAnalysts(accountId))
    .toHuman()
  return res
}
