export async function queryGetEMRList(api, ownerId) {
  const res = await api.query.electronicMedicalRecord.electronicMedicalRecordByOwner(ownerId)
  return res.toHuman()
}

export async function queryElectronicMedicalRecordFileById(api, emrId) {
  const res = await api.query.electronicMedicalRecord.electronicMedicalRecordFileById(emrId)
  return res.toHuman()
}

export async function queryElectronicMedicalRecordFileCount(api) {
  const res = await api.query.electronicMedicalRecord.electronicMedicalRecordFileCount()
  return res.toHuman()
}

export async function queryElectronicMedicalRecordFileCountByOwner(api, ownerId) {
  const res = await api.query.electronicMedicalRecord.electronicMedicalRecordFileCountByOwner(ownerId)
  return res.toHuman()
}
