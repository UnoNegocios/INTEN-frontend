import axios from "axios";
const state = {
    vehicles:[]
};
const getters = {};

const actions = {
    getVehicles( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/vehicle/all")
        .then(response => {
            commit('setVehicles', response.data);
        });
    }
};

const mutations = {
    setVehicles(state, data){
        state.vehicles = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}