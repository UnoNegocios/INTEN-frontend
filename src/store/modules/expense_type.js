
import axios from "axios";

const state = {
    expense_types:[]
};

const getters = {};

const actions = {
    getExpenseTypes( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/expense_type")
        .then(response => {
            commit('setExpenseTypes', response.data);
        });
    }
};

const mutations = {
    setExpenseTypes(state, data){
        state.expense_types = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
