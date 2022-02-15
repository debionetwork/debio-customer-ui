export async function queryGeneticAnalystQualifications(api, id) {
  let res = (await api.query.geneticAnalystQualifications.geneticAnalystQualifications(id))
    .toHuman()
  return res
}
