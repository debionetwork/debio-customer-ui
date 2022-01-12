export async function registerElectronicMedicalRecord(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord(data.title, data.category, data.files)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function getCreateRegisterEMRFee(api, pair, data) {
  return await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord(data.title, data.category, data.files)
    .paymentInfo(pair)
}

export async function getDeleteEMRFee(api, pair, emrId) {
  return await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord(emrId)
    .paymentInfo(pair)
}

export async function deregisterElectronicMedicalRecord(api, pair, emrId) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord(emrId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}
