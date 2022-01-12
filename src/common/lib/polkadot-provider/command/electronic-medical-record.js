export async function registerElectronicMedicalRecord(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord(data.title, data.category, data.files)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function getCreateRegisterEMRFee(api, pair, data) {
  const info = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord(data.title, data.category, data.files)
    .paymentInfo(pair)
  return info
}

export async function getDeleteEMRFee(api, pair, emrId) {
  const info = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord(emrId)
    .paymentInfo(pair)
  return info
}

export async function deregisterElectronicMedicalRecord(api, pair, emrId) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord(emrId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}
