import axios from "axios";
const state = {
  user: {},
};
const getters = {};
const actions = {
  getUser({ commit }) {
    axios.get(process.env.VUE_APP_BACKEND + "api/v1/user/current", 
    
    ).then(response => {
      commit("setUser", response.data.data);
    });
  },
  loginUser({}, user) {
    axios.post(process.env.VUE_APP_BACKEND + "api/v1/user/login", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg", response.data.access_token);
          localStorage.removeItem("nosepudo");
          window.location.replace("#/");
          location.reload();
        }else{
          localStorage.setItem("nosepudo", false);
        }
      })
  },
  logoutUser() {
    localStorage.clear();
    //localStorage.removeItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");
    window.location.replace("#/");
    location.reload();
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
