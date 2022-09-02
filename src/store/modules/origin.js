import axios from "axios";
const state = {
    origins:[]
};
const getters = {};

const actions = {
    getOrigins( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/origins")
        .then(response => {
            commit('setOrigins', response.data);
        });
    }
};

const mutations = {
    setOrigins(state, data){
        state.origins = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}