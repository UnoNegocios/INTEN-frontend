import axios from "axios";
const state = {
    phases:[]
};
const getters = {};

const actions = {
    getPhases( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/client_phases")
        .then(response => {
            commit('setPhases', response.data);
        });
    }
};

const mutations = {
    setPhases(state, data){
        state.phases = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}