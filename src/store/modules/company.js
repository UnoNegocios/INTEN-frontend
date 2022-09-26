import axios from "axios";
const state = {
    companies:[]
};
const getters = {};

const actions = {
  getCompanies( {commit} ){
    axios
    .get("https://unowipes.com/api/v1/clients?itemsPerPage=" + 9999999999999999)
    .then(response => {
        commit('setCompanies', response.data.data);
    });
  }
};

const mutations = {
  setCompanies(state, data){
    state.companies = data;
  }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}