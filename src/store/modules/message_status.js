import axios from "axios";
const state = {
    statuses:[]
};
const getters = {};

const actions = {
    getStatuses( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/message_status/all/" + localStorage.getItem("conversacionId"))
        .then(response => {
            commit('setStatuses', response.data);
        });
    }
};

const mutations = {
    setStatuses(state, data){
        state.statuses = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}