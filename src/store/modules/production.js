
import axios from "axios";

const state = {
    productions:[]
};

const getters = {};

const actions = {
    getProductions( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/production/all")
        .then(response => {
            commit('setProductions', response.data);
        });
    }
};

const mutations = {
    setProductions(state, data){
        state.productions = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
