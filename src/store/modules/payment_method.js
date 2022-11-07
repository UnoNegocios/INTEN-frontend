import axios from "axios";
const state = {
    payment_methods:[]
};
const getters = {};

const actions = {
    getPaymentMethods( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND + "api/v1/payment_methods")
        .then(response => {
            commit('setPaymentMethods', response.data);
        });
    }
};

const mutations = {
    setPaymentMethods(state, data){
        state.payment_methods = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}