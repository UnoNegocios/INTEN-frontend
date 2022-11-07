import axios from "axios";
const state = {
    inventories:[],
};
const getters = {};

const actions = {
    getInventories( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/inventory/all")
        .then(response => {
            commit('setInventories', response.data);
        });
    }
};

const mutations = {
    setInventories(state, data){
        state.inventories = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}