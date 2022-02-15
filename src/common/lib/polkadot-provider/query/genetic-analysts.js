export async function queryGeneticAnalysts(api, accountId) {
  let res = (await api.query.geneticAnalysts.geneticAnalysts(accountId))
    .toHuman()
  return res
}
