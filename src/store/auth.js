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
  },
};
