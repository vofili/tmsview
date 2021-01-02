import Vuex from 'vuex'
import Vue from 'vue'
import auth from './auth'
import notification from "./notification"
import loading from "./loading"
import terminal from "./terminal"
import utils from "./utils"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    notification,
    loading,
    terminal,
    utils
  }
})

