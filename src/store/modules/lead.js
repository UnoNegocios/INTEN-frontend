import axios from "axios";
const state = {
    leads:[],
};
const getters = {};

const actions = {
    getLeads( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/leads")
        .then(response => {
            commit('setLeads', response.data.data);
        });
    }
};

const mutations = {
    setLeads(state, data){
        state.leads = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}