import axios from "axios";
const state = {
    expenses:[],
};
const getters = {};

const actions = {
    getExpenses( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/expense/all")
        .then(response => {
            commit('setExpenses', response.data);
        });
    }
};

const mutations = {
    setExpenses(state, data){
        state.expenses = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}