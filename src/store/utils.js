import axios from "axios";

const url = process.env.VUE_APP_API_URL;

export default {
  state: {
    allStates: [],
    lgas: [],
    countries: [],
    merchants: [],
    stateLoading: false,
    lgaLoading: false,
  },
  actions: {
    getStates({ commit }) {
      commit("setStateLoading", true);
      axios
        .get(`${url}/all-states`)
        .then((res) => {
          const { data } = res;
          commit("setStateLoading", false);
          commit("setAllStates", data);
        })
        .catch((err) => {
          commit("setNotification", { type: "danger", message: "Unable to Fetch States" });
          commit("setStateLoading", false);
        });
    },
    getLgas({ commit }, data) {
        commit("setLgaLoading", true);
        axios
          .get(`${url}/lgas/${data}`)
          .then((res) => {
            const { data } = res;
            commit("setLgaLoading", false);
            commit("setLga", data);
          })
          .catch((err) => {
            commit("setNotification", { type: "danger", message: `Unable to Fetch Lga's` });
            commit("setLgaLoading", false);
          });
      },
      getCountries({ commit }) {
        commit("setLoading", true);
        axios
          .get(`${url}/countries`)
          .then((res) => {
            const { data } = res;
            commit("setLoading", false);
            commit("setCountries", data);
          })
          .catch((err) => {
            commit("setNotification", { type: "danger", message: `Unable to Fetch Country` });
            commit("setLoading", false);
          });
      },
      getMerchants({ commit }) {
        commit("setLoading", true);
        axios
          .get(`${url}/merchants`)
          .then((res) => {
            const { data } = res;
            commit("setLoading", false);
            commit("setMerchants", data);
          })
          .catch((err) => {
            commit("setNotification", { type: "danger", message: `Unable to Fetch Merchants` });
            commit("setLoading", false);
          });
      }
  },
  mutations: {
    setLgaLoading(state, payload) {
      state.lgaLoading = payload;
    },
    setStateLoading(state, payload) {
        state.stateLoading = payload;
      },
    setAllStates(state, payload){
        state.allStates = payload.allStates
    },
    setLga(state, payload){
        state.lgas = payload.lgas
    },
    setCountries(state, payload){
      state.countries = payload.Countries
    },
    setMerchants(state, payload){
        state.merchants = payload.merchants
    }
  },
};
