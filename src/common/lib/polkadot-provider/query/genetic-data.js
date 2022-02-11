export async function queryGeneticDataById(api, dataId) {
  let res = (await api.query.geneticData.geneticDataById(dataId))
    .toHuman()
  return res
}

export async function queryGeneticDataByOwner(api, accountId) {
  let res = (await api.query.geneticData.geneticDataByOwner(accountId))
    .toHuman()
  return res
}
