import axios from "axios";
const state = {
    payrolls:[],
};
const getters = {};

const actions = {
    getPayrolls( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/payroll/all")
        .then(response => {
            commit('setPayrolls', response.data);
        });
    }
};

const mutations = {
    setPayrolls(state, data){
        state.payrolls = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}