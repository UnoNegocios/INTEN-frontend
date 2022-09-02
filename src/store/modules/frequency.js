import axios from "axios";
const state = {
    frequencies:[],
};
const getters = {};

const actions = {
    getFrequencies( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/frequency/all")
        .then(response => {
            commit('setFrequencies', response.data);
        });
    }
};

const mutations = {
    setFrequencies(state, data){
        state.frequencies = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}