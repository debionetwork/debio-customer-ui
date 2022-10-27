import store from "@/store/index"
import CryptoJS from "crypto-js"
import { u8aToHex } from "@polkadot/util" // u8aToString, stringToU8a
import keyring from "@polkadot/ui-keyring"
import { Keyring } from "@polkadot/keyring"
import localStorage from "@/common/lib/local-storage"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { processEvent, eventTypes } from "@debionetwork/polkadot-provider"
import { getUnlistedNotification } from "@/common/lib/notification"

const {
  cryptoWaitReady
} = require("@polkadot/util-crypto")

cryptoWaitReady().then(() => {
  keyring.loadAll({ ss58Format: 42, type: "sr25519" })
})

const defaultState = {
  api: null,
  isConnected: false,
  isLoadingApi: false,
  isLoadingWallet: false,
  wallet: null,
  walletBalance: null,
  walletPublicKey: "",
  labAccount: null,
  isLabAccountExist: false,
  doctorAccount: null,
  isDoctorAccountExist: false,
  hospitalAccount: null,
  isHospitalAccountExist: false,
  lastEventData: null,
  localListNotification: [],
  configEvent: null,
  mnemonicData: null,
  usnBalance: null,
  usdtBalance: null,
  polkadotWallet: null
}

export default {
  namespaced: true,
  state: {
    ...defaultState
  },
  mutations: {
    SET_API(state, api) {
      state.api = api
    },
    SET_IS_CONNECTED(state, isConnected) {
      state.isConnected = isConnected
    },
    SET_LOADING_API(state, isLoading) {
      state.isLoadingApi = isLoading
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet
    },
    SET_LAB_ACCOUNT(state, labAccount) {
      state.labAccount = labAccount
      state.isLabAccountExist = true
    },
    SET_IS_LAB_ACCOUNT_EXIST(state, isLabAccountExist) {
      state.isLabAccountExist = isLabAccountExist
    },
    SET_DOCTOR_ACCOUNT(state, doctorAccount) {
      state.doctorAccount = doctorAccount
      state.isDoctorAccountExist = true
    },
    SET_IS_DOCTOR_ACCOUNT_EXIST(state, isDoctorAccountExist) {
      state.isDoctorAccountExist = isDoctorAccountExist
    },
    SET_HOSPITAL_ACCOUNT(state, hospitalAccount) {
      state.hospitalAccount = hospitalAccount
      state.isHospitalAccountExist = true
    },
    SET_IS_HOSPITAL_ACCOUNT_EXIST(state, isHospitalAccountExist) {
      state.isHospitalAccountExist = isHospitalAccountExist
    },
    SET_LOADING_WALLET(state, isLoadingWallet) {
      state.isLoadingWallet = isLoadingWallet
    },
    SET_WALLET_BALANCE(state, balance) {
      state.walletBalance = Number(balance).toFixed(4)
    },
    SET_USN_BALANCE(state, balance) {
      state.usnBalance = balance
    },
    SET_USDT_BALANCE(state, balance) {
      state.usdtBalance = balance
    },
    SET_POLKADOT_WALLET(state, wallet) {
      state.polkadotWallet = wallet
    },
    SET_WALLET_PUBLIC_KEY(state, publicKey) {
      state.walletPublicKey = publicKey
    },
    CLEAR_WALLET(state) {
      state.wallet = null
      state.walletBalance = null
    },
    SET_LAST_EVENT(state, event) {
      state.lastEventData = event
    },
    SET_LAST_BLOCK(state, event) {
      state.lastBlockData = event
    },
    SET_LIST_NOTIFICATION(state, event) {
      state.localListNotification = event
    },
    SET_CONFIG_EVENT(state, event) {
      state.configEvent = event
    },
    SET_MNEMONIC_DATA(state, event) {
      state.mnemonicData = event
    }
  },
  actions: {
    async connect({ commit }) {
      try {
        commit("SET_IS_CONNECTED", false)
        commit("SET_LOADING_API", true)
        const PROVIDER_SOCKET = store.getters["auth/getConfig"].substrateWs
        const wsProvider = new WsProvider(PROVIDER_SOCKET)

        wsProvider.on("connected", () => { // Websocket connection if connected here
          commit("SET_IS_CONNECTED", true)
          commit("SET_LOADING_API", false)
        })

        wsProvider.on("disconnected", () => { // Websocket connection if disconnected here
          commit("SET_IS_CONNECTED", false)
          commit("SET_LOADING_API", false)
        })

        wsProvider.on("error", () => { // Websocket connection if error here
          commit("SET_IS_CONNECTED", false)
          commit("SET_LOADING_API", false)
        })

        const api = await ApiPromise.create({
          provider: wsProvider
        })

        const allowedSections = [
          "serviceRequest",
          "rewards",
          "orders",
          "geneticTesting",
          "electronicMedicalRecord",
          "geneticData",
          "geneticAnalysisOrders",
          "geneticAnalysis",
          "userProfile",
          "menstrualSubscription"
        ]

        const block =  await api.rpc.chain.getBlock()
        const lastBlockData = block.toHuman()
        const role = "customer"
        let newBlock = parseInt((lastBlockData.block.header.number).replaceAll(",", ""))
        
        if (localStorage.getAddress) {
          let lastBlock
          const notifications = JSON.parse(localStorage.getLocalStorageByName(
            `LOCAL_NOTIFICATION_BY_ADDRESS_${localStorage.getAddress()}_${role}`
          ))

          commit("SET_LAST_BLOCK", newBlock)

          if(notifications && notifications.length > 0) {
            lastBlock = notifications[notifications.length-1].block
          } else {
            lastBlock = 0
          }
  
          if (newBlock > lastBlock) {
            getUnlistedNotification(newBlock, lastBlock)
          }
        }

        // Example of how to subscribe to events via storage
        api.query.system.events(async (events) => {
          for (const record of events) {
            const { event } = record

            if (allowedSections.includes(event.section)) {
              commit("SET_LAST_EVENT", event)
              commit("SET_LAST_BLOCK", lastBlockData)
            }
          }
        })

        await api.isReady
        commit("SET_API", api)

        commit("SET_IS_CONNECTED", true)
        commit("SET_LOADING_API", false)
      } catch (err) {
        commit("SET_IS_CONNECTED", false)
        commit("SET_LOADING_API", false)
        console.error(err)
      }
    },
    async registerMnemonic({ commit }, { mnemonic, password }) {
      try {
        commit("SET_LOADING_WALLET", true)
        commit("CLEAR_WALLET")

        const { pair, json } = keyring.addUri(mnemonic, password, { name: "accountName" })
        pair.unlock(password)
        localStorage.setKeystore(JSON.stringify(json))
        localStorage.setAddress(pair.address)
        commit("SET_WALLET_PUBLIC_KEY", u8aToHex(pair.publicKey))
        commit("SET_WALLET", pair) // FIXME: simpen untuk dev
        commit("SET_LOADING_WALLET", false)

        localStorage.setLocalStorageByName("mnemonic_data", CryptoJS.AES.encrypt(mnemonic, password));
        commit("SET_MNEMONIC_DATA", mnemonic)
        return { success: true }
      } catch (err) {
        console.error(err)
        commit("CLEAR_WALLET")
        commit("SET_LOADING_WALLET", false)
        return { success: false, error: err.message }
      }
    },
    async restoreAccountKeystore({ commit }, { file, password }) {
      try {
        if (Array.isArray(file)) {
          commit("SET_LOADING_WALLET", true)
          const pair = keyring.restoreAccount(file[0], password)
          pair.unlock(password)
          localStorage.setKeystore(JSON.stringify(file[0]))
          localStorage.setAddress(pair.address)
          commit("SET_WALLET_PUBLIC_KEY", u8aToHex(pair.publicKey))
          commit("SET_WALLET", pair)

          localStorage.setLocalStorageByName("mnemonic_data", CryptoJS.AES.encrypt(file[1].mnemonic, password))
          commit("SET_MNEMONIC_DATA", file[1])
          commit("SET_LOADING_WALLET", false)

          return { success: true }
        } else {
          // FIXME: Ini belum ada mnemonic nya
          commit("SET_LOADING_WALLET", true)
          const pair = keyring.restoreAccount(file, password)
          pair.unlock(password)
          localStorage.setKeystore(JSON.stringify(file))
          localStorage.setAddress(pair.address)
          commit("SET_WALLET_PUBLIC_KEY", u8aToHex(pair.publicKey))
          commit("SET_WALLET", pair)

          return { success: true }
        }
      } catch (err) {
        commit("CLEAR_WALLET")
        commit("SET_LOADING_WALLET", false)
        return { success: false, error: err.message }
      }
    },
    getEncryptedAccountData({ commit }, { password }) {
      const encryptedMnemonic = localStorage.getLocalStorageByName("mnemonic_data");
      if (encryptedMnemonic != null) {
        commit("SET_MNEMONIC_DATA", CryptoJS.AES.decrypt(encryptedMnemonic, password));
      }
    },
    // eslint-disable-next-line
    async getAllAccounts({ commit, state }, { address }) {
      try {
        commit("SET_LOADING_WALLET", true)
        const pair = keyring.getPair(address)
        commit("SET_WALLET_PUBLIC_KEY", u8aToHex(pair.publicKey))
        commit("SET_WALLET", pair)
        commit("SET_LOADING_WALLET", false)

        return { success: true }
      } catch (err) {
        console.error(err)
        commit("CLEAR_WALLET")
        commit("SET_LOADING_WALLET", false)
        return { success: false, error: err.message }
      }
    },
    async checkMnemonicSomeAddress({ commit }, { mnemonic, accountAddress }) {
      try {
        const keyringX = new Keyring({ type: "ed25519", ss58Format: 42 })
        const pair = keyringX.addFromUri(mnemonic, { name: "first pair" }, "ed25519")
        commit("SET_LOADING_WALLET", false)
        if (accountAddress == pair.address) {
          return { success: true }
        } else {
          return { success: false }
        }

      } catch (err) {
        return { success: false }
      }
    },
    async getListNotification({ commit }, { address, role, block }) {
      await getUnlistedNotification(block, 0)

      try {
        //localStorage.removeLocalStorageByName("LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role, null);
        commit("SET_CONFIG_EVENT", eventTypes)
        const listNotificationJson = localStorage.getLocalStorageByName("LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role)
        let listNotification = []
        if (listNotificationJson != null && listNotificationJson != "") {
          listNotification = JSON.parse(listNotificationJson)
          listNotification.reverse()
        }
        commit("SET_LIST_NOTIFICATION", listNotification)
      } catch (err) {
        console.error(err)
      }
    },
    async addListNotification({ commit }, { address, event, block, role }) {
      try {
        const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role
        const listNotificationJson = localStorage.getLocalStorageByName(storageName)

        let listNotification = []
        if (listNotificationJson != null && listNotificationJson != "") {
          listNotification = JSON.parse(listNotificationJson)
        }

        // If event section defined then process event
        if (eventTypes["role"][role][event.section] && eventTypes["role"][role][event.section][event.method]) {
          const { statusAdd, message, data, params } = await processEvent(address, event, role, store)
          const route = eventTypes["role"][role][event.section][event.method].route
          const dateSet = new Date()
          const timestamp = dateSet.getTime().toString()
          const notifDate = dateSet.toLocaleString("en-US", {
            weekday: "short", // long, short, narrow
            day: "numeric", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
            month: "long", // numeric, 2-digit, long, short, narrow
            hour: "numeric", // numeric, 2-digit
            minute: "numeric"
          })
          if (statusAdd) {
            listNotification.push({
              message: message,
              timestamp: timestamp,
              data: data,
              block: block,
              route: route,
              params: params,
              read: false,
              notifDate: notifDate
            })
          }
        }

        localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification))
        listNotification.reverse()
        commit("SET_LIST_NOTIFICATION", listNotification)
      } catch (err) {
        console.error(err)
      }
    },
    async updateDataListNotification({ commit }, { address, data, role }) {
      try {
        if (data != null && data != "") {
          data.reverse()
          localStorage.setLocalStorageByName("LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role, JSON.stringify(data))
          data.reverse()
          commit("SET_LIST_NOTIFICATION", data)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async addAnyNotification({ commit }, { address, dataAdd, role }) {
      try {
        const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role
        const listNotificationJson = localStorage.getLocalStorageByName(storageName)

        let listNotification = []
        if (listNotificationJson != null && listNotificationJson != "") {
          listNotification = JSON.parse(listNotificationJson)
        }

        if (dataAdd != null) {
          const dateSet = new Date()
          const timestamp = dateSet.getTime().toString()
          const notifDate = dateSet.toLocaleString("en-US", {
            weekday: "short", // long, short, narrow
            day: "numeric", // numeric, 2-digit
            year: "numeric", // numeric, 2-digit
            month: "long", // numeric, 2-digit, long, short, narrow
            hour: "numeric", // numeric, 2-digit
            minute: "numeric"
          })
          listNotification.push({
            message: dataAdd.message,
            timestamp: timestamp,
            data: dataAdd.data,
            route: dataAdd.route,
            params: dataAdd.params,
            read: false,
            notifDate: notifDate
          })
        }

        localStorage.setLocalStorageByName(storageName, JSON.stringify(listNotification))
        listNotification.reverse()
        commit("SET_LIST_NOTIFICATION", listNotification)
      } catch (err) {
        console.error(err)
      }
    }
  },
  getters: {
    wallet(state) {
      return state.wallet
    },
    isConnected(state) {
      return state.isConnected
    },
    labAccount(state) {
      return state.labAccount
    },
    isLabAccountExist(state) {
      return state.isLabAccountExist
    },
    doctorAccount(state) {
      return state.doctorAccount
    },
    isDoctorAccountExist(state) {
      return state.isDoctorAccountExist
    },
    hospitalAccount(state) {
      return state.hospitalAccount
    },
    isHospitalAccountExist(state) {
      return state.isHospitalAccountExist
    },
    getAPI(state) {
      return state.api
    },
    getLastEvent(state) {
      return state.lastEventData
    },
    getListNotification(state) {
      return state.localListNotification
    },
    getMnemonicData(state) {
      return state.mnemonicData
    }
  }
}
