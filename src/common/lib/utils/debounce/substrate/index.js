// TODO: Need additional configuration if needed
export const substrateDebounce = (fn, delayTime, root = undefined) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(root ? root : this, args), delayTime)
  }
}
