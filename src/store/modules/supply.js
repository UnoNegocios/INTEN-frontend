
import axios from "axios";

const state = {
    supplies:[]
};

const getters = {};

const actions = {
    getSupplies( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/supply/all")
        .then(response => {
            commit('setSupplies', response.data);
        });
    }
};

const mutations = {
    setSupplies(state, data){
        state.supplies = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
