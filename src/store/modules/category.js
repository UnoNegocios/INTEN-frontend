import axios from "axios";
const state = {
    categories:[]
};
const getters = {};

const actions = {
  getCategories( {commit} ){
    axios
    .get(process.env.VUE_APP_BACKEND + "api/v1/consumption_categories")
    .then(response => {
        commit('setCategories', response.data);
    });
  }
};

const mutations = {
  setCategories(state, data){
    state.categories = data;
  }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}