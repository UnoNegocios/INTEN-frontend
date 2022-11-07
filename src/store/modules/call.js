import axios from "axios";
const state = {
    calls:[]
};
const getters = {};

const actions = {
    getCalls( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/call/all")
        .then(response => {
            commit('setCalls', response.data);
        });
    }
};

const mutations = {
    setCalls(state, data){
        state.calls = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}