import { checkApiConnection } from "../util"

export async function queryBalance(api, addr) {
  checkApiConnection()
  // eslint-disable-next-line no-unused-vars
  const { nonce, data: balance } = await api.query.system.account(
    addr
  )
  const formatedBalance = balance.free.toHuman().replaceAll(",", "")
  return formatedBalance
}
