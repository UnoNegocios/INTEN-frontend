import axios from "axios";
const state = {
    zones:[]
};
const getters = {};

const actions = {
    getZones( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/zone/all")
        .then(response => {
            commit('setZones', response.data);
        });
    }
};

const mutations = {
    setZones(state, data){
        state.zones = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}