export default {
    state: {
      message: null,
      type: null,
      show: false,
      type: "success", //"info", "success", "warning", "danger"
    },
    actions: {
        setNotification({ commit }, data) {
            commit('setNotification', data)
        }
    },
    mutations: {
      setNotification(state, payload) {
        state.message = payload.message
        state.type = payload.type
        state.show = true
        setTimeout(function(){ state.show = false }, 6000);
      }
    }
  }