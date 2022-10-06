export async function addMenstrualCalendar(api, pair, averageCycle) {
  const result = await api.tx.menstrualCalendar.addMenstrualCalendar(averageCycle).signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function addMenstrualCycleLog(api, pair, menstrualCalendarId, menstrualCycleLog) {
  const result = await api.tx.menstrualCalendar.addMenstrualCycleLog(menstrualCalendarId, menstrualCycleLog).signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function updateMenstrualCalendar(api, pair, menstrualCalendarId, averageCycle) {
  const result = await api.tx.menstrualCalendar.updateMenstrualCalendar(menstrualCalendarId, averageCycle).signAndSend(pair, { nonce: -1})
  return result.toHuman()
}

export async function updateMenstrualCycleLog(api, pair, menstrualCalendarId, menstrualCycleLogId, menstrualCycleLog) {
  const result = await api.tx.menstrualCalendar.updateMenstrualCycleLog(menstrualCalendarId, menstrualCycleLogId, menstrualCycleLog).signAndSend(pair, { nonce: -1})
  return result.toHuman()
}
