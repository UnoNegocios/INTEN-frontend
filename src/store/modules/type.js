import axios from "axios";
const state = {
    types:[]
};
const getters = {};

const actions = {
    getTypes( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/type/all")
        .then(response => {
            commit('setTypes', response.data);
        });
    }
};

const mutations = {
    setTypes(state, data){
        state.types = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}