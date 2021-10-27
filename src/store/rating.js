import axios from "axios"

const defaultState = {
  rate: null
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_RATE(state, rate) {
      state.rate = rate
    }
  },
  actions: {

    async getRate({ commit }) {
      const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL
      const rate = await axios.get(`${baseUrl}/rating/service`)
      
      commit("SET_RATE", rate.data.data)
    }
  },

  getters: {
    getRateg(state) {
      state.rate
    }
  }
}
