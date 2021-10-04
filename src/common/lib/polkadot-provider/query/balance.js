export async function queryBalance(api, addr) {
  // eslint-disable-next-line no-unused-vars
  const { nonce, data: balance } = await api.query.system.account(
    addr
  )
  return balance.free.toHuman()
}
