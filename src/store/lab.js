import axios from "axios"

const defaultState = {
  services: [],
  country: null,
  city: null,
  category: null
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_COUNTRY(state, country) {
      state.country = country
    },

    SET_REGION(state, region) {
      state.region = region
    },

    SET_CITY(state, city) {
      state.city = city
    },

    SET_CATEGORY(state, category) {
      state.category = category
    },

    SET_SERVICES(state, services) {
      state.services = services
    }
  },
  actions: {
    async setCountryRegionCity ({commit}, data) {
      commit("SET_COUNTRY", data.country)
      commit("SET_REGION", data.region)
      commit("SET_CITY", data.city)
    },

    async getServicesByCategory({ commit, state }, category, isRequestService) {
      const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL
      const params = {
        country: state.country,
        region: state.region ,
        city: state.city,
        category,
        service_flow: isRequestService
      }

      const services = await axios.get(`${baseUrl}/labs`, { params })

      commit("SET_SERVICES", services.data.result)
      commit("SET_CATEGORY", category)
    }
  },

  getters: {
    getServicesByCategory(state) {
      state.services
    }
  }
}
