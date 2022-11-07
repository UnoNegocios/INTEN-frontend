import axios from "axios";
const state = {
    logs:[]
};
const getters = {};

const actions = {
    getLogs( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/log/all")
        .then(response => {
            commit('setLogs', response.data);
        });
    }
};

const mutations = {
    setLogs(state, data){
        state.logs = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}