import axios from "axios";
const state = {
    pps:[],
};
const getters = {};

const actions = {
    getPps( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/quotation/all")
        .then(response => {
            commit('setPps', response.data);
        });
    },
};

const mutations = {
    setPps(state, data){
        state.pps = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}