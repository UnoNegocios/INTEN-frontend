import axios from "axios"
const state = {
    items:[]
};
const getters = {};

const actions = {
    getItems( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/cellular_plans")
        .then(response => {
            commit('setItems', response.data);
        });
    }
};

const mutations = {
    setItems(state, data){
        state.items = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}