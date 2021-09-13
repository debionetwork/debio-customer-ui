import localStorage from './local-storage'
import store from '@/store/index'

async function dispatchGetAccount(wallet, address, func){
  if (wallet == null) {
    if (address != "") {
      await store.dispatch('substrate/getAccount', {
        address: address
      })
    }
  }
  func()
}

export async function checkIsLoggedIn(to, from, next) {
  const address = localStorage.getAddress();
  let api = store.getters['substrate/getAPI'];
  if (api == null) {
    await store.dispatch('substrate/connect', address);
  }

  let wallet = store.getters['substrate/wallet'];
  const keystore = localStorage.getAddress()
  const isLoggedIn = !!keystore;

  if (to.path == '/login') {
    if (isLoggedIn) {
      await dispatchGetAccount(wallet, address, () => {
        next('/')
      })
      return address
    } 

    next()
    return ""
  } 

  if (isLoggedIn) {
    await dispatchGetAccount(wallet, address, () => {
      next()
    })
    return address
  }

  next('/login')
  return ""
}