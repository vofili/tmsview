import router from "../router";

export default {
  state: {
    user: null,
    loading: false,
    errors: {},
  },
  actions: {
    async login({ commit }, data) {
        const user = {
            email: data.email,
            name: data.name || "Admin"
        }
        commit("setUser", user);
        router.push("/dashboard/transactions");       
    },
    
    logout({ commit }) {
      commit("clearUser");
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
