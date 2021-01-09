import router from "../router";
import axios from "axios";

const url = process.env.VUE_APP_API_URL;

export default {
  state: {
      terminals: []
  },
  actions: {
    createTerminal({ commit }, data) {
        commit("setLoading", true);
        axios
        .post(`${url}/terminal/create`, data)
        .then((res) => {
          const { message } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setLoading", false);

          router.push("/dashboard/terminals");

        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if(errors){
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });     
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  },
};
