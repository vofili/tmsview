export default {
    state: {
      show: false,
    },
    actions: {
        setLoading({ commit }, data) {
            commit('setLoading', data)
        }
    },
    mutations: {
      setLoading(state, payload) {
        state.show = payload
      }
    }
  }