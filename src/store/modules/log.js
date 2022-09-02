import axios from "axios";
const state = {
    logs:[]
};
const getters = {};

const actions = {
    getLogs( {commit} ){
        axios
        .get("https://unowipes.com/api/v1/log/all")
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