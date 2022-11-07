import axios from "axios";
const state = {
    funnels:[],
    phases:[]
};
const getters = {};

const actions = {
    getFunnels( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/funnels")
        .then(response => {
            commit('setFunnels', response.data.data);
        });
    },
    getPhases( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/funnel_phases")
        .then(response => {
            commit('setPhases', response.data);
        });
    }
};

const mutations = {
    setFunnels(state, data){
        state.funnels = data;
    },
    setPhases(state, data){
        state.phases = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}