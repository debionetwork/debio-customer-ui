const defaultState ={
  selectedData: null
}

export default {
  namespaced: true,
  state: {...defaultState},
  mutations: {
    SET_SELECTED_DATA(state, data){
      state.selectedData = data
    }
  },
  actions: {
    async getData({ commit }, data) {
      commit("SET_SELECTED_DATA", data)
    }
  }
}
