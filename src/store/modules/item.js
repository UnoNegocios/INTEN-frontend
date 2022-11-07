import axios from "axios"
const state = {
    items:[]
};
const getters = {};

const actions = {
    getItems( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/cellular_plans")
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