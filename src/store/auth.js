import router from "../router";
import axios from "axios";
import jwt from "jsonwebtoken";
import setAuthToken from "../utils/setAuthToken";

const url = process.env.VUE_APP_API_URL;
const key = process.env.VUE_APP_JWT_KEY;

export default {
  state: {
    user: null,
    loading: false,
    merchant: {},
    agents: []
  },
  actions: {
    login({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/loginUser`, data)
        .then((res) => {
          const { token, message } = res.data;
          commit("setNotification", { type: "success", message });
          commit("setLoading", false);

          //set axios header
          setAuthToken(token);

          //save the token in local storage
          localStorage.setItem("jwtToken", token);

          //decode token and set auth user state
          const user = jwt.decode(token, key);

          commit("setUser", user);
          router.push("/dashboard/transactions");

        })
        .catch((err) => {
          const { message } = err.response.data;
          commit("setNotification", { type: "danger", message });
          commit("setLoading", false);
        });
    },
    createUser({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/createUser`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);

          router.push("/login");
        })
        .catch((err) => {
          const { message } = err.response.data;
          commit("setNotification", { type: "danger", message });
          commit("setLoading", false);
        });
    },
    createMerchant({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/create-merchant`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);

          router.push("/dashboard/merchants");
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
    editMerchant({ commit }, data) {
      commit("setLoading", true);
      axios
        .put(`${url}/auth/update-merchant`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    disableMerchant({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/disable-merchant`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    enableMerchant({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/enable-merchant`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    getMerchant({ commit }, id) {
      commit("setLoading", true);
      commit("setMerchant", {})
      axios
        .get(`${url}/merchant/${id}`)
        .then((res) => {
          commit("setMerchant", res.data.merchant)
          commit("setLoading", false);
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
    createMerchantAgent({ commit }, payload) {
      commit("setLoading", true);
      axios
        .post(`${url}/merchant/agents/create`, payload)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);

          router.push(`/dashboard/merchant/${payload.merchantId}/agents`);
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
    updateAgent({ commit }, data) {
      commit("setLoading", true);
      axios
        .put(`${url}/agent/update`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    disableAgent({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/agent/disable`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    enableAgent({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/agent/enable`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    getAllMerchantAgents({ commit }, payload) {
      commit("setLoading", true);
      axios
        .post(`${url}/merchant/get-all-agents`, payload)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setAllMerchantsAgents", res.data)
          commit("setLoading", false);
        })
        .catch((err) => {
          const { message } = err.response.data;
          commit("setNotification", { type: "danger", message });
          commit("setLoading", false);
        });
    },
    createInstitution({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/create-institution`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);

          router.push("/dashboard/institutions");
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
    editInstitution({ commit }, data) {
      commit("setLoading", true);
      axios
        .put(`${url}/auth/update-institution`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    disableInstitution({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/disable-institution`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    enableInstitution({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/auth/enable-institution`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    getInstitution({ commit }, id) {
      commit("setLoading", true);
      commit("setMerchant", {})
      axios
        .get(`${url}/institution/${id}`)
        .then((res) => {
          commit("setMerchant", res.data.merchant)
          commit("setLoading", false);
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
    adminChangeUserPassword({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/user/admin-change-password`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    disableUser({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/user/disable`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    enableUser({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/user/enable`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    changePassword({ commit }, data) {
      commit("setLoading", true);
      axios
        .post(`${url}/user/change-password`, data)
        .then((res) => {
          commit("setNotification", { type: "success", message: res.data.message });
          commit("setLoading", false);
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
    logout({ commit }) {
      commit("clearUser");
      localStorage.removeItem("jwtToken");
      router.push("/");
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
    setMerchant(state, payload){
      state.merchant = payload
    },
    setAllMerchantsAgents(state, payload){
      state.agents = payload.agents
    }
  },
};
