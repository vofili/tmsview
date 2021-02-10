import router from "../router";
import axios from "axios";

const url = process.env.VUE_APP_API_URL;

export default {
  state: {
    terminals: [],
    charges: {
      bands: {}
    }
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
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    updateTerminal({ commit }, data) {
      commit("setLoading", true);
      axios
        .put(`${url}/terminal/update`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    disableTerminal({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/disable`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    enableTerminal({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/enable`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    deleteTerminal({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/delete`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
          router.push("/dashboard/terminals");
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    uploadTerminal({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/upload`, data)
        .then((res) => {
          const { message } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setLoading", false);

          router.push("/dashboard/terminals");

        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    saveConfig({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/save-configurations`, data)
        .then((res) => {
          const { message } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    scheduleDownloads({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/schedule-downloads`, data)
        .then((res) => {
          const { message } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    saveCharges({ commit, dispatch }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/terminal/save-charges`, data)
        .then((res) => {
          const { message } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setLoading", false);
          dispatch("getCharges");
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
            Object.values(errors).forEach(element => {
              commit("setNotification", { type: "danger", message: JSON.stringify(element) });
            });
          }
          commit("setLoading", false);
        });
    },
    getCharges({ commit }, data) {
      commit("setLoading", true);
      axios
        .get(`${url}/terminal/charges/get`)
        .then((res) => {
          const { message, charges } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setCharges", charges)
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message, errors } = err.response.data;
          commit("setNotification", { type: "danger", message });
          if (errors) {
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
    setCharges(state, charges){
      state.charges = charges
    }
  },
};
