
import axios from "axios";

const state = {
    providers:[]
};

const getters = {};

const actions = {
    getProviders( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/providers")
        .then(response => {
            commit('setProviders', response.data);
        });
    }
};

const mutations = {
    setProviders(state, data){
        state.providers = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
